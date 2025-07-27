#!/bin/bash

# ShopNaija Quick Start Script
# This script will help you get the entire application running quickly

echo "🛒 ShopNaija Quick Start"
echo "========================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Python
if ! command_exists python; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check for Node.js
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check for npm
if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed!"
echo ""

# Setup Backend
echo "🔧 Setting up Backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "eshop" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv eshop
fi

# Activate virtual environment (Linux/Mac)
if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "darwin"* ]]; then
    source eshop/bin/activate
fi

# Activate virtual environment (Windows - this won't work in bash, but shows the command)
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo "🪟 Windows detected. Please run: eshop\\Scripts\\activate"
    echo "Then continue with: pip install -r requirements.txt"
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install flask flask-sqlalchemy flask-jwt-extended flask-cors bcrypt python-dotenv

# Setup database
echo "🗄️ Setting up database..."
python setup.py

echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "🎨 Setting up Frontend..."
cd ../frontend

echo "📦 Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

echo "🎉 ShopNaija setup completed successfully!"
echo ""
echo "🚀 To start the application:"
echo "1. Backend: cd backend && python app.py"
echo "2. Frontend: cd frontend && npm run dev"
echo "3. Visit: http://localhost:5173"
echo ""
echo "💡 Admin credentials:"
echo "   Email: admin@shopnaija.com"
echo "   Password: admin123"
