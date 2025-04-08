// import React, { useState } from 'react';
// import Navbar from '../components/Navbar';
// import '../App.css'
// export default function Home() {


//   return (
//     <div style={{backgroundColor:'red'}}>
//         {/* <Navbar/> */}
//         <h1>Hi</h1>
//     </div>
    
//   );
// }

// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Chip, 
  useMediaQuery, 
  CircularProgress,
  IconButton
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { dummyProducts, categories } from '../data/dummyData';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const Home = ({ searchQuery }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [allProducts, setAllProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Filter products
//   useEffect(() => {
//     const filtered = dummyProducts.filter(product => {
//       const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                             product.description.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
//       return matchesSearch && matchesCategory;
//     });

//     setVisibleProducts(filtered.slice(0, page * 6));
//   }, [searchQuery, selectedCategory, page]);
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Optionally, add default values for any missing fields here
      const transformedProducts = data.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description || `Premium quality product ${item.id} description`,
        image: item.image_url || `https://source.unsplash.com/random/800x600?product,${item.id}`,
        category: item.category ? item.category.toLowerCase() : 'all',
        rating: item.rating || Math.floor(Math.random() * 5) + 1,
        reviews: item.reviews || []
      }));
      setAllProducts(transformedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  fetchProducts();
}, []);

// Filter products based on search query and selected category
useEffect(() => {
  const filtered = allProducts.filter(product => {
    const searchLower = searchQuery?.toLowerCase() || '';
    const productName = product.name?.toLowerCase() || '';
    const productDesc = product.description?.toLowerCase() || '';
    
    const matchesSearch = productName.includes(searchLower) || 
                          productDesc.includes(searchLower);
    
    const matchesCategory = selectedCategory === 'all' || 
                            product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  setVisibleProducts(filtered.slice(0, page * 6));
}, [searchQuery, selectedCategory, page, allProducts]);
  // Infinite scroll
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= 
      document.documentElement.offsetHeight - 100 && !loading) {
      setLoading(true);
      setTimeout(() => {
        setPage(prev => prev + 1);
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div style={{ padding: isMobile ? '1rem' : '2rem', position: 'relative',marginTop:'40px' }}>
      {/* Category Filter Chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: isMobile ? 'fixed' : 'static',
          top: isMobile ? 0 : 'auto',
          left: isMobile ? 0 : 'auto',
          right: isMobile ? 0 : 'auto',
          zIndex: 1000,
          background: isMobile ? 'white' : 'transparent',
          padding: isMobile ? '1rem' : 0,
          boxShadow: isMobile ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
          display: showFilters || !isMobile ? 'block' : 'none'
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          {isMobile && (
            <Typography variant="h6" sx={{ color: '#008751' }}>
              Filter by:
            </Typography>
          )}
          {isMobile && (
            <IconButton onClick={() => setShowFilters(false)}>
              <CloseIcon />
            </IconButton>
          )}
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}
        >
          {['all', ...categories].map(category => (
            <motion.div key={category} variants={itemVariants}>
              <Chip
                label={category}
                clickable
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                color="primary"
                onClick={() => setSelectedCategory(category)}
                sx={{
                  textTransform: 'capitalize',
                  border: selectedCategory === category ? 'none' : '1px solid #008751',
                  background: selectedCategory === category ? '#008751' : 'transparent',
                  color: selectedCategory === category ? 'white' : '#008751'
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Mobile Filter Toggle */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '1rem',
            zIndex: 1000
          }}
        >
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              background: '#008751',
              color: 'white',
              '&:hover': { background: '#006442' }
            }}
          >
            <FilterListIcon />
          </IconButton>
        </motion.div>
      )}

      {/* Product Grid */}
      <Grid container spacing={3} sx={{ marginTop: isMobile ? '70px' : 0 }}>
        <AnimatePresence>
          {visibleProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {/* Loading Spinner */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}
        >
          <CircularProgress sx={{ color: '#008751' }} />
        </motion.div>
      )}

      {/* Empty State */}
      {!visibleProducts.length && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', marginTop: '4rem' }}
        >
          <Typography variant="h5" sx={{ color: '#008751' }}>
            No products found matching your criteria
          </Typography>
        </motion.div>
      )}
    </div>
  );
};

export default Home;