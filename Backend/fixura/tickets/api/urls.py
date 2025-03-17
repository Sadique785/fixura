from django.urls import path
from .views import CreateTicketView, ListTicketsView, RetrieveUpdateView, DeleteTicketView, UserDetailView, AdminPanelView, UserTicketListView, AdminTicketListView



urlpatterns = [
    path('create/', CreateTicketView.as_view(), name='create-ticket'),
    # path('list/', ListTicketsView.as_view(), name='list-tickets'),
    path('list/', UserTicketListView.as_view(), name='user-ticket-list'),
    path('admin/list/', AdminTicketListView.as_view(), name='admin-ticket-list'),


    # path('<int:pk>/', RetrieveUpdateView.as_view(), name='retrieve-update-ticket'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-ticket-detail'),
    path('admin/<int:pk>/', AdminPanelView.as_view(), name='admin-ticket-detail'),
    path('delete/<int:pk>/', DeleteTicketView.as_view(), name='delete-ticket'),



    



]