// components/ProductCard.jsx
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext.jsx';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();
  const navigate = useNavigate();

  return (
    <Card
      component={motion.div}
      whileHover={{ scale: 1.05 }}
      onClick={() => navigate(`/product/${product.id}`)}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ 
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)'
          }
        }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" sx={{ fontWeight: 600 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
          ₦{product.price.toLocaleString()}
        </Typography>
      </CardContent>

      <Button 
        variant="contained"
        startIcon={<ShoppingBasketIcon />}
        sx={{ 
          m: 2,
          background: '#008751',
          '&:hover': { background: '#006442' }
        }}
        onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
      >
        Add to Cart
      </Button>
    </Card>
  );
};

export default ProductCard;