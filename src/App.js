import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import PaymentGateway from './components/PaymentGateway';
import ThankYou from './components/ThankYou';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<PrivateRoute element={Home} />} />
          <Route path="/payment-gateway" element={<PaymentGateway />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
