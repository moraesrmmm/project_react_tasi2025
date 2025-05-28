import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const adicionarAoCarrinhoLS = (produto, qtd) => {
    if (!produto) return;
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const idx = carrinho.findIndex((p) => p.nome === produto.nome);
    if (idx > -1) {
        carrinho[idx].quantidade += qtd;
        carrinho[idx].preco_total = carrinho[idx].quantidade * carrinho[idx].preco;
    } else {
        carrinho.push({
            ...produto,
            quantidade: qtd,
            preco_total: qtd * produto.preco,
        });
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
};

const Carrinho = () => {
    const [carrinho, setCarrinho] = useState([]);
    const [cep, setCep] = useState("");
    const [frete, setFrete] = useState(Number(localStorage.getItem("frete")) || 0);
    const [codigoPromo, setCodigoPromo] = useState("");
    const [desconto, setDesconto] = useState(Number(localStorage.getItem("desconto")) || 0);
    const navigate = useNavigate();
    const [atualizar, setAtualizar] = useState(false);

    useEffect(() => {
        const carrinhoLS = JSON.parse(localStorage.getItem("carrinho")) || [];
        setCarrinho(carrinhoLS);
        if (carrinhoLS.length === 0) {
            setFrete(0);
            setDesconto(0);
            setCep("");
            setCodigoPromo("");
            localStorage.removeItem("frete");
            localStorage.removeItem("desconto");
        }
    }, []);

    const atualizarCarrinho = (novoCarrinho) => {
        setCarrinho(novoCarrinho);
        localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    };

    const handleAdicionarQuantidade = (idx) => {
        const novoCarrinho = [...carrinho];
        novoCarrinho[idx].quantidade += 1;
        novoCarrinho[idx].preco_total = novoCarrinho[idx].quantidade * novoCarrinho[idx].preco;
        atualizarCarrinho(novoCarrinho);
        setAtualizar(prev => !prev);
    };

    const handleRemoverItem = (idx) => {
        const novoCarrinho = [...carrinho];
        novoCarrinho.splice(idx, 1);
        atualizarCarrinho(novoCarrinho);
    };

    const handleCalcularFrete = () => {
        if (!cep) return;
        const seed = parseInt(cep.replace(/\D/g, ""), 10) || Math.random() * 10000;
        const valorFrete = 10 + (seed % 41);
        setFrete(valorFrete);
        localStorage.setItem("frete", valorFrete);
    };

    const handleAplicarCodigoPromo = () => {
        if (!codigoPromo) return;
        const valorDesconto = Math.floor(Math.random() * 26) + 5;
        setDesconto(valorDesconto);
        localStorage.setItem("desconto", valorDesconto);
    };

    const handleComprar = () => {
        console.log("Finalizando compra...");
        localStorage.setItem("valor_total_da_compra", totalFinal);
        navigate("/finalizarvenda");
    };

    const totalProdutos = carrinho.reduce((acc, p) => acc + p.preco_total, 0);
    const valorDesconto = (totalProdutos * desconto) / 100;
    const totalFinal = totalProdutos + frete - valorDesconto;

    return (
        <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ color: "#be1e21", textAlign: "center" }}>🛒 Seu Carrinho</h2>
            {carrinho.length === 0 ? (
                <p style={{ textAlign: "center" }}>Seu carrinho está vazio.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#f9f9f9" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#be1e21", color: "white" }}>
                            <th style={{ padding: 10 }}>Produto</th>
                            <th>Qtd</th>
                            <th>Preço</th>
                            <th>Total</th>
                            <th colSpan={2}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrinho.map((item, idx) => (
                            <tr key={item.nome} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
                                <td
                                    onClick={() => navigate(`/produto/${encodeURIComponent(item.nome)}`)}
                                    style={{ textDecoration: "underline", color: "#be1e21", cursor: "pointer" }}
                                >
                                    {item.nome}
                                </td>
                                <td>{item.quantidade}</td>
                                <td>R$ {item.preco.toFixed(2)}</td>
                                <td>R$ {item.preco_total.toFixed(2)}</td>
                                <td>
                                    <button onClick={() => handleAdicionarQuantidade(idx)} style={botaoEstilo}>+</button>
                                </td>
                                <td>
                                    <button onClick={() => handleRemoverItem(idx)} style={{ ...botaoEstilo, background: "#555" }}>
                                        🗑
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 10 }}>
                <label>
                    CEP:
                    <input value={cep} onChange={(e) => setCep(e.target.value)} placeholder="Digite seu CEP" maxLength={9} style={{ marginLeft: 10, padding: 5 }}/>
                </label>
                <button onClick={handleCalcularFrete} style={botaoEstilo}>Calcular Frete</button>
                {frete > 0 && <span>Frete: R$ {frete.toFixed(2)}</span>}
            </div>

            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <label>
                    Código Promocional:
                    <input value={codigoPromo} onChange={(e) => setCodigoPromo(e.target.value)} placeholder="Digite o código" style={{ marginLeft: 10, padding: 5 }}/>
                </label>
                <button onClick={handleAplicarCodigoPromo} style={botaoEstilo}>Aplicar</button>
                {desconto > 0 && (
                    <span>
                        Desconto: {desconto}% (-R$ {valorDesconto.toFixed(2)})
                    </span>
                )}
            </div>

            <div style={{ marginTop: 30, fontWeight: "bold" }}>
                <div>Total produtos: R$ {totalProdutos.toFixed(2)}</div>
                <div>Frete: R$ {frete.toFixed(2)}</div>
                <div>Desconto: - R$ {valorDesconto.toFixed(2)}</div>
                <div style={{ fontSize: 20, marginTop: 10 }}>
                    Total Final: R$ {totalFinal.toFixed(2)}
                </div>
            </div>

            <button onClick={handleComprar} style={{ marginTop: 30, padding: "12px 30px", fontSize: 18, background: "#be1e21", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", width: "100%",}} disabled={carrinho.length === 0}>
                Finalizar Compra
            </button>
        </div>
    );
};

const botaoEstilo = {
    background: "#be1e21",
    color: "#fff",
    padding: "5px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
};

export default Carrinho;
