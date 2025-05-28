import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

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
    const [preco, setPreco] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem, setImagem] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(null);
    const [erro, setErro] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [miniatura, setMiniatura] = useState("");
    const refArquivo = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setErro("Token não encontrado. Faça login novamente.");
            return;
        }

        setCarregando(true);

        const buscarCategorias = axios.get("https://backend-completo.vercel.app/app/categorias", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const buscarProduto = axios.get(`https://backend-completo.vercel.app/app/produtos/romulo_moraes/${nome}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        Promise.all([buscarCategorias, buscarProduto])
            .then(([resCat, resProd]) => {
                setCategorias(resCat.data || []);
                const prod = resProd.data?.[0];
                if (prod) {
                    setId(prod._id);
                    setNomeProduto(prod.nome || "");
                    setQuantidade(prod.quantidade || 0);
                    setPreco(formatarMoeda(String(prod.preco)));
                    setCategoria(prod.categoria || "");
                    setDescricao(prod.descricao || "");
                    setImagem(prod.imagem || "");
                } else {
                    setErro("Produto não encontrado.");
                }
            })
            .catch(() => setErro("Erro ao buscar dados."))
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
                    preco: Number(parseMoeda(preco)),
                    categoria,
                    descricao,
                    imagem
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (resposta.data && resposta.data._id) {
                setSucesso("Produto atualizado!");
            } else {
                setErro(resposta.data.error || "Erro ao atualizar produto.");
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
            if (!response.data.error) {
                setSucesso("Produto excluído!");
                setTimeout(() => navigate("/produtos"), 1200);
            } else {
                setErro(response.data.error || "Erro ao excluir produto.");
            }
        } catch (err) {
            setErro("Erro ao excluir produto.");
        }
        setCarregando(false);
    };

    const aoClicarAnexar = () => {
        if (refArquivo.current) refArquivo.current.click();
    };

    const aoAnexarImagem = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setMiniatura(ev.target.result);
                setImagem(ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    function formatarMoeda(valor) {
        if (!valor) return "";
        let v = valor.replace(/\D/g, "");
        v = (Number(v) / 100).toFixed(2) + "";
        v = v.replace(".", ",");
        v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        return v;
    }

    function parseMoeda(valor) {
        if (!valor) return "";
        return valor.replace(/\./g, "").replace(",", ".");
    }

    useEffect(() => {
        if (imagem?.startsWith("data:") || imagem?.startsWith("http")) {
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
                    <span style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>Ocorreu um erro</span>
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
                        <label style={estilos.rotulo}>Nome:</label>
                        <input type="text" value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} required style={estilos.entrada} disabled={carregando} />
                    </div>
                    <div style={estilos.grupoFormulario}>
                        <label style={estilos.rotulo}>Quantidade:</label>
                        <input type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} required style={estilos.entrada} disabled={carregando} />
                    </div>
                    <div style={estilos.grupoFormulario}>
                        <label style={estilos.rotulo}>Preço:</label>
                        <input type="text" value={preco} onChange={e => setPreco(formatarMoeda(e.target.value))} required style={estilos.entrada} disabled={carregando} placeholder="0,00" />
                    </div>
                    <div style={estilos.grupoFormulario}>
                        <label style={estilos.rotulo}>Categoria:</label>
                        <select name="categoria" value={categoria} onChange={e => setCategoria(e.target.value)} required disabled={carregando} style={estilos.entrada}>
                            <option value="">Selecione...</option>
                            {categorias.length > 0 ? (
                                categorias.map(cat => (
                                    <option key={cat._id} value={cat.nome}>{cat.nome}</option>
                                ))
                            ) : (
                                <option value="" disabled>Nenhuma categoria encontrada</option>
                            )}
                        </select>
                    </div>
                    <div style={estilos.grupoFormulario}>
                        <label style={estilos.rotulo}>Descrição:</label>
                        <textarea value={descricao} onChange={e => setDescricao(e.target.value)} required style={{ ...estilos.entrada, minHeight: 60 }} disabled={carregando} />
                    </div>
                    <div style={estilos.grupoFormulario}>
                        <button type="button" style={estilos.botaoAnexar} onClick={aoClicarAnexar} disabled={carregando}>Anexar Imagem</button>
                        <input type="file" accept="image/*" ref={refArquivo} style={{ display: "none" }} onChange={aoAnexarImagem} disabled={carregando} />
                        {miniatura && (
                            <a href={miniatura} download="imagem_produto.png" title="Baixar imagem" style={{ marginLeft: 10, display: "inline-block" }}>
                                <img src={miniatura} alt="Miniatura" style={{ maxHeight: 48, borderRadius: 4, verticalAlign: "middle", boxShadow: "0 1px 4px #0001", cursor: "pointer" }} />
                            </a>
                        )}
                    </div>
                    <div style={estilos.linhaBotoes}>
                        <a href="/produtos" style={{ ...estilos.botao, ...estilos.botaoVoltar, textDecoration: "none", textAlign: "center" }}>Voltar</a>
                        <button type="button" onClick={aoExcluir} disabled={carregando} style={{ ...estilos.botao, background: "#888", ...(carregando ? estilos.botaoDesabilitado : {}) }}>Excluir</button>
                        <button type="submit" disabled={carregando} style={{ ...estilos.botao, ...(carregando ? estilos.botaoDesabilitado : {}) }}>{carregando ? "Salvando..." : "Salvar"}</button>
                    </div>
                </form>
            )}
        </div>
    );
}
