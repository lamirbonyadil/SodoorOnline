from django.core import validators
from django.utils.deconstruct import deconstructible
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


@deconstructible
class PhoneNumberValidator(validators.RegexValidator):
    regex = r"^0(9\d{9}|\d{2}(\d{4}|\d{8}))$"
    message = ("Enter a valid phone number. The phone number must contain only digits. "
               "Mobile numbers must start with '09' and landlines with '0'.")
    flags = 0


class NationalCodeValidator:
    """
        Validator for Iranian National Code (Code-e Melli) for students.
    """
    message_invalid = _("%(value)s is not a valid national Code format.")
    message_digits = _("%(value)s must be exactly 10 digits long.")
    message_numeric = _("%(value)s must contain digits only.")

    def __call__(self, value):
        # Check if the input contains only numeric characters.
        if not value.isnumeric():
            raise ValidationError(self.message_numeric, params={'value': value})

        # Check if the input length is exactly 10 digits.
        if len(value) != 10:
            raise ValidationError(self.message_digits, params={'value': value})

        # Execute the National Code validation algorithm
        total = 0
        control_digit = int(value[-1])
        for digit, index in zip(value, range(10, 1, -1)):
            total += int(digit) * index

        reminder = total % 11
        if reminder < 2:
            if reminder != control_digit:
                raise ValidationError(self.message_invalid, params={'value': value})
        else:
            if 11 - reminder != control_digit:
                raise ValidationError(self.message_invalid, params={'value': value})


class NationalIdValidator:
    """
        Validator for Iranian National ID (Shenase-e Melli) for institutes.
    """
    message_invalid = _("%(value)s is not a valid national ID format.")
    message_digits = _("%(value)s must be exactly 11 digits long.")
    message_numeric = _("%(value)s must contain digits only.")

    def __call__(self, value):
        # Check if the input contains only numeric characters.
        if not value.isnumeric():
            raise ValidationError(self.message_numeric, params={'value': value})

        # Check if the input length is exactly 11 digits.
        if len(value) != 11:
            raise ValidationError(self.message_digits, params={'value': value})

        # Execute the National ID validation algorithm
        weights = (29, 27, 23, 19, 17)
        control_digit = int(value[-1])
        d = int(value[-2]) + 2
        total = 0
        for i in range(10):
            total += (int(value[i]) + d) * weights[i % 5]

        reminder = total % 11
        if reminder == 10:
            reminder = 0

        if reminder != control_digit:
            raise ValidationError(self.message_invalid, params={'value': value})


@deconstructible
class UsernameValidator:
    """
        Dispatcher validator that selects the appropriate validation logic
        based on the input length (National Code vs. National ID).
    """
    message_invalid = _("%(value)s must be either 10 digit long (national Code) or 11 digit long (national ID).")
    def __init__(self):
        self.code_validator = NationalCodeValidator()
        self.id_validator = NationalIdValidator()

    def __call__(self, value):
        # Apply the specific validator based on the input length.
        if len(value) == 10:
            self.code_validator(value)

        elif len(value) == 11:
            self.id_validator(value)

        else:
            raise ValidationError(self.message_invalid, params={'value': value})

phone_number_validator = PhoneNumberValidator()
username_validator = UsernameValidator()
image_file_extension_validator = validators.FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"])