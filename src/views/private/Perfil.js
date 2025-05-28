import React, { useEffect, useState } from 'react';

const Perfil = () => {
    const [perfil, setPerfil] = useState({
        nome: '',
        usuario: '',
        token: '',
        horaAcesso: ''
    });

    useEffect(() => {
        const nome = localStorage.getItem('nome') || '';
        const usuario = localStorage.getItem('usuario') || '';
        const token = localStorage.getItem('token') || '';
        const horaAcesso = localStorage.getItem('horaAcesso') || new Date().toLocaleString();

        if (!localStorage.getItem('horaAcesso')) {
            localStorage.setItem('horaAcesso', horaAcesso);
        }

        setPerfil({ nome, usuario, token, horaAcesso });
    }, []);

    const encerrarSessao = () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        localStorage.removeItem('horaAcesso');
        localStorage.removeItem('logado');
        window.location.href = '/login'; // Redireciona para tela de login
    };

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
            <h2>Perfil do Usuário</h2>
            <p><strong>Usuário:</strong> {perfil.usuario}</p>
            <p><strong>Hora do acesso:</strong> {perfil.horaAcesso}</p>
            <p><strong>Token:</strong> <span style={{ wordBreak: 'break-all' }}>{perfil.token}</span></p>
            <button onClick={encerrarSessao} style={{ marginTop: 24, padding: '10px 20px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer'}}>
                Encerrar Sessão
            </button>
        </div>
    );
};

export default Perfil;