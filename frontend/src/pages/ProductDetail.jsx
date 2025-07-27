import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Typography, 
  Button, 
  Avatar, 
  Rating, 
  IconButton,
  Container,
  useMediaQuery,
  Box,
  Paper,
  Chip,
  Divider,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Badge
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { dummyProducts } from '../data/dummyData';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { showToast } from '../utils/toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { dispatch, cart } = useCart();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [product, setProduct] = useState(null);
  const [productR, setProductR] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if product is already in cart
  const cartItem = cart.find(item => item.id === parseInt(id));
  const isInCart = !!cartItem;

  useEffect(() => {
    const foundProduct = dummyProducts.find(p => p.id === parseInt(id));
    setProductR(foundProduct);
  }, [id]);

  // Fetch the product details from the API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Enhance the product data
        const enhancedProduct = {
          ...data,
          images: [
            data.image_url || `https://picsum.photos/600/400?random=${data.id}`,
            `https://picsum.photos/600/400?random=${data.id + 1}`,
            `https://picsum.photos/600/400?random=${data.id + 2}`,
            `https://picsum.photos/600/400?random=${data.id + 3}`
          ],
          rating: data.rating || (Math.random() * 2 + 3).toFixed(1),
          reviews: data.reviews || Math.floor(Math.random() * 100) + 10,
          stock: data.stock || Math.floor(Math.random() * 50) + 5,
          badge: Math.random() > 0.7 ? 'New' : Math.random() > 0.5 ? 'Sale' : null,
          discount: Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 10 : null,
          originalPrice: data.price * 1.2,
          features: [
            'Free shipping on orders over ₦50,000',
            '30-day return policy',
            '1-year warranty included',
            'Authentic product guarantee'
          ]
        };
        
        setProduct(enhancedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
        showToast('Error loading product details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      image: product.images[0],
      quantity: quantity
    };
    
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', payload: productToAdd });
    }
    
    showToast(`Added ${quantity} item(s) to cart!`, 'success');
  };

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{ pt: 10 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <ShoppingCartIcon sx={{ fontSize: 60, color: '#008751' }} />
        </motion.div>
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Product not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ background: '#008751' }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      pt: { xs: 8, md: 10 }
    }}>
      <Container maxWidth="xl">
        
        {/* Breadcrumb and Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => navigate(-1)}
              sx={{ 
                background: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': { 
                  background: '#008751',
                  color: 'white',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Home / Products / {product.category} / {product.name}
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ position: 'relative' }}>
                {/* Main Image */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    mb: 2,
                    position: 'relative'
                  }}
                >
                  {/* Badge */}
                  {product.badge && (
                    <Chip
                      label={product.badge}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 2,
                        background: product.badge === 'New' 
                          ? 'linear-gradient(45deg, #4CAF50, #45a049)'
                          : 'linear-gradient(45deg, #ff6b35, #f7931e)',
                        color: 'white',
                        fontWeight: 700
                      }}
                    />
                  )}
                  
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    style={{ 
                      width: '100%', 
                      height: isMobile ? '300px' : '500px',
                      objectFit: 'cover'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Favorite Button */}
                  <IconButton
                    onClick={() => setIsFavorite(!isFavorite)}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': { 
                        background: 'white',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    {isFavorite ? (
                      <FavoriteIcon sx={{ color: '#e74c3c' }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ color: '#7f8c8d' }} />
                    )}
                  </IconButton>
                </Paper>

                {/* Thumbnail Images */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  overflowX: 'auto',
                  pb: 1
                }}>
                  {product.images.map((image, index) => (
                    <Paper
                      key={index}
                      elevation={selectedImage === index ? 4 : 1}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        minWidth: 80,
                        height: 80,
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedImage === index ? '3px solid #008751' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Paper>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Product Information */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box sx={{ position: 'sticky', top: 100 }}>
                
                {/* Product Title and Rating */}
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 2,
                    color: '#2c3e50',
                    fontSize: { xs: '1.8rem', md: '2.5rem' }
                  }}
                >
                  {product.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Rating 
                    value={parseFloat(product.rating)} 
                    readOnly 
                    precision={0.1}
                    sx={{ color: '#008751' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {product.rating} ({product.reviews} reviews)
                  </Typography>
                  <Chip 
                    label="Best Seller" 
                    size="small" 
                    sx={{ 
                      background: '#ffc107',
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                </Box>

                {/* Price */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: '#008751',
                        fontWeight: 700
                      }}
                    >
                      ₦{product.price.toLocaleString()}
                    </Typography>
                    {product.discount && (
                      <>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            textDecoration: 'line-through',
                            color: 'text.secondary'
                          }}
                        >
                          ₦{product.originalPrice.toLocaleString()}
                        </Typography>
                        <Chip
                          label={`${product.discount}% OFF`}
                          sx={{
                            background: '#e74c3c',
                            color: 'white',
                            fontWeight: 700
                          }}
                        />
                      </>
                    )}
                  </Box>
                  {product.discount && (
                    <Typography variant="body2" sx={{ color: '#e74c3c', fontWeight: 600 }}>
                      You save ₦{(product.originalPrice - product.price).toLocaleString()}
                    </Typography>
                  )}
                </Box>

                {/* Stock Status */}
                <Box sx={{ mb: 3 }}>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={`${product.stock} items in stock`}
                    sx={{
                      background: 'rgba(76, 175, 80, 0.1)',
                      color: '#4CAF50',
                      fontWeight: 600
                    }}
                  />
                </Box>

                {/* Quantity Selector */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Quantity:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      border: '2px solid #008751',
                      borderRadius: '25px',
                      overflow: 'hidden'
                    }}>
                      <IconButton
                        onClick={() => handleUpdateQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                        sx={{ color: '#008751' }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ 
                        px: 3,
                        minWidth: 50,
                        textAlign: 'center',
                        fontWeight: 700,
                        color: '#008751'
                      }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        onClick={() => handleUpdateQuantity(quantity + 1)}
                        disabled={quantity >= product.stock}
                        sx={{ color: '#008751' }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      (Max: {product.stock} available)
                    </Typography>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<ShoppingCartIcon />}
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        sx={{
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #008751, #00a862)',
                          borderRadius: '12px',
                          textTransform: 'none',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #006d42, #008751)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0, 135, 81, 0.4)'
                          }
                        }}
                      >
                        {isInCart ? `Update Cart (${cartItem.quantity})` : 'Add to Cart'}
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        startIcon={<ShareIcon />}
                        onClick={() => showToast('Share feature coming soon!', 'info')}
                        sx={{
                          py: 2,
                          borderColor: '#008751',
                          color: '#008751',
                          borderRadius: '12px',
                          textTransform: 'none',
                          '&:hover': {
                            background: '#008751',
                            color: 'white'
                          }
                        }}
                      >
                        Share
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                {/* Features */}
                <Card elevation={0} sx={{ mb: 4, border: '1px solid rgba(0, 0, 0, 0.08)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                      Why Choose This Product?
                    </Typography>
                    {product.features.map((feature, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: 1 
                        }}
                      >
                        <CheckCircleIcon sx={{ color: '#008751', fontSize: 20 }} />
                        <Typography variant="body2">
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>

                {/* Security Badges */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 3,
                  p: 2,
                  background: 'rgba(0, 135, 81, 0.05)',
                  borderRadius: 2
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <SecurityIcon sx={{ color: '#008751', fontSize: 30 }} />
                    <Typography variant="caption" display="block">
                      Secure Payment
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <LocalShippingIcon sx={{ color: '#008751', fontSize: 30 }} />
                    <Typography variant="caption" display="block">
                      Fast Delivery
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircleIcon sx={{ color: '#008751', fontSize: 30 }} />
                    <Typography variant="caption" display="block">
                      Authentic
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Paper elevation={0} sx={{ mt: 6, border: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Description" />
              <Tab label="Specifications" />
              <Tab label="Reviews" />
            </Tabs>
            
            <Box sx={{ p: 4 }}>
              {tabValue === 0 && (
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  {productR?.description || product.description || 'No description available.'}
                </Typography>
              )}
              
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Product Specifications</Typography>
                  <Typography variant="body1">
                    Category: {product.category}<br/>
                    Stock: {product.stock} units<br/>
                    Rating: {product.rating}/5<br/>
                    Reviews: {product.reviews} customer reviews
                  </Typography>
                </Box>
              )}
              
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3 }}>Customer Reviews</Typography>
                  {productR?.reviews?.length > 0 ? (
                    productR.reviews.map((review) => (
                      <Box key={review.id} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Avatar sx={{ bgcolor: '#008751' }}>
                            {review.user.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {review.user}
                            </Typography>
                            <Rating value={5} size="small" readOnly />
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ ml: 7 }}>
                          {review.comment}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No reviews yet. Be the first to review this product!
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ProductDetail;