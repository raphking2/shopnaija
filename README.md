# 🛒 ShopNaija - Modern E-commerce Platform

![ShopNaija Banner](https://via.placeholder.com/1200x400/008751/FFFFFF?text=ShopNaija+-+Your+Nigerian+E-commerce+Platform)

A modern, responsive e-commerce platform built with **React** and **Flask**, designed specifically for the Nigerian market. ShopNaija offers a seamless shopping experience with beautiful UI/UX, horizontal scrolling product sections, mobile-first design, and robust backend functionality.

## ✨ Features

### 🎨 Frontend Features
- **Modern UI/UX Design** with Material-UI components
- **Responsive Design** - Works perfectly on all devices
- **Horizontal Scrolling Product Sections** - Like modern e-commerce sites
- **Hero Section** with animated elements
- **Product Search & Filtering** by categories
- **Product Detail Pages** with image galleries and reviews
- **Shopping Cart** with quantity management and promo codes
- **User Authentication** with beautiful animated forms
- **Real-time Notifications** with toast messages
- **Smooth Animations** powered by Framer Motion
- **Progressive Web App** ready

### 🔧 Backend Features
- **RESTful API** built with Flask
- **JWT Authentication** for secure user sessions
- **SQLite Database** with SQLAlchemy ORM
- **Product Management** with CRUD operations
- **User Management** with password hashing
- **Search Functionality** across products
- **Category Filtering** and sorting
- **Error Handling** and validation
- **CORS Support** for frontend integration

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv eshop
# Windows
eshop\Scripts\activate
# macOS/Linux
source eshop/bin/activate
```

3. **Install dependencies**
```bash
pip install flask flask-sqlalchemy flask-jwt-extended flask-cors bcrypt python-dotenv
```

4. **Setup database and seed data**
```bash
python setup.py
```

5. **Start the backend server**
```bash
python app.py
```

The backend will be running at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

## 📁 Project Structure

```
shopnaija/
├── backend/
│   ├── app.py              # Flask application factory
│   ├── config.py           # Configuration settings
│   ├── models.py           # Database models
│   ├── routes.py           # API routes
│   ├── setup.py            # Database setup script
│   ├── seed_database.py    # Sample data seeder
│   └── instance/
│       └── ecommerce.db    # SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CategorySection.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── FeaturedProducts.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── ProductDetail.jsx
│   │   ├── context/        # React Context
│   │   │   └── CartContext.jsx
│   │   ├── utils/          # Utility functions
│   │   └── data/           # Mock data
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Create product (admin)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/search?q=query` - Search products

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart

## 🎨 Design System

### Colors
- **Primary Green**: `#008751` (Nigerian flag inspired)
- **Secondary Green**: `#00a862`
- **Accent Orange**: `#ff6b35`
- **Text Dark**: `#2c3e50`
- **Background**: `#f8f9fa`

### Typography
- **Headings**: Roboto, Bold weights
- **Body**: Roboto, Regular weight
- **Buttons**: Semi-bold weight

## 📱 Responsive Breakpoints

- **Mobile**: `< 600px`
- **Tablet**: `600px - 960px`
- **Desktop**: `> 960px`

## 🔐 Authentication Flow

1. User signs up with email and password
2. Backend validates and hashes password
3. User logs in with credentials
4. Backend returns JWT token
5. Frontend stores token for authenticated requests
6. Protected routes require valid JWT

## 🛍️ Shopping Flow

1. **Browse Products**: Users can scroll through horizontal product sections
2. **Search & Filter**: Find specific products by name, category, or description
3. **Product Details**: View detailed product information with image gallery
4. **Add to Cart**: Products are added to persistent cart state
5. **Cart Management**: Update quantities, apply promo codes, remove items
6. **Checkout**: Process payment (placeholder for now)

## 🎁 Sample Products

The platform comes pre-loaded with 20 sample products across 5 categories:
- **Electronics**: Smartphones, laptops, TVs, gaming accessories
- **Fashion**: Shoes, clothing, accessories
- **Groceries**: Nigerian food items, household essentials
- **Home**: Furniture, appliances
- **Beauty**: Skincare, makeup, fragrances

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
JWT_SECRET_KEY=your-super-secret-jwt-key
DATABASE_URL=sqlite:///ecommerce.db
DEBUG=True
CORS_ORIGINS=http://localhost:5173
```

## 📦 Dependencies

### Backend
- **Flask**: Web framework
- **Flask-SQLAlchemy**: Database ORM
- **Flask-JWT-Extended**: JWT authentication
- **Flask-CORS**: Cross-origin requests
- **bcrypt**: Password hashing
- **python-dotenv**: Environment variables

### Frontend
- **React 19**: UI library
- **Material-UI**: Component library
- **Framer Motion**: Animations
- **React Router**: Navigation
- **React Toastify**: Notifications
- **Vite**: Build tool

## 🚀 Deployment

### Backend Deployment
1. Set up production database (PostgreSQL recommended)
2. Configure environment variables
3. Use Gunicorn for production server
4. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar platforms
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Raphael Chimezie Ezem**
- GitHub: [@raphking2](https://github.com/raphking2)
- Email: your-email@example.com

## 🙏 Acknowledgments

- Nigerian flag colors for the design inspiration
- Material-UI for the beautiful component library
- Unsplash for product placeholder images
- The React and Flask communities

---

**ShopNaija** - Made with ❤️ in Nigeria 🇳🇬
