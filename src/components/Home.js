import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
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

      const moviesSnapshot = await getDocs(collection(db, 'movies'));
      const tvShowsSnapshot = await getDocs(collection(db, 'tvseries'));

      const moviesList = moviesSnapshot.docs.map(doc => ({ document_id: doc.id, ...doc.data() }));
      const tvShowsList = tvShowsSnapshot.docs.map(doc => ({ document_id: doc.id, ...doc.data() }));

      setMovies(moviesList);
      setTvShows(tvShowsList);
      setFilteredContent(moviesList);
      setRentedMovies(rentedMoviesList);
      setRentedTVShows(rentedTVShowsList);
      setDownloadedMovies(downloadedMoviesList);
      setDownloadedTVShows(downloadedTVShowsList);
      setFavoriteMovies(favoriteMoviesList);
      setFavoriteTVShows(favoriteTVShowsList);
    };

    fetchData();
  }, []);

  useEffect(() => {
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const contentToFilter = activeTab === 'Movies' ? (activeMenu === 'Rent' ? rentedMovies : (activeMenu === 'Downloads' ? downloadedMovies : (activeMenu === 'Favorites' ? favoriteMovies : movies))) : (activeMenu === 'Rent' ? rentedTVShows : (activeMenu === 'Downloads' ? downloadedTVShows : (activeMenu === 'Favorites' ? favoriteTVShows : tvShows)));
    const filtered = contentToFilter.filter(content => content.name.toLowerCase().includes(lowerCaseQuery));
    setFilteredContent(filtered);
  }, [searchQuery, activeTab, activeMenu, movies, tvShows, rentedMovies, rentedTVShows, downloadedMovies, downloadedTVShows, favoriteMovies, favoriteTVShows]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'Movies') {
      setFilteredContent(activeMenu === 'Rent' ? rentedMovies : (activeMenu === 'Downloads' ? downloadedMovies : (activeMenu === 'Favorites' ? favoriteMovies : movies)));
    } else {
      setFilteredContent(activeMenu === 'Rent' ? rentedTVShows : (activeMenu === 'Downloads' ? downloadedTVShows : (activeMenu === 'Favorites' ? favoriteTVShows : tvShows)));
    }
  };

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);
    setActiveSubMenu('');
    if (menu === 'Home') {
      setFilteredContent(activeTab === 'Movies' ? movies : tvShows);
    } else if (menu === 'Rent') {
      setFilteredContent(activeTab === 'Movies' ? rentedMovies : rentedTVShows);
    } else if (menu === 'Downloads') {
      setFilteredContent(activeTab === 'Movies' ? downloadedMovies : downloadedTVShows);
    } else if (menu === 'Favorites') {
      setFilteredContent(activeTab === 'Movies' ? favoriteMovies : favoriteTVShows);
    }
  };

  const handleSubMenuChange = (subMenu) => {
    setActiveSubMenu(subMenu);
    if (activeTab === 'Movies') {
      setFilteredContent(movies.filter(movie => movie.genre === subMenu));
    } else {
      setFilteredContent(tvShows.filter(tvShow => tvShow.genre === subMenu));
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleRent = (item) => {
    navigate('/payment-gateway', { state: { rentItem: item, userId, activeTab } });
  };

  const handleDownload = (item) => {
    navigate('/payment-gateway', { state: { downloadItem: item, userId, activeTab } });
  };

  const handleFavorite = async (item) => {
    const userRef = doc(db, 'Users', userId);
    const itemRef = doc(db, item.type === 'movie' ? 'movies' : 'tvseries', item.document_id);
    const isFavorite = favoriteMovies.some(fav => fav.document_id === item.document_id) || favoriteTVShows.some(fav => fav.document_id === item.document_id);

    if (isFavorite) {
      // Remove from favorites
      await updateDoc(userRef, {
        favorites: arrayRemove(item.document_id)
      });
      setFavoriteMovies(favoriteMovies.filter(fav => fav.document_id !== item.document_id));
      setFavoriteTVShows(favoriteTVShows.filter(fav => fav.document_id !== item.document_id));
    } else {
      // Add to favorites
      await updateDoc(userRef, {
        favorites: arrayUnion(item.document_id)
      });
      alert('Great choice! Your favorites list is updated.');
      if (item.type === 'movie') {
        setFavoriteMovies([...favoriteMovies, item]);
      } else {
        setFavoriteTVShows([...favoriteTVShows, item]);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">AB Movies</div>
        <div className="tabs">
          <button
            className={activeTab === 'Movies' ? 'active' : ''}
            onClick={() => handleTabChange('Movies')}
          >
            Movies
          </button>
          <button
            className={activeTab === 'TVShows' ? 'active' : ''}
            onClick={() => handleTabChange('TVShows')}
          >
            TV Shows
          </button>
        </div>
        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className="sign-out" onClick={handleSignOut}>
          Sign Out
        </button>
      </header>
      <main className="home-body">
        <aside className="menu-bar">
          <button
            className={activeMenu === 'Home' ? 'active' : ''}
            onClick={() => handleMenuChange('Home')}
          >
            Home
          </button>
          {activeMenu === 'Home' && (
            <div className="sub-menu">
              <button
                className={activeSubMenu === 'Action/Adventure' ? 'active' : ''}
                onClick={() => handleSubMenuChange('Action/Adventure')}
              >
                Action
              </button>
              <button
                className={activeSubMenu === 'Comedy' ? 'active' : ''}
                onClick={() => handleSubMenuChange('Comedy')}
              >
                Comedy
              </button>
              <button
                className={activeSubMenu === 'Fantasy' ? 'active' : ''}
                onClick={() => handleSubMenuChange('Fantasy')}
              >
                Fantasy
              </button>
              <button
                className={activeSubMenu === 'Thriller' ? 'active' : ''}
                onClick={() => handleSubMenuChange('Thriller')}
              >
                Thriller
              </button>
              <button
                className={activeSubMenu === 'Horror' ? 'active' : ''}
                onClick={() => handleSubMenuChange('Horror')}
              >
                Horror
              </button>
            </div>
          )}
          <button
            className={activeMenu === 'Rent' ? 'active' : ''}
            onClick={() => handleMenuChange('Rent')}
          >
            Rent
          </button>
          <button
            className={activeMenu === 'Downloads' ? 'active' : ''}
            onClick={() => handleMenuChange('Downloads')}
          >
            Downloads
          </button>
          <button
            className={activeMenu === 'Favorites' ? 'active' : ''}
            onClick={() => handleMenuChange('Favorites')}
          >
            Favorites
          </button>
        </aside>
        <section className="content-list">
          {filteredContent.length ? (
            filteredContent.map(content => (
              <div className="content-card" key={content.document_id}>
                <img src={content.image} alt={content.name} className="content-image" />
                <div className="content-info">
                  <h3>{content.name}</h3>
                  <p>{content.genre}</p>
                  <p>Cast & Crew: {content.Cast}</p>
                  <div className="actions">
                    {(activeMenu === 'Favorites' || activeMenu === 'Rent' || activeMenu === 'Downloads') && (
                      <>
                        <button className="rent-button">
                          Watch Now!
                        </button>
                      </>
                    )}
                    {(activeMenu !== 'Favorites' && activeMenu !== 'Rent' && activeMenu !== 'Downloads') && (
                      <>
                        <button className="rent-button" onClick={() => handleRent(content)}>
                          Rent : ${content.rent_price}
                        </button>
                        <button className="download-button" onClick={() => handleDownload(content)}>
                          Download : ${content.download_price}
                        </button>
                      </>
                    )}
                    <button
                      className="favorite-button"
                      onClick={() => handleFavorite(content)}
                    >
                      {favoriteMovies.some(fav => fav.document_id === content.document_id) || favoriteTVShows.some(fav => fav.document_id === content.document_id)
                        ? <FaHeart color="red" />
                        : <FaRegHeart />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No content available</p>
          )}
        </section>
      </main>
      <footer className="footer">
        <p>Terms & Conditions | Privacy Policy | Contact Us</p>
      </footer>
    </div>
  );
};

export default Home;
