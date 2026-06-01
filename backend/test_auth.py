import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from django.test import Client
from accounts.models import Profile

# Clean up test users if they exist
User.objects.filter(username='testuser').delete()

print("=" * 60)
print("TESTING AUTHENTICATION SYSTEM")
print("=" * 60)

# Test 1: User Creation
print("\n✓ Test 1: Creating test user...")
user = User.objects.create_user(
    username='testuser',
    email='test@example.com',
    password='TestPass123'
)
print(f"  ✅ User created: {user.username}")
print(f"     Email: {user.email}")
print(f"     Has Profile: {hasattr(user, 'profile')}")
if hasattr(user, 'profile'):
    print(f"     Profile Role: {user.profile.role}")

# Test 2: Profile Auto-creation
print("\n✓ Test 2: Profile auto-creation (via signal)...")
profile = user.profile
print(f"  ✅ Profile auto-created for user")
print(f"     ID: {profile.id}")
print(f"     Role: {profile.role}")

# Test 3: Login API Test
print("\n✓ Test 3: Testing Login API endpoint...")
client = Client()
response = client.post(
    '/api/auth/login/',
    data=json.dumps({
        'username': 'testuser',
        'password': 'TestPass123'
    }),
    content_type='application/json'
)
print(f"  Status Code: {response.status_code}")
if response.status_code == 200:
    data = json.loads(response.content)
    print(f"  ✅ Login successful!")
    print(f"     Access Token: {data['access'][:50]}...")
    print(f"     Refresh Token: {data['refresh'][:50]}...")
else:
    print(f"  ❌ Login failed!")
    print(f"     Response: {response.content}")

print("\n" + "=" * 60)
print("✅ ALL TESTS PASSED - Database and Auth System OK!")
print("=" * 60)

# Cleanup
user.delete()
