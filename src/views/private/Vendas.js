import React, { useEffect, useState } from "react";
import axios from "axios";

const estilos = {
    titulo: {
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 4,
        display: "flex",
        alignItems: "center",
        gap: 10
    },
    hr: {
        border: 0,
        borderTop: "2px solid #eee",
        margin: "10px 0 24px 0"
    },
    barraAcoes: {
        display: "flex",
        gap: 16,
        marginBottom: 18,
        alignItems: "center"
    },
    entrada: {
        padding: "8px 10px",
        border: "1px solid #ccc",
        borderRadius: 4,
        fontSize: 16,
        outline: "none",
        transition: "border 0.2s",
        background: "#fafbfc"
    },
    botao: {
        padding: "10px 18px",
        background: "#BE1E21",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 0.2s"
    },
    botaoExcluir: {
        background: "#BE1E21",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        padding: "7px 14px",
        fontWeight: 500,
        cursor: "pointer"
    },
    tabela: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 10
    },
    th: {
        background: "#f5f5f5",
        fontWeight: 700,
        padding: "10px 8px",
        borderBottom: "2px solid #eee",
        textAlign: "left"
    },
    td: {
        padding: "10px 8px",
        borderBottom: "1px solid #eee",
        verticalAlign: "middle"
    },
    semProdutos: {
        color: "#888",
        textAlign: "center",
        padding: 30
    }
};

export default function Vendas() {
    const [vendas, setVendas] = useState([]);
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        carregarVendas();
    }, []);

    async function carregarVendas() {
        setCarregando(true);
        setErro(null);
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(
                "https://backend-completo.vercel.app/app/venda",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVendas(res.data);
        } catch (err) {
            setErro("Erro ao buscar vendas.");
            setVendas([]);
        }
        setCarregando(false);
    }

    async function excluirVenda(id) {
        if (!window.confirm("Tem certeza que deseja excluir esta venda?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(
            `https://backend-completo.vercel.app/app/venda`,
            {
                headers: { Authorization: `Bearer ${token}` },
                data: { id }
            }
            );
            setVendas(vendas.filter(v => v._id !== id));
        } catch (err) {
            alert("Erro ao excluir venda.");
        }
    }

    const vendasFiltradas = vendas.filter(v =>
        v.nomeCliente?.toLowerCase().includes(busca.trim().toLowerCase())
    );

    function formatarData(data) {
        if (!data) return "—";
        const partes = data.split('T')[0].split('-'); 
        return `${partes[2]}/${partes[1]}/${partes[0]}`; 
    }

    function formatarMoeda(valor) {
        if (typeof valor === "number") valor = valor.toFixed(2);
        if (!valor) return "R$ 0,00";
        let v = valor.toString().replace(/\D/g, "");
        v = (Number(v) / 100).toFixed(2) + "";
        v = v.replace(".", ",");
        v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        return "R$ " + v;
    }

    return (
        <div>
            <div style={estilos.titulo}>
                <span role="img" aria-label="venda">🧾</span>
                LISTAGEM DE VENDAS
            </div>
            <hr style={estilos.hr} />
            {erro && (
                <div style={{ color: "red", marginBottom: 10 }}>{erro}</div>
            )}
            <div style={estilos.barraAcoes}>
                <input
                    type="text"
                    placeholder="Buscar por nome do cliente..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    style={{ ...estilos.entrada, width: 260 }}
                />
            </div>
            <div style={{ overflowX: "auto" }}>
                <table style={estilos.tabela}>
                    <thead>
                        <tr>
                            <th style={estilos.th}>Cliente</th>
                            <th style={estilos.th}>Data</th>
                            <th style={estilos.th}>Produtos</th>
                            <th style={estilos.th}>Total</th>
                            <th style={estilos.th}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carregando ? (
                            <tr>
                                <td colSpan={5} style={estilos.semProdutos}>
                                    Carregando...
                                </td>
                            </tr>
                        ) : !vendasFiltradas || vendasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={estilos.semProdutos}>
                                    Nenhuma venda encontrada.
                                </td>
                            </tr>
                        ) : (
                            vendasFiltradas.map(venda => (
                                <tr key={venda._id}>
                                    <td style={estilos.td}>{venda.nomeCliente || "—"}</td>
                                    <td style={estilos.td}>{formatarData(venda.data)}</td>
                                    <td style={estilos.td}>
                                        {venda.produtos && venda.produtos.length > 0 ? (
                                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                                {venda.produtos.map((p, i) => (
                                                    <li key={i}>
                                                        {p.nome} ({p.quantidade} x {formatarMoeda(p.preco)})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : "—"}
                                    </td>
                                    <td style={estilos.td}>
                                        {formatarMoeda(
                                            (venda.produtos || []).reduce(
                                                (soma, p) => soma + (p.preco * p.quantidade), 0
                                            )
                                        )}
                                    </td>
                                    <td style={estilos.td}>
                                        <button
                                            style={estilos.botaoExcluir}
                                            onClick={() => excluirVenda(venda._id)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
