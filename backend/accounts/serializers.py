from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.CharField(write_only=True, required=False, default='user')

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password2', 'role')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        role = validated_data.pop('role', 'user')
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        
        # Profile is created via signal, retrieve and update role
        profile = user.profile
        profile.role = role
        profile.save()
        
        return user

    def to_representation(self, instance):
        # After creation, return tokens + user data
        data = super().to_representation(instance)
        refresh = RefreshToken.for_user(instance)
        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        return data



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ('user', 'avatar', 'bio', 'phone', 'location', 'role')

class ProfileUpdateSerializer(serializers.ModelSerializer):
    # Allow updating user fields (first_name, last_name, email)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)

    class Meta:
        model = Profile
        fields = ('avatar', 'bio', 'phone', 'location', 'first_name', 'last_name', 'email')

    def update(self, instance, validated_data):
        # Pop nested user data
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Update profile fields
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.location = validated_data.get('location', instance.location)
        instance.save()

        # Update user fields
        if user_data:
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.email = user_data.get('email', user.email)
            user.save()

        return instance