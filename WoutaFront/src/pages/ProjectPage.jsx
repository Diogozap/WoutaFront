import React, { useState, useEffect } from "react";
import axios from "axios";  // Importando axios
import { Link } from "react-router-dom";
import "./ProjectPage.css";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:8000/restrito/projeto");
        setProjects(response.data);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="project-page-container">
      <h1>Lista de Projetos</h1>
      {loading ? (
        <p>Carregando projetos...</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.uuid}>
              <Link to={`/projeto/${project.uuid}`}>{project.titulo}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectPage;
