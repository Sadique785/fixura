from rest_framework import status, generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from tickets.permissions import IsOwnerOrAdmin
from rest_framework.exceptions import PermissionDenied
from ..models import Ticket
from ..choices import TicketStatus
from .serializers import CreateTicketSerializer, TicketSerializer, UserTicketSerializer, AdminTicketSerializer


class CreateTicketView(APIView):
    """
    API view for creating new tickets in the system.
    This view handles POST requests to create tickets from authenticated users.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateTicketSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            ticket = serializer.save()

            return Response({
                "message": "Ticket created successfully",
                "ticket": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



# List views
class UserTicketListView(generics.ListAPIView):
    """View for users (including admins) to list their own tickets"""

    serializer_class = UserTicketSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'priority']

    def get_queryset(self):
        # Always filter by the current user, even if they're admin/staff
        queryset = Ticket.objects.filter(user=self.request.user)

            
        return queryset


class AdminTicketListView(generics.ListAPIView):

    """View for admins to list all tickets"""

    serializer_class = AdminTicketSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'priority', 'user']

    def get_queryset(self):
        queryset = Ticket.objects.all()
        return queryset


    
class UserDetailView(generics.RetrieveUpdateAPIView):
    """View for users (including admins) to manage their own tickets"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserTicketSerializer

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user)




class AdminPanelView(generics.RetrieveUpdateAPIView):
    """View for admins to manage all tickets"""
    permission_classes = [IsAdminUser]  
    serializer_class = AdminTicketSerializer
    queryset = Ticket.objects.all()


    
class DeleteTicketView(generics.DestroyAPIView):
    """
    API view for deleting tickets.
    Includes business logic restrictions on when tickets can be deleted.
    """
    queryset = Ticket.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def delete(self, request, *args, **kwargs):
        ticket = self.get_object()

        # Prevent deletion if the ticket is "in_progress"
        if ticket.status == TicketStatus.IN_PROGRESS:
            raise PermissionDenied("You cannot delete a ticket that is currently in progress.")

        return super().delete(request, *args, **kwargs)
    
