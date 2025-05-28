import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProdutoDetalhes() {
    const [produto, setProduto] = useState(null);
    const [quantidade, setQuantidade] = useState(1);
    const { nome } = useParams();
    const navigate = useNavigate();

    const adicionarAoCarrinhoLS = (produto, qtd) => {
        if (!produto) return;
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const idx = carrinho.findIndex(p => p.nome === produto.nome);
        if (idx > -1) {
            const novaQtd = carrinho[idx].quantidade + qtd;
            if (novaQtd > produto.quantidade) {
                alert(`Estoque insuficiente. Apenas ${produto.quantidade} disponível.`);
                return;
            }
            carrinho[idx].quantidade = novaQtd;
            carrinho[idx].preco_total = novaQtd * carrinho[idx].preco;
        } else {
            if (qtd > produto.quantidade) {
                alert(`Estoque insuficiente. Apenas ${produto.quantidade} disponível.`);
                return;
            }
            carrinho.push({
                ...produto,
                quantidade: qtd,
                preco_total: qtd * produto.preco
            });
            alert(`Produto adicionado ao carrinho! Quantidade: ${quantidade}`);
        }
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    };

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
                const prod = Array.isArray(data) ? data[0] : data;
                setProduto(prod);
            })
            .catch(() => setProduto(null));
    }, [nome]);

    const handleComprar = () => {
        if (quantidade > produto.quantidade) {
            alert(`Estoque insuficiente. Apenas ${produto.quantidade} disponível.`);
            return;
        }else{
            adicionarAoCarrinhoLS(produto, quantidade);
        }
        alert('Redirecionando para o carrinho...');
        navigate("/carrinho");
    };

    const handleAdicionarCarrinho = () => {
        if (quantidade > produto.quantidade) {
            alert(`Estoque insuficiente. Apenas ${produto.quantidade} disponível.`);
            return;
        }else{
            adicionarAoCarrinhoLS(produto, quantidade);
        }
    };

    const aumentarQuantidade = () => {
        if (quantidade < produto.quantidade) {
            setQuantidade(q => q + 1);
        }
    };

    const diminuirQuantidade = () => {
        setQuantidade(q => (q > 1 ? q - 1 : 1));
    };

    if (!produto) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5rem' }}>
                Carregando produto...
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: 700,
            margin: '40px auto',
            padding: 24,
            border: '1px solid #ddd',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 32
        }}>
            <img src={produto.imagem} alt={produto.nome} style={{ width: 250, borderRadius: 8, objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
                <h2>{produto.nome}</h2>
                <p>{produto.descricao}</p>
                <h3>R$ {produto.preco?.toFixed(2)}</h3>
                <div style={{ fontSize: 14, marginTop: 8, color: "#666" }}>
                    Disponível: {produto.quantidade} unidades
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
                    <button onClick={diminuirQuantidade} style={btnQtd}>-</button>
                    <span style={{ minWidth: 32, textAlign: 'center', fontSize: 18 }}>{quantidade}</span>
                    <button onClick={aumentarQuantidade} style={btnQtd}>+</button>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button onClick={handleComprar} style={btnPrincipal}>
                        Comprar
                    </button>
                    <button onClick={handleAdicionarCarrinho} style={btnSecundario}>
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    );
}

const btnQtd = {
    padding: '6px 14px',
    fontSize: 18,
    borderRadius: 4,
    border: 'none',
    background: 'transparent',
    color: '#BE1E21',
    cursor: 'pointer'
};

const btnPrincipal = {
    padding: '10px 20px',
    background: '#BE1E21',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
};

const btnSecundario = {
    padding: '10px 20px',
    background: '#575650',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
};

export default ProdutoDetalhes;
