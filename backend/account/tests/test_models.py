from django.test import TestCase
from account.models import CustomUser
from django.db.utils import IntegrityError


class CustomUserManagerTest(TestCase):
    def test_create_user(self):
        """Test creating a new user with the custom manager"""
        user = CustomUser.objects.create_user(
            username="0000000000",
            password="123",
            email="a@bb.com",
            first_name="تست",
            last_name="کاربر",
            phone_number="02145665544",
            role="S"
        )
        self.assertEqual(user.username, "0000000000")
        self.assertTrue(user.check_password("123"))
        self.assertEqual(user.email, "a@bb.com")
        self.assertEqual(user.role, "S")
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)

    def test_create_superuser(self):
        """Test creating a new superuser with the custom manager"""
        admin_user = CustomUser.objects.create_superuser(
            username="1234567891",
            password="111",
            email="bb@cc.com",
            first_name="تست",
            last_name="ادمین",
            phone_number="09991113344"
        )
        self.assertEqual(admin_user.username, "1234567891")
        self.assertTrue(admin_user.check_password("111"))
        self.assertEqual(admin_user.role, "")
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_active)

    def test_create_user_missing_field(self):
        """Test that creating user without required fields raises ValueError"""
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                username='',
                password="123",
                email="a@bb.com",
                first_name="تست",
                last_name="کاربر",
                phone_number="02145665544",
                role="S"
            )

        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                username='1234567891',
                password="123",
                email="",
                first_name="تست",
                last_name="کاربر",
                phone_number="02145665544",
                role="S"
            )

        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                username='',
                password="123",
                email="a@bb.com",
                first_name="تست",
                last_name="کاربر",
                phone_number="",
                role="S"
            )

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

class CustomUserMethodTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="0000000000",
            password="123",
            email="a@bb.com",
            first_name="تست",
            last_name="کاربر",
            phone_number="02145665544",
            role="S"
        )

    def test_user_str(self):
        self.assertEqual(str(self.user), "0000000000")

class DataBaseConstraintsTest(TestCase):
    def setUp(self):
        CustomUser.objects.create_user(
            username="0000000000",
            password="123",
            email="a@bb.com",
            first_name="تست",
            last_name="کاربر",
            phone_number="02145665544",
            role="S"
        )

    def test_duplicate_username(self):
        """Test that unique constraint on username works"""
        with self.assertRaises(IntegrityError):
            CustomUser.objects.create_user(
            username="0000000000",
            password="1234",
            email="a@cb.com",
            first_name="تست",
            last_name="کاربر 1",
            phone_number="02145665644",
            role="S"
            )

    def test_duplicate_email(self):
        """Test that unique constraint on email works"""
        with self.assertRaises(IntegrityError):
            CustomUser.objects.create_user(
            username="1234567891",
            password="123",
            email="a@bb.com",
            first_name="تست",
            last_name="کاربر",
            phone_number="02145665644",
            role="S"
            )

    def test_duplicate_phone_number(self):
        """Test that unique constraint on phone_number works"""
        with self.assertRaises(IntegrityError):
            CustomUser.objects.create_user(
            username="0000000000",
            password="1234",
            email="a@cb.com",
            first_name="تست",
            last_name="کاربر 1",
            phone_number="02145665544",
            role="S"
            )