from rest_framework import serializers
from ..models import Ticket, TicketActivity
from ..choices import TicketStatus, PriorityLevel, TicketType



class CreateTicketSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'type', 'priority', 'user', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def validate_priority(self, value):
        if value not in dict(PriorityLevel.choices):
            raise serializers.ValidationError("Invalid priority level.")
        return value

    def create(self, validated_data):
        ticket = super().create(validated_data)

        # Log activity when a new ticket is created
        TicketActivity.objects.create(
            ticket=ticket,
            user=ticket.user,
            action="Ticket created"
        )

        return ticket
    
class UpdateTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['status', 'priority']
        read_only_fields = ['id']

    def validate_status(self, value):
        if value not in dict(TicketStatus.choices):
            raise serializers.ValidationError("Invalid status.")
        return value
    

class TicketSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'type', 'priority', 'status', 'user_email', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user_email', 'created_at', 'updated_at']

class UserTicketSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    username = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    activities = serializers.SerializerMethodField()  # ✅ Add this field

    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'type', 'priority', 'status', 
                  'user', 'username', 'user_email', 'created_at', 'updated_at', 'activities']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'username', 'user_email']

    def get_username(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    
    def get_user_email(self, obj):
        return obj.user.email


    def update(self, instance, validated_data):
        user = self.context['request'].user
        changes = []

        # Track what fields are being updated
        for field, new_value in validated_data.items():
            old_value = getattr(instance, field)
            if old_value != new_value:  # Only log changes
                changes.append(f"{field} changed from {old_value} to {new_value}")

        # Update the ticket
        instance = super().update(instance, validated_data)

        # If there are changes, log them
        if changes:
            TicketActivity.objects.create(
                ticket=instance,
                user=user,
                action=", ".join(changes)  # Save as readable text
            )

        return instance
    
    def get_activities(self, obj):
        # Get the latest 5 activities for the ticket
        activities = obj.activities.order_by('-timestamp')[:5]
        return [
            {
                "user": activity.user.email if activity.user else "System",
                "action": activity.action,
                "timestamp": activity.timestamp.strftime("%Y-%m-%d %H:%M:%S")  
            }
            for activity in activities
        ]


        
class AdminTicketSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'type', 'priority', 'status', 'user_email', 'created_at', 'updated_at']
        read_only_fields = ['id', 'title', 'description', 'type', 'user_email', 'created_at', 'updated_at']