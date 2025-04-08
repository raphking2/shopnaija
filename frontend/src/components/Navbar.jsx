import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Navigate, useNavigate } from 'react-router-dom';

import { useCart } from '../context/CartContext.jsx';
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '100%',
  maxWidth: '600px',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
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
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Navbar({ user, setUser,searchQuery,setSearchQuery }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [isSignedIn, setIsSignedIn] = React.useState(false);
//   const [cartCount] = React.useState(0);
    const { cart } = useCart(); // Get cart from context
    const navigate = useNavigate();


  const handleCartClick = () => {
    handleMenuClose();
    navigate('/cart');
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);


  const handleAuthLog =()=>{
    navigate('/auth')

  }
  const handleAuthLogWeb =()=>{
    setIsSignedIn(true);
    navigate('/auth');

  }
  const handleLogout =()=>{
    setUser(null);
    setIsSignedIn(false);
    handleMenuClose();
    navigate('/')
  }


  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
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
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
     {user && <MenuItem onClick={handleLogout}>
        Logout
      </MenuItem>}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="cart" color="inherit" onClick={handleCartClick}>
          <Badge badgeContent={cart.length} color="error" showZero>
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>
      
      {user ? (
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            size="large"
            aria-label="account of current user"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      ) : (
        <MenuItem onClick={() => {
          setIsSignedIn(true);
          handleMobileMenuClose();
        }}>
          <Button color="inherit" fullWidth sx={{ justifyContent: 'flex-start' }} onClick={handleAuthLog}>
            Sign In / Register
          </Button>
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ backgroundColor: '#008751' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, color: 'white' }}
          >
            Shop
          </Typography>

          <Box sx={{ 
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            maxWidth: '600px'
          }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon sx={{ color: 'white' }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Search>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
            <IconButton 
              size="large" 
              aria-label="cart"
              sx={{ color: 'white' }}
              onClick={handleCartClick}
            >
              <Badge badgeContent={cart.length} color="error" showZero>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {user ? (
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                sx={{ color: 'white' }}
              >
                <AccountCircle />
              </IconButton>
            ) : (
              <Button 
                color="inherit"
                onClick={handleAuthLogWeb}
                sx={{ textTransform: 'none' }}
              >
                Sign In / Register
              </Button>
            )}
          </Box>

          <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}