from rest_framework import status, generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from tickets.permissions import IsOwner
from rest_framework.exceptions import PermissionDenied
from ..models import Ticket
from ..choices import TicketStatus
from .serializers import CreateTicketSerializer, TicketSerializer, UserTicketSerializer, AdminTicketSerializer



class CreateTicketView(APIView):
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
    

class ListTicketsView(generics.ListAPIView):

    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'priority', 'user']



    def get_queryset(self):
        user = self.request.user
        queryset = Ticket.objects.all() if user.is_staff or user.is_superuser else Ticket.objects.filter(user=user)
        
        status = self.request.query_params.get('status', None)
        priority = self.request.query_params.get('priority', None)
        user_filter = self.request.query_params.get('user', None)

        if status:
            queryset = queryset.filter(status=status)
        if priority:
            queryset = queryset.filter(priority=priority)
        if user_filter and user.is_staff:
            queryset = queryset.filter(user=user_filter)

        return queryset


class RetrieveUpdateView(generics.RetrieveUpdateAPIView):

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Ticket.objects.all()
        return Ticket.objects.filter(user=user)


    def get_serializer_class(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return AdminTicketSerializer
        return UserTicketSerializer
    

    
class DeleteTicketView(generics.DestroyAPIView):
    queryset = Ticket.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def delete(self, request, *args, **kwargs):
        ticket = self.get_object()

        # Prevent deletion if the ticket is "in_progress"
        if ticket.status == TicketStatus.IN_PROGRESS:
            raise PermissionDenied("You cannot delete a ticket that is currently in progress.")

        return super().delete(request, *args, **kwargs)
    
