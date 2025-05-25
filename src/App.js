import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Views

// Públicas
import Registrar from './views/Registrar';
import Login from './views/Login';
import Dashboard from './views/private/Dashboard';
import Home from './views/public/Home';
import ProdutoDetalhes from './views/public/ProdutoDetalhes';

// Privadas

import Categorias from './views/private/Categorias';
import NovaCategoria from './views/private/NovaCategoria';
import EditarCategoria from './views/private/EditarCategoria';
import Produtos from './views/private/Produtos';
import NovoProduto from './views/private/NovoProduto';
import EditarProduto from './views/private/EditarProduto';
import Perfil from './views/private/Perfil';

// Template
import TemplateAdmin from './components/TemplateAdmin';
import TemplatePublic from './components/TemplatePublic';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#111', 
      paper: '#1e1e1e', 
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
    <Navigate to="/home" />
  );
};

const App = () => {

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2', 
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
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route element={<TemplatePublic />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="produto/:nome" element={<ProdutoDetalhes />} />
          </Route>

          <Route element={<Middleware />}>
            <Route element={<TemplateAdmin />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/produtos/novo" element={<NovoProduto />} />
              <Route path="/produtos/editar/:nome" element={<EditarProduto />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/categorias/nova" element={<NovaCategoria />} />
              <Route path="/categorias/editar/:nome" element={<EditarCategoria />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
