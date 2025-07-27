import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { AdminPanelSettings, Person, Email, Lock } from '@mui/icons-material';
import { config } from '../constant/index';
import { showToast } from '../utils/toast';

const AdminSetup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(null);

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/admin/check`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setAdminExists(data.adminExists);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      showToast('Please fill in all required fields', 'error');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return false;
    }

    if (formData.password.length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email address', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${config.BASE_URL}/admin/create-first`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin');
      }

      // Store admin data and token
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      showToast('Admin account created successfully!', 'success');
      
      // Redirect to admin dashboard
      window.location.href = '/admin';
      
    } catch (error) {
      console.error('Admin creation error:', error);
      showToast(error.message || 'Failed to create admin account', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (adminExists === null) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (adminExists) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card elevation={3}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <AdminPanelSettings sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Admin Already Exists
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              An admin account has already been created for this system. 
              Please login with your admin credentials.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              href="/login"
              sx={{ borderRadius: 2 }}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={3}>
          <AdminPanelSettings sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Create First Admin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Set up your ShopNaija administrator account
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />

            <TextField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              helperText="Must be at least 8 characters long"
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />

            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />

            <TextField
              name="phone"
              label="Phone Number (Optional)"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              name="address"
              label="Address (Optional)"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 2, 
                py: 1.5,
                borderRadius: 2,
                position: 'relative'
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Admin Account'
              )}
            </Button>
          </Box>
        </form>

        <Alert severity="info" sx={{ mt: 3 }}>
          This will create the first administrator account for your ShopNaija platform. 
          After creation, you can add more administrators from the admin panel.
        </Alert>
      </Paper>
    </Container>
  );
};

export default AdminSetup;
