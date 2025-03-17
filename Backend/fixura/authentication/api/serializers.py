from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from ..models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'mobile', 'password')

    def validate(self, attrs):
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "User with this email already exists."})
        
        if User.objects.filter(mobile=attrs['mobile']).exists():
            raise serializers.ValidationError({"mobile": "User with this mobile number already exists."})
        
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            mobile=validated_data['mobile'],
            password=validated_data['password']
        )
        return user
    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        if not email:
            raise serializers.ValidationError({'email': 'Email address is required.'})
        
        if not password:
            raise serializers.ValidationError({'password': 'Password is required.'})

        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError({'email': 'No account found with this email address.'})

        if not user.is_active:
            raise serializers.ValidationError({'email': 'This account has been deactivated. Please contact support.'})

        # Authenticate using email (not username)
        user = authenticate(request=self.context.get('request'), email=email, password=password)
        if user is None:
            raise serializers.ValidationError({'password': 'Invalid password. Please try again.'})

        data['user'] = user
        return data
    


class UserSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']


