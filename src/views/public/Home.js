import React, { useState, useEffect } from 'react';
import Card from '../../components/card';
import { Link } from 'react-router-dom';

const Home = () => {
  const [produtos, setProdutos] = useState([]);

  const [loading, setLoading] = useState(true);

  const buscaProdutos = async () => {
    const url = 'https://backend-completo.vercel.app/app/produtos';
    const loginUrl = 'https://backend-completo.vercel.app/app/login';
    const loginDados = { usuario: 'romulo_moraes', senha: '159357' };
    var token = '';

    try {
      const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginDados)
      });
      const loginResult = await loginResponse.json();
      if (!loginResponse.ok || !loginResult.token) {
        throw new Error('Falha no login');
      }
      token = loginResult.token;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const aProdutos = await response.json();
      setProdutos(aProdutos);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscaProdutos();
  }, []);
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5rem' }}>
        Carregando produtos...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', marginLeft: '90px', marginTop: '30px', marginRight: '90px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {produtos.map((produto, index) => (
         <Link to={`/produto/${produto.nome}`} key={index} style={{ textDecoration: 'none' }}>
            <Card 
              key={index} 
              title={produto.nome}
              price={produto.preco}
              image={produto.imagem}
              alt={produto.nome}
            >
            </Card>
         </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
