@echo off
REM ShopNaija Quick Start Script for Windows
REM This script will help you get the entire application running quickly

echo 🛒 ShopNaija Quick Start
echo ========================

REM Check for Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check for Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check for npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!
echo.

REM Setup Backend
echo 🔧 Setting up Backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "eshop" (
    echo 📦 Creating virtual environment...
    python -m venv eshop
)

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call eshop\Scripts\activate.bat

REM Install Python dependencies
echo 📦 Installing Python dependencies...
pip install flask flask-sqlalchemy flask-jwt-extended flask-cors bcrypt python-dotenv

REM Setup database
echo 🗄️ Setting up database...
python setup.py

echo ✅ Backend setup complete!
echo.

REM Setup Frontend
echo 🎨 Setting up Frontend...
cd ..\frontend

echo 📦 Installing Node.js dependencies...
npm install

echo ✅ Frontend setup complete!
echo.

echo 🎉 ShopNaija setup completed successfully!
echo.
echo 🚀 To start the application:
echo 1. Backend: cd backend ^&^& eshop\Scripts\activate ^&^& python app.py
echo 2. Frontend: cd frontend ^&^& npm run dev
echo 3. Visit: http://localhost:5173
echo.
echo 💡 Admin credentials:
echo    Email: admin@shopnaija.com
echo    Password: admin123
echo.
pause
