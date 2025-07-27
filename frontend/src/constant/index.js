// constants/index.js

// Define your configurations for different environments
const configurations = {
    development: {
      // Backend base URL for development (local server)
      BASE_URL: 'http://127.0.0.1:5000/api',
      LOCAL_SERVER: 'http://localhost:3000',
    },
    production: {
      // Backend base URL for production
      BASE_URL: 'https://your-production-url.com/api',
      LOCAL_SERVER: 'https://your-production-url.com',
    },
  };
  
  // Export the configuration based on the current NODE_ENV
  const environment = process.env.NODE_ENV || 'development';
  const config = configurations[environment];

  export default config;
  export { config };
  