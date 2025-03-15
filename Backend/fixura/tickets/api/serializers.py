from rest_framework import serializers
from ..models import Ticket
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

    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'type', 'priority', 'user', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

        
class AdminTicketSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'type', 'priority', 'status', 'user_email', 'created_at', 'updated_at']
        read_only_fields = ['id', 'title', 'description', 'type', 'user_email', 'created_at', 'updated_at']