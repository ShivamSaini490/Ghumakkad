// src/pages/home/Home.jsx
import React from "react";
import "./Home.css";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <main className="home-container">
        <h1>Welcome to Our Platform</h1>
        <p>Please login or signup to continue.</p>
      </main>
      <Footer />
    </>
  );
};

export default Home;
