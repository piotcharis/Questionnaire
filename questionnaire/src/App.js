import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Main from "./pages/Main";
import Admin from "./pages/Admin";
import Thanks from "./components/Thanks";

const unique_id = Math.random().toString(36);
localStorage.setItem("session_id", unique_id);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/questions/1" />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/questions/:questionId" element={<Main />} />
        <Route path="/thanks" element={<Thanks />} />
      </Routes>
    </Router>
  );
}

export default App;
