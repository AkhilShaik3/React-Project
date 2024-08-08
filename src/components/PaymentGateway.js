import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Payment.css';

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rentItem, downloadItem, userId, formData, activeTab } = location.state;

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateCardNumber = (number) => /^[0-9]{16}$/.test(number);
  const validateExpiryDate = (date) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(date); // MM/YY format
  const validateCvv = (cvv) => /^[0-9]{3}$/.test(cvv);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateCardNumber(cardNumber)) {
      setError('Invalid card number. It should be a 16-digit number.');
      setLoading(false);
      return;
    }

    if (!validateExpiryDate(expiryDate)) {
      setError('Invalid expiry date. It should be in MM/YY format.');
      setLoading(false);
      return;
    }

    if (!validateCvv(cvv)) {
      setError('Invalid CVV. It should be a 3-digit number.');
      setLoading(false);
      return;
    }

    try {
      // Mock payment processing
      setTimeout(async () => {
        if (rentItem) {
          const userRef = doc(db, 'Users', userId);
          const field = activeTab === 'Movies' ? 'movie_rented' : 'TVshows_rented';
          await updateDoc(userRef, {
            [field]: arrayUnion(rentItem.document_id)
          });
          alert('Payment Successful!');
          navigate('/thank-you');
        } else if (downloadItem) {
          const userRef = doc(db, 'Users', userId);
          const field = activeTab === 'Movies' ? 'movie_downloads' : 'TVshows_downloads';
          await updateDoc(userRef, {
            [field]: arrayUnion(downloadItem.document_id)
          });
          alert('Payment Successful!');
          navigate('/thank-you');
        } else if (formData) {
          alert('Payment Successful!');
          navigate('/signup', { state: { formData, paymentSuccess: true } });
        }
      }, 500);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Payment Details</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Expiry Date (MM/YY)</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentGateway;
