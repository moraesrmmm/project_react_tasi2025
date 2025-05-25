import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";

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
    },
    botaoAnexar: {
        padding: "8px 16px",
        background: "#e0e0e0",
        color: "#333",
        border: "none",
        borderRadius: 4,
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
        marginBottom: 18
    },
};

export default function EditarProduto() {
    const [id, setId] = useState("");
    const { nome } = useParams();
    const [nomeProduto, setNomeProduto] = useState("");
    const [quantidade, setQuantidade] = useState(0);
    const [preco, setPreco] = useState(0);
    const [categoria, setCategoria] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem, setImagem] = useState("");
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
        axios.get(`https://backend-completo.vercel.app/app/produtos/romulo_moraes/${nome}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (res.data && res.data[0]) {
                const prod = res.data[0];
                setId(prod._id);
                setNomeProduto(prod.nome || "");
                setQuantidade(prod.quantidade || 0);
                setPreco(prod.preco || 0);
                setCategoria(prod.categoria || "");
                setDescricao(prod.descricao || "");
                setImagem(prod.imagem || "");
            } else {
                setErro("Produto não encontrado.");
            }
        })
        .catch(() => setErro("Erro ao buscar produto."))
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
                `https://backend-completo.vercel.app/app/produtos`,
                {
                    id,
                    nome: nomeProduto,
                    quantidade: Number(quantidade),
                    preco: Number(preco),
                    categoria,
                    descricao,
                    imagem
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (resposta.data && resposta.data._id) {
                setSucesso("Produto atualizado!");
            } else {
                setErro(resposta.data.error ? resposta.data.error : "Erro ao atualizar produto.");
            }
        } catch (err) {
            setErro("Erro ao atualizar produto.");
        }
        setCarregando(false);
    };

    const aoExcluir = async () => {
        if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
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
            const response = await axios.delete(
                `https://backend-completo.vercel.app/app/produtos`,
                {
                    data: { id },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if(!response.data.error){
                setSucesso("Produto excluído!");
                setTimeout(() => navigate("/produtos"), 1200);
            }else{
                setErro(response.data.error ? response.data.error : "Erro ao excluir produto.");
            }
        } catch (err) {
            setErro("Erro ao excluir produto.");
        }
        setCarregando(false);
    };

    // Referência para o input de arquivo
    // ...restante do código...

    // Adicione estes estados e refs no início do componente
    const refArquivo = useRef(null);
    const [miniatura, setMiniatura] = useState("");

    // Função para clicar no input de arquivo
    const aoClicarAnexar = () => {
        if (refArquivo.current) refArquivo.current.click();
    };

    // Função para processar a imagem anexada
    const aoAnexarImagem = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setMiniatura(ev.target.result);
                setImagem(ev.target.result); // Salva a imagem como base64
            };
            reader.readAsDataURL(file);
        }
    };

    // Atualize o useEffect para mostrar miniatura se já houver imagem (URL)
    useEffect(() => {
        if (imagem && imagem.startsWith("data:")) {
            setMiniatura(imagem);
        } else if (imagem && imagem.startsWith("http")) {
            setMiniatura(imagem);
        } else {
            setMiniatura("");
        }
    }, [imagem]);

    return (
        <div>
            <div style={estilos.titulo}>
                <span role="img" aria-label="produto">📦</span> EDITAR PRODUTO
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
                    <a href={`/produtos`} style={{ color: "#BE1E21" }}>Voltar para listagem</a>
                </div>
            ) : (
                <form onSubmit={aoEnviar}>
                    <div style={estilos.grupoFormulario}>
                        <input type="text" name="nome" value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} required style={estilos.entrada} placeholder="Digite o nome do produto" disabled={carregando} />
                    </div>
                    <div style={estilos.grupoFormulario}>
                        <label style={estilos.rotulo}>Quantidade:</label>
                        <input type="number" name="quantidade" value={quantidade} onChange={e => setQuantidade(e.target.value)} required style={estilos.entrada} placeholder="Digite a quantidade" disabled={carregando} />
                    </div>
                    <div style={estilos.grupoFormulario}>
                        <label style={estilos.rotulo}>Preço:</label>
                        <input type="number" name="preco" value={preco} onChange={e => setPreco(e.target.value)} required style={estilos.entrada} placeholder="Digite o preço" step="0.01" disabled={carregando} />
                    </div>
                    <div style={estilos.grupoFormulario}>
                        <label style={estilos.rotulo}>Categoria:</label>
                        <input type="text" name="categoria" value={categoria} onChange={e => setCategoria(e.target.value)} required style={estilos.entrada} placeholder="Digite a categoria" disabled={carregando} />
                    </div>
                    <div style={estilos.grupoFormulario}>
                        <label style={estilos.rotulo}>Descrição:</label>
                        <textarea name="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} required style={{ ...estilos.entrada, minHeight: 60 }} placeholder="Digite a descrição" disabled={carregando} />
                    </div>
                    <div style={estilos.grupoFormulario}>
                        <div style={{ marginTop: 8, display: "flex", alignItems: "center" }}>
                            <button style={{ ...estilos.botaoAnexar }} type="button" onClick={aoClicarAnexar} disabled={carregando}>Anexar Imagem</button>
                            <input type="file" accept="image/*" ref={refArquivo} style={{ display: "none" }} onChange={aoAnexarImagem} disabled={carregando} />
                            {miniatura && (
                                <a href={miniatura} download="imagem_produto.png" title="Baixar imagem base64" style={{ marginLeft: 10, display: "inline-block" }}>
                                    <img src={miniatura} alt="Miniatura" style={{ maxHeight: 48, borderRadius: 4, verticalAlign: "middle", boxShadow: "0 1px 4px #0001", cursor: "pointer"}}/>
                                </a>
                            )}
                        </div>
                    </div>
                    <div style={estilos.linhaBotoes}>
                        <a href="/produtos" style={{ ...estilos.botao, ...estilos.botaoVoltar, textDecoration: "none", display: "inline-block", textAlign: "center" }}>Voltar</a>
                        <button type="button" onClick={aoExcluir} disabled={carregando} style={{ ...estilos.botao, background: "#888", ...(carregando ? estilos.botaoDesabilitado : {}) }}>Excluir</button>
                        <button type="submit" disabled={carregando} style={{ ...estilos.botao, ...(carregando ? estilos.botaoDesabilitado : {}) }}>{carregando ? "Salvando..." : "Salvar"}</button>
                    </div>
                </form>
            )}
        </div>
    );
}
