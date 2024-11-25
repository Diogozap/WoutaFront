import React, { useState } from "react";
import "./ProjectPage.css";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [hoveredMember, setHoveredMember] = useState(null);
  const [hoveredTask, setHoveredTask] = useState(null);

  const projectNameMaxLength = 30;
  const memberNameMaxLength = 15;
  const taskNameMaxLength = 50;

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const addProject = () => {
    const projectName = prompt("Digite o nome do novo projeto:");
    const projectDescription = prompt("Digite a descrição do projeto:");

    if (!projectName || projectName.trim() === "" || !projectDescription) {
      alert("Nome e descrição do projeto não podem ser vazios.");
      return;
    }

    if (projectName.length > projectNameMaxLength) {
      alert(`O nome do projeto não pode ter mais de ${projectNameMaxLength} caracteres.`);
      return;
    }

    const projectExists = projects.some(
      (project) => project.name.toLowerCase() === projectName.toLowerCase()
    );

    if (projectExists) {
      alert("Já existe um projeto com esse nome.");
      return;
    }

    const newProject = {
      id: Date.now(),
      name: projectName,
      description: projectDescription,
      color: getRandomColor(),
      members: [],
      tasks: [],
    };

    setProjects([...projects, newProject]);
  };

  const addMember = (projectId) => {
    const memberName = prompt("Digite o nome do novo integrante:");
    if (!memberName || memberName.trim() === "") {
      alert("O nome do integrante não pode ser vazio.");
      return;
    }

    if (memberName.length > memberNameMaxLength) {
      alert(`O nome do integrante não pode ter mais de ${memberNameMaxLength} caracteres.`);
      return;
    }

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              members: project.members.includes(memberName)
                ? (alert("Este integrante já está no projeto."), project.members)
                : [...project.members, memberName],
            }
          : project
      )
    );
  };

  const addTask = (projectId) => {
    const taskName = prompt("Digite o nome da nova tarefa:");
    if (!taskName || taskName.trim() === "") {
      alert("O nome da tarefa não pode ser vazio.");
      return;
    }

    if (taskName.length > taskNameMaxLength) {
      alert(`O nome da tarefa não pode ter mais de ${taskNameMaxLength} caracteres.`);
      return;
    }

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.includes(taskName)
                ? (alert("Essa tarefa já existe no projeto."), project.tasks)
                : [...project.tasks, taskName],
            }
          : project
      )
    );
  };

  const deleteProject = (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este projeto?");
    if (confirmDelete) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  const deleteMember = (projectId, memberName) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, members: project.members.filter((member) => member !== memberName) }
          : project
      )
    );
  };

  const deleteTask = (projectId, taskName) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, tasks: project.tasks.filter((task) => task !== taskName) }
          : project
      )
    );
  };

  return (
    <div className="projects-container">
      <h1>Projetos</h1>
      {projects.length === 0 ? (
        <div className="empty-state" onClick={addProject}>
          <div className="add-circle">+</div>
          <p>Criar novo projeto</p>
        </div>
      ) : (
        <div className="projects-list">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              style={{ backgroundColor: project.color }}
            >
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="members-list">
                {project.members.map((member, index) => (
                  <span
                    key={index}
                    onMouseEnter={() => setHoveredMember(member)}
                    onMouseLeave={() => setHoveredMember(null)}
                  >
                    {hoveredMember === member ? (
                      <span
                        onClick={() => deleteMember(project.id, member)}
                        className="delete-icon"
                      >
                        ❌
                      </span>
                    ) : (
                      member
                    )}
                  </span>
                ))}
              </div>
              <button onClick={() => addMember(project.id)}>Adicionar Integrante</button>
              <div className="tasks-list">
                {project.tasks.map((task, index) => (
                  <span
                    key={index}
                    onMouseEnter={() => setHoveredTask(task)}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    {hoveredTask === task ? (
                      <span
                        onClick={() => deleteTask(project.id, task)}
                        className="delete-icon"
                      >
                        ❌
                      </span>
                    ) : (
                      task
                    )}
                  </span>
                ))}
              </div>
              <button onClick={() => addTask(project.id)}>Adicionar Tarefa</button>
              <button onClick={() => deleteProject(project.id)}>Excluir Projeto</button>
            </div>
          ))}
          <div className="add-project" onClick={addProject}>
            <span>+ Novo Projeto</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
