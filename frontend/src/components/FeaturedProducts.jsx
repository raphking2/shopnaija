import React, { useRef } from 'react';
import { Box, Typography, Button, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const FeaturedProducts = ({ products }) => {
  const scrollRef = useRef(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = isMobile ? 280 : 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box id="featured-products" sx={{ mb: 6 }}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <LocalFireDepartmentIcon 
              sx={{ 
                fontSize: 40, 
                color: '#ff6b35',
                mr: 1
              }} 
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Featured Products
            </Typography>
          </Box>
          
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}
          >
            Handpicked products just for you. Don't miss out on these amazing deals!
          </Typography>
        </Box>
      </motion.div>

      {/* Horizontal Scrolling Container */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: 2,
          scrollBehavior: 'smooth',
          px: 1,
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: 10,
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(90deg, #ff6b35, #f7931e)',
            borderRadius: 10,
            '&:hover': {
              background: 'linear-gradient(90deg, #e55a2b, #d6821a)',
            },
          },
          // Hide scrollbar on mobile
          '@media (max-width: 600px)': {
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          },
        }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ y: -5 }}
            style={{
              minWidth: isMobile ? '260px' : '300px',
              width: isMobile ? '260px' : '300px',
            }}
          >
            {/* Featured Badge */}
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  left: 10,
                  zIndex: 2,
                  background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                <StarIcon sx={{ fontSize: 16 }} />
                Featured
              </Box>
              <ProductCard product={product} featured={true} />
            </Box>
          </motion.div>
        ))}
      </Box>

      {/* Navigation Hint for Mobile */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          justifyContent: 'center',
          mt: 3,
          mb: 2
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: '20px',
            background: 'rgba(255, 107, 53, 0.1)',
            border: '1px solid rgba(255, 107, 53, 0.2)'
          }}
        >
          👈 Swipe to explore more products
        </Typography>
      </Box>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#ff6b35',
              color: '#ff6b35',
              px: 4,
              py: 1.5,
              borderRadius: '25px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: '#ff6b35',
                color: 'white',
                transform: 'scale(1.05)',
                boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            View All Featured Products
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default FeaturedProducts;
