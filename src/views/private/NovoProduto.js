import React, { useState } from "react";
import axios from "axios";

const estadoInicial = {
    nome: "",
    quantidade: "",
    preco: "",
    categoria: "",
    descricao: "",
    usuario: "romulo_moraes",
    imagem: ""
};

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
    linhaFormulario: {
        display: "flex",
        gap: 12,
        marginBottom: 18
    },
    grupoFormulario: {
        marginBottom: 10,
        display: "flex",
        flexDirection: "column",
        flex: 1
    },
    grupoFormularioSemMarginBottom: {
        display: "flex",
        flexDirection: "column",
        flex: 1
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
        transition: "border 0.2s",
        background: "#fafbfc"
    },
    areaTexto: {
        padding: "8px 10px",
        border: "1px solid #ccc",
        borderRadius: 4,
        fontSize: 16,
        minHeight: 60,
        resize: "vertical",
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
        background: "#90caf9",
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
    entradaArquivoOculta: {
        display: "none"
    }
};

export default function NovoProduto() {
    const [formulario, setFormulario] = useState(estadoInicial);
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(null);
    const [erro, setErro] = useState(null);
    const refArquivo = React.useRef();
    const [categorias, setCategorias] = useState([]);
    const [miniatura, setMiniatura] = useState(null);

    const aoMudar = (e) => {
        const { name, value } = e.target;
        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));
    };

    const aoClicarAnexar = (e) => {
        e.preventDefault();
        refArquivo.current.click();
    };

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
                "https://backend-completo.vercel.app/app/produtos",
                {
                    ...formulario,
                    quantidade: Number(formulario.quantidade),
                    preco: Number(parseMoeda(formulario.preco))
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setSucesso(resposta.data._id);
            setFormulario(estadoInicial);
        } catch (err) {
            setErro(
                err.response?.data?.message ||
                "Erro ao cadastrar produto. Tente novamente."
            );
        }
        setCarregando(false);
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

    const aoMudarPreco = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/[^\d,]/g, "");
        const formatado = formatarMoeda(valor);
        setFormulario((anterior) => ({
            ...anterior,
            preco: formatado
        }));
    };

    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        axios
            .get("https://backend-completo.vercel.app/app/categorias", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setCategorias(res.data))
            .catch(() => setCategorias([]));
    }, []);

    const aoAnexarImagem = (e) => {
        const arquivo = e.target.files[0];
        if (arquivo) {
            const leitor = new FileReader();
            leitor.onload = (ev) => {
                setMiniatura(ev.target.result);
                setFormulario((anterior) => ({
                    ...anterior,
                    imagem: ev.target.result
                }));
            };
            leitor.readAsDataURL(arquivo);
        }
    };

    return (
        <div>
            <div style={estilos.titulo}><span role="img" aria-label="produto">📦</span> NOVO CADASTRO DE PRODUTO</div>
            <hr style={estilos.hr} />
            {erro && (<div style={{ color: "red", marginBottom: 10 }}>{erro}</div>)}
            {sucesso ? (
                <div style={{ color: "white", marginBottom: 10, backgroundColor: "green", padding: 10, borderRadius: 4, textAlign: "center" }}>
                    Produto código: <b>{sucesso}</b> cadastrado com sucesso.<br />
                    <a style={{color: "white"}} href="" onClick={e => {e.preventDefault(); setSucesso(null);}}>Clique aqui para cadastrar um novo produto</a> <span style={{color: "white"}}>ou{" "}</span>
                    <a style={{color: "white"}} href="/produtos">clique aqui para voltar para listagem</a>
                </div>
            ) : (
                <form onSubmit={aoEnviar}>
                    <div style={estilos.linhaFormulario}>
                        <div style={estilos.grupoFormularioSemMarginBottom}>
                            <label style={estilos.rotulo}>Nome:</label>
                            <input type="text" name="nome" value={formulario.nome} onChange={aoMudar} required style={estilos.entrada}/>
                        </div>
                        <div style={estilos.grupoFormularioSemMarginBottom}>
                            <label style={estilos.rotulo}>Quantidade:</label>
                            <input type="number" name="quantidade" value={formulario.quantidade} onChange={aoMudar} required min="0" style={estilos.entrada}/>
                        </div>
                        <div style={estilos.grupoFormularioSemMarginBottom}>
                            <label style={estilos.rotulo}>Preço:</label>
                            <input type="text" name="preco" value={formulario.preco} onChange={aoMudarPreco} required min="0" style={estilos.entrada} inputMode="decimal" pattern="^\d{1,3}(\.\d{3})*,\d{2}$" placeholder="0,00"/>
                        </div>
                        <div style={estilos.grupoFormularioSemMarginBottom}>
                            <label style={estilos.rotulo}>Categoria:</label>
                            <select name="categoria" value={formulario.categoria} onChange={aoMudar} required style={estilos.entrada}>
                                <option value="">Selecione...</option>
                                {categorias && categorias.length > 0 ? (
                                    categorias.map(cat => (
                                        <option key={cat._id} value={cat.nome}>{cat.nome}</option>
                                    ))
                                ) : (
                                    <option value="" disabled>Nenhuma categoria encontrada</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div style={estilos.grupoFormulario}>
                        <label style={estilos.rotulo}>Descrição:</label>
                        <textarea name="descricao" value={formulario.descricao} onChange={aoMudar} required style={estilos.areaTexto}/>
                    </div>
                    <div>
                        <button style={estilos.botaoAnexar} onClick={aoClicarAnexar} type="button">Anexar Imagem</button>
                        <input type="file" accept="image/*" ref={refArquivo} style={estilos.entradaArquivoOculta} onChange={aoAnexarImagem}/>
                        {miniatura && (
                            <img src={miniatura} alt="Miniatura" style={{ marginLeft: 10, maxHeight: 48, borderRadius: 4, verticalAlign: "middle", boxShadow: "0 1px 4px #0001" }}/>
                        )}
                    </div>
                    <div style={estilos.linhaBotoes}>
                        <a href="/produtos" style={{ ...estilos.botao, ...estilos.botaoVoltar, textDecoration: "none", display: "inline-block", textAlign: "center" }}>Voltar</a>
                        <button type="submit" disabled={carregando} style={{ ...estilos.botao, ...(carregando ? estilos.botaoDesabilitado : {})}}>{carregando ? "Cadastrando..." : "Cadastrar Produto"}</button>
                    </div>
                </form>
            )}
        </div>
    );
}
