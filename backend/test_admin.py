#!/usr/bin/env python3
"""
Test admin functionality
"""

from app import create_app
from models import db, User, UserRole

def test_admin():
    app = create_app()
    
    with app.app_context():
        print("🔍 Testing Admin Functionality")
        print("=" * 40)
        
        # Check all users
        all_users = User.query.all()
        print(f"📊 Total Users: {len(all_users)}")
        
        for user in all_users:
            print(f"   - {user.email} ({user.role.value}) - ID: {user.id}")
        
        # Check specifically for admin users
        admin_users = User.query.filter(User.role == UserRole.ADMIN).all()
        print(f"\n👨‍💼 Admin Users: {len(admin_users)}")
        
        for admin in admin_users:
            print(f"   - {admin.email} ({admin.username}) - ID: {admin.id}")
            print(f"     Created: {admin.created_at}")
            print(f"     Last Login: {admin.last_login}")
            print(f"     Verified: {admin.is_verified}")
        
        # Test if your email exists
        your_admin = User.query.filter_by(email='ezemaraphael94@gmail.com').first()
        if your_admin:
            print(f"\n✅ Your admin account found:")
            print(f"   Email: {your_admin.email}")
            print(f"   Username: {your_admin.username}")
            print(f"   Role: {your_admin.role.value}")
            print(f"   ID: {your_admin.id}")
        else:
            print(f"\n❌ Your admin account NOT found!")
            
        print("\n" + "=" * 40)

if __name__ == '__main__':
    test_admin()
