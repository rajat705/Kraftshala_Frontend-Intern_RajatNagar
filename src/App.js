import React, { useState, useEffect } from 'react';
import './App.css';

import ErrorComp from "./comps/ErrorMessage" // Import the ErrorMessage component
import LeftContainer from './comps/LeftContainer'; // Import the LeftContainer component
import RightContainer from './comps/RightContainer'; // Import the RightContainer component

function App() {
  const [weatherData, setWeatherData] = useState(null); // Weather data state
  const [error, setError] = useState(null); // Error state
  const [cityName, setCityName] = useState("Gurugram"); // City name state
  const [showError, setShowError] = useState(false); // Flag to control error display
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Screen width state
  const apiKey = '67a89b344f26062bd0efba5141bebf27'; // Define apiKey here

  useEffect(() => {
    // Function to handle screen resize
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);  // Add event listener for resize
    return () => {
      window.removeEventListener('resize', handleResize);  // Remove event listener on component unmount
    };
  }, []);

  // Function to fetch weather data for a given city
  const fetchWeatherData = async (city) => {
    try {
      setCityName(city);  // Set the city name
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const data = await response.json();  // Convert response to JSON

      if (data.cod === 200) {
        setWeatherData(data);
        setShowError(false)
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError('City not found!');
        setShowError(true)
      }
    } catch (error) {
      setError('Error fetching weather data ...');  // Set error message for any other errors
      setShowError(true)  // Show error message
    }
  };

  useEffect(() => {
    // Function to fetch weather data based on user's geolocation
    const fetchWeatherByGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
              .then((response) => response.json())
              .then((data) => {
                setCityName(data.name);  // Set city name based on geolocation
              })
              .catch((error) => {
                console.error('Error getting location: ' + error.message);
                setCityName("Gurugram");
              });
          },

        );
      } else {
        setCityName("Gurgaon");
      }
    };

    fetchWeatherByGeolocation();  // Call function to fetch weather by geolocation
  }, [apiKey]);

  useEffect(() => {
    fetchWeatherData(cityName);   // Fetch weather data when city name changes
  }, [cityName]);

  
  return (
    <div className="App">
      {weatherData && (
        <div className="container">
          <LeftContainer fetchWeatherData={fetchWeatherData} weatherData={weatherData} screenWidth={screenWidth} />
          <RightContainer fetchWeatherData={fetchWeatherData} weatherData={weatherData} screenWidth={screenWidth} cityName={cityName} />
        </div>
      )}
      {
        showError && (
          <ErrorComp message={error} onClose={() => setShowError(false)} />
        )
      }

      <footer className="footer">
         <p> &copy; 2024 Developed by Rajat Nagar &#10084; </p>
      </footer>
    </div>
    
  );
}

export default App;
