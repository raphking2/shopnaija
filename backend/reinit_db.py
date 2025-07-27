#!/usr/bin/env python3
"""
Reinitialize database and fix any data issues
"""

import os
from app import create_app
from models import db, User, Vendor, Product, ProductImage, UserRole, VendorStatus
from werkzeug.security import generate_password_hash
from datetime import datetime

def reinit_database():
    app = create_app()
    
    with app.app_context():
        print("🔄 Reinitializing Database...")
        print("=" * 40)
        
        # Drop all tables and recreate
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
        
        # Create sample vendor user
        vendor_user = User(
            username='vendortest',
            email='vendor@test.com',
            phone='08098765432',
            role=UserRole.VENDOR,
            is_verified=True,
            created_at=datetime.utcnow()
        )
        vendor_user.set_password('VendorPass123')
        
        db.session.add(vendor_user)
        db.session.commit()
        
        # Create vendor profile
        vendor_profile = Vendor(
            user_id=vendor_user.id,
            business_name='Test Electronics Store',
            business_address='123 Lagos Street, Victoria Island, Lagos, Nigeria',
            business_phone='08098765432',
            business_email='vendor@test.com',
            business_registration='RC123456',
            bank_name='First Bank Nigeria',
            account_number='1234567890',
            account_name='Test Electronics Store',
            status=VendorStatus.APPROVED,
            created_at=datetime.utcnow()
        )
        
        db.session.add(vendor_profile)
        db.session.commit()
        print(f"✅ Sample vendor created: {vendor_profile.business_name}")
        
        # Create sample products
        sample_products = [
            {
                'name': 'iPhone 15 Pro Max',
                'description': 'Latest Apple iPhone with advanced features',
                'price': 899000.00,
                'category': 'Electronics',
                'image_url': '/images/iphone15.jpg'
            },
            {
                'name': 'Samsung Galaxy S24 Ultra',
                'description': 'Premium Android smartphone with S Pen',
                'price': 750000.00,
                'category': 'Electronics',
                'image_url': '/images/galaxy-s24.jpg'
            },
            {
                'name': 'MacBook Air M3',
                'description': 'Ultra-thin laptop with M3 chip',
                'price': 1200000.00,
                'category': 'Computers',
                'image_url': '/images/macbook-air.jpg'
            }
        ]
        
        for product_data in sample_products:
            product = Product(
                name=product_data['name'],
                description=product_data['description'],
                price=product_data['price'],
                category=product_data['category'],
                vendor_id=vendor_profile.id,
                stock=10,  # Use 'stock' not 'stock_quantity'
                is_active=True,
                created_at=datetime.utcnow()
            )
            
            db.session.add(product)
            db.session.commit()
            
            # Add product image
            product_image = ProductImage(
                product_id=product.id,
                image_url=product_data['image_url'],
                is_primary=True
            )
            
            db.session.add(product_image)
            
        db.session.commit()
        print(f"✅ {len(sample_products)} sample products created")
        
        # Verify data
        total_users = User.query.count()
        total_admins = User.query.filter(User.role == UserRole.ADMIN).count()
        total_vendors = Vendor.query.count()
        total_products = Product.query.count()
        
        print("\n📊 Database Summary:")
        print(f"   Users: {total_users}")
        print(f"   Admins: {total_admins}")
        print(f"   Vendors: {total_vendors}")
        print(f"   Products: {total_products}")
        
        print(f"\n🔑 Login Credentials:")
        print(f"   Admin: ezemaraphael94@gmail.com / AdminPass123")
        print(f"   Vendor: vendor@test.com / VendorPass123")
        
        print("\n" + "=" * 40)
        print("✅ Database reinitialization complete!")

if __name__ == '__main__':
    reinit_database()
