from django.urls import path
from .views import CreateTicketView, ListTicketsView, RetrieveUpdateView, DeleteTicketView



urlpatterns = [
    path('create/', CreateTicketView.as_view(), name='create-ticket'),
    path('list/', ListTicketsView.as_view(), name='list-tickets'),
    path('<int:pk>/', RetrieveUpdateView.as_view(), name='retrieve-update-ticket'),
    path('delete/<int:pk>/', DeleteTicketView.as_view(), name='delete-ticket'),



    



]