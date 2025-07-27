import React, { useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ProductCard from './ProductCard';

const CategorySection = ({ category, products }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 320; // Width of one card plus gap
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <Box sx={{ mb: 6 }}>
      {/* Section Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          px: 1
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#2c3e50',
            textTransform: 'capitalize',
            fontSize: { xs: '1.5rem', md: '2rem' },
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              background: 'linear-gradient(90deg, #008751, #00a862)',
              borderRadius: 2
            }
          }}
        >
          {category}
        </Typography>
        
        {/* Navigation Arrows */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              background: 'rgba(0, 135, 81, 0.1)',
              color: '#008751',
              '&:hover': {
                background: '#008751',
                color: 'white',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              background: 'rgba(0, 135, 81, 0.1)',
              color: '#008751',
              '&:hover': {
                background: '#008751',
                color: 'white',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>

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
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: 10,
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#008751',
            borderRadius: 10,
            '&:hover': {
              background: '#006d42',
            },
          },
          // Hide scrollbar on mobile for cleaner look
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
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{
              minWidth: '300px',
              width: '300px',
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </Box>

      {/* Mobile scroll indicator */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          justifyContent: 'center',
          mt: 2,
          gap: 1
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Scroll horizontally to see more →
        </Typography>
      </Box>
    </Box>
  );
};

export default CategorySection;
