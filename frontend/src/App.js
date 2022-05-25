import React, { Component } from "react";
import "./App.css";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <React.Fragment>
            <MainNavigation />
            <Routes>
              <Route path="/" element={<Navigate to="/auth" replace />} exact />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
            </Routes>
          </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
