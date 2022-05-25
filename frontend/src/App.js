import React, { Component } from "react";
import "./App.css";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";

import AuthPage from "./Auth";
import BookingsPage from "./Bookings";
import EventsPage from "./Events";

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} exact />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
