import React, { useState } from 'react';
import { config } from '../constant/index';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';
import { 
  CloudUpload as UploadIcon, 
  Description as DocumentIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';

const VendorRegistration = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Info
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Business Info
    business_name: '',
    business_email: '',
    business_phone: '',
    business_address: '',
    business_city: '',
    business_state: '',
    business_registration: '',
    business_description: '',
    category: '',
    
    // Bank Info
    bank_name: '',
    account_number: '',
    account_name: '',
    
    // Documents
    documents: {
      id_card: null,
      business_permit: null,
      tax_certificate: null,
      bank_statement: null
    }
  });
  
  const [loading, setLoading] = useState(false);
  
  const steps = ['Personal Information', 'Business Details', 'Banking Information', 'Document Upload'];
  
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'Federal Capital Territory', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
    'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara'
  ];
  
  const businessCategories = [
    'Electronics', 'Fashion & Clothing', 'Home & Garden', 'Books & Education',
    'Sports & Fitness', 'Beauty & Personal Care', 'Automotive', 'Food & Beverages',
    'Health & Wellness', 'Toys & Games', 'Jewelry & Accessories', 'Art & Crafts',
    'Office Supplies', 'Pet Supplies', 'Travel & Luggage', 'Musical Instruments'
  ];

  const DocumentUpload = ({ title, documentType, required = false }) => (
    <Card sx={{ mb: 2, border: '2px dashed #e0e0e0' }}>
      <CardContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <UploadIcon sx={{ fontSize: 48, color: '#008751', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            {title} {required && <span style={{ color: 'red' }}>*</span>}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload PDF, JPG, or PNG (Max 5MB)
          </Typography>
          
          {formData.documents[documentType] ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CheckIcon sx={{ color: 'success.main' }} />
              <Typography variant="body2">
                {formData.documents[documentType].name}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => handleFileUpload(documentType, null)}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ) : (
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              sx={{ borderColor: '#008751', color: '#008751' }}
            >
              Choose File
              <input
                type="file"
                hidden
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.size <= 5 * 1024 * 1024) {
                    handleFileUpload(documentType, file);
                  } else {
                    showToast('File size should not exceed 5MB', 'error');
                  }
                }}
              />
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (documentType, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file
      }
    }));
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
          showToast('Please fill all required fields', 'error');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          showToast('Passwords do not match', 'error');
          return false;
        }
        if (formData.password.length < 6) {
          showToast('Password must be at least 6 characters', 'error');
          return false;
        }
        return true;
      case 1:
        if (!formData.business_name || !formData.business_email || !formData.business_phone || 
            !formData.business_address || !formData.business_city || !formData.business_state || 
            !formData.category) {
          showToast('Please fill all required business fields', 'error');
          return false;
        }
        return true;
      case 2:
        if (!formData.bank_name || !formData.account_number || !formData.account_name) {
          showToast('Please fill all required banking fields', 'error');
          return false;
        }
        return true;
      case 3:
        if (!formData.documents.id_card || !formData.documents.business_permit) {
          showToast('Please upload required documents (ID Card and Business Permit)', 'error');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setLoading(true);
    try {
      // First register as user
      const userResponse = await fetch(`${config.BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.error || errorData.msg || 'User registration failed');
      }

      const userData = await userResponse.json();
      
      // Then register as vendor
      const vendorResponse = await fetch(`${config.BASE_URL}/vendor/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.access_token}`
        },
        body: JSON.stringify({
          business_name: formData.business_name,
          business_email: formData.business_email,
          business_phone: formData.business_phone,
          business_address: formData.business_address,
          business_city: formData.business_city,
          business_state: formData.business_state,
          business_registration: formData.business_registration,
          business_description: formData.business_description,
          category: formData.category,
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          account_name: formData.account_name
        })
      });

      if (!vendorResponse.ok) {
        const errorData = await vendorResponse.json();
        throw new Error(errorData.error || errorData.msg || 'Vendor registration failed');
      }

      showToast('Vendor registration successful! Please wait for admin approval.', 'success');
      navigate('/auth');
      
    } catch (error) {
      console.error('Registration error:', error);
      showToast(error.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#008751' }}>
                👤 Personal Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#008751' }}>
                🏪 Business Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Name"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Email"
                name="business_email"
                type="email"
                value={formData.business_email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Phone"
                name="business_phone"
                value={formData.business_phone}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Business Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {businessCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Address"
                name="business_address"
                value={formData.business_address}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="business_city"
                value={formData.business_city}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>State</InputLabel>
                <Select
                  name="business_state"
                  value={formData.business_state}
                  onChange={handleChange}
                >
                  {nigerianStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Registration Number (Optional)"
                name="business_registration"
                value={formData.business_registration}
                onChange={handleChange}
                helperText="CAC registration number if available"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Business Description"
                name="business_description"
                value={formData.business_description}
                onChange={handleChange}
                helperText="Tell us about your business and products"
              />
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#008751' }}>
                🏦 Banking Information
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                This information is required for payment processing. All bank details are securely encrypted.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                required
                helperText="e.g., Access Bank, GTBank, First Bank, etc."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Account Number"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Account Name"
                name="account_name"
                value={formData.account_name}
                onChange={handleChange}
                required
                helperText="Must match bank account name"
              />
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#008751', mb: 2 }}>
                    📋 Next Steps
                  </Typography>
                  <Typography variant="body2" paragraph>
                    After registration, your vendor application will be reviewed by our admin team. You will receive an email notification once approved.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip label="Account Review" color="primary" variant="outlined" />
                    <Chip label="Email Verification" color="primary" variant="outlined" />
                    <Chip label="Background Check" color="primary" variant="outlined" />
                    <Chip label="Approval Notification" color="success" variant="outlined" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#008751' }}>
                📄 Document Upload
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                Please upload the required documents for verification. All documents should be clear and readable.
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DocumentUpload 
                title="Government ID Card" 
                documentType="id_card" 
                required 
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DocumentUpload 
                title="Business Permit/License" 
                documentType="business_permit" 
                required 
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DocumentUpload 
                title="Tax Certificate" 
                documentType="tax_certificate" 
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DocumentUpload 
                title="Bank Statement" 
                documentType="bank_statement" 
              />
            </Grid>
            
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#008751', mb: 2 }}>
                    📋 Document Guidelines
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <DocumentIcon sx={{ color: '#008751' }} />
                      </ListItemIcon>
                      <ListItemText primary="Government ID: National ID, Driver's License, or International Passport" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DocumentIcon sx={{ color: '#008751' }} />
                      </ListItemIcon>
                      <ListItemText primary="Business Permit: CAC Certificate, Trade License, or Business Registration" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DocumentIcon sx={{ color: '#008751' }} />
                      </ListItemIcon>
                      <ListItemText primary="Tax Certificate: FIRS Tax Identification Number (TIN) Certificate" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DocumentIcon sx={{ color: '#008751' }} />
                      </ListItemIcon>
                      <ListItemText primary="Bank Statement: Recent 3-month bank statement" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      py: 4
    }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                mb: 2,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #008751, #00a862)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              🏪 Become a ShopNaija Vendor
            </Typography>
            
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}
            >
              Join Nigeria's fastest-growing marketplace and start selling your products today!
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mb: 4 }}>
              {renderStepContent()}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/auth')}
                >
                  Cancel
                </Button>
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                      backgroundColor: '#008751',
                      '&:hover': { backgroundColor: '#006d41' }
                    }}
                  >
                    {loading ? 'Registering...' : 'Complete Registration'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      backgroundColor: '#008751',
                      '&:hover': { backgroundColor: '#006d41' }
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default VendorRegistration;
