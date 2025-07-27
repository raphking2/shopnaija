#!/usr/bin/env python3
"""
Simple database reinitialization script
"""

import os
from app import create_app
from models import db, User, Vendor, UserRole, VendorStatus
from datetime import datetime

def simple_reinit():
    app = create_app()
    
    with app.app_context():
        print("🔄 Simple Database Reinitialization...")
        print("=" * 50)
        
        # Drop and recreate all tables
        db.drop_all()
        db.create_all()
        print("✅ Database schema recreated")
        
        # Create your admin account
        admin_user = User(
            username='raphael',
            email='ezemaraphael94@gmail.com',
            phone='08012345678',
            role=UserRole.ADMIN,
            is_verified=True,
            created_at=datetime.utcnow()
        )
        admin_user.set_password('AdminPass123')
        
        db.session.add(admin_user)
        db.session.commit()
        print(f"✅ Admin user created: {admin_user.email}")
        
        # Create a test vendor user (for testing vendor registration)
        vendor_user = User(
            username='testvendor',
            email='testvendor@example.com',
            phone='08098765432',
            role=UserRole.VENDOR,
            is_verified=True,
            created_at=datetime.utcnow()
        )
        vendor_user.set_password('VendorPass123')
        
        db.session.add(vendor_user)
        db.session.commit()
        
        # Create vendor profile for the test vendor
        vendor_profile = Vendor(
            user_id=vendor_user.id,
            business_name='Test Store',
            business_address='123 Test Street, Lagos, Nigeria',
            business_phone='08098765432',
            business_email='testvendor@example.com',
            business_registration='RC123456',
            bank_name='First Bank',
            account_number='1234567890',
            account_name='Test Store Ltd',
            status=VendorStatus.PENDING,  # Set to pending so you can test approval
            created_at=datetime.utcnow()
        )
        
        db.session.add(vendor_profile)
        db.session.commit()
        print(f"✅ Test vendor created: {vendor_profile.business_name} (Status: {vendor_profile.status.value})")
        
        # Verify creation
        total_users = User.query.count()
        total_admins = User.query.filter(User.role == UserRole.ADMIN).count()
        total_vendors = Vendor.query.count()
        
        print("\n📊 Database Summary:")
        print(f"   Total Users: {total_users}")
        print(f"   Admins: {total_admins}")
        print(f"   Vendors: {total_vendors}")
        
        print(f"\n🔑 Login Credentials:")
        print(f"   Admin: ezemaraphael94@gmail.com / AdminPass123")
        print(f"   Test Vendor: testvendor@example.com / VendorPass123")
        
        print("\n" + "=" * 50)
        print("✅ Simple database reinitialization complete!")
        print("💡 You can now test:")
        print("   - Admin login and dashboard")
        print("   - Vendor approval workflow")
        print("   - New vendor registration with different emails")

if __name__ == '__main__':
    simple_reinit()
