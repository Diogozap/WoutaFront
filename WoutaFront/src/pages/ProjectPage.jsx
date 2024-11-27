import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProjectPage.css";
import { apiProjetos } from "../api/Api";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectUsers, setNewProjectUsers] = useState("");
  const [newProjectPrazo, setNewProjectPrazo] = useState("");
  const [newProjectStatus, setNewProjectStatus] = useState("");
  const projectNameMaxLength = 30;
  const projectDescriptionMaxLength = 100;

  // Função para gerar uma cor aleatória
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Função para buscar projetos do backend
  const fetchProjects = async () => {
    const token = localStorage.getItem('token'); // Obtém o token armazenado no localStorage
    if (!token) {
      alert("Você precisa estar autenticado para acessar os projetos.");
      return;
    }

    try {
      const response = await apiProjetos.getProjetos();
      setProjects(response.data);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      if (error.response && error.response.status === 401) {
        alert("Sessão expirada. Por favor, faça login novamente.");
      } else {
        alert("Erro ao buscar projetos.");
      }
    }
  };

  // Função para adicionar um novo projeto
  const addProject = async () => {
    if (!newProjectName || !newProjectDescription) {
      alert("Nome e descrição do projeto são obrigatórios.");
      return;
    }

    if (newProjectName.length > projectNameMaxLength) {
      alert(`O nome do projeto não pode ter mais de ${projectNameMaxLength} caracteres.`);
      return;
    }

    if (newProjectDescription.length > projectDescriptionMaxLength) {
      alert(`A descrição do projeto não pode ter mais de ${projectDescriptionMaxLength} caracteres.`);
      return;
    }

    // Validação de formato de data (exemplo básico)
    const isValidDate = (date) => {
      return /\d{4}-\d{2}-\d{2}/.test(date); // Formato YYYY-MM-DD
    };

    if (newProjectPrazo && !isValidDate(newProjectPrazo)) {
      alert("Formato de data inválido. Use o formato YYYY-MM-DD.");
      return;
    }

    const newProject = {
      titulo: newProjectName,
      description: newProjectDescription,
      usuarios: newProjectUsers.split(',').map(user => user.trim()), // Divide usuários em um array de IDs
      prazo: newProjectPrazo,
      status: newProjectStatus,
      color: getRandomColor(), // Atribui uma cor aleatória ao projeto
    };

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Você precisa estar autenticado para criar um projeto.");
      return;
    }

    try {
      const response = await axios.post(
        "https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/projetos/",
        newProject,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      setProjects([...projects, response.data]); // Adiciona o novo projeto à lista de projetos
      setNewProjectName(""); // Limpa o campo de nome
      setNewProjectDescription(""); // Limpa o campo de descrição
      setNewProjectUsers(""); // Limpa o campo de usuários
      setNewProjectPrazo(""); // Limpa o campo de prazo
      setNewProjectStatus(""); // Limpa o campo de status
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      alert("Erro ao criar o projeto.");
    }
  };

  // Função para excluir um projeto
  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este projeto?");
    if (confirmDelete) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Você precisa estar autenticado para excluir um projeto.");
        return;
      }

      try {
        await axios.delete(
          `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/projetos/${projectId}/`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        setProjects(projects.filter((project) => project.id !== projectId)); // Remove o projeto excluído
      } catch (error) {
        console.error("Erro ao excluir o projeto:", error);
        alert("Erro ao excluir o projeto.");
      }
    }
  };

  // UseEffect para buscar os projetos ao carregar a página
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="projects-container">
      <h1>Projetos</h1>

      <div className="add-project-form">
        <input
          type="text"
          placeholder="Nome do Projeto"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descrição do Projeto"
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Usuários (IDs separados por vírgula)"
          value={newProjectUsers}
          onChange={(e) => setNewProjectUsers(e.target.value)}
        />
        <input
          type="date"
          placeholder="Prazo (YYYY-MM-DD)"
          value={newProjectPrazo}
          onChange={(e) => setNewProjectPrazo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Status (opcional)"
          value={newProjectStatus}
          onChange={(e) => setNewProjectStatus(e.target.value)}
        />
        <button onClick={addProject}>Adicionar Novo Projeto</button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum projeto encontrado. Adicione um novo projeto acima.</p>
        </div>
      ) : (
        <div className="projects-list">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              style={{ backgroundColor: project.color }} // Exibe a cor aleatória
            >
              <h3>{project.titulo}</h3> {/* Exibe o título */}
              <p>{project.description}</p> {/* Exibe a descrição */}
              <p>Status: {project.status}</p> {/* Exibe o status */}
              <button onClick={() => deleteProject(project.id)}>Excluir</button> {/* Exclui o projeto */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
