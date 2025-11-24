import os.path
from django.core.exceptions import ValidationError
from django.test import TestCase, override_settings
from account.models import CustomUser, Institute, Student
from django.db.utils import IntegrityError
from django.db import transaction
from account.utils import default_file_path
from django.core.files.uploadedfile import SimpleUploadedFile
import tempfile
import shutil


# Temporary Media Folder
MEDIA_ROOT = tempfile.mkdtemp()


class CustomUserTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="7966299817",
            email="aaaa@bb.com",
            first_name="تست",
            last_name="کاربر",
            phone_number="09395551212",
            role="S"
        )

    def test_create_user(self):
        """Test creating a new user with the custom manager"""
        self.assertEqual(self.user.username, "7966299817")
        self.assertEqual(self.user.email, "aaaa@bb.com")
        self.assertEqual(self.user.role, "S")
        self.assertFalse(self.user.is_staff)
        self.assertFalse(self.user.is_superuser)
        self.assertTrue(self.user.is_active)

    def test_create_superuser(self):
        """Test creating a new superuser with the custom manager"""
        admin_user = CustomUser.objects.create_superuser(
            username="1234567891",
            email="bb@cc.com",
            first_name="تست",
            last_name="ادمین",
            phone_number="09991113344"
        )
        self.assertEqual(admin_user.username, "1234567891")
        self.assertEqual(admin_user.role, "")
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_active)

    def test_create_user_missing_field(self):
        """Test that creating user without required fields raises ValueError"""
        # Missing field = username
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                username='',
                email="a@bb.com",
                first_name="تست",
                last_name="کاربر",
                phone_number="02145665544",
                role="S"
            )
        # Missing field = email
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                username='1234567891',
                email="",
                first_name="تست",
                last_name="کاربر",
                phone_number="02145665544",
                role="S"
            )
        # Missing field = phone number
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                username='1234567891',
                email="a@bb.com",
                first_name="تست",
                last_name="کاربر",
                phone_number="",
                role="S"
            )
        # Missing field = first name
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                username='',
                password="123",
                email="a@bb.com",
                first_name="",
                last_name="کاربر",
                phone_number="02145665544",
                role="S"
            )
        # Missing field = last name
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                username='',
                password="123",
                email="a@bb.com",
                first_name="تست",
                last_name="",
                phone_number="02145665544",
                role="S"
            )

    def test_str_method(self):
        self.assertEqual(str(self.user), "7966299817")

    def test_unique_constraints(self):
        """Test that unique constraint on username works"""
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                CustomUser.objects.create_user(
                    username="7966299817",
                    email="acddc@cb.com",
                    first_name="تست",
                    last_name="کاربر 1",
                    phone_number="02145665644",
                    role="S"
                )

        """Test that unique constraint on email works"""
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                CustomUser.objects.create_user(
                    username="1234567891",
                    email="aaaa@bb.com",
                    first_name="تست",
                    last_name="کاربر",
                    phone_number="02145665644",
                    role="S"
                )

        """Test that unique constraint on phone_number works"""
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                CustomUser.objects.create_user(
                    username="0000000000",
                    email="a@cb.com",
                    first_name="تست",
                    last_name="کاربر 1",
                    phone_number="09395551212",
                    role="S"
                )


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class InstituteProfileTest(TestCase):
    def setUp(self):
        self.institute_user = CustomUser.objects.create_user(
            username="0000000000",
            email="a@bb.com",
            first_name="تست",
            last_name="کاربر",
            phone_number="02145665544",
            role="I"
        )
        self.institute_profile = Institute.objects.create(
            user=self.institute_user,
            institute_name="شرکت 1",
            website="http://www.google.com",
        )

    def test_institute_profile(self):
        self.assertEqual(self.institute_profile.institute_name, "شرکت 1")
        self.assertEqual(self.institute_profile.website, "http://www.google.com")
        self.assertEqual(self.institute_profile.user.username, self.institute_user.username)
        self.assertEqual(self.institute_profile.logo, default_file_path())

    def tearDown(self):
        # Clean up the temp directory
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_institute_profile_img(self):
        sample_img_content = b'\xff\xd8\xff\x00\x00\x00\x00\x00\x00\xff\xd9'
        file_name = "sample.jpg"
        uploaded_file = SimpleUploadedFile(file_name, sample_img_content, content_type="image/jpeg")

        self.institute_profile.logo = uploaded_file
        self.institute_profile.save()

        self.assertTrue(self.institute_profile.logo.name.endswith(f"institutes/{self.institute_profile.user.username}/{file_name}"))
        self.assertTrue(os.path.exists(self.institute_profile.logo.path))

    def test_create_institute_with_wrong_role(self):
        student_user = CustomUser.objects.create_user(
            username="5116168397",
            email="aaa@bb.com",
            first_name="تست",
            last_name="کاربر",
            phone_number="09123456789",
            role="S"
        )
        institute = Institute(
            user=student_user,
            institute_name="شرکت 2",
            website="http://www.google.com",
        )

        with self.assertRaises(ValidationError) as e:
            institute.clean()

        self.assertIn("Can't assign Institute profile", str(e.exception))

    def test_institute_str(self):
        self.assertEqual(str(self.institute_profile), "شرکت 1")

    def test_institute_user_relationship(self):
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Institute.objects.create(
                    user=self.institute_user,
                    institute_name="شرکت 2",
                    website="http://www.google.com",
                )

@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class StudentProfileTest(TestCase):
    def setUp(self):
        self.student_user = CustomUser.objects.create_user(
            username="8912812269",
            email="aaaaa@jjj.com",
            first_name="نریمان",
            last_name="اسدی",
            phone_number="09199876543",
            role="S"
        )
        self.student_profile = Student.objects.create(
            user=self.student_user,
            birth_date="1990-01-01"
        )

    def test_student_profile(self):
        self.assertEqual(self.student_profile.user.username, self.student_user.username)
        self.assertEqual(self.student_profile.user.phone_number, self.student_user.phone_number)
        self.assertEqual(self.student_profile.birth_date, "1990-01-01")

    def tearDown(self):
        # Clean up the temp directory
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_student_profile_img(self):
        sample_img_content = b'\xff\xd8\xff\x00\x00\x00\x00\x00\x00\xff\xd9'
        file_name = "sample.jpg"
        uploaded_file = SimpleUploadedFile(file_name, sample_img_content, content_type="image/jpeg")

        self.student_profile.avatar = uploaded_file
        self.student_profile.save()

        self.assertTrue(self.student_profile.avatar.name.endswith(f"students/{self.student_profile.user.username}/{file_name}"))
        self.assertTrue(os.path.exists(self.student_profile.avatar.path))

    def test_student_institute_with_wrong_role(self):
        institute_user = CustomUser.objects.create_user(
            username="0000000000",
            email="a@bb.com",
            first_name="تست",
            last_name="کاربر",
            phone_number="02145665544",
            role="I"
        )

        student = Student(
            user=institute_user,
            birth_date="1990-01-01"
        )

        with self.assertRaises(ValidationError) as e:
            student.clean()

        self.assertIn("Can't assign Student profile", str(e.exception))

    def test_student_str(self):
        self.assertEqual(str(self.student_profile), "نریمان اسدی")

    def test_student_user_relationship(self):
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Student.objects.create(
                    user=self.student_user,
                    birth_date="1990-01-01"
                )