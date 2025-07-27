#!/usr/bin/env python3
"""
Test script to check database contents
"""

from app import create_app
from models import db, User, Product, Vendor

def check_database():
    app = create_app()
    
    with app.app_context():
        print("🔍 Database Status Check")
        print("=" * 40)
        
        # Check users
        users = User.query.all()
        print(f"👥 Total Users: {len(users)}")
        for user in users:
            print(f"   - {user.email} ({user.role.value})")
        
        # Check vendors
        vendors = Vendor.query.all()
        print(f"\n🏪 Total Vendors: {len(vendors)}")
        for vendor in vendors:
            print(f"   - {vendor.business_name} ({vendor.status.value})")
        
        # Check products
        products = Product.query.all()
        print(f"\n📦 Total Products: {len(products)}")
        for product in products:
            print(f"   - {product.name}: ₦{product.price:,.2f} (Stock: {product.stock})")
        
        if len(products) == 0:
            print("\n❌ No products found! Run init_db.py to create sample products.")
        else:
            print(f"\n✅ Database looks good! {len(products)} products available.")

if __name__ == '__main__':
    check_database()
