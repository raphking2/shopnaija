# 🛒 ShopNaija Multi-Vendor E-Commerce Platform
## Complete User Journey Testing Guide

Your ShopNaija multi-vendor platform is now running! Here's how to test all the different user journeys and features.

---

## 🌐 **Server Status**
- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:3000
- **Health Check**: http://localhost:5000/health

---

## 👥 **Test Credentials**

### 🔑 **1. Admin Access**
- **Email**: `admin@shopnaija.com`
- **Password**: `admin123`
- **Role**: Admin
- **Access**: Full platform management

### 🏪 **2. Vendor Access**
- **Email**: `vendor@shopnaija.com`
- **Password**: `vendor123`
- **Role**: Vendor (Pre-approved)
- **Business**: Test Electronics Store
- **Access**: Vendor dashboard, product management

### 👤 **3. Customer Access**
- **Email**: `customer@shopnaija.com`
- **Password**: `customer123`
- **Role**: Customer
- **Access**: Shopping, cart, orders

---

## 🧪 **Testing Scenarios**

### **A. Admin Journey Testing**

#### **1. Admin Login & Dashboard**
1. Visit http://localhost:3000/auth
2. Login with admin credentials
3. You'll be redirected to `/admin` dashboard
4. **Test Points**:
   - View dashboard statistics
   - Check pending vendor approvals
   - Monitor revenue and commission
   - See platform overview metrics

#### **2. Vendor Management**
1. Go to **Vendors** tab in admin dashboard
2. **Test Actions**:
   - View all vendors (including the pre-approved one)
   - Approve/reject pending vendor applications
   - View vendor details and business information
   - Check vendor status changes

#### **3. Product Management**
1. Go to **Products** tab
2. **Test Actions**:
   - View all products from all vendors
   - Filter by category, vendor, or status
   - Deactivate problematic products
   - Monitor low stock items

#### **4. Order Management**
1. Go to **Orders** tab
2. **Test Actions**:
   - View all platform orders
   - Filter by status or vendor
   - Monitor order flow
   - Check commission calculations

---

### **B. Vendor Journey Testing**

#### **1. Vendor Login & Dashboard**
1. Visit http://localhost:3000/auth
2. Login with vendor credentials
3. You'll be redirected to `/vendor` dashboard
4. **Test Points**:
   - View business statistics
   - Check total sales and commission
   - Monitor product performance
   - See available balance

#### **2. Product Management**
1. Go to **Products** tab in vendor dashboard
2. **Test Actions**:
   - View your existing products (5 sample products)
   - **Add New Product**:
     - Click "Add Product"
     - Fill in product details
     - Set price, stock, category
     - Upload image URL
   - **Edit Products**:
     - Click edit icon on any product
     - Update details, price, or stock
     - Save changes
   - **Delete Products**:
     - Remove products you no longer sell

#### **3. Inventory Management**
1. Test stock tracking:
   - Update stock quantities
   - Monitor low stock alerts
   - Set minimum stock levels

#### **4. Orders & Sales**
1. Go to **Orders** tab
2. **Test Actions**:
   - View orders containing your products
   - Track order status
   - Monitor sales performance

---

### **C. Customer Journey Testing**

#### **1. Customer Registration & Login**
1. Visit http://localhost:3000/auth
2. **Register New Customer**:
   - Switch to signup tab
   - Create new account
   - Login with new credentials
3. **Or use existing**: customer@shopnaija.com / customer123

#### **2. Product Browsing**
1. Visit homepage at http://localhost:3000
2. **Test Actions**:
   - Browse products (5 sample products available)
   - Use search functionality
   - Filter by categories
   - View product details
   - Check responsive design on mobile

#### **3. Shopping Cart**
1. **Add to Cart**:
   - Click "Add to Cart" on products
   - Adjust quantities
   - View cart total
2. **Cart Management**:
   - View cart at `/cart`
   - Update quantities
   - Remove items
   - See total calculation

#### **4. Checkout Process**
1. Proceed to checkout from cart
2. **Test**:
   - Enter delivery information
   - Select payment method
   - Place order
   - Verify order confirmation

---

### **D. New Vendor Registration**

#### **1. Vendor Application**
1. Visit http://localhost:3000/auth
2. Click "Become a Vendor Today!" button
3. **Complete Registration**:
   - **Step 1**: Personal Information
     - Username, email, password
   - **Step 2**: Business Details
     - Business name, address, category
     - Registration number, description
   - **Step 3**: Banking Information
     - Bank details for payments
4. Submit application

#### **2. Admin Approval Process**
1. Login as admin
2. Go to Vendors tab
3. **Test Approval**:
   - See new pending vendor
   - Approve or reject application
   - Add rejection reason if needed

---

## 🧩 **Advanced Features to Test**

### **1. Mobile Responsiveness**
- Test on different screen sizes
- Check touch interactions
- Verify mobile navigation
- Test responsive product cards

### **2. Search & Filters**
- Search products by name
- Filter by categories
- Sort by price, rating
- Test search suggestions

### **3. Multi-Vendor Cart**
- Add products from different vendors
- Check commission calculations
- Verify vendor attribution

### **4. Commission System**
- Create orders and check 8% commission
- Monitor vendor balances
- Test commission rate changes (admin)

---

## 🔍 **API Testing**

### **Backend Endpoints to Test**

#### **Authentication**
```bash
# Login Admin
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shopnaija.com","password":"admin123"}'

# Login Vendor
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@shopnaija.com","password":"vendor123"}'
```

#### **Admin Endpoints**
```bash
# Get Dashboard Stats (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/admin/dashboard/stats \
  -H "Authorization: Bearer TOKEN"

# Get All Vendors
curl -X GET http://localhost:5000/api/admin/vendors \
  -H "Authorization: Bearer TOKEN"
```

#### **Vendor Endpoints**
```bash
# Get Vendor Dashboard
curl -X GET http://localhost:5000/api/vendor/dashboard/stats \
  -H "Authorization: Bearer TOKEN"

# Get Vendor Products
curl -X GET http://localhost:5000/api/vendor/products \
  -H "Authorization: Bearer TOKEN"
```

---

## 🚨 **Common Issues & Solutions**

### **1. Server Won't Start**
- Check if virtual environment is activated
- Verify all dependencies are installed
- Check database file permissions

### **2. Frontend Connection Issues**
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API endpoints in frontend

### **3. Database Issues**
- Delete `backend/instance/ecommerce.db` and restart
- Run `python create_test_data.py` again
- Check database schema consistency

### **4. Authentication Problems**
- Clear browser localStorage
- Check JWT token expiration
- Verify user roles are set correctly

---

## 📊 **Success Metrics**

### **✅ Platform Features Working**
- [ ] Admin dashboard with statistics
- [ ] Vendor management and approval
- [ ] Product CRUD operations
- [ ] Multi-vendor shopping cart
- [ ] Order processing with commission
- [ ] Mobile-responsive design
- [ ] Role-based access control
- [ ] Vendor registration flow

### **✅ Security Features**
- [ ] JWT authentication
- [ ] Role-based permissions
- [ ] Protected admin routes
- [ ] Secure vendor data
- [ ] Input validation

### **✅ Business Logic**
- [ ] 8% commission calculation
- [ ] Vendor balance tracking
- [ ] Order status management
- [ ] Inventory tracking
- [ ] Multi-vendor order attribution

---

## 🚀 **Next Steps for Production**

1. **Email Integration**: Set up email notifications for vendor approvals
2. **Payment Gateway**: Integrate with Nigerian payment providers (Paystack, Flutterwave)
3. **File Upload**: Implement proper image upload system
4. **Security Hardening**: Add rate limiting, CSRF protection
5. **Performance**: Add caching, database optimization
6. **Monitoring**: Set up logging and error tracking
7. **Deployment**: Configure for production hosting

---

## 🎯 **Key Testing Priorities**

1. **Start with Admin Flow**: Test vendor approval process
2. **Test Vendor Operations**: Product management and dashboard
3. **Verify Customer Experience**: Shopping and checkout
4. **Check Mobile Experience**: Responsive design
5. **Test Multi-Vendor Logic**: Orders with multiple vendors
6. **Verify Commission System**: Financial calculations

---

Your ShopNaija platform is now ready for comprehensive testing! The system includes all the features you requested for a production-ready multi-vendor e-commerce platform suitable for the Nigerian market. 🇳🇬✨
