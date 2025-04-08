import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  IconButton, 
  Box,
  Divider,
  CssBaseline,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import bgTest from '../assets/bgTest.gif'
import { showToast } from '../utils/toast'

const theme = createTheme({
  palette: {
    primary: {
      main: '#008751', // Nigerian green
    },
    secondary: {
      main: '#FFFFFF', // White
    },
    background: {
      default: 'white', // Fallback color if image doesn't load
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${bgTest})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right',
          backgroundSize: 'auto 500px',
        },
      },
    },
  },
 
});

// Gradient background for the pages
const GradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FFFFFF 30%, #FFFFFF 50%, #FFFFFF 70%)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
}));

const Cart = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  //const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <GradientBox>
    <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4, px: isMobile ? 1 : 4 }} >
      <Typography variant="h3" gutterBottom sx={{ 
        color: '#008751', 
        fontSize: isMobile ? '2rem' : '3rem',
        textAlign: 'center',
        fontWeight: 600
      }}>
        Your Shopping Cart
      </Typography>

      {cart.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Your cart is empty
          </Typography>
          <Button 
            variant="contained" 
            sx={{ 
              mt: 2, 
              bgcolor: '#008751',
              fontSize: isMobile ? '0.875rem' : '1rem',
              p: isMobile ? '8px 16px' : '10px 24px'
            }}
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} >
          <Grid item xs={12} md={8} >
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper elevation={isMobile ? 0 : 2} sx={{ 
                    p: 2, 
                    mb: 2,
                    borderRadius: 4,
                    border: isMobile ? 'none' : '1px solid rgba(0, 0, 0, 0.12)'
                  }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={4} sm={3}>
                        <Box
                          sx={{
                            position: 'relative',
                            paddingTop: '100%',
                            borderRadius: 3,
                            overflow: 'hidden'
                          }}
                        >
                          <img
                            src={item.image_url}
                            alt={item.name}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={8} sm={6}>
                        <Typography variant={isMobile ? 'subtitle1' : 'h6'}>
                          {item.name}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={2}>
                          <Button
                            variant="outlined"
                            sx={{ 
                              minWidth: '32px', 
                              p: 0,
                              height: '32px'
                            }}
                            onClick={() => dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: { id: item.id, quantity: item.quantity - 1 }
                            })}
                          >
                            -
                          </Button>
                          <Typography mx={2} sx={{ fontWeight: 500 }}>
                            {item.quantity}
                          </Typography>
                          <Button
                            variant="outlined"
                            sx={{ 
                              minWidth: '32px', 
                              p: 0,
                              height: '32px'
                            }}
                            onClick={() => dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: { id: item.id, quantity: item.quantity + 1 }
                            })}
                          >
                            +
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={3} sx={{ 
                        textAlign: isMobile ? 'left' : 'right',
                        mt: isMobile ? 1 : 0
                      }}>
                        <IconButton
                          onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                          color="error"
                          sx={{ 
                            p: 1,
                            '&:hover': { 
                              backgroundColor: 'rgba(255, 0, 0, 0.1)' 
                            }
                          }}
                        >
                          <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>
              ))}
            </AnimatePresence>
          </Grid>

          <Grid item xs={12} >
            <Paper elevation={isMobile ? 0 : 2} sx={{ 
              p: 3,
              borderRadius: 4,
              border: isMobile ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
              position: isMobile ? 'static' : 'sticky',
              top: 20
            }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>Total Items:</Typography>
                <Typography>{cart.length}</Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" sx={{ color: '#008751', fontWeight: 700 }}>
                  ₦{calculateTotal().toLocaleString()}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="small"
                sx={{ 
                  bgcolor: '#008751',
                  py: 2,
                  fontSize: '1rem',
                  borderRadius: 2,
                  '&:hover': { 
                    bgcolor: '#006442',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
                onClick={() => showToast("This feature is yet to be integrated", "warning")}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
    </GradientBox>
    </ThemeProvider>
  );
};

export default Cart;