import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge, 
  Button, 
  Box, 
  InputBase,
  Menu,
  MenuItem,
  useMediaQuery,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 25,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  '&:focus-within': {
    backgroundColor: alpha(theme.palette.common.white, 0.3),
    boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.3)',
  },
  marginLeft: 0,
  width: '100%',
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
    minWidth: '300px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255, 255, 255, 0.8)',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1.5, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '0.95rem',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.7)',
      opacity: 1,
    },
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #008751 0%, #00a862 50%, #00c774 100%)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 135, 81, 0.3)',
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const Navbar = ({ user, setUser, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const isMobile = useMediaQuery('(max-width:960px)');
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate('/auth');
    handleMenuClose();
    setMobileDrawerOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token'); // Clear any stored tokens
    handleMenuClose();
    setMobileDrawerOpen(false);
    navigate('/');
  };

  const handleCartClick = () => {
    navigate('/cart');
    setMobileDrawerOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setMobileDrawerOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const ProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.1))',
          mt: 1.5,
          borderRadius: 2,
          minWidth: 200,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
        <PersonIcon sx={{ mr: 2, color: '#008751' }} />
        My Profile
      </MenuItem>
      <MenuItem onClick={handleCartClick} sx={{ py: 1.5 }}>
        <ShoppingBagIcon sx={{ mr: 2, color: '#008751' }} />
        My Orders
      </MenuItem>
      
      {/* Admin Dashboard Link */}
      {user?.role === 'admin' && (
        <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }} sx={{ py: 1.5 }}>
          <AccountCircleIcon sx={{ mr: 2, color: '#ff6b35' }} />
          Admin Dashboard
        </MenuItem>
      )}
      
      {/* Vendor Dashboard Link */}
      {user?.role === 'vendor' && (
        <MenuItem onClick={() => { navigate('/vendor'); handleMenuClose(); }} sx={{ py: 1.5 }}>
          <ShoppingBagIcon sx={{ mr: 2, color: '#2196f3' }} />
          Vendor Dashboard
        </MenuItem>
      )}
      
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#e74c3c' }}>
        <LogoutIcon sx={{ mr: 2 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  const MobileDrawer = (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: 280,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <LogoBox onClick={handleHomeClick}>
            <ShoppingBagIcon sx={{ fontSize: 32, color: '#008751' }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#008751' }}>
              ShopNaija
            </Typography>
          </LogoBox>
          <IconButton onClick={() => setMobileDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <List>
          <ListItem button onClick={handleHomeClick}>
            <ListItemIcon>
              <HomeIcon sx={{ color: '#008751' }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          
          <ListItem button onClick={handleCartClick}>
            <ListItemIcon>
              <Badge badgeContent={cart.length} color="error">
                <ShoppingCartIcon sx={{ color: '#008751' }} />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Shopping Cart" />
          </ListItem>
          
          <Divider sx={{ my: 1 }} />
          
          {user ? (
            <>
              <ListItem button>
                <ListItemIcon>
                  <PersonIcon sx={{ color: '#008751' }} />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon sx={{ color: '#e74c3c' }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <ListItem button onClick={handleLogin}>
              <ListItemIcon>
                <LoginIcon sx={{ color: '#008751' }} />
              </ListItemIcon>
              <ListItemText primary="Sign In / Register" />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <StyledAppBar position="fixed" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
            
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setMobileDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <LogoBox onClick={handleHomeClick}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <ShoppingBagIcon sx={{ 
                  fontSize: { xs: 28, md: 32 }, 
                  color: 'white',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }} />
              </motion.div>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800,
                  color: 'white',
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                ShopNaija
              </Typography>
            </LogoBox>

            {/* Search Bar - Desktop */}
            {!isMobile && (
              <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                justifyContent: 'center',
                mx: 4 
              }}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search for products, categories..."
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </Search>
              </Box>
            )}

            {/* Desktop Actions */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                
                {/* Cart Button */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <IconButton
                    color="inherit"
                    onClick={handleCartClick}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Badge 
                      badgeContent={cart.length} 
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                          color: 'white',
                          fontWeight: 700,
                          boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
                        }
                      }}
                    >
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </motion.div>

                {/* User Actions */}
                {user ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <IconButton
                      color="inherit"
                      onClick={handleProfileMenuOpen}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <AccountCircleIcon />
                    </IconButton>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      color="inherit"
                      onClick={handleLogin}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '25px',
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                )}
              </Box>
            )}

            {/* Mobile Cart Icon */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={handleCartClick}
                sx={{ ml: 'auto' }}
              >
                <Badge badgeContent={cart.length} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
          </Toolbar>

          {/* Mobile Search Bar */}
          {isMobile && (
            <Box sx={{ px: 2, pb: 2 }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search products..."
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </Search>
            </Box>
          )}
        </Container>
      </StyledAppBar>

      {/* Menus */}
      {ProfileMenu}
      {MobileDrawer}
    </>
  );
};

export default Navbar;