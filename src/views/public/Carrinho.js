// Carrinho com layout SECTIONS (mais moderno)

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Carrinho = () => {
  const [carrinho, setCarrinho] = useState([]);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState(Number(localStorage.getItem("frete")) || 0);
  const [codigoPromo, setCodigoPromo] = useState("");
  const [desconto, setDesconto] = useState(Number(localStorage.getItem("desconto")) || 0);
  const navigate = useNavigate();

  useEffect(() => {
    const carrinhoLS = JSON.parse(localStorage.getItem("carrinho")) || [];
    setCarrinho(carrinhoLS);
  }, []);

  const atualizarCarrinho = (novoCarrinho) => {
    setCarrinho(novoCarrinho);
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    window.dispatchEvent(new Event('carrinhoAtualizado'));
  };

  const handleAdicionarQuantidade = (idx) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho[idx].quantidade += 1;
    novoCarrinho[idx].preco_total = novoCarrinho[idx].quantidade * novoCarrinho[idx].preco;
    atualizarCarrinho(novoCarrinho);
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
    toast.success("Frete calculado com sucesso!");
  };

  const handleAplicarCodigoPromo = () => {
    if (!codigoPromo) return;
    const valorDesconto = Math.floor(Math.random() * 26) + 5;
    setDesconto(valorDesconto);
    localStorage.setItem("desconto", valorDesconto);
    toast.success("Desconto aplicado com sucesso!");
  };

  const handleComprar = () => {
    if (carrinho.length === 0) {
      toast.error("Seu carrinho está vazio!");
      return;
    }
    localStorage.setItem("valor_total_da_compra", totalFinal);
    navigate("/finalizarvenda");
  };

  const totalProdutos = carrinho.reduce((acc, p) => acc + p.preco_total, 0);
  const valorDesconto = (totalProdutos * desconto) / 100;
  const totalFinal = totalProdutos + frete - valorDesconto;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      <h2 style={{ color: "#be1e21", textAlign: "center", marginBottom: 30 }}>Seu Carrinho</h2>

      {/* Seção de Produtos */}
      <section style={{ background: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.1)", marginBottom: 30 }}>
        {carrinho.length === 0 ? (
          <p style={{ textAlign: "center" }}>Seu carrinho está vazio.</p>
        ) : (
          carrinho.map((item, idx) => (
            <div key={item.nome} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", padding: "12px 0" }}>
              <div>
                <div onClick={() => navigate(`/produto/${encodeURIComponent(item.nome)}`)} style={{ fontWeight: "bold", cursor: "pointer", color: "#be1e21" }}>{item.nome}</div>
                <small>R$ {item.preco.toFixed(2)} x {item.quantidade} = R$ {item.preco_total.toFixed(2)}</small>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => handleAdicionarQuantidade(idx)} style={btnIcon}>+</button>
                <button onClick={() => handleRemoverItem(idx)} style={btnTrash}>🗑</button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Frete e Cupom */}
      <section style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <div style={{ flex: 1 }}>
          <label>CEP:</label>
          <input value={cep} onChange={(e) => setCep(e.target.value)} placeholder="Digite seu CEP" style={inputEstilo} />
          <button onClick={handleCalcularFrete} style={botaoEstilo}>Calcular</button>
        </div>
        <div style={{ flex: 1 }}>
          <label>Código Promocional:</label>
          <input value={codigoPromo} onChange={(e) => setCodigoPromo(e.target.value)} placeholder="Digite o código" style={inputEstilo} />
          <button onClick={handleAplicarCodigoPromo} style={botaoEstilo}>Aplicar</button>
        </div>
      </section>

      {/* Resumo */}
      <section style={{ background: "#f9f9f9", padding: 20, borderRadius: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }}>
        <div>Total produtos: R$ {totalProdutos.toFixed(2)}</div>
        <div>Frete: R$ {frete.toFixed(2)}</div>
        <div>Desconto: -R$ {valorDesconto.toFixed(2)} ({desconto}%)</div>
        <div style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>Total Final: R$ {totalFinal.toFixed(2)}</div>
        <button onClick={handleComprar} style={btnFinalizar} disabled={carrinho.length === 0}>Finalizar Compra</button>
      </section>
    </div>
  );
};

const inputEstilo = {
  width: "100%",
  padding: 8,
  border: "1px solid #ccc",
  borderRadius: 5,
  marginBottom: 6
};

const botaoEstilo = {
  background: "#be1e21",
  color: "#fff",
  border: "none",
  borderRadius: 5,
  padding: "6px 12px",
  cursor: "pointer"
};

const btnIcon = {
  ...botaoEstilo,
  fontSize: 16,
  padding: "4px 10px"
};

const btnTrash = {
  background: "#444",
  color: "#fff",
  border: "none",
  borderRadius: 5,
  padding: "4px 10px",
  cursor: "pointer"
};

const btnFinalizar = {
  marginTop: 20,
  width: "100%",
  padding: "12px 20px",
  fontSize: 18,
  background: "#be1e21",
  color: "#fff",
  border: "none",
  borderRadius: 5,
  cursor: "pointer"
};

export default Carrinho;
