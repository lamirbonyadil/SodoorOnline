from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
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

    def create_user(self, first_name, last_name, email, phone_number, password=None, **extra_fields):
        if not first_name:
            raise ValueError("Users must have a first name.")
        if not last_name:
            raise ValueError("Users must have a last name.")
        if not phone_number:
            raise ValueError("Users must have a phone number.")
        if not email:
            raise ValueError("Users must have an email address.")
        if not password:
            raise ValueError("Users must have a password.")

        user = self.model(
            first_name=first_name,
            last_name=last_name,
            email=self.normalize_email(email),
            phone_number=self.normalize_phone_number(phone_number),
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, first_name, last_name, email, phone_number, password, **extra_fields):
        if not first_name:
            raise ValueError("Users must have a first name.")
        if not last_name:
            raise ValueError("Users must have a last name.")
        if not phone_number:
            raise ValueError("Users must have a phone number.")
        if not email:
            raise ValueError("Users must have an email address.")
        if not password:
            raise ValueError("Users must have a password.")

        user = self.model(
            first_name=first_name,
            last_name=last_name,
            email=self.normalize_email(email),
            phone_number=phone_number,
        )
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user

class CustomUser(AbstractUser):
    class Roles(models.TextChoices):
        STUDENT = 'S', 'Student'
        INSTITUTE = 'I', 'Institute'

    username = models.CharField(max_length=11, unique=True, help_text="National Id for Institutes / National Code for Students", validators=[username_validator])
    first_name = models.CharField(verbose_name="First Name", max_length=100)
    last_name = models.CharField(verbose_name="Last Name", max_length=100)
    email = models.EmailField(verbose_name="Email Address", max_length=60, unique=True)
    phone_number = models.CharField(verbose_name="Phone Number", max_length=15, validators=[phone_number_validator], unique=True)
    province = models.CharField(max_length=100, null=True)
    city = models.CharField(max_length=100, null=True)
    address = models.TextField(null=True)

    role = models.CharField(max_length=1, choices=Roles.choices, null=True, help_text="Null for superuser, Not Null for business users")

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'phone_number']


class Institute(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    institute_name = models.CharField(max_length=100)
    description = models.TextField(null=True)
    website = models.URLField(null=True, unique=True)
    logo = models.ImageField(null=True, upload_to=get_image_file_path, default=default_file_path)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.institute_name

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    birth_date = models.DateField(null=True)
    bio = models.TextField(null=True)
    avatar = models.ImageField(null=True, upload_to=get_image_file_path, default=default_file_path)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.get_full_name()