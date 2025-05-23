from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .serializers import UserRegistrationSerializer, LoginSerializer, UserSearchSerializer
from ..models import User
from django.middleware import csrf
from .utils import generate_tokens
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from django.db.models import Q




    
class RegisterView(APIView):
    """Handles user registration. Allows new users to sign up."""

    permission_classes = [AllowAny]  

    def post(self, request):
        """Registers a new user and returns their details if successful."""
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
    """Handles user login and token generation."""

    permission_classes = [AllowAny]  

    def post(self, request):
        """Handles user login and token generation."""

        print('Entered login')
        serializer = LoginSerializer(data=request.data, context={'request': request})
        print('step2', serializer)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            print('user', user)
            tokens = generate_tokens(user)  
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
                    "mobile": user.mobile,
                    "isAdmin":user.is_superuser,
                }
                
            }
            print(response_data)

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
    
class LogoutView(APIView):
    """Handles user logout by blacklisting the refresh token and clearing cookies."""


    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Logs out the user by invalidating the refresh token and clearing authentication cookies."""

        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                except TokenError:
                    pass

            logout(request)

            response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
            response.delete_cookie('csrftoken')
            response.delete_cookie('refresh_token')
            response.delete_cookie('sessionid')

            return response

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        


class CustomTokenRefreshView(TokenRefreshView):
    """Handles refreshing access tokens and setting a new refresh token in cookies."""

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """Validates the refresh token, issues a new access token, and updates the refresh token cookie."""

        refresh_token = request.headers.get('X-Refresh-Token') or request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({"error": "Refresh token is missing"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)

            # Verify the token type is "refresh"
            if refresh.payload.get('token_type') != 'refresh':
                return Response({"error": "Invalid token type"}, status=status.HTTP_401_UNAUTHORIZED)

            # Pass refresh token to request for processing
            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)

            # Set the new refresh token in the HTTP-only cookie
            new_refresh_token = response.data.get('refresh')
            if new_refresh_token:
                response.set_cookie(
                    key='refresh_token',
                    value=new_refresh_token,
                    httponly=True,
                    secure=True,  # Set to True in production
                    samesite='Lax',
                    max_age=7 * 24 * 60 * 60  # 7 days expiration
                )

            return response

        except TokenError as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)



class SearchUsersView(APIView):
    """Allows authenticated users to search for other users by email, first name, or last name."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        """Performs a user search based on the query parameter and returns matching results."""

        query = request.query_params.get('query', "").strip()
        
        if not query or len(query) < 1:
            return Response({"error": "Search term must be at least 1 characters long"}, status=400)
        
        users = User.objects.filter(
            Q(email__icontains=query) | Q(first_name__icontains=query) | Q(last_name__icontains=query)
        )[:5]

        serializer = UserSearchSerializer(users, many=True)
        return Response(serializer.data)



