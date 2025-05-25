import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const estilos = {
    // ... (mantém igual)
    titulo: {
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        gap: 10
    },
    hr: {
        border: 0,
        borderTop: "2px solid #eee",
        margin: "10px 0 24px 0"
    },
    grupoFormulario: {
        marginBottom: 18,
        display: "flex",
        flexDirection: "column"
    },
    rotulo: {
        marginBottom: 6,
        fontWeight: 500,
        color: "#333"
    },
    entrada: {
        padding: "8px 10px",
        border: "1px solid #ccc",
        borderRadius: 4,
        fontSize: 16,
        outline: "none",
        background: "#fafbfc"
    },
    linhaBotoes: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 10
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
    botaoDesabilitado: {
        background: "rgba(190, 30, 33, 0.5)",
        cursor: "not-allowed"
    },
    botaoVoltar: {
        background: "#eee",
        color: "#333"
    }
};

export default function EditarCategoria() {
    const { nome } = useParams(); // nome da categoria na URL
    const [nomeCategoria, setNomeCategoria] = useState("");
    const [idCategoria, setIdCategoria] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(null);
    const [erro, setErro] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setErro("Token não encontrado. Faça login novamente.");
            return;
        }
        setCarregando(true);
        axios.get(`https://backend-completo.vercel.app/app/categorias?nome_categoria=teste`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {

            console.log(res.data);

            if (res.data && res.data[0].nome) {
                setNomeCategoria(res.data[0].nome);
                setIdCategoria(res.data[0]._id);
            } else {
                setErro("Categoria não encontrada.");
            }
        })
        .catch(() => setErro("Erro ao buscar categoria."))
        .finally(() => setCarregando(false));
    }, [nome]);

    const aoEnviar = async (e) => {
        e.preventDefault();
        setCarregando(true);
        setErro(null);
        setSucesso(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setErro("Token não encontrado. Faça login novamente.");
            setCarregando(false);
            return;
        }
        try {
            const resposta = await axios.put(
                `https://backend-completo.vercel.app/app/categorias`,
                { 
                    nome_categoria: nomeCategoria, 
                    id: idCategoria  // Passando o ID da categoria
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (resposta.data && resposta.data._id) {
                setSucesso("Categoria atualizada!");
            } else {
                setErro(resposta.data.error ? resposta.data.error : "Erro ao atualizar categoria.");
            }
        } catch (err) {
            setErro("Erro ao atualizar categoria.");
        }
        setCarregando(false);
    };

    const aoExcluir = async () => {
        if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
        setCarregando(true);
        setErro(null);
        setSucesso(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setErro("Token não encontrado. Faça login novamente.");
            setCarregando(false);
            return;
        }
        try {
            console.log("Excluindo categoria com ID:", idCategoria);
            console.log("Token:", token);
           const response = await axios.delete(
                `https://backend-completo.vercel.app/app/categorias`,
                {
                    data: { id: idCategoria },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if(!response.data.error){
                setSucesso("Categoria excluída!");
                setTimeout(() => navigate("/categorias"), 1200);
            }else{
                console.log(response.data.error);
                setErro(response.data.error ? response.data.error : "Erro ao excluir categoria.");
            }

        } catch (err) {
            setErro("Erro ao excluir categoria.");
        }
        setCarregando(false);
    };

    return (
        <div>
            <div style={estilos.titulo}>
                <span role="img" aria-label="categoria">📁</span>
                EDITAR CATEGORIA
            </div>
            <hr style={estilos.hr} />
            {erro && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 10, backgroundColor: "#BE1E21", padding: 10, borderRadius: 4 }}>
                    <span style={{ fontWeight: "bold", color: "#fff", fontSize: 18, marginBottom: 0 }}>Ocorreu um erro</span>
                    <span style={{ color: "#fff", textAlign: "center" }}>{erro}</span>
                </div>
            )}
            {sucesso ? (
                <div style={{ color: "green", marginBottom: 10 }}>
                    {sucesso}
                    <br />
                    <a href={`/categorias`} style={{ color: "#BE1E21" }}>Voltar para listagem</a>
                </div>
            ) : (
                <form onSubmit={aoEnviar}>
                    <div style={estilos.grupoFormulario}>
                        <label style={estilos.rotulo}>Nome da Categoria:</label>
                        <input
                            type="text"
                            name="nome_categoria"
                            value={nomeCategoria}
                            onChange={e => setNomeCategoria(e.target.value)}
                            required
                            style={estilos.entrada}
                            placeholder="Digite o nome da categoria"
                            disabled={carregando}
                        />
                    </div>
                    <div style={estilos.linhaBotoes}>
                        <a href="/categorias" style={{ ...estilos.botao, ...estilos.botaoVoltar, textDecoration: "none", display: "inline-block", textAlign: "center" }}>
                            Voltar
                        </a>
                        <button
                            type="button"
                            onClick={aoExcluir}
                            disabled={carregando}
                            style={{
                                ...estilos.botao,
                                background: "#888",
                                ...(carregando ? estilos.botaoDesabilitado : {})
                            }}
                        >
                            Excluir
                        </button>
                        <button type="submit" disabled={carregando} style={{ ...estilos.botao, ...(carregando ? estilos.botaoDesabilitado : {}) }}>
                            {carregando ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
