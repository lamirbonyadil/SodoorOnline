from rest_framework.permissions import IsAuthenticated

class DenyAll(IsAuthenticated):
    def has_permission(self, request, view):
        return False