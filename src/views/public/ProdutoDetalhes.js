import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProdutoDetalhes() {
    const [produto, setProduto] = useState(null);
    const [quantidade, setQuantidade] = useState(1);
    const { nome } = useParams();

    useEffect(() => {
        fetch(`https://backend-completo.vercel.app/app/produtos/romulo_moraes/${nome}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoicm9tdWxvX21vcmFlcyIsImlhdCI6MTc0NzI2OTc2NiwiZXhwIjoxNzQ3MzU2MTY2fQ.-0Txbs4zLkQWncIq6hWOaDjVfLzja0dS8jouv_OZEn8`
            },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProduto(data[0]);
                } else {
                    setProduto(data);
                }
            })
            .catch(() => setProduto(null));
    }, [nome]);

    const handleComprar = () => {
        alert(`Compra realizada! Quantidade: ${quantidade}`);
    };

    const handleAdicionarCarrinho = () => {
        alert(`Produto adicionado ao carrinho! Quantidade: ${quantidade}`);
    };

    const aumentarQuantidade = () => setQuantidade(q => q + 1);
    const diminuirQuantidade = () => setQuantidade(q => (q > 1 ? q - 1 : 1));

    if (!produto) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5rem' }}>
                Carregando produtos...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 700, margin: '40px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 32
        }}>
            <img
                src={produto.imagem}
                alt={produto.nome}
                style={{ width: 250, borderRadius: 8, objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
                <h2>{produto.nome}</h2>
                <p>{produto.descricao}</p>
                <h3>R$ {produto.preco?.toFixed(2)}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
                    <button
                        onClick={diminuirQuantidade}
                        style={{ padding: '6px 14px', fontSize: 18, borderRadius: 4, border: 'none', background: 'transparent', color: '#BE1E21', cursor: 'pointer'
                        }}
                    >-</button>
                    <span style={{ minWidth: 32, textAlign: 'center', fontSize: 18 }}>{quantidade}</span>
                    <button
                        onClick={aumentarQuantidade}
                        style={{ padding: '6px 14px', fontSize: 18, borderRadius: 4, border: 'none', background: 'transparent', color: '#BE1E21', cursor: 'pointer'
                        }}
                    >+</button>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button onClick={handleComprar} style={{ padding: '10px 20px', background: '#BE1E21', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        Comprar
                    </button>
                    <button onClick={handleAdicionarCarrinho} style={{ padding: '10px 20px', background: '#575650', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProdutoDetalhes;
