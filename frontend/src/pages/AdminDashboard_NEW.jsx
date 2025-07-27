import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Fade
} from '@mui/material';

import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  AdminPanelSettings as AdminIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Close as CloseIcon
} from '@mui/icons-material';

import { config } from '../constant';
import { showToast } from '../utils/toast';

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [currentTab, setCurrentTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [dashboardStats, setDashboardStats] = useState({});
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [admins, setAdmins] = useState([]);
  
  // Dialog states
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [newAdminDialogOpen, setNewAdminDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [newAdminData, setNewAdminData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, value: 0 },
    { label: 'Vendors', icon: <StoreIcon />, value: 1 },
    { label: 'Products', icon: <InventoryIcon />, value: 2 },
    { label: 'Orders', icon: <OrdersIcon />, value: 3 },
    { label: 'Admin Management', icon: <AdminIcon />, value: 4 }
  ];

  // Fetch functions
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BASE_URL}/admin/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      showToast('Failed to load dashboard stats', 'error');
    }
  };

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BASE_URL}/admin/vendors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVendors(data.vendors || []);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      showToast('Failed to load vendors', 'error');
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BASE_URL}/admin/admins`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins || []);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      showToast('Failed to load admin list', 'error');
    }
  };

  // Handle vendor approval/rejection
  const handleApproveVendor = async (vendorId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BASE_URL}/admin/vendors/${vendorId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('Vendor approved successfully', 'success');
        fetchVendors();
      }
    } catch (error) {
      console.error('Error approving vendor:', error);
      showToast('Failed to approve vendor', 'error');
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
        showToast('Vendor rejected successfully', 'success');
        setRejectDialogOpen(false);
        setRejectReason('');
        setSelectedVendor(null);
        fetchVendors();
      }
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      showToast('Failed to reject vendor', 'error');
    }
  };

  // Handle admin creation
  const handleCreateAdmin = async () => {
    if (newAdminData.password !== newAdminData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
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

      if (response.ok) {
        showToast('Admin created successfully', 'success');
        setNewAdminDialogOpen(false);
        setNewAdminData({ username: '', email: '', password: '', confirmPassword: '' });
        fetchAdmins();
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to create admin', 'error');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      showToast('Failed to create admin', 'error');
    }
  };

  // Load data on tab change
  useEffect(() => {
    switch (currentTab) {
      case 0:
        fetchDashboardStats();
        break;
      case 1:
        fetchVendors();
        break;
      case 4:
        fetchAdmins();
        break;
      default:
        break;
    }
  }, [currentTab]);

  // Dashboard Stats Cards
  const StatsCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${theme.palette[color].light} 0%, ${theme.palette[color].main} 100%)` }}>
      <CardContent sx={{ color: 'white', textAlign: 'center', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          {React.cloneElement(icon, { sx: { fontSize: 48 } })}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value || '0'}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  // Render tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <Fade in={true}>
            <Box>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.main }}>
                📊 Dashboard Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard
                    title="Total Vendors"
                    value={dashboardStats.total_vendors}
                    icon={<StoreIcon />}
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard
                    title="Total Products"
                    value={dashboardStats.total_products}
                    icon={<InventoryIcon />}
                    color="secondary"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard
                    title="Total Orders"
                    value={dashboardStats.total_orders}
                    icon={<OrdersIcon />}
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard
                    title="Total Users"
                    value={dashboardStats.total_users}
                    icon={<PeopleIcon />}
                    color="warning"
                  />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );

      case 1:
        return (
          <Fade in={true}>
            <Box>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.main }}>
                🏪 Vendor Management
              </Typography>
              
              {vendors.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  No vendor applications found. New vendor registrations will appear here for approval.
                </Alert>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                      <TableRow>
                        <TableCell><strong>Business Name</strong></TableCell>
                        <TableCell><strong>Email</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Applied Date</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vendors.map((vendor) => (
                        <TableRow key={vendor.id} hover>
                          <TableCell>{vendor.business_name}</TableCell>
                          <TableCell>{vendor.business_email}</TableCell>
                          <TableCell>
                            <Chip
                              label={vendor.status}
                              color={vendor.status === 'approved' ? 'success' : vendor.status === 'pending' ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {vendor.created_at ? new Date(vendor.created_at).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {vendor.status === 'pending' && (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={<ApproveIcon />}
                                  onClick={() => handleApproveVendor(vendor.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  startIcon={<RejectIcon />}
                                  onClick={() => {
                                    setSelectedVendor(vendor);
                                    setRejectDialogOpen(true);
                                  }}
                                >
                                  Reject
                                </Button>
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Fade>
        );

      case 4:
        return (
          <Fade in={true}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                  👨‍💼 Admin Management
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setNewAdminDialogOpen(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Add New Admin
                </Button>
              </Box>

              {admins.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  No admin users found. This might indicate a system issue or all admins have been removed.
                </Alert>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
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
                        <TableRow key={admin.id} hover>
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
                              color="error"
                              onClick={() => console.log('Delete admin:', admin.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Fade>
        );

      default:
        return (
          <Alert severity="info">
            This section is under development. Please check back later.
          </Alert>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.grey[50] }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(!drawerOpen)}
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
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundColor: 'white',
            borderRight: `1px solid ${theme.palette.divider}`,
            marginTop: isMobile ? '64px' : 0
          },
        }}
      >
        {!isMobile && (
          <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
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
                mx: 1,
                borderRadius: 2,
                mb: 1,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.contrastText,
                  }
                }
              }}
            >
              <ListItemIcon sx={{ color: currentTab === item.value ? 'inherit' : theme.palette.text.secondary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        mt: isMobile ? '64px' : 0,
        ml: isMobile ? 0 : 0,  // Remove margin on mobile
        width: isMobile ? '100%' : `calc(100% - 280px)`,  // Adjust width properly
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            renderTabContent()
          )}
        </Container>
      </Box>

      {/* Reject Vendor Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
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
      <Dialog open={newAdminDialogOpen} onClose={() => setNewAdminDialogOpen(false)} maxWidth="sm" fullWidth>
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
            color="primary"
            variant="contained"
            disabled={!newAdminData.username || !newAdminData.email || !newAdminData.password}
          >
            Create Admin
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
