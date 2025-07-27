#!/usr/bin/env python3
"""
Setup script for ShopNaija Backend
This script initializes the database and seeds it with sample data
"""

import os
import sys
from app import create_app
from models import db
from seed_database import seed_database

def setup_backend():
    """Setup the backend database and seed with sample data"""
    
    print("🚀 Setting up ShopNaija Backend...")
    
    # Create Flask app
    app = create_app()
    
    # Create database tables
    with app.app_context():
        print("📦 Creating database tables...")
        db.create_all()
        print("✅ Database tables created successfully!")
    
    # Seed database with sample data
    print("🌱 Seeding database with sample products...")
    try:
        seed_database()
        print("✅ Database seeded successfully!")
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        return False
    
    print("\n🎉 Backend setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the backend server: python app.py")
    print("2. Start the frontend: cd frontend && npm run dev")
    print("3. Visit http://localhost:5173 to see your app!")
    
    return True

if __name__ == '__main__':
    if setup_backend():
        print("\n🏪 Welcome to ShopNaija - Your Nigerian E-commerce Platform!")
    else:
        print("\n❌ Setup failed. Please check the errors above.")
        sys.exit(1)
