// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CopilotWidget from './components/CopilotWidget';

function App() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <CartProvider >
    <Router>
    <ToastContainer />
    <CopilotWidget/>
      <CssBaseline  />
      <Navbar user={user} setUser={setUser} searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}/>
      <Routes>
        
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        {/* <Route path="/Auth" element={<Auth/>}/> */}
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/" /> : <Auth setUser={setUser} />} 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;
