import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rentItem, downloadItem, userId, formData, activeTab } = location.state;

  useEffect(() => {
    const processPayment = async () => {
        console.log('Inside Payment gateway')
      if (rentItem) {
        console.log('Inside Payment Gateway : ',rentItem)
        // Add rented item to user account
        const userRef = doc(db, 'Users', userId);
        const field = activeTab === 'Movies' ? 'movie_rented' : 'TVshows_rented';
        await updateDoc(userRef, {
          [field]: arrayUnion(rentItem.document_id)
        });
        navigate('/home');
      } else if (downloadItem) {
        // Add downloaded item to user account
        const userRef = doc(db, 'Users', userId);
        const field = activeTab === 'Movies' ? 'movie_downloads' : 'TVshows_downloads';
        await updateDoc(userRef, {
          [field]: arrayUnion(downloadItem.document_id)
        });
        navigate('/home');
      } else if (formData) {
        setTimeout(() => {
                  navigate('/signup', { state: { formData, paymentSuccess: true } });
                }, 2000);
      }
    };

    processPayment();
  }, [navigate, formData, rentItem, downloadItem, userId]);

  return (
    <div>
      <h1>Processing Payment...</h1>
    </div>
  );
};

export default PaymentGateway;
