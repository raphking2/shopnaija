import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Button, Link, Container, CssBaseline, Grid, Paper, Slide, Fade } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import bgTest from '../assets/bgTest.gif'
import { config } from '../constant/index';
import { showToast } from '../utils/toast'


// Custom theme with Nigerian flag colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#008751', // Nigerian green
    },
    secondary: {
      main: '#FFFFFF', // White
    },
    background: {
      default: 'white', // Fallback color if image doesn't load
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${bgTest})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right',
          backgroundSize: 'auto 500px',
        },
      },
    },
  },
});

// Gradient background for the pages
const GradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #008751 30%, #FFFFFF 50%, #008751 70%)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
}));

// Animated paper component for forms
const AnimatedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

// Signup Component
const Signup = ({ onSwitchToLogin, onSwitchToForgotPassword }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signup Data:', formData);

    try {
      const response = await fetch(`${config.BASE_URL}/signup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      const userData = await response.json();
      if (!response.ok) {
        showToast(userData.msg, "error");
        throw new Error('Login failed');
      }

      
      // Assume the API returns an object with user details.
      // setUser({
      //   accessToken: userData.access_token,
      // });
      showToast("Signup Successful", "success");
      onSwitchToLogin();
    } catch (error) {
      console.error(error);
      // Optionally show an error message to the user.
    }

  };

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <AnimatedPaper elevation={3}>
        <Typography variant="h4" gutterBottom sx={{ color: '#008751' }}>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#008751', '&:hover': { backgroundColor: '#006442' } }}
          >
            Sign Up
          </Button>
        </form>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Link href="#" onClick={onSwitchToLogin} sx={{ color: '#008751' }}>
              Already have an account? Login
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" onClick={onSwitchToForgotPassword} sx={{ color: '#008751' }}>
              Forgot Password?
            </Link>
          </Grid>
        </Grid>
      </AnimatedPaper>
    </Slide>
  );
};

// Login Component
const Login = ({ onSwitchToSignup, onSwitchToForgotPassword, setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login Data:', formData);

    console.log(`${config.BASE_URL}/endpoint`)

    // setTimeout(() => {
    //   setUser({
    //     email: formData.email,
    //     name: 'Test User'
    //   });
    //   navigate('/');
    // }, 1000);
    try {
      const response = await fetch(`${config.BASE_URL}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      const userData = await response.json();
      if (!response.ok) {
        showToast(userData.msg, "error");
        throw new Error('Login failed');
      }

      // Store user data and token
      localStorage.setItem('token', userData.access_token);
      localStorage.setItem('user', JSON.stringify(userData.user));
      
      setUser({
        ...userData.user,
        accessToken: userData.access_token,
      });
      
      showToast("Login Successful", "success");
      
      // Redirect based on user role
      if (userData.user.role === 'admin') {
        navigate('/admin');
      } else if (userData.user.role === 'vendor') {
        navigate('/vendor');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      // Optionally show an error message to the user.
    }
  };

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <AnimatedPaper elevation={3}>
        <Typography variant="h4" gutterBottom sx={{ color: '#008751' }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#008751', '&:hover': { backgroundColor: '#006442' } }}
          >
            Login
          </Button>
        </form>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Link href="#" onClick={onSwitchToSignup} sx={{ color: '#008751' }}>
              Don't have an account? Sign Up
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" onClick={onSwitchToForgotPassword} sx={{ color: '#008751' }}>
              Forgot Password?
            </Link>
          </Grid>
        </Grid>
      </AnimatedPaper>
    </Slide>
  );
};

// Forgot Password Component
const ForgotPassword = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Forgot Password Email:', email);
  };

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <AnimatedPaper elevation={3}>
        <Typography variant="h4" gutterBottom sx={{ color: '#008751' }}>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#008751', '&:hover': { backgroundColor: '#006442' } }}
          >
            Reset Password
          </Button>
        </form>
        <Link href="#" onClick={onSwitchToLogin} sx={{ color: '#008751' }}>
          Back to Login
        </Link>
      </AnimatedPaper>
    </Fade>
  );
};

// Main Auth Component
const Auth = ({ setUser }) => {
  const [activePage, setActivePage] = useState('login');
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <GradientBox>
        <Container maxWidth="sm">
          {activePage === 'signup' && (
            <Signup
              onSwitchToLogin={() => setActivePage('login')}
              onSwitchToForgotPassword={() => setActivePage('forgotPassword')}
            />
          )}
          {activePage === 'login' && (
            <Login
              setUser={setUser}
              onSwitchToLogin={() => setActivePage('login')}
              onSwitchToSignup={() => setActivePage('signup')}
              onSwitchToForgotPassword={() => setActivePage('forgotPassword')}
            />
          )}
          {activePage === 'forgotPassword' && (
            <ForgotPassword onSwitchToLogin={() => setActivePage('login')} />
          )}
          
          {/* Vendor Registration CTA */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              🏪 Want to sell on ShopNaija?
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/vendor-registration')}
              sx={{
                backgroundColor: '#ff6b35',
                color: 'white',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: '#e85a2b',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Become a Vendor Today!
            </Button>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
              Join thousands of Nigerian entrepreneurs
            </Typography>
          </Box>
        </Container>
      </GradientBox>
    </ThemeProvider>
  );
};

export default Auth;