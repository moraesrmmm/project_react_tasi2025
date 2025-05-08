import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Views
import Registrar from './views/Registrar';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Home from './views/public/Home';

// Template
import TemplateAdmin from './components/TemplateAdmin';
import TemplatePublic from './components/TemplatePublic';
import { lightBlue } from '@mui/material/colors';

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

  return isLogged? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

const App = () => {

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2', // azul padrão do MUI
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: '#f5f5f5',
        paper: '#fff',
      },
    },
  });

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* ROTAS PÚBLICAS - usam o TemplatePublic */}
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route element={<TemplatePublic />}>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/home" element={<Home />} />
          </Route>

          {/* ROTAS ADMIN - protegidas por login e perfil */}
          <Route element={<Middleware />}>
            <Route element={<TemplateAdmin />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
