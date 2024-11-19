import React, { useState } from "react";
import "./TeamsPage.css";

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [hoveredMember, setHoveredMember] = useState(null); // Estado para controlar o hover do membro
  const [hoveredTeam, setHoveredTeam] = useState(null); // Estado para controlar o hover do card da equipe

  // Limite de caracteres
  const teamNameMaxLength = 30;
  const memberNameMaxLength = 15;

  // Função para gerar uma cor aleatória
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Função para adicionar uma nova equipe
  const addTeam = () => {
    let teamName = prompt("Digite o nome da nova equipe:");
    if (teamName) {
      if (teamName.trim() === "") {
        alert("O nome da equipe não pode ser vazio.");
        return;
      }

      if (teamName.length > teamNameMaxLength) {
        alert(`O nome da equipe não pode ter mais de ${teamNameMaxLength} caracteres.`);
        return;
      }

      const teamExists = teams.some(
        (team) => team.name.toLowerCase() === teamName.toLowerCase()
      );
      if (teamExists) {
        alert("Já existe uma equipe com esse nome.");
        return;
      }

      const newTeam = {
        id: Date.now(),
        name: teamName,
        color: getRandomColor(),
        members: [],
      };

      setTeams([...teams, newTeam]);
    }
  };

  // Função para adicionar um novo integrante à equipe
  const addMember = (teamId) => {
    let memberName = prompt("Digite o nome do novo integrante:");
    if (memberName) {
      if (memberName.trim() === "") {
        alert("O nome do integrante não pode ser vazio.");
        return;
      }

      if (memberName.length > memberNameMaxLength) {
        alert(`O nome do integrante não pode ter mais de ${memberNameMaxLength} caracteres.`);
        return;
      }

      const memberNameLower = memberName.toLowerCase();

      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === teamId
            ? {
                ...team,
                members: team.members.some(
                  (member) => member.toLowerCase() === memberNameLower
                )
                  ? (alert("Este integrante já está na equipe."), team.members)
                  : [...team.members, memberName],
              }
            : team
        )
      );
    }
  };

  // Função para excluir um membro da equipe
  const deleteMember = (teamId, memberName) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o membro "${memberName}"?`
    );
    if (confirmDelete) {
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === teamId
            ? {
                ...team,
                members: team.members.filter(
                  (member) => member !== memberName
                ),
              }
            : team
        )
      );
    }
  };

  // Função para editar o nome de um integrante
  const editMember = (teamId, oldMemberName) => {
    const newMemberName = prompt("Digite o novo nome para o integrante:");
    if (newMemberName) {
      if (newMemberName.trim() === "") {
        alert("O nome do integrante não pode ser vazio.");
        return;
      }

      if (newMemberName === oldMemberName) {
        alert("O nome inserido é o mesmo do integrante.");
        return;
      }

      const confirmEdit = window.confirm(
        `Tem certeza que deseja alterar o nome de "${oldMemberName}" para "${newMemberName}"?`
      );
      if (confirmEdit) {
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  members: team.members.map((member) =>
                    member === oldMemberName ? newMemberName : member
                  ),
                }
              : team
          )
        );
      }
    }
  };

  // Função para excluir uma equipe com confirmação
  const deleteTeam = (id) => {
    const teamToDelete = teams.find((team) => team.id === id);
    if (teamToDelete) {
      const confirmDelete = window.confirm(
        `Tem certeza que deseja excluir a equipe "${teamToDelete.name}"?`
      );
      if (confirmDelete) {
        setTeams(teams.filter((team) => team.id !== id));
      }
    }
  };

  return (
    <div className="teams-container">
      <h1>Equipes</h1>
      {teams.length === 0 ? (
        <div className="empty-state" onClick={addTeam}>
          <div className="add-circle">+</div>
          <p>Criar nova equipe</p>
        </div>
      ) : (
        <div className="teams-list">
          {teams.map((team) => (
            <div
              key={team.id}
              className="team-card"
              style={{ backgroundColor: team.color }}
              onMouseEnter={() => setHoveredTeam(team.id)}
              onMouseLeave={() => setHoveredTeam(null)}
            >
              <h3>{team.name}</h3>
              <p>{team.members.length} Membros</p>

              {/* Mostrar integrantes da equipe */}
              <div className="members-list">
                {team.members.map((member, index) => (
                  <div
                    key={index}
                    className="member-container"
                    onMouseEnter={() => setHoveredMember(member)} // Ao passar o mouse
                    onMouseLeave={() => setHoveredMember(null)} // Ao sair com o mouse
                  >
                    <span className="member-tag">
                      {hoveredMember === member ? (
                        <>
                          <span
                            className="icon edit"
                            onClick={() => editMember(team.id, member)}
                          >
                            ✏️
                          </span>
                          <span
                            className="icon delete"
                            onClick={() => deleteMember(team.id, member)}
                          >
                            ❌
                          </span>
                        </>
                      ) : (
                        member
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Botão para adicionar integrante */}
              <button
                className="add-member-btn"
                onClick={() => addMember(team.id)}
              >
                Adicionar Integrante
              </button>

              {/* Botão para excluir a equipe */}
              <button
                className="delete-button"
                onClick={() => deleteTeam(team.id)}
              >
                Excluir Equipe
              </button>
            </div>
          ))}
          <div className="add-team" onClick={addTeam}>
            <span>+ Nova Equipe</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
