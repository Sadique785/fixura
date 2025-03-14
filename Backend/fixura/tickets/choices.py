from django.db import models

class TicketType(models.TextChoices):
    BUG = "bug", "Bug"
    FEATURE ="feature", "Feature Request" 
    SUPPORT = "support", "Support Inquiry"


class PriorityLevel(models.TextChoices):
    LOW = "low", "Low"
    MEDIUM = "medium", "Medium"
    HIGH = "high", "High"

# Ticket Status
class TicketStatus(models.TextChoices):
    OPEN = "open", "Open"
    IN_PROGRESS = "in_progress", "In Progress"
    RESOLVED = "resolved", "Resolved"
    CLOSED = "closed", "Closed"