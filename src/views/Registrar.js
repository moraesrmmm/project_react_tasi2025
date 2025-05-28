import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import axios from 'axios';  

export default function CustomLogin() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar_senha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const registraUsuario = async (e) => {
      e.preventDefault();
      var url = 'https://backend-completo.vercel.app/app/registrar';
      var dados = { usuario: usuario, senha: senha, confirmar_senha: confirmar_senha };

      setError(false);
      setErrorMessage('');
      setLoading(true);

      if (usuario === '' || senha === '' || confirmar_senha === '') {
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
              window.location.href = "/";
          } else {
              console.log(response.data);
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
        sx={{ padding: 4, marginTop: 10, color: '#fff', border: '1px solid #BE1E21', }}>
        <Typography variant="h5" align="center"  gutterBottom fontWeight="bold" sx={{ color: '#BE1E21' }}>
          Registrar
        </Typography>
        <Typography variant="body2" align="center" gutterBottom sx={{ color: '#BE1E21' }}>
          Crie sua conta para acessar o sistema.
        </Typography>

        <Box component="form" onSubmit={registraUsuario}>
          <TextField
            fullWidth
            margin="normal"
            label="Usuário"
            type="text"
            variant="outlined"
            InputLabelProps={{ style: { color: '#000' } }}
            InputProps={{
              style: { color: '#000' },
              sx: {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#BE1E21' }
              }
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
            InputProps={{
              style: { color: '#000' },
              sx: {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#BE1E21' }
              }
            }}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Confirmar Senha"
            type="password"
            variant="outlined"
            InputLabelProps={{ style: { color: '#000' } }}
            InputProps={{
              style: { color: '#000' },
              sx: {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#BE1E21' }
              }
            }}
            value={confirmar_senha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />

          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <Button type="submit" fullWidth variant="contained" sx={{
              mt: 2,
              backgroundColor: '#BE1E21',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#a81a1c' },
            }}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Registrar'}
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            <a href="/login" style={{ color: '#BE1E21', textDecoration: 'none' }}>
              Já tem uma conta? Entre aqui
            </a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
