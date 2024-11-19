import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import ProjectPage from "./pages/ProjectPage";
import TeamsPage from "./pages/TeamsPage"; // Importe a página de Equipes

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/projetos" element={<ProjectPage />} />
        <Route path="/equipes" element={<TeamsPage />} /> {/* Nova rota para Equipes */}
      </Routes>
    </Router>
  );
};

export default App;
