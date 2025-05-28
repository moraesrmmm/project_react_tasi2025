import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TemplatePublic = () => {
  const [busca, setBusca] = useState('');

  const getCarrinhoCount = () => {
    try {
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      return carrinho.reduce((total, item) => total + (item.quantidade || 0), 0);
    } catch {
      return 0;
    }
  };

  const [carrinhoCount, setCarrinhoCount] = useState(getCarrinhoCount());

  React.useEffect(() => {
    const handleStorage = () => setCarrinhoCount(getCarrinhoCount());
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleStorage);
    };
  }, []);

  return (
    <div>
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px 0', borderBottom: '2px solid #ddd' }}>
        <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', color: '#333' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Frete grátis acima de R$ 99,00 🚚✨</span>
        </div>
      </div>

      <header style={{ backgroundColor: '#be1e21' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 15px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', fontFamily: 'Arial, sans-serif', marginRight: '50px', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
            LojaMassa
          </h1>

          <div style={{ position: 'relative', marginLeft: '20px', width: '55%' }}>
            <input type="text" placeholder="Busque aqui seu produto" className="rounded p-2 w-full text-black" value={busca} onChange={(e) => setBusca(e.target.value)}
              style={{ padding: '10px 40px 10px 10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', borderColor: '#ccc', fontSize: '14px', outline: 'none',
              }}
            />
            <span
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-40%)',
                color: '#888',
                pointerEvents: 'none',
              }}
            >
              <img width={23} src={require('../assets/red-icon.png')} alt="Search Icon" />
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '50px' }}>
            <FaUser className="mr-2 text-lg" style={{ color: '#fff', marginRight: '8px' }} />
            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ color: '#fff', fontSize: '14px', fontFamily: 'Arial, sans-serif', textAlign: 'start' }}>
                <div style={{ fontWeight: 'bold', cursor: "pointer" }} onClick={ () => {window.location.href = "/login";}}>olá, faça seu login</div>
                <div style={{ fontWeight: 'bold' }}>ou cadastre-se</div>
              </div>
            </button>
          </div>
          <a
            href="/carrinho"
            style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', position: 'relative', textDecoration: 'none' }}
          >
            <img
              src={require('../assets/cart-white.png')}
              alt="Cart Icon"
              style={{ width: '40px', height: '40px', cursor: 'pointer', marginLeft: '20px' }}
            />
            {carrinhoCount > 0 && (
              <span
                style={{ position: 'absolute', top: '-5px', right: '10px', background: '#fff', color: '#be1e21', borderRadius: '50%', padding: '2px 7px', fontSize: '12px', fontWeight: 'bold', border: '2px solid #be1e21', minWidth: '22px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                }}
              >
                {carrinhoCount}
              </span>
            )}
          </a>
        </div>
        <nav style={{ backgroundColor: '#be1e21', padding: '10px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              'todos os departamentos',
              'mercado',
              'celulares',
              'eletrodomésticos',
              'informática',
              'áudio e vídeo',
              'móveis',
              'dia das mães',
            ].map((item, index) => (
              <span
                key={index}
                style={{ fontSize: '11px', fontWeight: 'bold', marginLeft: index === 0 ? '0' : '15px', color: '#fff', textTransform: 'uppercase', cursor: 'pointer',}}>
                {item}
              </span>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto mt-6 px-4">
        <Outlet context={{ busca }} />
      </main>
    </div>
  );
};

export default TemplatePublic;
