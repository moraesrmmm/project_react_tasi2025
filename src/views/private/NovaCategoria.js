import { useState } from "react";
import axios from "axios";

const estilos = {
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
        background: "#BE1E21", // alterado para usar rgba
        color: "#fff",
        border: "none",
        borderRadius: 4,
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 0.2s"
    },
    botaoDesabilitado: {
        background: "rgba(190, 30, 33, 0.5)", // alterado para usar rgba
        cursor: "not-allowed"
    },
    botaoVoltar: {
        background: "#eee",
        color: "#333"
    }
};

export default function NovaCategoria() {
    const [nomeCategoria, setNomeCategoria] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(null);
    const [erro, setErro] = useState(null);

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
            const resposta = await axios.post(
            "https://backend-completo.vercel.app/app/categorias",
            { nome_categoria: nomeCategoria },
            {
                headers: {
                Authorization: `Bearer ${token}`
                }
            }
            );
            console.log(resposta.data);
            if (resposta.data && resposta.data._id) {
                setSucesso("Categoria cadastrada!");
                setNomeCategoria("");
            } else {
                setErro(resposta.data.error ? resposta.data.error : "Erro ao cadastrar categoria. Tente novamente mais tarde.");
            }
        } catch (err) {
            setErro("Erro ao cadastrar categoria. Tente novamente.");
        }
        setCarregando(false);
    };

    return (
        <div>
            <div style={estilos.titulo}>
                <span role="img" aria-label="categoria">📁</span>
                NOVA CATEGORIA
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
                    {typeof sucesso === "string" ? sucesso : "Categoria cadastrada com sucesso."}
                    <br />
                    <a href="" onClick={e => { e.preventDefault(); setSucesso(null); }}>Cadastrar outra categoria</a> ou{" "}
                    <a href="/categorias">voltar para listagem</a>
                </div>
            ) : (
                <form onSubmit={aoEnviar}>
                    <div style={estilos.grupoFormulario}>
                        <label style={estilos.rotulo}>Nome da Categoria:</label>
                        <input type="text" name="nome_categoria" value={nomeCategoria} onChange={e => setNomeCategoria(e.target.value)} required style={estilos.entrada} placeholder="Digite o nome da categoria"/>
                    </div>
                    <div style={estilos.linhaBotoes}>
                        <a href="/categorias" style={{ ...estilos.botao, ...estilos.botaoVoltar, textDecoration: "none", display: "inline-block", textAlign: "center" }}>
                            Voltar
                        </a>
                        <button type="submit" disabled={carregando} style={{ ...estilos.botao, ...(carregando ? estilos.botaoDesabilitado : {}) }}>
                            {carregando ? "Cadastrando..." : "Cadastrar"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
