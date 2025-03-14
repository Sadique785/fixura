from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .serializers import UserRegistrationSerializer, LoginSerializer
from ..models import User
from django.middleware import csrf
from .utils import generate_tokens



class RegisterView(APIView):
    permission_classes = [AllowAny]


    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "mobile": user.mobile,
                },
                "message": "User Created Successfully"
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    permission_classes = [AllowAny]  # Public API

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = generate_tokens(user)  # Generate JWT tokens
            csrf_token = csrf.get_token(request)

            response_data = {
                "success": True,
                "message": "Login successful",
                "data": {
                    "access": tokens["access"],
                    "user_id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "mobile": user.mobile
                }
            }

            response = Response(response_data)

            # Set CSRF token in a cookie
            response.set_cookie(
                key='csrftoken',
                value=csrf_token,
                httponly=False,
                samesite='Lax'
            )

            # Set Refresh token as an HTTP-only cookie
            response.set_cookie(
                key='refresh_token',
                value=tokens["refresh"],
                httponly=True,
                secure=True,  # Use True in production (only allows HTTPS)
                samesite='Lax',
                max_age=7 * 24 * 60 * 60  # 7 days expiration
            )

            return response
        
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

