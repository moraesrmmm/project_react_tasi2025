import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FinalizarVenda = () => {
    const [nome, setNome] = useState("");
    const [cep, setCep] = useState("");
    const [endereco, setEndereco] = useState("");
    const [loadingCep, setLoadingCep] = useState(false);
    const [erroCep, setErroCep] = useState("");
    const [pagando, setPagando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const valorTotal = localStorage.getItem("valor_total_da_compra") || "0.00";
    const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    const navigate = useNavigate();

    const buscarEndereco = async () => {
        setErroCep("");
        setEndereco("");
        if (cep.length !== 8) {
            setErroCep("CEP deve ter 8 dígitos.");
            return;
        }
        setLoadingCep(true);
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (data.erro) {
                setErroCep("CEP não encontrado.");
            } else {
                setEndereco(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
            }
        } catch {
            setErroCep("Erro ao buscar CEP.");
        }
        setLoadingCep(false);
    };

    const finalizarVenda = async (e) => {
        e.preventDefault();
        setPagando(true);
        setMensagem("");
        const produtos = carrinho.map(item => ({
            nome: item.nome,
            quantidade: item.quantidade,
            preco: item.preco
        }));
        const payload = {
            _id: "",
            nomeCliente: nome,
            usuario: "romulo_moraes",
            data: new Date().toISOString().split("T")[0],
            produtos
        };

        console.log("Payload da venda:", payload);
        try {
            const res = await fetch("https://backend-completo.vercel.app/app/venda", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.erro) {
                setMensagem("✅ Venda finalizada com sucesso!");

                let erroAtualizar = false;
                for (const item of carrinho) {
                    try {
                        const produtoRes = await fetch(`https://backend-completo.vercel.app/app/produtos/romulo_moraes/${item.nome}`);
                        const produto = await produtoRes.json();
                        const novaQuantidade = Number(produto[0].quantidade) - Number(item.quantidade);
                        const token = localStorage.getItem("token") || "";
                        const quantidadeAtualizada = novaQuantidade < 0 ? 0 : novaQuantidade;
                        const putRes = await fetch(`https://backend-completo.vercel.app/app/produtos`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                id: produto[0]._id,
                                usuario: produto.usuario,
                                nome: produto[0].nome,
                                quantidade: quantidadeAtualizada,
                                preco: produto[0].preco,
                                categoria: produto[0].categoria,
                                descricao: produto[0].descricao,
                                imagem: produto[0].imagem,
                                __v: produto[0].__v
                            })
                        });

                        if (!putRes.ok) {
                            erroAtualizar = true;
                            break;
                        }
                    } catch {
                        erroAtualizar = true;
                        break;
                    }
                }

                if (erroAtualizar) {

                    await fetch(`https://backend-completo.vercel.app/app/venda/${payload._id}`, {
                        method: "DELETE"
                    });
                    setMensagem("❌ Erro ao atualizar estoque. Venda cancelada.");
                } else {
                    localStorage.removeItem("carrinho");
                    localStorage.removeItem("frete");
                    localStorage.removeItem("desconto");
                    localStorage.removeItem("valor_total_da_compra");
                    navigate("/agradecimento");
                }
            } else {
                setMensagem("❌ Erro ao finalizar venda.");
            }
        } catch {
            setMensagem("❌ Erro ao conectar com o servidor.");
        }
        setPagando(false);
    };

    const estiloInput = {
        width: "100%",
        padding: "8px",
        marginTop: "4px",
        marginBottom: "12px",
        borderRadius: "5px",
        border: "1px solid #ccc"
    };

    const estiloBotao = {
        background: "#be1e21",
        color: "#fff",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    };

    return (
        <div style={{ maxWidth: 500, margin: "40px auto", padding: "30px", border: "1px solid #ddd", borderRadius: 10, background: "#fafafa", fontFamily: "Arial, sans-serif"}}>
            <h2 style={{ textAlign: "center", color: "#be1e21" }}>Finalizar Venda</h2>
            <form onSubmit={finalizarVenda}>
                <div>
                    <label>Nome:</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={estiloInput}/>
                </div>
                <div>
                    <label>CEP:</label>
                    <div style={{ display: "flex", gap: 10 }}>
                        <input type="text" value={cep} onChange={e => setCep(e.target.value.replace(/\D/g, ""))} maxLength={8} required style={{ ...estiloInput, flex: 1, marginBottom: 0 }}/>
                        <button type="button" onClick={buscarEndereco} disabled={loadingCep} style={{ ...estiloBotao, whiteSpace: "nowrap" }}>
                            {loadingCep ? "Buscando..." : "Buscar"}
                        </button>
                    </div>
                    {erroCep && <div style={{ color: "red", marginTop: 5 }}>{erroCep}</div>}
                </div>
                <div>
                    <label>Endereço:</label>
                    <input type="text" value={endereco} readOnly style={{ ...estiloInput, background: "#eee" }}/>
                </div>
                <div style={{ marginBottom: 20 }}>
                    <strong>💰 Valor Total: R$ {parseFloat(valorTotal).toFixed(2)}</strong>
                </div>
                <button type="submit" disabled={pagando} style={{ ...estiloBotao, width: "100%", fontSize: 16 }} >
                    {pagando ? "Processando..." : "Pagar"}
                </button>
                {mensagem && (
                    <div style={{ marginTop: 16, textAlign: "center", fontWeight: "bold" }}>
                        {mensagem}
                    </div>
                )}
            </form>
        </div>
    );
};

export default FinalizarVenda;
