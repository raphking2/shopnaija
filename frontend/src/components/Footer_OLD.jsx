import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Categories', href: '/categories' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Track Your Order', href: '/track' },
        { name: 'Returns & Refunds', href: '/returns' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Size Guide', href: '/size-guide' }
      ]
    },
    {
      title: 'Account',
      links: [
        { name: 'My Account', href: '/account' },
        { name: 'Order History', href: '/orders' },
        { name: 'Wishlist', href: '/wishlist' },
        { name: 'Newsletter', href: '/newsletter' },
        { name: 'Affiliate Program', href: '/affiliate' }
      ]
    }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, href: 'https://facebook.com', color: '#1877F2' },
    { icon: <TwitterIcon />, href: 'https://twitter.com', color: '#1DA1F2' },
    { icon: <InstagramIcon />, href: 'https://instagram.com', color: '#E4405F' },
    { icon: <LinkedInIcon />, href: 'https://linkedin.com', color: '#0A66C2' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        mt: 'auto',
        pt: 6,
        pb: 3
      }}
    >
      <Container maxWidth="xl">
        
        {/* Main Footer Content */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ShoppingBagIcon sx={{ fontSize: 40, mr: 2, color: '#008751' }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
                  ShopNaija
                </Typography>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#bdc3c7' }}>
                Your trusted Nigerian e-commerce platform offering authentic products 
                at competitive prices. From electronics to fashion, groceries to home 
                essentials - we've got you covered.
              </Typography>

              {/* Contact Info */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon sx={{ mr: 2, color: '#008751' }} />
                  <Typography variant="body2">support@shopnaija.com</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon sx={{ mr: 2, color: '#008751' }} />
                  <Typography variant="body2">+234 (0) 800 SHOP NAIJA</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ mr: 2, color: '#008751' }} />
                  <Typography variant="body2">Lagos, Nigeria</Typography>
                </Box>
              </Box>

              {/* Social Links */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: social.color,
                        background: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          background: social.color,
                          color: 'white',
                          boxShadow: `0 4px 12px ${social.color}40`
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <Grid item xs={12} sm={6} md={2.67} key={section.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    color: '#008751',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: 40,
                      height: 3,
                      background: '#008751',
                      borderRadius: 2
                    }
                  }}
                >
                  {section.title}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {section.links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      sx={{
                        color: '#bdc3c7',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#008751',
                          textDecoration: 'none',
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #008751 0%, #00a862 100%)',
              borderRadius: 3,
              p: 4,
              mb: 4,
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Stay Updated with ShopNaija
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Subscribe to our newsletter for exclusive deals, new product launches, and special offers!
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              maxWidth: 400, 
              mx: 'auto',
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Box
                component="input"
                placeholder="Enter your email..."
                sx={{
                  flex: 1,
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
              <Box
                component="button"
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  border: 'none',
                  background: 'white',
                  color: '#008751',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }
                }}
              >
                Subscribe
              </Box>
            </Box>
          </Box>
        </motion.div>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}>
            <Typography variant="body2" sx={{ color: '#bdc3c7' }}>
              © {currentYear} ShopNaija. All rights reserved. Made with ❤️ in Nigeria.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link 
                href="/privacy" 
                sx={{ 
                  color: '#bdc3c7', 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#008751' }
                }}
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                sx={{ 
                  color: '#bdc3c7', 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#008751' }
                }}
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies" 
                sx={{ 
                  color: '#bdc3c7', 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#008751' }
                }}
              >
                Cookie Policy
              </Link>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;
