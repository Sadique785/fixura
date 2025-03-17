from django.urls import path
from .views import RegisterView, LoginView, LogoutView, CustomTokenRefreshView,SearchUsersView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('users/search/', SearchUsersView.as_view(), name='search-users'),




]