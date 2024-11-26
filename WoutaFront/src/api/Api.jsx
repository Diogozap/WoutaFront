import axios from "axios";
const axiosInstance = axios.create({
    baseURL: "https://sistemadegerenciamentodeprojetosback.onrender.com/"
});
const token = localStorage.getItem('token');

axiosInstance.interceptors.request.use(
    (config) => {
        // Recuperar o token do localStorage antes de enviar a requisição
        const token = localStorage.getItem('token');

        if (token) {
            // Adiciona o token ao cabeçalho da requisição
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const apiTarefas = {
    listarTarefas: () => axiosInstance.get('/restrito/tarefas/'),
}

export const apiProjetos = {
    listarProjetos: () => axiosInstance.get('/restrito/projetos/'),
}

export const apiComentarios = {
    listarComentarios: () => axiosInstance.get('/restrito/comentarios/'),
}