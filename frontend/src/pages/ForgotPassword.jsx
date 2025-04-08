import React from 'react';
import { Container, Box, TextField, Button, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ForgotPassword = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // handle forgot password logic here
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5">Reset Password</Typography>
        <Box component="form" onSubmit={handleSubmit} mt={2}>
          <TextField fullWidth margin="normal" label="Email" variant="outlined" required />
          <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Send Reset Link
          </Button>
          <Box mt={2}>
            <Link component={RouterLink} to="/login">Back to Login</Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
