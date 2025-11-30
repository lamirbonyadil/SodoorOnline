from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Institute, Student
from .forms import CustomUserCreationForm, CustomUserChangeForm
from django.http import HttpResponseRedirect
from django.urls import reverse


class StudentProfileInline(admin.StackedInline):
    """
    Enables editing Student profile info directly inside the CustomUser admin page.
    """
    model = Student
    max_num = 1
    can_delete = False
    verbose_name_plural = 'Student Profile'

class InstituteProfileInline(admin.StackedInline):
    """
    Enables editing Institute profile info directly inside the CustomUser admin page.
    """
    model = Institute
    max_num = 1
    can_delete = False
    verbose_name = 'Institute Profile'


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    model = CustomUser

    list_display = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'phone_number', 'province', 'city', 'is_active', 'is_staff', 'is_superuser']
    list_filter = ['role', 'province', 'city']
    search_fields = ['username', 'first_name', 'last_name']

    sortable_by = []
    ordering = ['id']
    date_hierarchy = 'date_joined'
    list_per_page = 20

    fieldsets = (
        (None,
            {
                "fields": ("username", "password"),
            }
        ),
        ("Personal Info",
            {
                "fields": ("first_name", "last_name", "email", "phone_number"),
            }
        ),
        ("Address Details",
            {
                "fields": ("province", "city", "address"),
            }
        ),
        ("Permissions",
            {
                "fields": ("role", "is_active", "is_superuser", "is_staff", "user_permissions", "groups"),
            }
        ),
        ("Important Dates",
            {
                "fields": ("last_login", "date_joined"),
            }
        ),
    )

    add_fieldsets = (
        (None,
            {
                'classes': ('wide',),
                'fields': ('username', 'email', 'phone_number', 'first_name', 'last_name', 'role', "password1", "password2"),
            }
        ),
    )

    inlines = ()

    def get_inline_instances(self, request, obj=None):
        """
        Override: Dynamically display inlines based on the user's role.
        """
        # If 'obj' is None, it means we are in the "Add User" view.
        # We return an empty list because the user instance doesn't exist yet,
        # so we can't link a profile to it or know which role will be selected.
        if not obj:
            return []

        # Check the user's role to determine which profile inline to show.
        inline_instances = []
        if obj.role == "S":
            inline_instances.append(StudentProfileInline(self.model, self.admin_site))
        elif obj.role == "I":
            inline_instances.append(InstituteProfileInline(self.model, self.admin_site))

        return inline_instances

    def response_add(self, request, obj, post_url_continue=None):
        """
        Override: Redirect to the change list after creating a user,
        unless '_continue' or '_addanother' was clicked.
        """
        if "_continue" in request.POST or "_addanother" in request.POST:
            return super().response_add(request, obj, post_url_continue)

        return HttpResponseRedirect(reverse('admin:account_customuser_changelist'))

    def get_readonly_fields(self, request, obj=None):
        """
        Override: Configure read-only fields based on the view type.
        'username' and 'role' are immutable once created and cannot be changed.
        """
        if not obj:
            return []

        return ['username', 'role']

    def save_model(self, request, obj, form, change):
        """
            Override: to handle profile creation conflict between Admin and Signals.

            Sets a temporary 'skip_signal' flag on the object to prevent the post_save
            signal from running. This avoids an IntegrityError caused by the signal
            and Admin inlines trying to create the same profile simultaneously.
            """
        obj.skip_signal = True
        
        super().save_model(request, obj, form, change)

@admin.register(Institute)
class InstituteAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'institute_name', 'website']
    list_select_related = ['user']

    sortable_by = []
    ordering = ['id']
    list_per_page = 20

    # Disable bulk actions
    actions = None

    def has_change_permission(self, request, obj=None):
        """Make the view read-only."""
        return False

    def has_add_permission(self, request):
        """Prevent creating profile outside of the User flow."""
        return False

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'birth_date', 'bio']
    list_select_related = ['user']
    list_filter = ['birth_date']
    sortable_by = []
    ordering = ['id']
    list_per_page = 20

    # Disable bulk actions
    actions = None

    def has_change_permission(self, request, obj=None):
        """Make the view read-only."""
        return False

    def has_add_permission(self, request):
        """Prevent creating profile outside of the User flow."""
        return False