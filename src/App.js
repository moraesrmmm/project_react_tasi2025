import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Views
import Registrar from './views/Registrar';
import Login from './views/Login';
import Dashboard from './views/Dashboard';

// Template
import Template from './components/Template';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#111', // fundo da página
      paper: '#1e1e1e', // fundo de elementos como cards
    },
    text: {
      primary: '#fff',
    },
  },
});

const Middleware = () => {
  const isLogged = localStorage.getItem('logado') === 'true';

  return isLogged ? (
    <Template>
      <Outlet />
    </Template>
  ) : (
    <Navigate to="/login" />
  );
};

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route element={<Middleware />}>
            {/* Suas rotas protegidas vão aqui */}
            <Route path="/dashboard" element={<Dashboard/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
