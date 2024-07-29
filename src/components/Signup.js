import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    mobile: '',
    unitNo: '',
    streetName: '',
    city: '',
    province: '',
    postalCode: '',
    planType: 'Basic',
  });
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    console.log('TEST')
    if (location.state && location.state.paymentSuccess) {
        console.log('Inside if block')
      setPaymentSuccess(true);
      handleRegistration(location.state.formData);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@!$%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleRegistration = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'Users', user.uid), {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        mobile: data.mobile,
        address: {
          unitNo: data.unitNo,
          streetName: data.streetName,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode,
        },
        planType: data.planType,
        movie_downloads: [],
        movie_rented: [],
        TVshows_downloads: [],
        TVshows_rented: [],
      });
      alert('User created successfully');
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    console.log('Before all ifs')
    if (!validateEmail(formData.email)) {
      setError('Invalid email format');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long and contain at least one letter and one number. Only special characters allowed : [@$!%*?&] ');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validateMobile(formData.mobile)) {
      setError('Mobile number must be 10 digits');
      return;
    }
    handleRegistration(formData);

    // navigate('/payment-gateway', { state: { formData } });
    navigate('/home', { state: { formData } });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="text-center">Sign Up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {paymentSuccess ? (
          <div className="alert alert-success">Payment Successful! Completing Registration...</div>
        ) : (
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Email</label>
                <input type="email" name="email" onChange={handleChange} value={formData.email} className="form-control" required />
              </div>
              <div className="form-group col-md-6">
                <label>Password</label>
                <input type="password" name="password" onChange={handleChange} value={formData.password} className="form-control" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" onChange={handleChange} value={formData.confirmPassword} className="form-control" required />
              </div>
              <div className="form-group col-md-6">
                <label>First Name</label>
                <input type="text" name="firstName" onChange={handleChange} value={formData.firstName} className="form-control" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Last Name</label>
                <input type="text" name="lastName" onChange={handleChange} value={formData.lastName} className="form-control" required />
              </div>
              <div className="form-group col-md-6">
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth" onChange={handleChange} value={formData.dateOfBirth} className="form-control" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Mobile</label>
                <input type="text" name="mobile" onChange={handleChange} value={formData.mobile} className="form-control" required />
              </div>
              <div className="form-group col-md-6">
                <label>Unit No</label>
                <input type="text" name="unitNo" onChange={handleChange} value={formData.unitNo} className="form-control" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Street Name</label>
                <input type="text" name="streetName" onChange={handleChange} value={formData.streetName} className="form-control" required />
              </div>
              <div className="form-group col-md-6">
                <label>City</label>
                <input type="text" name="city" onChange={handleChange} value={formData.city} className="form-control" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Province</label>
                <input type="text" name="province" onChange={handleChange} value={formData.province} className="form-control" required />
              </div>
              <div className="form-group col-md-6">
                <label>Postal Code</label>
                <input type="text" name="postalCode" onChange={handleChange} value={formData.postalCode} className="form-control" required />
              </div>
            </div>
            <div className="form-group">
              <label>Plan Type</label>
              <select name="planType" onChange={handleChange} value={formData.planType} className="form-control" required>
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Free Trial">Free Trial</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
            <div className="text-center mt-3">
              <p>
                Have an account? <Link to="/">Login</Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;


