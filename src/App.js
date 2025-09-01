import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import Mainlayout3 from "./layouts/Mainlayout3"; // Admin layout

// Pages
import Home from "./page/Home";
import Register from "./page/Register";
import Login from "./page/Login";
import GenrePage from "./page/GenrePage";
import MovieDetails from "./page/MovieDetails";
import { WatchlistPage } from "./page/WatchlistPage";
import { WatchlistDetailPage } from "./page/WatchlistDetailsPage";
import { Watched } from "./page/Watched";
import MoviePicker from "./page/MoviePicker";
import Reviews from "./page/Reviews";
import YourReviews from "./page/YourReviews";
import RequestMovie from "./page/RequestMovie";
import EditProfile from "./page/EditProfile";
import NotificationPage from "./page/NotificationPage";
import UserRequests from "./page/UserRequests";
import AddMovie from "./page/AddMovie";
import EditMovie from "./page/EditMovie";
import AllMovies from "./page/Allmovies";

import "./App.css";

// Helper to read cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// LayoutWrapper inside App.js
const LayoutWrapper = () => {
  const role = getCookie("role");
  const Layout = role === "Admin" ? Mainlayout3 : MainLayout;
  return <Layout><Outlet /></Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Shared layout for all main pages */}
        <Route path="/" element={<LayoutWrapper />}>
          <Route index element={<Home />} />
          <Route path="genre/:genreId" element={<GenrePage />} />
          <Route path="movie/:movieId" element={<MovieDetails />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="watchlist/:id" element={<WatchlistDetailPage />} />
          <Route path="watched" element={<Watched />} />
          <Route path="moviepicker" element={<MoviePicker />} />
          <Route path="review" element={<Reviews />} />
          <Route path="your-review" element={<YourReviews />} />
          <Route path="request-movie" element={<RequestMovie />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="userrequests" element={<UserRequests />} />
          <Route path="add-movie" element={<AddMovie />} />
          <Route path="edit-movie/:movieId" element={<EditMovie />} />
          <Route path="all-movies" element={<AllMovies />} />

          
        </Route>

        {/* Auth pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
