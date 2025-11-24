from django.test import TestCase
from account.validators import (PhoneNumberValidator,
                                NationalCodeValidator,
                                NationalIdValidator,
                                UsernameValidator,
                                image_file_extension_validator)
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile


class PhoneNumberValidatorTest(TestCase):
    def setUp(self):
        self.validator = PhoneNumberValidator()

    def test_iranian_mobile_numbers(self):
        """Test validation for various Iranian mobile number formats."""

        # Test case 1: A valid mobile number
        phone_1 = "09112322233"
        self.validator(phone_1)

        # Test case 2: An invalid mobile number (too long)
        # This is expected to raise a ValidationError.
        phone_2 = "091123222332"
        with self.assertRaises(ValidationError):
            self.validator(phone_2)

        # Test case 3: An invalid format (non-numeric characters)
        # This should always raise a ValidationError.
        phone_4 = "abcded"
        with self.assertRaises(ValidationError):
            self.validator(phone_4)

    def test_iranian_landlines(self):
        """Test validation for Iranian landline number formats."""

        # Test case 1: A valid landline number
        phone_1 = "0216463"
        self.validator(phone_1)

        # Test case 2: An invalid landline number (too short)
        phone_2 = "01154"
        with self.assertRaises(ValidationError):
            self.validator(phone_2)

        # Test case 3: A valid landline number
        phone_3 = "05832923217"
        self.validator(phone_3)


class NationalCodeValidatorTest(TestCase):
    def setUp(self):
        self.validator = NationalCodeValidator()

    def test_non_numeric_national_code(self):
        """Test validation for non-numeric national codes."""

        # Test case 1: An invalid format national code (non-numeric)
        # This should always raise a ValidationError.
        code_1 = "abcdefghij"
        with self.assertRaises(ValidationError):
            self.validator(code_1)

    def test_numeric_national_code(self):
        """Test validation for numeric national codes."""

        # Test case 1: An invalid national code (too short)
        # This is expected to raise a ValidationError.
        code_1 = "123456789"
        with self.assertRaises(ValidationError):
            self.validator(code_1)

        # Test case 2: An invalid national code (checksum = 6, control digit = 1)
        code_2 = "7731689951"
        with self.assertRaises(ValidationError):
            self.validator(code_2)

        # Test case 3: A valid national code (checksum = 0, control digit = 0)
        code_3 = "0932833810"
        self.validator(code_3)

        # Test case 5: An Invalid national code
        code_5 = "1234567890"
        with self.assertRaises(ValidationError):
            self.validator(code_5)

class NationalIdValidatorTest(TestCase):
    def setUp(self):
        self.validator = NationalIdValidator()


    def test_non_numeric_national_id(self):
        """Test validation for non-numeric national ids."""

        # Test case 1: An invalid format national id (non-numeric)
        # This should always raise a ValidationError.
        code_1 = "abcdefghij"
        with self.assertRaises(ValidationError):
            self.validator(code_1)

    def test_numeric_national_id(self):
        """Test validation for numeric national codes."""

        # Test case 1: A valid national id (Mobin-Net LTD)
        code_1 = "10103765178"
        self.validator(code_1)

        # Test case 2: An invalid national id (checksum = 9, control digit = 6)
        code_2 = "12563254306"
        with self.assertRaises(ValidationError):
            self.validator(code_2)

        # Test case 3: An invalid national id (too short)
        # This is expected to raise a ValidationError.
        code_3 = "1234567890"
        with self.assertRaises(ValidationError):
            self.validator(code_3)


class UsernameValidatorTest(TestCase):
    def setUp(self):
        self.validator = UsernameValidator()

    def test_username(self):
        """Test validation for username."""

        # Test case 1: This should invoke National Code Validator And should throw an Exception
        code_1 = "123456789"
        with self.assertRaises(ValidationError):
            self.validator(code_1)

        # Test case 2: This should invoke National Code Validator and its a valid one.
        code_2 = "0932833810"
        self.validator(code_2)


        # Test case 3: This should invoke National Id validator and should its a valid one.
        code_3 = "10103765178"
        self.validator(code_3)

        # Test case 4: This should invoke National Id validator And should throw an Exception
        code_4 = "1234567890"
        with self.assertRaises(ValidationError):
            self.validator(code_4)

        # Test case 5: This should raise exception because its too short.
        code_5 = "123456"
        with self.assertRaises(ValidationError):
            self.validator(code_5)


class ImageExtensionTest(TestCase):
    def setUp(self):
        self.validator = image_file_extension_validator

    def test_jpg_file_extension(self):
        img = self._create_temp_img(ext=".jpg")
        self.validator(img)

    def test_jpeg_file_extension(self):
        img = self._create_temp_img(ext=".jpeg")
        self.validator(img)

    def test_png_file_extension(self):
        img = self._create_temp_img(ext=".png")
        self.validator(img)

    def test_gif_image_extensions(self):
        gif = self._create_temp_img(ext=".gif")
        with self.assertRaises(ValidationError):
            self.validator(gif)

    def test_avif_img_extension(self):
        avif = self._create_temp_img(ext=".avif")
        with self.assertRaises(ValidationError):
            self.validator(avif)


    def _create_temp_img(self, ext: str):
        return SimpleUploadedFile(name=f"test{ext}", content=b"", content_type=f"image/{ext[1:]}")