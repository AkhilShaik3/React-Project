import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';
import Home from './components/Home';
import Signup from './components/Signup';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<PrivateRoute element={Home} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
