import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ThankYou.css'; // Assuming you create a CSS file for styles

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 5000); // Redirects after 5 seconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [navigate]);

  return (
    <div className="thank-you-container">
      <div className="thank-you-message">
        <h1>Thank You!</h1>
        <p>We hope you enjoyed the movie. Redirecting you back to the home page...</p>
      </div>
    </div>
  );
};

export default ThankYou;
