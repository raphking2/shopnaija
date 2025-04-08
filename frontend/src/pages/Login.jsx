import React from 'react';
import { Container, Box, TextField, Button, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // handle login logic here
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5">Login</Typography>
        <Box component="form" onSubmit={handleSubmit} mt={2}>
          <TextField fullWidth margin="normal" label="Email" variant="outlined" required />
          <TextField fullWidth margin="normal" label="Password" type="password" variant="outlined" required />
          <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Login
          </Button>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Link component={RouterLink} to="/signup">Sign Up</Link>
            <Link component={RouterLink} to="/forgot-password">Forgot Password?</Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
