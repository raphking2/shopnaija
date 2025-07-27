import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Rating,
  Chip,
  Button,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ProductCard = ({ product, featured = false }) => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');

  const handleViewProduct = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: product
    });
    toast.success(`${product.name} added to cart!`, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.info(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const discountPercentage = product.discount || 0;
  const originalPrice = product.originalPrice || (discountPercentage > 0 ? product.price / (1 - discountPercentage / 100) : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: isMobile ? 0 : -4, scale: isMobile ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden',
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
          '&:hover': {
            boxShadow: { xs: 'rgba(0, 0, 0, 0.1) 0px 4px 12px', md: 'rgba(0, 0, 0, 0.15) 0px 8px 24px' },
            '& .product-image': {
              transform: isMobile ? 'none' : 'scale(1.05)',
            },
            '& .add-to-cart-btn': {
              opacity: 1,
              transform: 'translateY(0)',
            }
          },
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          minHeight: { xs: 280, sm: 320, md: 360 }
        }}
        onClick={handleViewProduct}
      >
        {/* Badges */}
        <Box sx={{ position: 'absolute', top: { xs: 4, sm: 8 }, left: { xs: 4, sm: 8 }, zIndex: 2 }}>
          {product.badge && (
            <Chip
              label={product.badge}
              size="small"
              sx={{
                backgroundColor: product.badge === 'New' ? '#4caf50' : '#ff9800',
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '0.6rem', sm: '0.75rem' },
                height: { xs: 20, sm: 24 },
                mb: 0.5
              }}
            />
          )}
          {discountPercentage > 0 && (
            <Chip
              label={`-${discountPercentage}%`}
              size="small"
              sx={{
                backgroundColor: '#f44336',
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '0.6rem', sm: '0.75rem' },
                height: { xs: 20, sm: 24 }
              }}
            />
          )}
        </Box>

        {/* Favorite Button */}
        <IconButton
          onClick={handleToggleFavorite}
          sx={{
            position: 'absolute',
            top: { xs: 4, sm: 8 },
            right: { xs: 4, sm: 8 },
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.1)',
            },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: '#f44336', fontSize: { xs: '1rem', sm: '1.25rem' } }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: '#666', fontSize: { xs: '1rem', sm: '1.25rem' } }} />
          )}
        </IconButton>

        {/* Product Image */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '75%', // 4:3 aspect ratio
            overflow: 'hidden',
            backgroundColor: '#f5f5f5'
          }}
        >
          <CardMedia
            component="img"
            image={product.image || `https://picsum.photos/400/300?random=${product.id}`}
            alt={product.name}
            className="product-image"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out',
            }}
          />
          
          {/* Quick Add to Cart Button - Desktop Only */}
          {!isMobile && (
            <Box
              className="add-to-cart-btn"
              sx={{
                position: 'absolute',
                bottom: { xs: 8, sm: 12 },
                right: { xs: 8, sm: 12 },
                opacity: 0,
                transform: 'translateY(20px)',
                transition: 'all 0.3s ease',
                display: 'flex'
              }}
            >
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                disabled={product.stock === 0}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    backgroundColor: '#008751',
                    color: 'white',
                    transform: 'scale(1.1)',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    color: '#ccc'
                  },
                  boxShadow: 2,
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 }
                }}
              >
                <AddShoppingCartIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Product Content */}
        <CardContent sx={{ 
          flexGrow: 1, 
          p: { xs: 1.5, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 0.5, sm: 1 }
        }}>
          {/* Product Name */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' },
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: { xs: '2.2rem', sm: '2.6rem' },
              color: '#2c3e50',
              mb: { xs: 0.5, sm: 1 }
            }}
          >
            {product.name}
          </Typography>

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: { xs: 0.5, sm: 1 } }}>
            <Rating
              value={parseFloat(product.rating) || 0}
              precision={0.1}
              readOnly
              size={isMobile ? "small" : "medium"}
              sx={{
                fontSize: { xs: '0.8rem', sm: '1rem' },
                '& .MuiRating-iconFilled': {
                  color: '#ffc107',
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                ml: 0.5
              }}
            >
              ({product.reviews || 0})
            </Typography>
          </Box>

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 700,
                color: '#008751',
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' }
              }}
            >
              ₦{product.price?.toLocaleString()}
            </Typography>
            
            {originalPrice && originalPrice > product.price && (
              <Typography
                variant="body2"
                component="span"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }}
              >
                ₦{originalPrice.toLocaleString()}
              </Typography>
            )}
          </Box>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <Box sx={{ mt: 1 }}>
              {product.stock === 0 ? (
                <Chip
                  label="Out of Stock"
                  size="small"
                  sx={{
                    backgroundColor: '#ffebee',
                    color: '#d32f2f',
                    fontSize: { xs: '0.6rem', sm: '0.7rem' },
                    height: { xs: 20, sm: 24 }
                  }}
                />
              ) : product.stock <= 5 ? (
                <Chip
                  label={`Only ${product.stock} left`}
                  size="small"
                  sx={{
                    backgroundColor: '#fff3e0',
                    color: '#f57c00',
                    fontSize: { xs: '0.6rem', sm: '0.7rem' },
                    height: { xs: 20, sm: 24 }
                  }}
                />
              ) : (
                <Chip
                  label="In Stock"
                  size="small"
                  sx={{
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    fontSize: { xs: '0.6rem', sm: '0.7rem' },
                    height: { xs: 20, sm: 24 }
                  }}
                />
              )}
            </Box>
          )}

          {/* Mobile Add to Cart Button */}
          {isMobile && (
            <Button
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={product.stock === 0}
              startIcon={<AddShoppingCartIcon />}
              sx={{
                mt: 1.5,
                backgroundColor: '#008751',
                '&:hover': {
                  backgroundColor: '#006d3f',
                },
                '&:disabled': {
                  backgroundColor: '#ccc'
                },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                py: 1
              }}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}

          {/* Vendor Info */}
          {product.vendor && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                mt: 1
              }}
            >
              Sold by: {product.vendor.business_name || product.vendor}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
