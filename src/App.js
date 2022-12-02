import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameContainer from './components/gameContainer.jsx';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdpRGo1Y-UZU9Ffw8100prFGrNg-iWbD4",
  authDomain: "duplicate-game.firebaseapp.com",
  databaseURL: "http://127.0.0.1:9000/?ns=duplicate-game",// "https://duplicate-game.firebaseio.com",
  projectId: "duplicate-game",
  storageBucket: "duplicate-game.appspot.com",
  messagingSenderId: "869241889874",
  appId: "1:869241889874:web:b5d5f440cf6fefc8dc2b8b",
  measurementId: "G-9JCHEF12GC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getDatabase(app);
getAnalytics(app);

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <p>
            Duplicate
          </p>
        </header>
        <Routes>
          <Route path="/" element={<GameContainer multiplayer={false} />} />
          <Route path='/game/:id/:name' element={<GameContainer multiplayer={true} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
