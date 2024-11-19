import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");  // Mensagem de erro
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");  // Limpar qualquer erro anterior

    // Validação dos campos
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    const data = { username, email, password };  

    setLoading(true);

    try {
      const response = await axios.post(
        "https://sistemadegerenciamentodeprojetosback.onrender.com/auth/novo/", // URL da sua API Django
        data,
        {
          headers: {
            "Content-Type": "application/json",  // Garantindo que o corpo da requisição seja em JSON
          },
        }
      );

      if (response.status === 201) {  // Sucesso no cadastro (HTTP 201)
        navigate("/login");  // Redireciona para a página de login após o cadastro
      }
    } catch (err) {
      if (err.response) {
        // Se a resposta do servidor foi recebida (erro 4xx ou 5xx)
        const errorMessage = err.response.data.detail || "Erro ao registrar.";

        // Checando se o erro está relacionado a email ou nome de usuário duplicado
        if (errorMessage.includes("email")) {
          setError("Este email já está em uso.");
        } else if (errorMessage.includes("username")) {
          setError("Este nome de usuário já está em uso.");
        } else {
          setError(errorMessage);
        }
      } else {
        // Se o erro não for relacionado à resposta (erro de rede ou CORS, por exemplo)
        setError("Erro ao conectar com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1 className="project-name">Wouta</h1>
      <div className="register-header">Crie sua conta</div>
      <div className="register-description">Preencha os campos abaixo para se cadastrar</div>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nome de Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Carregando..." : "Cadastrar"}
        </button>
      </form>

      <div className="login-link">
        <p>Já tem uma conta?</p>
        <Link to="/login">Entrar</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
