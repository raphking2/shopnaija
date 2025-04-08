import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///ecommerce.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disable modification tracking to save resources

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')  # Mandatory secret key
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))  # 1 hour by default
    JWT_TOKEN_LOCATION = ['headers']  # Only accept tokens in headers
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'

    # Security Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')  # Flask secret key
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'  # Debug mode

    # CORS Configuration (if needed)
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')  # Allow all origins by default

    # Email Configuration (optional, for future use)
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.example.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')

    # File Upload Configuration (optional, for future use)
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB by default

# Development-specific configuration
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True  # Log SQL queries for debugging

# Production-specific configuration
class ProductionConfig(Config):
    DEBUG = False
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    SQLALCHEMY_ECHO = False

# Testing-specific configuration
class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # Use in-memory SQLite for tests
    JWT_ACCESS_TOKEN_EXPIRES = 60  # 1 minute for tests

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}