import React, { useState, useEffect } from 'react';
import { config } from '../constant/index';
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
  Chip,
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
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Dashboard,
  People,
  Store,
  Inventory,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  Cancel,
  Visibility,
  Edit,
  Menu as MenuIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({});
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [newAdminDialogOpen, setNewAdminDialogOpen] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const isMobile = useMediaQuery('(max-width:600px)');

  const menuItems = [
    { label: 'Dashboard', icon: <Dashboard />, value: 0 },
    { label: 'Vendors', icon: <Store />, value: 1 },
    { label: 'Products', icon: <Inventory />, value: 2 },
    { label: 'Orders', icon: <ShoppingCart />, value: 3 },
    { label: 'Analytics', icon: <TrendingUp />, value: 4 },
    { label: 'Admin Management', icon: <People />, value: 5 }
  ];

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.BASE_URL}/admin/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setDashboardStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  // Fetch vendors
  useEffect(() => {
    if (currentTab === 1) {
      fetchVendors();
    }
  }, [currentTab]);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BASE_URL}/admin/vendors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setVendors(data.vendors);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handleApproveVendor = async (vendorId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BASE_URL}/admin/vendors/${vendorId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchVendors(); // Refresh list
      }
    } catch (error) {
      console.error('Error approving vendor:', error);
    }
  };

  const handleRejectVendor = async () => {
    if (!selectedVendor || !rejectReason) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BASE_URL}/admin/vendors/${selectedVendor.id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectReason })
      });
      if (response.ok) {
        fetchVendors(); // Refresh list
        setRejectDialogOpen(false);
        setRejectReason('');
        setSelectedVendor(null);
      }
    } catch (error) {
      console.error('Error rejecting vendor:', error);
    }
  };

  // Fetch admins
  useEffect(() => {
    if (currentTab === 5) {
      fetchAdmins();
    }
  }, [currentTab]);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching admins with token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`${config.BASE_URL}/admin/admins`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Admin fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Admin fetch response data:', data);
        setAdmins(data.admins || []);
      } else {
        const errorData = await response.json();
        console.error('Admin fetch error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleCreateAdmin = async () => {
    if (newAdminData.password !== newAdminData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Creating admin with data:', {
        username: newAdminData.username,
        email: newAdminData.email
      });
      
      const response = await fetch(`${config.BASE_URL}/admin/admins`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newAdminData.username,
          email: newAdminData.email,
          password: newAdminData.password
        })
      });
      
      console.log('Create admin response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Create admin response:', data);
        fetchAdmins();
        setNewAdminDialogOpen(false);
        setNewAdminData({ username: '', email: '', password: '', confirmPassword: '' });
        alert('Admin created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Create admin error:', errorData);
        alert(`Error creating admin: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert(`Error creating admin: ${error.message}`);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.BASE_URL}/admin/admins/${adminId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          fetchAdmins();
        }
      } catch (error) {
        console.error('Error deleting admin:', error);
      }
    }
  };

  const StatCard = ({ title, value, icon, color = '#008751' }) => (
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
            {value?.toLocaleString() || 0}
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
        🛒 ShopNaija Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={dashboardStats.summary?.total_users}
            icon={<People />}
            color="#008751"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Vendors"
            value={dashboardStats.summary?.total_vendors}
            icon={<Store />}
            color="#ff6b35"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={dashboardStats.summary?.total_products}
            icon={<Inventory />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={dashboardStats.summary?.total_orders}
            icon={<ShoppingCart />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Pending Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                ⚠️ Pending Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Pending Vendor Approvals</Typography>
                  <Chip 
                    label={dashboardStats.summary?.pending_vendors || 0}
                    color={dashboardStats.summary?.pending_vendors > 0 ? 'warning' : 'default'}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Pending Orders</Typography>
                  <Chip 
                    label={dashboardStats.summary?.pending_orders || 0}
                    color={dashboardStats.summary?.pending_orders > 0 ? 'error' : 'default'}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Low Stock Products</Typography>
                  <Chip 
                    label={dashboardStats.summary?.low_stock_products || 0}
                    color={dashboardStats.summary?.low_stock_products > 0 ? 'warning' : 'default'}
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
                💰 Revenue Overview
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#008751' }}>
                    ₦{dashboardStats.revenue?.total_revenue?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Commission (8%)</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#ff6b35' }}>
                    ₦{dashboardStats.revenue?.total_commission?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Recent Revenue (30 days)</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    ₦{dashboardStats.revenue?.recent_revenue?.toLocaleString() || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const VendorManagement = () => (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        🏪 Vendor Management
      </Typography>
      
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Business Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Registration</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {vendor.business_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {vendor.user.username}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{vendor.business_email}</TableCell>
                <TableCell>
                  <Chip
                    label={vendor.status}
                    color={
                      vendor.status === 'approved' ? 'success' :
                      vendor.status === 'pending' ? 'warning' :
                      vendor.status === 'rejected' ? 'error' : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{vendor.business_registration || 'N/A'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {vendor.status === 'pending' && (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => handleApproveVendor(vendor.id)}
                          sx={{ color: 'success.main' }}
                        >
                          <CheckCircle />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setRejectDialogOpen(true);
                          }}
                          sx={{ color: 'error.main' }}
                        >
                          <Cancel />
                        </IconButton>
                      </>
                    )}
                    <IconButton size="small">
                      <Visibility />
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

  const AdminManagement = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#008751' }}>
          👨‍💼 Admin Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setNewAdminDialogOpen(true)}
          sx={{ backgroundColor: '#008751', '&:hover': { backgroundColor: '#006d41' } }}
        >
          Add New Admin
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Created</strong></TableCell>
              <TableCell><strong>Last Login</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.username}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  {admin.last_login ? new Date(admin.last_login).toLocaleDateString() : 'Never'}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteAdmin(admin.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return <DashboardOverview />;
      case 1:
        return <VendorManagement />;
      case 2:
        return <Typography>Product Management Coming Soon...</Typography>;
      case 3:
        return <Typography>Order Management Coming Soon...</Typography>;
      case 4:
        return <Typography>Analytics Coming Soon...</Typography>;
      case 5:
        return <AdminManagement />;
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
              Admin Dashboard
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
              🛒 ShopNaija Admin
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
        ml: isMobile ? 0 : '280px',  // Add margin for sidebar on desktop
        transition: 'margin 0.3s ease'
      }}>
        <Container maxWidth="xl">
          {renderTabContent()}
        </Container>
      </Box>

      {/* Reject Vendor Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Vendor Application</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this vendor application:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRejectVendor}
            color="error"
            variant="contained"
            disabled={!rejectReason}
          >
            Reject Vendor
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create New Admin Dialog */}
      <Dialog open={newAdminDialogOpen} onClose={() => setNewAdminDialogOpen(false)}>
        <DialogTitle>Create New Admin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            value={newAdminData.username}
            onChange={(e) => setNewAdminData({...newAdminData, username: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newAdminData.email}
            onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newAdminData.password}
            onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newAdminData.confirmPassword}
            onChange={(e) => setNewAdminData({...newAdminData, confirmPassword: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewAdminDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateAdmin}
            variant="contained"
            sx={{ backgroundColor: '#008751', '&:hover': { backgroundColor: '#006d41' } }}
          >
            Create Admin
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
