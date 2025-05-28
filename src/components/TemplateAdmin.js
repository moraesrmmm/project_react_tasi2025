import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardLayout, AppProvider, PageContainer } from '@toolpad/core';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProductIcon = DashboardIcon;

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Cadastro',
  },
  {
    segment: 'produtos',
    title: 'Produtos',
    icon: <ProductIcon />,
  },
  {
    segment: 'categorias',
    title: 'Categorias',
    icon: <LayersIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Vendas',
  },
  {
    segment: 'vendas',
    title: 'Vendas',
    icon: <BarChartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Configurações',
  },
  {
    segment: 'perfil',
    title: 'Perfil',
    icon: <AccountCircleIcon />,
  },
];

const demoTheme = createTheme({
  palette: {
    primary: {
      main: '#be1e21',
    },
    secondary: {
      main: '#be1e21',
    },
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#be1e21',
        },
      },
    },
  },
  colorSchemes: { light: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
});

const Template = () => {
  const router = {
    pathname: window.location.pathname,
    searchParams: new URLSearchParams(window.location.search),
    navigate: (path) => (window.location.href = path),
  };

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}   branding={{ logo: <img src="https://brandcenter.americanas.io/wp-content/uploads/2022/02/logo_1-01-e1658341073536.png" alt="LojaMassa" />, title: '', homeUrl: '/toolpad/core/introduction',}}>
      <DashboardLayout>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
};

export default Template;
