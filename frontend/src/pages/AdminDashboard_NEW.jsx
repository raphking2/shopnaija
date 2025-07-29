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
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Pagination,
  Stack,
  InputAdornment
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
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Block as BlockIcon,
  Search as SearchIcon,
  FileDownload as DownloadIcon
} from '@mui/icons-material';

import { config } from '../constant';
import { showToast } from '../utils/toast';

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get current user data
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
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
  
  // Pagination and filtering states
  const [vendorPage, setVendorPage] = useState(1);
  const [vendorTotalPages, setVendorTotalPages] = useState(1);
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorStatusFilter, setVendorStatusFilter] = useState('');
  const [adminPage, setAdminPage] = useState(1);
  const [adminTotalPages, setAdminTotalPages] = useState(1);
  const [adminSearch, setAdminSearch] = useState('');
  
  // Dialog states
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [newAdminDialogOpen, setNewAdminDialogOpen] = useState(false);
  const [newVendorDialogOpen, setNewVendorDialogOpen] = useState(false);
  const [vendorDetailsOpen, setVendorDetailsOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [newAdminData, setNewAdminData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [newVendorData, setNewVendorData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    business_name: '',
    business_email: '',
    business_phone: '',
    category: ''
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

  const fetchVendors = async (page = 1, search = '', status = '') => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '10'
      });
      
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      
      const response = await fetch(`${config.BASE_URL}/admin/vendors?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setVendors(data.vendors || []);
        setVendorTotalPages(data.pagination?.pages || 1);
        setVendorPage(data.pagination?.page || 1);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      showToast('Failed to load vendors', 'error');
    }
  };

  const fetchAdmins = async (page = 1, search = '') => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '10'
      });
      
      if (search) params.append('search', search);
      
      const response = await fetch(`${config.BASE_URL}/admin/admins?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins || []);
        setAdminTotalPages(data.pagination?.pages || 1);
        setAdminPage(data.pagination?.page || 1);
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
        fetchVendors(vendorPage, vendorSearch, vendorStatusFilter);
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
        fetchVendors(vendorPage, vendorSearch, vendorStatusFilter);
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
        fetchAdmins(adminPage, adminSearch);
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to create admin', 'error');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      showToast('Failed to create admin', 'error');
    }
  };

  // Handle admin deletion
  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BASE_URL}/admin/admins/${adminId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        showToast('Admin deleted successfully', 'success');
        fetchAdmins(adminPage, adminSearch);
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to delete admin', 'error');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      showToast('Failed to delete admin', 'error');
    }
  };

  // Handle vendor actions (approve/reject)
  const handleVendorAction = async (vendorId, action) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = action === 'approve' ? 'approve' : 'reject';
      
      const response = await fetch(`${config.BASE_URL}/admin/vendors/${vendorId}/${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        showToast(`Vendor ${action}d successfully`, 'success');
        fetchVendors(vendorPage, vendorSearch, vendorStatusFilter);
        setVendorDetailsOpen(false);
      } else {
        const errorData = await response.json();
        showToast(errorData.error || `Failed to ${action} vendor`, 'error');
      }
    } catch (error) {
      console.error(`Error ${action}ing vendor:`, error);
      showToast(`Failed to ${action} vendor`, 'error');
    }
  };

  // Handle vendor details view
  const handleViewVendorDetails = (vendor) => {
    setSelectedVendor(vendor);
    setVendorDetailsOpen(true);
  };

  // Handle add admin
  const handleAddAdmin = async () => {
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
        showToast('Admin added successfully', 'success');
        setNewAdminDialogOpen(false);
        setNewAdminData({ username: '', email: '', password: '', confirmPassword: '' });
        fetchAdmins(adminPage, adminSearch);
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to add admin', 'error');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      showToast('Failed to add admin', 'error');
    }
  };

  // Handle add vendor
  const handleAddVendor = async () => {
    if (newVendorData.password !== newVendorData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BASE_URL}/admin/vendors`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newVendorData.username,
          email: newVendorData.email,
          password: newVendorData.password,
          business_name: newVendorData.business_name,
          business_email: newVendorData.business_email,
          business_phone: newVendorData.business_phone,
          category: newVendorData.category
        })
      });
      
      if (response.ok) {
        showToast('Vendor added successfully', 'success');
        setNewVendorDialogOpen(false);
        setNewVendorData({ 
          username: '', email: '', password: '', confirmPassword: '',
          business_name: '', business_email: '', business_phone: '', category: ''
        });
        fetchVendors(vendorPage, vendorSearch, vendorStatusFilter);
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to add vendor', 'error');
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
      showToast('Failed to add vendor', 'error');
    }
  };

  // Export functions
  const exportVendorsToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,";
    const headers = ["Business Name", "Email", "Phone", "Status", "Total Sales", "Created Date"];
    const rows = [headers.join(",")];
    
    vendors.forEach(vendor => {
      const row = [
        `"${vendor.business_name}"`,
        `"${vendor.business_email}"`,
        `"${vendor.business_phone || 'N/A'}"`,
        `"${vendor.status}"`,
        `"${vendor.total_sales || 0}"`,
        `"${new Date(vendor.created_at).toLocaleDateString()}"`
      ];
      rows.push(row.join(","));
    });
    
    const csv = csvContent + rows.join("\n");
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendors_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Vendors exported successfully', 'success');
  };

  const exportAdminsToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,";
    const headers = ["Username", "Email", "Created Date", "Last Login"];
    const rows = [headers.join(",")];
    
    admins.forEach(admin => {
      const row = [
        `"${admin.username}"`,
        `"${admin.email}"`,
        `"${admin.created_at ? new Date(admin.created_at).toLocaleDateString() : 'N/A'}"`,
        `"${admin.last_login ? new Date(admin.last_login).toLocaleDateString() : 'Never'}"`
      ];
      rows.push(row.join(","));
    });
    
    const csv = csvContent + rows.join("\n");
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admins_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Admins exported successfully', 'success');
  };

  // Load data on tab change
  useEffect(() => {
    switch (currentTab) {
      case 0:
        fetchDashboardStats();
        break;
      case 1:
        fetchVendors(vendorPage, vendorSearch, vendorStatusFilter);
        break;
      case 4:
        fetchAdmins(adminPage, adminSearch);
        break;
      default:
        break;
    }
  }, [currentTab, vendorPage, vendorSearch, vendorStatusFilter, adminPage, adminSearch]);

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
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                  🏪 Vendor Management
                </Typography>
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={exportVendorsToCSV}
                    sx={{ borderRadius: 2 }}
                  >
                    Export CSV
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setNewVendorDialogOpen(true)}
                    sx={{ borderRadius: 2 }}
                  >
                    Add Vendor
                  </Button>
                </Box>
              </Box>

              {/* Search and Filter Controls */}
              <Box display="flex" gap={2} sx={{ mb: 3 }}>
                <TextField
                  placeholder="Search vendors..."
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 300 }}
                />
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={vendorStatusFilter}
                    label="Status"
                    onChange={(e) => setVendorStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setVendorSearch('');
                    setVendorStatusFilter('');
                    setVendorPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
              
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
                                  variant="outlined"
                                  onClick={() => handleViewVendorDetails(vendor)}
                                  sx={{ mr: 1 }}
                                >
                                  View Details
                                </Button>
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
                            {vendor.status !== 'pending' && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleViewVendorDetails(vendor)}
                              >
                                View Details
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Pagination */}
              {vendorTotalPages > 1 && (
                <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
                  <Pagination
                    count={vendorTotalPages}
                    page={vendorPage}
                    onChange={(event, value) => setVendorPage(value)}
                    color="primary"
                    size="large"
                  />
                </Box>
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
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={exportAdminsToCSV}
                    sx={{ borderRadius: 2 }}
                  >
                    Export CSV
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setNewAdminDialogOpen(true)}
                    sx={{ borderRadius: 2 }}
                  >
                    Add New Admin
                  </Button>
                </Box>
              </Box>

              {/* Search Controls */}
              <Box display="flex" gap={2} sx={{ mb: 3 }}>
                <TextField
                  placeholder="Search admins..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 300 }}
                />
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setAdminSearch('');
                    setAdminPage(1);
                  }}
                >
                  Clear Search
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
                              onClick={() => handleDeleteAdmin(admin.id)}
                              disabled={admin.id === currentUser?.id} // Can't delete self
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

              {/* Pagination */}
              {adminTotalPages > 1 && (
                <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
                  <Pagination
                    count={adminTotalPages}
                    page={adminPage}
                    onChange={(event, value) => setAdminPage(value)}
                    color="primary"
                    size="large"
                  />
                </Box>
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
        ml: 0,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 }, flexGrow: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            renderTabContent()
          )}
        </Container>
        
        {/* Footer will be handled by App.jsx */}
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
  // Add this dialog near the bottom of the component, before the closing return
  
  {/* Add Vendor Dialog */}
  <Dialog
    open={newVendorDialogOpen}
    onClose={() => setNewVendorDialogOpen(false)}
    maxWidth="md"
    fullWidth
  >
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Add New Vendor</Typography>
        <IconButton onClick={() => setNewVendorDialogOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Username"
            value={newVendorData.username}
            onChange={(e) => setNewVendorData({ ...newVendorData, username: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newVendorData.email}
            onChange={(e) => setNewVendorData({ ...newVendorData, email: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newVendorData.password}
            onChange={(e) => setNewVendorData({ ...newVendorData, password: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={newVendorData.confirmPassword}
            onChange={(e) => setNewVendorData({ ...newVendorData, confirmPassword: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Business Name"
            value={newVendorData.business_name}
            onChange={(e) => setNewVendorData({ ...newVendorData, business_name: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Business Email"
            type="email"
            value={newVendorData.business_email}
            onChange={(e) => setNewVendorData({ ...newVendorData, business_email: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Business Phone"
            value={newVendorData.business_phone}
            onChange={(e) => setNewVendorData({ ...newVendorData, business_phone: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={newVendorData.category}
              label="Category"
              onChange={(e) => setNewVendorData({ ...newVendorData, category: e.target.value })}
            >
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Fashion">Fashion</MenuItem>
              <MenuItem value="Home & Garden">Home & Garden</MenuItem>
              <MenuItem value="Books">Books</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Beauty">Beauty</MenuItem>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setNewVendorDialogOpen(false)}>
        Cancel
      </Button>
      <Button 
        onClick={handleAddVendor}
        variant="contained"
        disabled={!newVendorData.username || !newVendorData.email || !newVendorData.password || 
                 !newVendorData.confirmPassword || !newVendorData.business_name}
      >
        Add Vendor
      </Button>
    </DialogActions>
  </Dialog>

  {/* Add Admin Dialog */}
  <Dialog
    open={newAdminDialogOpen}
    onClose={() => setNewAdminDialogOpen(false)}
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Add New Admin</Typography>
        <IconButton onClick={() => setNewAdminDialogOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Username"
            value={newAdminData.username}
            onChange={(e) => setNewAdminData({ ...newAdminData, username: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newAdminData.email}
            onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newAdminData.password}
            onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={newAdminData.confirmPassword}
            onChange={(e) => setNewAdminData({ ...newAdminData, confirmPassword: e.target.value })}
            required
          />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setNewAdminDialogOpen(false)}>
        Cancel
      </Button>
      <Button 
        onClick={handleAddAdmin}
        variant="contained"
        disabled={!newAdminData.username || !newAdminData.email || !newAdminData.password || !newAdminData.confirmPassword}
      >
        Add Admin
      </Button>
    </DialogActions>
  </Dialog>

  {/* Vendor Details Dialog */}
  <Dialog
    open={vendorDetailsOpen}
    onClose={() => setVendorDetailsOpen(false)}
    maxWidth="md"
    fullWidth
  >
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Vendor Details</Typography>
        <IconButton onClick={() => setVendorDetailsOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent dividers>
      {selectedVendor && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Typography><strong>Full Name:</strong> {selectedVendor.full_name}</Typography>
                <Typography><strong>Username:</strong> {selectedVendor.username}</Typography>
                <Typography><strong>Email:</strong> {selectedVendor.email}</Typography>
                <Typography><strong>Phone:</strong> {selectedVendor.phone}</Typography>
                <Typography><strong>Address:</strong> {selectedVendor.address}</Typography>
                <Typography><strong>Registration Date:</strong> {new Date(selectedVendor.created_at).toLocaleDateString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Business Information
                </Typography>
                <Typography><strong>Business Name:</strong> {selectedVendor.business_name}</Typography>
                <Typography><strong>Business Type:</strong> {selectedVendor.business_type}</Typography>
                <Typography><strong>Tax ID:</strong> {selectedVendor.tax_id}</Typography>
                <Typography><strong>Bank Name:</strong> {selectedVendor.bank_name}</Typography>
                <Typography><strong>Account Number:</strong> {selectedVendor.account_number}</Typography>
                <Typography><strong>Status:</strong> 
                  <Chip 
                    label={selectedVendor.is_verified ? 'Verified' : 'Pending'}
                    color={selectedVendor.is_verified ? 'success' : 'warning'}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Uploaded Documents
                </Typography>
                {selectedVendor.documents && selectedVendor.documents.length > 0 ? (
                  <Grid container spacing={2}>
                    {selectedVendor.documents.map((doc, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              {doc.document_type}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {doc.file_name}
                            </Typography>
                            <Button
                              size="small"
                              color="primary"
                              startIcon={<VisibilityIcon />}
                              onClick={() => window.open(`/api/documents/${doc.file_path}`, '_blank')}
                              sx={{ mt: 1 }}
                            >
                              View Document
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography color="textSecondary">No documents uploaded</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </DialogContent>
    <DialogActions>
      {selectedVendor && !selectedVendor.is_verified && (
        <>
          <Button
            onClick={() => handleVendorAction(selectedVendor.id, 'approve')}
            color="success"
            variant="contained"
            startIcon={<CheckIcon />}
          >
            Approve Vendor
          </Button>
          <Button
            onClick={() => handleVendorAction(selectedVendor.id, 'reject')}
            color="error"
            variant="outlined"
            startIcon={<BlockIcon />}
          >
            Reject Vendor
          </Button>
        </>
      )}
      <Button onClick={() => setVendorDetailsOpen(false)}>
        Close
      </Button>
    </DialogActions>
  </Dialog>

    </Box>
  );
};

export default AdminDashboard;
