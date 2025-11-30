from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import CustomUser, Institute, Student

@receiver(post_save, sender=CustomUser)
def create_profile(sender, instance, created, **kwargs):
    """
    Signal receiver to handle automatic profile creation.

    Behavior:
    1. Checks if the 'skip_signal' flag is present (e.g., when saving from Admin).
       If True, it exits early to let the Admin panel handle profile creation via inlines.
    2. Skips execution on initial creation (created=True) since profiles are created upon activation.
    3. Checks if the user is active. Profile creation is deferred until the account is activated.
           Once active, it uses get_or_create to generate the specific profile (Institute or Student) based on the role.
    """
    if getattr(instance, 'skip_signal', False):
        return

    if created:
        return

    if instance.is_active:
        if instance.role == CustomUser.Roles.INSTITUTE:
            Institute.objects.get_or_create(user=instance)

        elif instance.role == CustomUser.Roles.STUDENT:
            Student.objects.get_or_create(user=instance)