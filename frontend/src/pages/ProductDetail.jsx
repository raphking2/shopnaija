import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Grid, 
  Typography, 
  Button, 
  Avatar, 
  Rating, 
  IconButton,
  Container,
  CssBaseline,
  useMediaQuery,
  Box
} from '@mui/material';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { dummyProducts } from '../data/dummyData';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import bgTest from '../assets/bgTest.gif'
// Custom theme with Nigerian flag colors
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



const ProductDetail = () => {
  const { id } = useParams();
  const { dispatch } = useCart();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [product, setProduct] = useState(null);
  const [productR, setProductR] = useState(null);
  console.log('hi',id)

  useEffect(() => {
    const foundProduct = dummyProducts.find(p => p.id === parseInt(id));
    setProductR(foundProduct);
  }, [id]);

  // Fetch the product details from the API endpoint using the id from URL params
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('ne',data)
        // In case the API does not return reviews, add a default empty array
        if (!data.reviews) {
          data.reviews = [];
        }
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);


  if (!product) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h4">Product not found</Typography>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <GradientBox>
      <Container maxWidth="sm">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: isMobile ? '1rem' : '2rem' }}
    >
      <IconButton 
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <motion.img
            src={product.image_url}
            alt={product.name}
            style={{ 
              width: '100%', 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating 
              value={productR.rating} 
              readOnly 
              precision={0.5}
              sx={{ color: '#008751' }}
            />
            <Typography variant="body2">
              ({product.reviews.length} reviews)
            </Typography>
          </Box>

          <Typography variant="h4" color="primary" gutterBottom>
            ₦{product.price.toLocaleString()}
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingBasketIcon />}
            sx={{ 
              mb: 4,
              background: '#008751',
              '&:hover': { background: '#006442' }
            }}
            onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
          >
            Add to Cart
          </Button>
          
          <Typography variant="body1" sx={{ mb: 4 }}>
            {productR.description}
          </Typography>
          
          <Typography variant="h5" gutterBottom>
            Customer Reviews
          </Typography>
          
          {productR.reviews.map((review) => (
            <Box key={review.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar sx={{ bgcolor: '#008751' }}>
                  {review.user.charAt(0)}
                </Avatar>
                <Typography variant="subtitle1">
                  {review.user}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ ml: 6 }}>
                {review.comment}
              </Typography>
            </Box>
          ))}
        </Grid>
      </Grid>
    </motion.div>
      </Container>
    </GradientBox>
    </ThemeProvider>
  );
};

export default ProductDetail;