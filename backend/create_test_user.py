import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User

username = 'testuser2'
email = 'test2@example.com'
password = 'TestPass123'

if User.objects.filter(username=username).exists():
    print('User already exists')
else:
    User.objects.create_user(username=username, email=email, password=password)
    print('Created user:', username)
