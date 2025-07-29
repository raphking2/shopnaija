import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Chip,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  Add,
  Edit,
  Delete,
  Visibility,
  Menu as MenuIcon,
  TrendingUp,
  AttachMoney,
  Store,
  People
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { config } from '../constant';

const VendorDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [vendorStats, setVendorStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    image_url: ''
  });
  
  // Withdrawal states
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  
  const isMobile = useMediaQuery('(max-width:600px)');

  const menuItems = [
    { label: 'Dashboard', icon: <Dashboard />, value: 0 },
    { label: 'Products', icon: <Inventory />, value: 1 },
    { label: 'Orders', icon: <ShoppingCart />, value: 2 },
    { label: 'Financials', icon: <AttachMoney />, value: 3 },
    { label: 'Analytics', icon: <TrendingUp />, value: 4 }
  ];

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Books', 'Sports',
    'Beauty', 'Automotive', 'Food & Drinks', 'Health', 'Toys'
  ];

  // Fetch vendor stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/vendor/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setVendorStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  // Fetch products
  useEffect(() => {
    if (currentTab === 1) {
      fetchProducts();
    }
  }, [currentTab]);

  // Fetch orders
  useEffect(() => {
    if (currentTab === 2) {
      fetchOrders();
    }
  }, [currentTab]);

  // Fetch financial data
  useEffect(() => {
    if (currentTab === 3) {
      fetchWithdrawalHistory();
      fetchPaymentMethods();
    }
  }, [currentTab]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/vendor/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/vendor/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category: '',
      image_url: ''
    });
    setProductDialogOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      category: product.category,
      image_url: product.image_url || ''
    });
    setProductDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingProduct 
        ? `/api/vendor/products/${editingProduct.id}`
        : '/api/vendor/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          stock_quantity: parseInt(productForm.stock_quantity)
        })
      });

      if (response.ok) {
        setProductDialogOpen(false);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Withdrawal functions
  const fetchWithdrawalHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BASE_URL}/vendor/withdrawals`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWithdrawalHistory(data.withdrawals || []);
      }
    } catch (error) {
      console.error('Error fetching withdrawal history:', error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BASE_URL}/vendor/payment-methods`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.payment_methods || []);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleWithdrawalRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      const amount = parseFloat(withdrawalAmount);
      
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      if (amount > (vendorStats.summary?.available_balance || 0)) {
        alert('Insufficient balance');
        return;
      }

      if (!selectedPaymentMethod) {
        alert('Please select a payment method');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/vendor/withdraw`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          payment_method_id: selectedPaymentMethod
        })
      });

      if (response.ok) {
        alert('Withdrawal request submitted successfully');
        setWithdrawalDialogOpen(false);
        setWithdrawalAmount('');
        setSelectedPaymentMethod('');
        fetchStats(); // Refresh balance
        fetchWithdrawalHistory();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to submit withdrawal request');
      }
    } catch (error) {
      console.error('Error submitting withdrawal request:', error);
      alert('Failed to submit withdrawal request');
    }
  };

  const StatCard = ({ title, value, icon, color = '#008751', subtitle }) => (
    <Card
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      sx={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        borderRadius: 3,
        height: '100%'
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            borderRadius: 2,
            backgroundColor: `${color}15`,
            color: color
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '2rem' },
              color: color,
              mb: 0.5
            }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: 'block',
                mt: 0.5
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const DashboardOverview = () => (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 4,
          fontSize: { xs: '1.5rem', sm: '2rem' },
          background: 'linear-gradient(45deg, #008751, #00a862)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        🏪 Vendor Dashboard
      </Typography>

      {/* Status Alert */}
      {vendorStats.vendor?.status === 'pending' && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          Your vendor account is pending approval. You can add products but they won't be visible to customers until approved.
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={vendorStats.summary?.total_products || 0}
            icon={<Inventory />}
            color="#008751"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={vendorStats.summary?.total_orders || 0}
            icon={<ShoppingCart />}
            color="#ff6b35"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`₦${(vendorStats.summary?.total_revenue || 0).toLocaleString()}`}
            icon={<AttachMoney />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available Balance"
            value={`₦${(vendorStats.summary?.available_balance || 0).toLocaleString()}`}
            icon={<TrendingUp />}
            color="#9c27b0"
            subtitle="After 8% commission"
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                📊 Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Products in Stock</Typography>
                  <Chip 
                    label={vendorStats.summary?.products_in_stock || 0}
                    color="success"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Low Stock Products</Typography>
                  <Chip 
                    label={vendorStats.summary?.low_stock_products || 0}
                    color={vendorStats.summary?.low_stock_products > 0 ? 'warning' : 'default'}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Pending Orders</Typography>
                  <Chip 
                    label={vendorStats.summary?.pending_orders || 0}
                    color={vendorStats.summary?.pending_orders > 0 ? 'error' : 'default'}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Recent Orders (7 days)</Typography>
                  <Chip 
                    label={vendorStats.summary?.recent_orders || 0}
                    color="info"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                🏪 Store Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Business Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {vendorStats.vendor?.business_name || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={vendorStats.vendor?.status || 'pending'}
                    color={
                      vendorStats.vendor?.status === 'approved' ? 'success' :
                      vendorStats.vendor?.status === 'pending' ? 'warning' :
                      'error'
                    }
                    size="small"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Business Email</Typography>
                  <Typography variant="body1">
                    {vendorStats.vendor?.business_email || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">
                    {vendorStats.vendor?.business_phone || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const ProductManagement = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          📦 Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddProduct}
          sx={{
            backgroundColor: '#008751',
            '&:hover': { backgroundColor: '#006d41' }
          }}
        >
          Add Product
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {product.image_url && (
                      <Box
                        component="img"
                        src={product.image_url}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {product.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>₦{product.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{product.stock_quantity}</Typography>
                    {product.stock_quantity < 10 && (
                      <Chip label="Low" size="small" color="warning" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.is_available ? 'Available' : 'Unavailable'}
                    color={product.is_available ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteProduct(product.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const OrderManagement = () => (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        🛒 Order Management
      </Typography>
      
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.items_count} items</TableCell>
                <TableCell>₦{order.total_amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={
                      order.status === 'delivered' ? 'success' :
                      order.status === 'shipped' ? 'info' :
                      order.status === 'processing' ? 'warning' :
                      'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const FinancialManagement = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#008751', mb: 4 }}>
        💰 Financial Management
      </Typography>

      {/* Balance Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Available Balance"
            value={`₦${(vendorStats.summary?.available_balance || 0).toLocaleString()}`}
            icon={<AttachMoney />}
            color="#008751"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Earnings"
            value={`₦${(vendorStats.summary?.total_revenue || 0).toLocaleString()}`}
            icon={<TrendingUp />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Pending Withdrawals"
            value={withdrawalHistory.filter(w => w.status === 'pending').length}
            icon={<ShoppingCart />}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      {/* Withdrawal Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Request Withdrawal
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Available Balance: ₦{(vendorStats.summary?.available_balance || 0).toLocaleString()}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setWithdrawalDialogOpen(true)}
              disabled={(vendorStats.summary?.available_balance || 0) <= 0}
              sx={{ backgroundColor: '#008751', '&:hover': { backgroundColor: '#006741' } }}
            >
              Request Withdrawal
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Payment Methods
            </Typography>
            {paymentMethods.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No payment methods configured. Please contact support to add payment methods.
              </Typography>
            ) : (
              paymentMethods.map((method, index) => (
                <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
                  <Typography variant="body2">
                    {method.type}: {method.details}
                  </Typography>
                </Box>
              ))
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Withdrawal History */}
      <Card sx={{ mt: 3 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Withdrawal History
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Payment Method</strong></TableCell>
                <TableCell><strong>Reference</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {withdrawalHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">No withdrawal history found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                withdrawalHistory.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>{new Date(withdrawal.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>₦{withdrawal.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={withdrawal.status}
                        color={
                          withdrawal.status === 'completed' ? 'success' :
                          withdrawal.status === 'pending' ? 'warning' :
                          withdrawal.status === 'processing' ? 'info' :
                          'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{withdrawal.payment_method_type}</TableCell>
                    <TableCell>{withdrawal.reference || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return <DashboardOverview />;
      case 1:
        return <ProductManagement />;
      case 2:
        return <OrderManagement />;
      case 3:
        return <FinancialManagement />;
      case 4:
        return <Typography>Analytics Coming Soon...</Typography>;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar position="fixed" sx={{ backgroundColor: '#008751' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Vendor Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundColor: 'white',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            marginTop: isMobile ? '64px' : 0
          },
        }}
      >
        {!isMobile && (
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#008751' }}>
              🏪 Vendor Portal
            </Typography>
          </Box>
        )}
        
        <List sx={{ pt: isMobile ? 2 : 3 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.value}
              selected={currentTab === item.value}
              onClick={() => {
                setCurrentTab(item.value);
                if (isMobile) setDrawerOpen(false);
              }}
              sx={{
                mx: 2,
                mb: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: '#008751',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white'
                  }
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        p: { xs: 2, sm: 3 }, 
        mt: isMobile ? '64px' : 0,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
          {renderTabContent()}
        </Container>
      </Box>

      {/* Product Dialog */}
      <Dialog 
        open={productDialogOpen} 
        onClose={() => setProductDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={productForm.name}
                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (₦)"
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={productForm.stock_quantity}
                onChange={(e) => setProductForm(prev => ({ ...prev, stock_quantity: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={productForm.category}
                  onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL"
                value={productForm.image_url}
                onChange={(e) => setProductForm(prev => ({ ...prev, image_url: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            sx={{ backgroundColor: '#008751' }}
          >
            {editingProduct ? 'Update' : 'Add'} Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Withdrawal Dialog */}
      <Dialog
        open={withdrawalDialogOpen}
        onClose={() => setWithdrawalDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Withdrawal</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Available Balance: ₦{(vendorStats.summary?.available_balance || 0).toLocaleString()}
            </Typography>
            
            <TextField
              fullWidth
              label="Withdrawal Amount"
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              sx={{ mb: 3 }}
              inputProps={{ min: 0, max: vendorStats.summary?.available_balance || 0 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={selectedPaymentMethod}
                label="Payment Method"
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.id} value={method.id}>
                    {method.type} - {method.details}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {paymentMethods.length === 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                No payment methods available. Please contact support to add payment methods before requesting withdrawals.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawalDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleWithdrawalRequest}
            variant="contained"
            sx={{ backgroundColor: '#008751' }}
            disabled={!withdrawalAmount || !selectedPaymentMethod || paymentMethods.length === 0}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorDashboard;
