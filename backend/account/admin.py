from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Institute, Student
from .forms import CustomUserCreationForm, CustomUserChangeForm
from django.http import HttpResponseRedirect
from django.urls import reverse


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    model = CustomUser

    list_display = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'phone_number', 'province', 'city']
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

    def response_add(self, request, obj, post_url_continue=None):
        """
        Override: Redirect to the change list after creating a user,
        unless '_continue' or '_addanother' was clicked.
        """
        if "_continue" in request.POST or "_addanother" in request.POST:
            return super().response_add(request, obj, post_url_continue)

        return HttpResponseRedirect(reverse('admin:account_customuser_changelist'))

@admin.register(Institute)
class InstituteAdmin(admin.ModelAdmin):
    list_display = [
        'user_id',
        'institute_name',
        'description',
        'website',
    ]

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = [
        'user_id',
        'birth_date',
        'bio'
    ]