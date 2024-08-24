"use client";
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Assuming you have your Firebase setup correctly
import { useRouter } from 'next/navigation';
import { collection, doc, setDoc, deleteDoc, getDoc, onSnapshot, updateDoc,arrayUnion, arrayRemove } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchFavorites(currentUser); // Fetch favorites when the user is authenticated
      } else {
        setUser(null); // Clear user state when logged out
        setFavorites([]); // Clear favorites state when logged out
        router.push('/'); // Redirect to login page if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  const fetchFavorites = async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const favoritesData = userDoc.data().favorites || [];
        setFavorites(favoritesData);
      } else {
        await setDoc(userDocRef, { favorites: [] });
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      if (error.code === 'unavailable') {
        alert('Network connection lost. Please check your internet connection.');
      }
    }
  };
  

  const fetchGifs = async (query) => {
    if (!query) return;

    setLoading(true);
    const apiKey = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65'; // Replace with your actual Giphy API key
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=10&offset=0&rating=g&lang=en`;

    const response = await fetch(url);
    const data = await response.json();
    setGifs(data.data);
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchGifs(value);
  };

  const handleFavorite = async (gif) => {
    const userDocRef = doc(db, 'users', user.uid);

    try {
      const userDoc = await getDoc(userDocRef);
      const currentFavorites = userDoc.data().favorites || [];

      if (currentFavorites.some(fav => fav.id === gif.id)) {
        // Remove GIF from favorites array
        await updateDoc(userDocRef, {
          favorites: arrayRemove(gif) 
        });
      } else {
        // Add GIF to favorites array
        await updateDoc(userDocRef, {
          favorites: arrayUnion(gif) 
        });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <div className="container flex flex-col items-center w-full bg-white">
      <div className='flex justify-between items-center border-black bg-gray-200 text-black h-20 w-full p-4'>
        <form className="flex items-center space-x-4 w-full">
          <input
            type="text"
            placeholder='Search for a GIF'
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded p-2 flex-grow outline-none"
          />
          <button type="button" onClick={toggleShowFavorites} className="bg-blue-500 text-white rounded px-4 py-2">
            My Favourites
          </button>
        </form>
        <button className="ml-4 bg-red-500 text-white rounded px-4 py-2" onClick={handleLogout}>Logout</button>
      </div>
      {loading && (
        <div className="loader"></div> 
      )}
      <div className="grid grid-cols-5 gap-4 mt-4">
        {(showFavorites ? favorites : gifs).map((gif) => (
          <div key={gif.id} className="card flex flex-col justify-between border rounded overflow-hidden shadow-lg">
            <img src={gif.images.fixed_height.url} alt={gif.title} className="rounded" />
            <div className="flex justify-between items-center p-2">
              <span className="text-sm font-medium text-lg">{gif.title || "Untitled"}</span>
              <button onClick={() => handleFavorite(gif)} className="text-yellow-500 text-xl">
                {favorites.some(fav => fav.id === gif.id) ? '★' : '☆'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
