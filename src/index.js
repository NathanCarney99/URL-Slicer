import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "url-shortener-12a39.firebaseapp.com",
  projectId: "url-shortener-12a39",
  storageBucket: "url-shortener-12a39.appspot.com",
  messagingSenderId: "820970910300",
  appId: "1:820970910300:web:f4f7f9d7913e706da5ec99",
  measurementId: "G-424MLDERH4"
};

initializeApp(firebaseConfig);

const root = createRoot(document.getElementById('root'));

root.render(   
   <App />


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
