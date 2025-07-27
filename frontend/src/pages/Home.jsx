import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography, 
  Container,
  useMediaQuery,
  CircularProgress,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import CategorySection from '../components/CategorySection';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';
import { categories } from '../data/dummyData';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Home = ({ searchQuery }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5000/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Extract products from paginated response
        const productsData = data.products || data;
        
        const transformedProducts = productsData.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.price * 1.2, // Add original price for discount display
          description: item.description || `Premium quality ${item.name}`,
          image: item.image_url || `https://picsum.photos/400/300?random=${item.id}`,
          category: item.category ? item.category.toLowerCase() : 'general',
          rating: item.rating || (Math.random() * 2 + 3).toFixed(1), // 3-5 star rating
          reviews: item.review_count || Math.floor(Math.random() * 100) + 10,
          stock: item.stock || Math.floor(Math.random() * 50) + 5,
          badge: Math.random() > 0.7 ? 'New' : Math.random() > 0.5 ? 'Sale' : null,
          discount: Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 10 : null
        }));
        
        setAllProducts(transformedProducts);
        
        // Set featured products (first 8 products)
        setFeaturedProducts(transformedProducts.slice(0, 8));
        
        // Group products by category
        const grouped = {};
        categories.forEach(category => {
          grouped[category] = transformedProducts
            .filter(product => product.category === category)
            .slice(0, 8); // Limit to 8 products per category
        });
        setCategoryProducts(grouped);
        
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback to dummy data if API fails
        setAllProducts([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Filter products based on search
  const filteredProducts = allProducts.filter(product => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
      >
        <CircularProgress size={60} sx={{ color: '#008751' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      paddingTop: { xs: '60px', sm: '70px', md: '80px' },
      paddingBottom: '2rem'
    }}>
      {/* Hero Section */}
      {!searchQuery && <HeroSection />}
      
      <Container 
        maxWidth="xl" 
        sx={{ 
          px: { xs: 1, sm: 2, md: 3, lg: 4 },
          mt: searchQuery ? 2 : 0
        }}
      >
        
        {/* Search Results */}
        {searchQuery && (
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 3,
                fontWeight: 700,
                color: '#2c3e50',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                textAlign: { xs: 'center', sm: 'left' },
                px: { xs: 1, sm: 0 }
              }}
            >
              Search Results for "{searchQuery}"
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(auto-fill, minmax(150px, 1fr))',
                  sm: 'repeat(auto-fill, minmax(200px, 1fr))',
                  md: 'repeat(auto-fill, minmax(280px, 1fr))',
                  lg: 'repeat(auto-fill, minmax(320px, 1fr))'
                },
                gap: { xs: 1, sm: 2, md: 3 },
                mb: 4,
                px: { xs: 0.5, sm: 0 }
              }}
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </Box>
            
            {filteredProducts.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  No products found matching your search.
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mt: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  Try adjusting your search terms or browse our categories
                </Typography>
              </Box>
            )}
          </Box>
        )}
        
        {/* Featured Products Section */}
        {!searchQuery && featuredProducts.length > 0 && (
          <FeaturedProducts products={featuredProducts} />
        )}
        
        {/* Category Sections */}
        {!searchQuery && categories.map((category) => {
          const products = categoryProducts[category] || [];
          if (products.length === 0) return null;
          
          return (
            <CategorySection
              key={category}
              category={category}
              products={products}
            />
          );
        })}
        
      </Container>
    </Box>
  );
};

export default Home;