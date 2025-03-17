from django.db import models
from django.conf import settings
from .choices import TicketType, PriorityLevel, TicketStatus

class Ticket(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=TicketType.choices, default=TicketType.BUG)
    priority = models.CharField(max_length=10, choices=PriorityLevel.choices, default=PriorityLevel.MEDIUM)
    status = models.CharField(max_length=15, choices=TicketStatus.choices, default=TicketStatus.OPEN)
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tickets")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"

class TicketActivity(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name="activities")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255) 
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email if self.user else 'System'} - {self.action} - {self.timestamp}"