import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [rentedMovies, setRentedMovies] = useState([]);
  const [rentedTVShows, setRentedTVShows] = useState([]);
  const [downloadedMovies, setDownloadedMovies] = useState([]);
  const [downloadedTVShows, setDownloadedTVShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteTVShows, setFavoriteTVShows] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [activeTab, setActiveTab] = useState('Movies');
  const [activeMenu, setActiveMenu] = useState('Home');
  const [activeSubMenu, setActiveSubMenu] = useState('');
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const navigate = useNavigate();
}