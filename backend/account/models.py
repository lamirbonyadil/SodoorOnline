from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from .validators import phone_number_validator, username_validator
from .utils import default_file_path, get_image_file_path

class CustomUserManager(BaseUserManager):
    @classmethod
    def normalize_phone_number(cls, phone_number):
        """
        Normalize the phone number by prefixing it with +98.
        """
        phone_number = phone_number or ""
        try:
            _, number = phone_number.split("0", 1)
        except ValueError:
            pass
        else:
            phone_number = "+98" + number
        return phone_number

    def create_user(self, username, first_name, last_name, email, phone_number, password=None, **extra_fields):
        if not username:
            raise ValueError("Users must have a username.")

        if not email:
            raise ValueError("Users must have an email address.")

        if not phone_number:
            raise ValueError("Users must have a phone number.")

        if not first_name:
            raise ValueError("Users must have a first name.")

        if not last_name:
            raise ValueError("Users must have a last name.")

        user = self.model(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=self.normalize_email(email),
            phone_number=self.normalize_phone_number(phone_number),
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, first_name, last_name, email, phone_number, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(username, first_name, last_name, email, phone_number, password, **extra_fields)

class CustomUser(AbstractUser):
    class Roles(models.TextChoices):
        STUDENT = 'S', 'Student'
        INSTITUTE = 'I', 'Institute'

    username        = models.CharField(max_length=11, unique=True, validators=[username_validator], help_text="Shenase-e Melli for Institutes / Code-e Melli for Students.")
    first_name      = models.CharField(max_length=100)
    last_name       = models.CharField(max_length=100)
    email           = models.EmailField(max_length=60, unique=True)
    phone_number    = models.CharField(max_length=15, unique=True, validators=[phone_number_validator], help_text="Phone number must start with 0 and contain digits only, with no dashes or spaces.")
    province        = models.CharField(max_length=100, blank=True)
    city            = models.CharField(max_length=100, blank=True)
    address         = models.TextField(blank=True)
    role            = models.CharField(max_length=1, choices=Roles.choices, blank=True, help_text="Leave blank for superusers.")

    objects = CustomUserManager()

    USERNAME_FIELD  = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'phone_number']


class Institute(models.Model):
    user            = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    institute_name  = models.CharField(max_length=100)
    description     = models.TextField(blank=True)
    website         = models.URLField(null=True, unique=True)
    logo            = models.ImageField(upload_to=get_image_file_path, default=default_file_path, blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.institute_name

class Student(models.Model):
    user            = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    birth_date      = models.DateField(null=True, help_text="The date must be in the YYYY-MM-DD format.")
    bio             = models.TextField(blank=True)
    avatar          = models.ImageField(upload_to=get_image_file_path, default=default_file_path, blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.get_full_name()