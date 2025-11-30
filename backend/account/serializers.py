from djoser.serializers import UserSerializer, UserCreatePasswordRetypeSerializer
from rest_framework import serializers
from .models import CustomUser, Institute, Student


class InstituteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institute
        fields = ('institute_name', 'description', 'website', 'logo')


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('birth_date', 'bio', 'avatar')


class CustomUserSerializer(UserSerializer):
    institute = InstituteSerializer()
    student = StudentSerializer()

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('institute', 'student', )
        read_only_fields = UserSerializer.Meta.read_only_fields + ('role', )

    def update(self, instance, validated_data):
        profile_obj, profile_data = None, None
        if instance.role == CustomUser.Roles.INSTITUTE:
            profile_obj = instance.institute
            profile_data = validated_data.pop('institute', None)

        if instance.role == CustomUser.Roles.STUDENT:
            profile_obj = instance.student
            profile_data = validated_data.pop('student', None)

        instance = super().update(instance, validated_data)

        if profile_data:
            for attr, value in profile_data.items():
                setattr(profile_obj, attr, value)

            profile_obj.save()

        return instance

    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.role == CustomUser.Roles.INSTITUTE:
            data.pop('student')

        if instance.role == CustomUser.Roles.STUDENT:
            data.pop('institute')

        return data

class CustomUserCreatePasswordRetypeSerializer(UserCreatePasswordRetypeSerializer):
    class Meta(UserCreatePasswordRetypeSerializer.Meta):
        extra_kwargs = {
            'role': {
                'required': True,
                'allow_blank': False,
                'error_messages': {
                    'required': 'This field is required.',
                    'blank': 'Role field cannot be blank.',
                    'invalid_choice': 'Invalid choice. Please select either "S" for Student or "I" for Institute.'
                }
            },
        }