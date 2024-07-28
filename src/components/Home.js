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
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      setUserId(user.uid);

      const userDoc = await getDoc(doc(db, 'Users', user.uid));
      const userData = userDoc.data();

      const rentedMoviesList = [];
      const rentedTVShowsList = [];
      const downloadedMoviesList = [];
      const downloadedTVShowsList = [];
      const favoriteMoviesList = [];
      const favoriteTVShowsList = [];

      if (userData.movie_rented) {
        for (const movieId of userData.movie_rented) {
          const movieDoc = await getDoc(doc(db, 'movies', movieId));
          rentedMoviesList.push({ document_id: movieDoc.id, ...movieDoc.data() });
        }
      }

      if (userData.TVshows_rented) {
        for (const tvShowId of userData.TVshows_rented) {
          const tvShowDoc = await getDoc(doc(db, 'tvseries', tvShowId));
          rentedTVShowsList.push({ document_id: tvShowDoc.id, ...tvShowDoc.data() });
        }
      }

      if (userData.movie_downloads) {
        for (const movieId of userData.movie_downloads) {
          const movieDoc = await getDoc(doc(db, 'movies', movieId));
          downloadedMoviesList.push({ document_id: movieDoc.id, ...movieDoc.data() });
        }
      }

      if (userData.TVshows_downloads) {
        for (const tvShowId of userData.TVshows_downloads) {
          const tvShowDoc = await getDoc(doc(db, 'tvseries', tvShowId));
          downloadedTVShowsList.push({ document_id: tvShowDoc.id, ...tvShowDoc.data() });
        }
      }

      if (userData.favorites) {
        for (const favoriteId of userData.favorites) {
          const favoriteDoc = await getDoc(doc(db, 'movies', favoriteId)) || await getDoc(doc(db, 'tvseries', favoriteId));
          if (favoriteDoc.exists()) {
            const data = favoriteDoc.data();
            if (favoriteDoc.ref.path.startsWith('movies')) {
              favoriteMoviesList.push({ document_id: favoriteDoc.id, ...data, type: 'movie' });
            } else {
              favoriteTVShowsList.push({ document_id: favoriteDoc.id, ...data, type: 'tvshow' });
            }
          }
        }
      }
    }
  }
}