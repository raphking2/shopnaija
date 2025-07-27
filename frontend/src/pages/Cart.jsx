import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  IconButton, 
  Box,
  Divider,
  useMediaQuery,
  TextField,
  Chip,
  Card,
  CardContent,
  Badge,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DiscountIcon from '@mui/icons-material/Discount';
import { showToast } from '../utils/toast';

const Cart = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const shippingFee = 2500; // ₦2,500 shipping
  const tax = calculateSubtotal() * 0.075; // 7.5% VAT
  const total = calculateSubtotal() + shippingFee + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setDiscount(calculateSubtotal() * 0.1);
      showToast('Promo code applied! 10% discount', 'success');
    } else if (promoCode.toLowerCase() === 'save20') {
      setDiscount(calculateSubtotal() * 0.2);
      showToast('Promo code applied! 20% discount', 'success');
    } else {
      showToast('Invalid promo code', 'error');
    }
  };

  const EmptyCart = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box 
        textAlign="center" 
        py={8}
        sx={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: 4,
          border: '1px solid rgba(0, 135, 81, 0.1)'
        }}
      >
        <ShoppingBagIcon 
          sx={{ 
            fontSize: 120, 
            color: '#008751', 
            opacity: 0.3,
            mb: 3
          }} 
        />
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 2, 
            fontWeight: 700,
            color: '#2c3e50',
            fontSize: { xs: '1.8rem', md: '2.5rem' }
          }}
        >
          Your Cart is Empty
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            color: 'text.secondary',
            fontSize: '1.1rem',
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          Looks like you haven't added any items to your cart yet. 
          Start shopping to find amazing products!
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          startIcon={<ShoppingCartIcon />}
          onClick={() => navigate('/')}
          sx={{
            py: 2,
            px: 4,
            fontSize: '1.1rem',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #008751, #00a862)',
            borderRadius: '50px',
            textTransform: 'none',
            boxShadow: '0 8px 25px rgba(0, 135, 81, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #006d42, #008751)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 35px rgba(0, 135, 81, 0.4)',
            }
          }}
        >
          Start Shopping
        </Button>
      </Box>
    </motion.div>
  );

  if (cart.length === 0) {
    return (
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 4 },
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box sx={{ width: '100%' }}>
          <EmptyCart />
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      py: { xs: 2, md: 4 },
      pt: { xs: 10, md: 12 }
    }}>
      <Container maxWidth="xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Badge badgeContent={cart.length} color="primary">
              <ShoppingCartIcon sx={{ fontSize: 50, color: '#008751', mb: 2 }} />
            </Badge>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                color: '#2c3e50',
                fontSize: { xs: '2rem', md: '2.8rem' },
                mb: 1
              }}
            >
              Shopping Cart
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '1.1rem'
              }}
            >
              Review your items and proceed to checkout
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                <Box sx={{ 
                  p: 3, 
                  background: 'linear-gradient(135deg, #008751 0%, #00a862 100%)',
                  color: 'white'
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Cart Items ({cart.length})
                  </Typography>
                </Box>
                
                <Box sx={{ p: 0 }}>
                  <AnimatePresence>
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Box sx={{ 
                          p: 3, 
                          borderBottom: index < cart.length - 1 ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 135, 81, 0.02)'
                          },
                          transition: 'background-color 0.2s ease'
                        }}>
                          <Grid container spacing={3} alignItems="center">
                            
                            {/* Product Image */}
                            <Grid item xs={12} sm={3}>
                              <Box
                                sx={{
                                  width: '100%',
                                  height: { xs: 200, sm: 120 },
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              </Box>
                            </Grid>
                            
                            {/* Product Details */}
                            <Grid item xs={12} sm={6}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: 600,
                                  mb: 1,
                                  color: '#2c3e50'
                                }}
                              >
                                {item.name}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'text.secondary',
                                  mb: 2,
                                  lineHeight: 1.5
                                }}
                              >
                                {item.description}
                              </Typography>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  color: '#008751',
                                  fontWeight: 700
                                }}
                              >
                                ₦{item.price.toLocaleString()}
                              </Typography>
                            </Grid>
                            
                            {/* Quantity and Actions */}
                            <Grid item xs={12} sm={3}>
                              <Box sx={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2
                              }}>
                                {/* Quantity Controls */}
                                <Box sx={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  border: '2px solid #008751',
                                  borderRadius: '25px',
                                  overflow: 'hidden'
                                }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => dispatch({
                                      type: 'UPDATE_QUANTITY',
                                      payload: { id: item.id, quantity: Math.max(1, item.quantity - 1) }
                                    })}
                                    sx={{ 
                                      color: '#008751',
                                      '&:hover': { backgroundColor: 'rgba(0, 135, 81, 0.1)' }
                                    }}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                  
                                  <Typography sx={{ 
                                    px: 2,
                                    minWidth: 40,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    color: '#008751'
                                  }}>
                                    {item.quantity}
                                  </Typography>
                                  
                                  <IconButton
                                    size="small"
                                    onClick={() => dispatch({
                                      type: 'UPDATE_QUANTITY',
                                      payload: { id: item.id, quantity: item.quantity + 1 }
                                    })}
                                    sx={{ 
                                      color: '#008751',
                                      '&:hover': { backgroundColor: 'rgba(0, 135, 81, 0.1)' }
                                    }}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                                
                                {/* Subtotal */}
                                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                  ₦{(item.price * item.quantity).toLocaleString()}
                                </Typography>
                                
                                {/* Remove Button */}
                                <IconButton
                                  onClick={() => {
                                    dispatch({ type: 'REMOVE_FROM_CART', payload: item.id });
                                    showToast('Item removed from cart', 'info');
                                  }}
                                  sx={{
                                    color: '#e74c3c',
                                    '&:hover': { 
                                      backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                      transform: 'scale(1.1)'
                                    }
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Box sx={{ position: 'sticky', top: 100 }}>
                
                {/* Promo Code */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    border: '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <Box sx={{ 
                    p: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DiscountIcon />
                      Promo Code
                    </Typography>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <TextField
                      fullWidth
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleApplyPromo}
                      sx={{ 
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          backgroundColor: '#667eea',
                          color: 'white'
                        }
                      }}
                    >
                      Apply Code
                    </Button>
                    {discount > 0 && (
                      <Chip
                        label={`Discount Applied: -₦${discount.toLocaleString()}`}
                        color="success"
                        sx={{ mt: 2 }}
                      />
                    )}
                  </Box>
                </Paper>

                {/* Order Summary */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    borderRadius: 3,
                    border: '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <Box sx={{ 
                    p: 3,
                    background: 'linear-gradient(135deg, #008751 0%, #00a862 100%)',
                    color: 'white'
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Order Summary
                    </Typography>
                  </Box>
                  
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography>Subtotal ({cart.length} items):</Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          ₦{calculateSubtotal().toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography>Shipping:</Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          ₦{shippingFee.toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography>Tax (7.5%):</Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          ₦{tax.toLocaleString()}
                        </Typography>
                      </Box>
                      
                      {discount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography sx={{ color: '#e74c3c' }}>Discount:</Typography>
                          <Typography sx={{ fontWeight: 600, color: '#e74c3c' }}>
                            -₦{discount.toLocaleString()}
                          </Typography>
                        </Box>
                      )}
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Total:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#008751' }}>
                          ₦{total.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Security Icons */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                      <SecurityIcon sx={{ color: '#008751' }} />
                      <LocalShippingIcon sx={{ color: '#008751' }} />
                      <CheckCircleIcon sx={{ color: '#008751' }} />
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={() => showToast("Checkout feature coming soon!", "info")}
                      sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #008751, #00a862)',
                        borderRadius: '12px',
                        textTransform: 'none',
                        boxShadow: '0 8px 25px rgba(0, 135, 81, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #006d42, #008751)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 35px rgba(0, 135, 81, 0.4)',
                        }
                      }}
                    >
                      Proceed to Checkout
                    </Button>

                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        textAlign: 'center',
                        mt: 2,
                        color: 'text.secondary'
                      }}
                    >
                      Secure payment with 256-bit SSL encryption
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Cart;