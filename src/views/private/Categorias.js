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
    semCategorias: {
        color: "#888",
        textAlign: "center",
        padding: 30
    }
};

export default function ListaCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        async function carregarCategorias() {
            setCarregando(true);
            setErro(null);
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(
                    "https://backend-completo.vercel.app/app/categorias",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setCategorias(res.data);
            } catch (err) {
                setErro("Erro ao buscar categorias.");
                setCategorias([]);
            }
            setCarregando(false);
        }
        carregarCategorias();
    }, []);

    const categoriasFiltradas = categorias.filter(cat =>
        cat.nome.toLowerCase().includes(busca.trim().toLowerCase())
    );

    return (
        <div>
            <div style={estilos.titulo}>
                <span role="img" aria-label="categoria">🏷️</span>
                LISTAGEM DE CATEGORIAS
            </div>
            <hr style={estilos.hr} />
            {erro && (
                <div style={{ color: "red", marginBottom: 10 }}>{erro}</div>
            )}
            <div style={estilos.barraAcoes}>
                <input type="text" placeholder="Buscar por nome da categoria..." value={busca} onChange={e => setBusca(e.target.value)} style={{ ...estilos.entrada, width: 260 }}/>
                <a href="/categorias/nova" style={{ ...estilos.botao, textDecoration: "none"}}>
                    + Nova Categoria
                </a>
            </div>
            <div style={{ overflowX: "auto" }}>
                <table style={estilos.tabela}>
                    <thead>
                        <tr>
                            <th style={estilos.th}>Nome</th>
                            <th style={{ ...estilos.th, textAlign: "right" }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carregando ? (
                            <tr>
                                <td colSpan={3} style={estilos.semCategorias}>
                                    Carregando...
                                </td>
                            </tr>
                        ) : !categoriasFiltradas || categoriasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={estilos.semCategorias}>
                                    Nenhuma categoria encontrada.
                                </td>
                            </tr>
                        ) : (
                            categoriasFiltradas.map(cat => (
                                <tr key={cat._id}>
                                    <td style={estilos.td}>{cat.nome || "—"}</td>
                                    <td style={{ ...estilos.td, textAlign: "right" }}>
                                        <a href={`/categorias/editar/${cat.nome}`} style={estilos.botaoEditar}>
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
