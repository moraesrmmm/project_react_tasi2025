import React, { useState, useEffect } from 'react';
import Card from '../../components/card';
import { Link } from 'react-router-dom';

const Home = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscaProdutos = async () => {
    const url = 'https://backend-completo.vercel.app/app/produtos/romulo_moraes';
    try {
      const response = await fetch(url, {});
      if (!response.ok) {
        throw new Error('Erro na resposta da requisição');
      }
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

  // Agrupa produtos por categoria
  const produtosPorCategoria = produtos.reduce((acc, produto) => {
    const categoria = produto.categoria || 'Sem categoria';
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(produto);
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        fontSize: '2rem',
        color: '#555',
        fontFamily: 'Arial, sans-serif'
      }}>
        Carregando produtos...
      </div>
    );
  }

  return (
    <div style={{
      padding: '40px 0',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {Object.entries(produtosPorCategoria).map(([categoria, produtos]) => (
          <div key={categoria} style={{
            width: '100%',
            marginBottom: '50px',
            background: '#fff',
            borderRadius: '18px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            padding: '32px 0 24px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h2 style={{
              fontSize: '2.2rem',
              color: '#2a2a2a',
              marginBottom: '28px',
              letterSpacing: '1px',
              fontWeight: 700,
              textAlign: 'center',
              borderBottom: '2px solid #e5e7eb',
              width: '60%',
              paddingBottom: '10px'
            }}>{categoria}</h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '32px',
              justifyContent: 'center',
              width: '100%'
            }}>
              {produtos.map((produto) => (
                <Link
                  to={`/produto/${produto.nome}`}
                  key={produto.nome}
                  style={{
                    textDecoration: 'none',
                    transition: 'transform 0.2s',
                  }}
                >
                  <Card
                    title={produto.nome}
                    price={produto.preco}
                    image={produto.imagem}
                    alt={produto.nome}
                  />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;