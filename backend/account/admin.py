from django.contrib import admin
from .models import CustomUser, Institute, Student


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = [
        'username',
        'first_name',
        'last_name',
        'email',
        'role',
        'phone_number',
        'province',
        'city',
        'address'
    ]

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