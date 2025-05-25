import React, { useState } from 'react';
import { Box, Button, CircularProgress, Container, TextField, Typography, Paper
} from '@mui/material';
import axios from 'axios';

export default function CustomLogin() {
        const [usuario, setUsuario] = useState('');
        const [senha, setSenha] = useState('');
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(false);
        const [errorMessage, setErrorMessage] = useState('');

        const ValidaUsuario = async (e) => {

            e.preventDefault();
            var url = 'https://backend-completo.vercel.app/app/login';
            var dados = { usuario: usuario, senha: senha };

            setError(false);
            setErrorMessage('');
            setLoading(true);

            if (usuario === '' || senha === '') {
                setError(true);
                setErrorMessage('Preencha todos os campos!');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post(url, dados);
                if (response.data.token) {
                    localStorage.setItem("logado", true);
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("usuario", usuario);
                    localStorage.setItem("horaAcesso", new Date().toLocaleString());
                    window.location.href = "/dashboard";
                } else {
                    setError(true);
                    setErrorMessage('Usuário ou senha inválidos!');
                }
            } catch (err) {
                setError(true);
                setErrorMessage('Erro ao conectar ao servidor! ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        return (
            <Container maxWidth="xs">
            <Paper
                sx={{
                padding: 4,
                marginTop: 10,
                color: '#fff',
                border: '1px solid #444',
                }}
            >
                <Typography
                variant="h5"
                align="center"
                gutterBottom
                fontWeight="bold"
                >
                Entrar
                </Typography>
                <Typography variant="body2" align="center" gutterBottom>
                Bem-vindo de volta! Entre na sua conta.
                </Typography>

                <Box component="form" onSubmit={ValidaUsuario}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Usuário"
                    type="text"
                    variant="outlined"
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000' } }}
                    sx={{
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#be1e21',
                        },
                    }}
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Senha"
                    type="password"
                    variant="outlined"
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000' } }}
                    sx={{
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#be1e21',
                        },
                    }}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                {error && (
                    <Typography
                    variant="body2"
                    color="error"
                    align="center"
                    sx={{ mt: 2 }}
                    >
                    {errorMessage}
                    </Typography>
                )}

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                    mt: 2,
                    backgroundColor: '#be1e21',
                    color: '#white',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#be1e21' },
                    }}
                    disabled={loading}
                >
                    {loading ? 'Carregando...' : 'Entrar'}
                </Button>

                <Typography align="center" sx={{ mt: 2 }}>
                    <a
                    href="/forgot-senha"
                    style={{
                        color: '#be1e21',
                        textDecoration: 'none',
                    }}
                    >
                    Esqueci minha senha
                    </a>
                </Typography>

                <Typography align="center" sx={{ mt: 2 }}>
                    <a
                    href="/registrar"
                    style={{
                        color: '#be1e21',
                        textDecoration: 'none',
                    }}
                    >
                    Não possui uma conta? Crie aqui
                    </a>
                </Typography>
                </Box>
            </Paper>
            </Container>
        );
}
