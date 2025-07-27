import React, { useState } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  Chip,
  Rating,
  IconButton,
  Badge
} from '@mui/material';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const ProductCard = ({ product, featured = false }) => {
  const { dispatch } = useCart();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const handleViewProduct = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const discountPercentage = product.discount || 0;
  const originalPrice = product.originalPrice || product.price * 1.2;

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: featured 
          ? '0 8px 32px rgba(255, 107, 53, 0.15)' 
          : '0 4px 20px rgba(0,0,0,0.08)',
        border: featured ? '2px solid rgba(255, 107, 53, 0.2)' : 'none',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        '&:hover': {
          boxShadow: featured 
            ? '0 12px 40px rgba(255, 107, 53, 0.25)' 
            : '0 8px 30px rgba(0,0,0,0.15)',
        }
      }}
      onClick={handleViewProduct}
    >
      {/* Image Container */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Badges */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
          {product.badge && (
            <Chip
              label={product.badge}
              size="small"
              sx={{
                background: product.badge === 'New' 
                  ? 'linear-gradient(45deg, #4CAF50, #45a049)'
                  : 'linear-gradient(45deg, #ff6b35, #f7931e)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 24,
                mb: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            />
          )}
          {discountPercentage > 0 && (
            <Chip
              icon={<LocalOfferIcon sx={{ fontSize: 14, color: 'white !important' }} />}
              label={`${discountPercentage}% OFF`}
              size="small"
              sx={{
                background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 24,
                boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)'
              }}
            />
          )}
        </Box>

        {/* Favorite Button */}
        <IconButton
          onClick={toggleFavorite}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: '#e74c3c', fontSize: 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: '#7f8c8d', fontSize: 20 }} />
          )}
        </IconButton>

        {/* Product Image */}
        <CardMedia
          component="img"
          height="220"
          image={product.image}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />

        {/* Hover Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0, 135, 81, 0.8), rgba(0, 168, 98, 0.8))',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Button
            variant="contained"
            startIcon={<VisibilityIcon />}
            onClick={handleViewProduct}
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#008751',
              fontWeight: 600,
              borderRadius: '25px',
              px: 3,
              py: 1,
              textTransform: 'none',
              '&:hover': {
                background: 'white',
                transform: 'scale(1.05)'
              }
            }}
          >
            Quick View
          </Button>
        </Box>
      </Box>

      {/* Card Content */}
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            fontSize: '1.1rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: '#2c3e50'
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 2,
            fontSize: '0.9rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4
          }}
        >
          {product.description}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating
            value={parseFloat(product.rating)}
            precision={0.1}
            size="small"
            readOnly
            sx={{ mr: 1 }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            ({product.reviews} reviews)
          </Typography>
        </Box>

        {/* Price Section */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#008751',
                fontSize: '1.3rem'
              }}
            >
              ₦{product.price.toLocaleString()}
            </Typography>
            {discountPercentage > 0 && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  fontSize: '0.9rem'
                }}
              >
                ₦{originalPrice.toLocaleString()}
              </Typography>
            )}
          </Box>
          {discountPercentage > 0 && (
            <Typography
              variant="caption"
              sx={{
                color: '#e74c3c',
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
            >
              You save ₦{(originalPrice - product.price).toLocaleString()}
            </Typography>
          )}
        </Box>

        {/* Stock Status */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Limited Stock' : 'Out of Stock'}
            size="small"
            sx={{
              background: product.stock > 10 
                ? 'rgba(76, 175, 80, 0.1)' 
                : product.stock > 0 
                ? 'rgba(255, 152, 0, 0.1)' 
                : 'rgba(244, 67, 54, 0.1)',
              color: product.stock > 10 
                ? '#4CAF50' 
                : product.stock > 0 
                ? '#FF9800' 
                : '#f44336',
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
        </Box>
      </CardContent>

      {/* Add to Cart Button */}
      <Box sx={{ p: 2.5, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          sx={{
            py: 1.5,
            borderRadius: '12px',
            background: product.stock === 0 
              ? 'rgba(0, 0, 0, 0.12)' 
              : 'linear-gradient(45deg, #008751, #00a862)',
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
            boxShadow: product.stock === 0 
              ? 'none' 
              : '0 4px 12px rgba(0, 135, 81, 0.3)',
            '&:hover': {
              background: product.stock === 0 
                ? 'rgba(0, 0, 0, 0.12)' 
                : 'linear-gradient(45deg, #006d42, #008751)',
              transform: product.stock === 0 ? 'none' : 'translateY(-1px)',
              boxShadow: product.stock === 0 
                ? 'none' 
                : '0 6px 16px rgba(0, 135, 81, 0.4)',
            },
            '&:disabled': {
              color: 'rgba(0, 0, 0, 0.38)'
            }
          }}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;