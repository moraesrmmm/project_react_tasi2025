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
    botaoNovo: {
        background: "#BE1E21"
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
    botaoEditar: {
        background: "#BE1E21",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        padding: "7px 14px",
        fontWeight: 500,
        cursor: "pointer"
    },
    imagem: {
        maxWidth: 60,
        maxHeight: 60,
        borderRadius: 4,
        objectFit: "cover"
    },
    semProdutos: {
        color: "#888",
        textAlign: "center",
        padding: 30
    }
};

export default function ListaProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaFiltro, setCategoriaFiltro] = useState("");
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        async function carregarProdutos() {
            setCarregando(true);
            setErro(null);
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(
                    "https://backend-completo.vercel.app/app/produtos/romulo_moraes",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setProdutos(res.data);
            } catch (err) {
                setErro("Erro ao buscar produtos.");
                setProdutos([]);
            }
            setCarregando(false);
        }
        carregarProdutos();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        axios
            .get("https://backend-completo.vercel.app/app/categorias", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setCategorias(res.data))
            .catch(() => setCategorias([]));
    }, []);

    useEffect(() => {
        let lista = [...produtos];
        if (categoriaFiltro) {
            lista = lista.filter(p => p.categoria === categoriaFiltro);
        }
        if (busca.trim()) {
            const termo = busca.trim().toLowerCase();
            lista = lista.filter(
                p =>
                    p.nome.toLowerCase().includes(termo) ||
                    (p.descricao && p.descricao.toLowerCase().includes(termo))
            );
        }
        setProdutosFiltrados(lista);
    }, [produtos, categoriaFiltro, busca]);

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
                <span role="img" aria-label="produto">📦</span>
                LISTAGEM DE PRODUTOS
            </div>
            <hr style={estilos.hr} />
            {erro && (
                <div style={{ color: "red", marginBottom: 10 }}>{erro}</div>
            )}
            <div style={estilos.barraAcoes}>
                <input type="text" placeholder="Buscar por nome ou descrição..." value={busca} onChange={e => setBusca(e.target.value)} style={{ ...estilos.entrada, width: 260 }}/>
                <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)} style={estilos.entrada}>
                    <option value="">Todas as categorias</option>
                    {categorias && categorias.map && categorias.map(cat => (
                        <option key={cat._id} value={cat.nome}>
                            {cat.nome}
                        </option>
                    ))}
                </select>
                <a href="/produtos/novo" style={{
                        ...estilos.botao,
                        ...estilos.botaoNovo,
                        textDecoration: "none"
                    }}
                >
                    + Novo Produto
                </a>
            </div>
            <div style={{ overflowX: "auto" }}>
                <table style={estilos.tabela}>
                    <thead>
                        <tr>
                            <th style={estilos.th}>Imagem</th>
                            <th style={estilos.th}>Nome</th>
                            <th style={estilos.th}>Categoria</th>
                            <th style={estilos.th}>Preço</th>
                            <th style={estilos.th}>Quantidade</th>
                            <th style={estilos.th}>Descrição</th>
                            <th style={estilos.th}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carregando ? (
                            <tr>
                                <td colSpan={7} style={estilos.semProdutos}>
                                    Carregando...
                                </td>
                            </tr>
                        ) : !produtosFiltrados || produtosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={estilos.semProdutos}>
                                    Nenhum produto encontrado.
                                </td>
                            </tr>
                        ) : (
                            produtosFiltrados.map(produto => (
                                <tr key={produto._id}>
                                    <td style={estilos.td}>
                                        {produto.imagem ? (
                                            <img
                                                src={
                                                    produto.imagem.startsWith("data:image")
                                                        ? produto.imagem
                                                        : produto.imagem.startsWith("http")
                                                        ? produto.imagem
                                                        : `https://backend-completo.vercel.app/static/${produto.imagem}`
                                                }
                                                alt={produto.nome}
                                                style={estilos.imagem}
                                            />
                                        ) : (
                                            <span style={{ color: "#bbb" }}>—</span>
                                        )}
                                    </td>
                                    <td style={estilos.td}>{produto.nome || "—"}</td>
                                    <td style={estilos.td}>{produto.categoria || "—"}</td>
                                    <td style={estilos.td}>{formatarMoeda(produto.preco)}</td>
                                    <td style={estilos.td}>{produto.quantidade != null ? produto.quantidade : "—"}</td>
                                    <td style={estilos.td}>{produto.descricao || "—"}</td>
                                    <td style={estilos.td}>
                                        <a href={`/produtos/editar/${produto.nome}`} style={estilos.botaoEditar}>
                                            Editar
                                        </a>
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
