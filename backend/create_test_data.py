#!/usr/bin/env python3
"""
ShopNaija Test Data Creation Script
Creates default admin user and sample data for testing
"""

from app import create_app
from models import db, User, Vendor, Product, UserRole, VendorStatus
from datetime import datetime

def create_test_data():
    """Create test users and data for ShopNaija"""
    
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
        print("🏗️  Creating ShopNaija test data...")
        
        # Create admin user
        admin_user = User.query.filter_by(email='admin@shopnaija.com').first()
        if not admin_user:
            admin_user = User(
                username='admin',
                email='admin@shopnaija.com',
                role=UserRole.ADMIN,
                is_verified=True
            )
            admin_user.set_password('admin123')
            db.session.add(admin_user)
            print("✅ Created admin user: admin@shopnaija.com / admin123")
        
        # Create test customer
        customer_user = User.query.filter_by(email='customer@shopnaija.com').first()
        if not customer_user:
            customer_user = User(
                username='customer',
                email='customer@shopnaija.com',
                role=UserRole.CUSTOMER,
                is_verified=True
            )
            customer_user.set_password('customer123')
            db.session.add(customer_user)
            print("✅ Created customer user: customer@shopnaija.com / customer123")
        
        # Create test vendor user
        vendor_user = User.query.filter_by(email='vendor@shopnaija.com').first()
        if not vendor_user:
            vendor_user = User(
                username='vendor',
                email='vendor@shopnaija.com',
                role=UserRole.VENDOR,
                is_verified=True
            )
            vendor_user.set_password('vendor123')
            db.session.add(vendor_user)
            print("✅ Created vendor user: vendor@shopnaija.com / vendor123")
        
        db.session.commit()
        
        # Create test vendor profile
        vendor_profile = Vendor.query.filter_by(user_id=vendor_user.id).first()
        if not vendor_profile:
            vendor_profile = Vendor(
                user_id=vendor_user.id,
                business_name='Test Electronics Store',
                business_address='123 Lagos Street, Victoria Island, Lagos',
                business_phone='+234 801 234 5678',
                business_email='vendor@shopnaija.com',
                business_registration='RC12345678',
                bank_name='Access Bank',
                account_number='1234567890',
                account_name='Test Electronics Store',
                status=VendorStatus.APPROVED,
                commission_rate=8.0,
                total_sales=0.0,
                current_balance=0.0,
                approved_at=datetime.utcnow()
            )
            db.session.add(vendor_profile)
            print("✅ Created vendor profile: Test Electronics Store")
        
        # Create sample products
        sample_products = [
            {
                'name': 'iPhone 14 Pro Max',
                'description': 'Latest Apple iPhone with advanced camera system',
                'price': 850000.00,
                'category': 'Electronics',
                'stock': 50,
                'image_url': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
                'is_available': True
            },
            {
                'name': 'Samsung Galaxy S23 Ultra',
                'description': 'Premium Android smartphone with S Pen',
                'price': 720000.00,
                'category': 'Electronics',
                'stock': 30,
                'image_url': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
                'is_available': True
            },
            {
                'name': 'MacBook Air M2',
                'description': 'Ultra-lightweight laptop with M2 chip',
                'price': 1200000.00,
                'category': 'Electronics',
                'stock': 20,
                'image_url': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
                'is_available': True
            },
            {
                'name': 'Nike Air Force 1',
                'description': 'Classic white leather sneakers',
                'price': 45000.00,
                'category': 'Fashion',
                'stock': 100,
                'image_url': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
                'is_available': True
            },
            {
                'name': 'Wireless Bluetooth Headphones',
                'description': 'High-quality noise-cancelling headphones',
                'price': 25000.00,
                'category': 'Electronics',
                'stock': 75,
                'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
                'is_available': True
            }
        ]
        
        for product_data in sample_products:
            existing_product = Product.query.filter_by(
                name=product_data['name'], 
                vendor_id=vendor_profile.id
            ).first()
            
            if not existing_product:
                product = Product(
                    vendor_id=vendor_profile.id,
                    name=product_data['name'],
                    description=product_data['description'],
                    price=product_data['price'],
                    category=product_data['category'],
                    stock=product_data['stock'],
                    is_active=True,
                    min_stock=5
                )
                db.session.add(product)
                print(f"✅ Created product: {product_data['name']}")
        
        db.session.commit()
        
        print("\n🎉 ShopNaija test data created successfully!")
        print("\n📋 Test Credentials:")
        print("===================")
        print("👨‍💼 Admin Login:")
        print("   Email: admin@shopnaija.com")
        print("   Password: admin123")
        print("\n🏪 Vendor Login:")
        print("   Email: vendor@shopnaija.com")
        print("   Password: vendor123")
        print("\n👤 Customer Login:")
        print("   Email: customer@shopnaija.com")
        print("   Password: customer123")
        print("\n🌐 Backend Server: http://localhost:5000")
        print("🖥️  Frontend App: http://localhost:3000")

if __name__ == '__main__':
    create_test_data()
