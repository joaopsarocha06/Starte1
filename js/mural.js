/* ==========================================================================
   MURAL DOCENTE — SUPABASE
   ========================================================================== */

const SUPABASE_URL =
    "https://fdpytnlvkdfvumejlbip.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_G2loVvADj59-2OQZVNhl5w_PA4bIYgf";


/* ==========================================================================
   INICIALIZAÇÃO
   ========================================================================== */

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* ==========================================================================
   ESTADO DA APLICAÇÃO
   ========================================================================== */

let alunos = [];
let observacoes = [];

let alunoAtual = null;


/* ==========================================================================
   ELEMENTOS
   ========================================================================== */

const campoBusca =
    document.getElementById("buscarAluno");

const filtroTurma =
    document.getElementById("filtroTurma");

const filtroCurso =
    document.getElementById("filtroCurso");

const btnFiltrar =
    document.getElementById("btnFiltrar");

const listaAlunos =
    document.getElementById("listaAlunos");

const contadorAlunos =
    document.getElementById("contadorAlunos");

const statusAlunos =
    document.getElementById("statusAlunos");

const totalAlunos =
    document.getElementById("totalAlunos");

const alunosComObservacao =
    document.getElementById("alunosComObservacao");

const alunosSemObservacao =
    document.getElementById("alunosSemObservacao");

const percentualAcompanhados =
    document.getElementById("percentualAcompanhados");

const listaObservacoesRecentes =
    document.getElementById(
        "listaObservacoesRecentes"
    );


/* MODAL */

const modal =
    document.getElementById("modal");

const alunoSelecionado =
    document.getElementById(
        "alunoSelecionado"
    );

const alunoSelecionadoId =
    document.getElementById(
        "alunoSelecionadoId"
    );

const tipoObservacao =
    document.getElementById(
        "tipoObservacao"
    );

const textoObservacao =
    document.getElementById(
        "textoObservacao"
    );

const btnSalvarObservacao =
    document.getElementById(
        "btnSalvarObservacao"
    );

const btnFecharModal =
    document.getElementById(
        "btnFecharModal"
    );

const btnCancelarModal =
    document.getElementById(
        "btnCancelarModal"
    );

const contadorCaracteres =
    document.getElementById(
        "contadorCaracteres"
    );


/* MODAL HISTÓRICO */

const modalObservacoes =
    document.getElementById(
        "modalObservacoes"
    );

const listaTodasObservacoes =
    document.getElementById(
        "listaTodasObservacoes"
    );

const btnVerTodas =
    document.getElementById(
        "btnVerTodas"
    );

const btnTodasObservacoes =
    document.getElementById(
        "btnTodasObservacoes"
    );

const btnFecharObservacoes =
    document.getElementById(
        "btnFecharObservacoes"
    );


/* ==========================================================================
   UTILITÁRIOS
   ========================================================================== */

function escaparHTML(valor) {

    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function normalizarTexto(valor) {

    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}


function formatarData(data) {

    if (!data) {
        return "Sem data";
    }

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return "Sem data";
    }

    return dataObj.toLocaleDateString(
        "pt-BR"
    );
}


function formatarDataHora(data) {

    if (!data) {
        return "Sem data";
    }

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return "Sem data";
    }

    return dataObj.toLocaleString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function obterNomeCurso(curso) {

    const valor = normalizarTexto(curso);

    if (valor.includes("informat")) {
        return "Técnico em Informática";
    }

    if (
        valor.includes("administr")
    ) {
        return "Técnico em Administração";
    }

    return curso || "Curso não informado";
}


/* ==========================================================================
   STATUS
   ========================================================================== */

function mostrarStatusAlunos(
    mensagem,
    tipo = "loading"
) {

    if (!statusAlunos) {
        return;
    }

    let icone =
        '<i class="fa-solid fa-spinner fa-spin"></i>';

    if (tipo === "erro") {
        icone =
            '<i class="fa-solid fa-triangle-exclamation"></i>';
    }

    if (tipo === "vazio") {
        icone =
            '<i class="fa-regular fa-face-frown"></i>';
    }

    statusAlunos.innerHTML = `
        ${icone}
        <span>${escaparHTML(mensagem)}</span>
    `;

    statusAlunos.style.display = "flex";
}


function esconderStatusAlunos() {

    if (!statusAlunos) {
        return;
    }

    statusAlunos.style.display = "none";
}


/* ==========================================================================
   CARREGAR TURMAS
   ========================================================================== */

async function carregarTurmas() {

    if (!filtroTurma) {
        return;
    }

    const {
        data,
        error
    } = await supabaseClient
        .from("turmas")
        .select("id, nome, curso")
        .order("nome", {
            ascending: true
        });


    if (error) {

        console.error(
            "Erro ao carregar turmas:",
            error
        );

        return;
    }


    const turmas = data || [];

    filtroTurma.innerHTML = `
        <option value="">
            Todas as turmas
        </option>
    `;


    turmas.forEach(turma => {

        const option =
            document.createElement("option");

        option.value = turma.id;

        option.textContent =
            `${turma.nome || "Turma"}${
                turma.curso
                    ? ` — ${obterNomeCurso(turma.curso)}`
                    : ""
            }`;

        filtroTurma.appendChild(option);

    });

}


/* ==========================================================================
   CARREGAR CURSOS
   ========================================================================== */

async function carregarCursos() {

    if (!filtroCurso) {
        return;
    }

    const cursosUnicos =
        new Map();


    alunos.forEach(aluno => {

        const turma =
            Array.isArray(aluno.turmas)
                ? aluno.turmas[0]
                : aluno.turmas;

        if (!turma?.curso) {
            return;
        }

        const cursoOriginal =
            turma.curso;

        const chave =
            normalizarTexto(cursoOriginal);

        if (!cursosUnicos.has(chave)) {

            cursosUnicos.set(
                chave,
                cursoOriginal
            );

        }

    });


    filtroCurso.innerHTML = `
        <option value="">
            Todos os cursos
        </option>
    `;


    [...cursosUnicos.entries()]
        .sort((a, b) =>
            String(a[1]).localeCompare(
                String(b[1]),
                "pt-BR"
            )
        )
        .forEach(
            ([valorNormalizado, curso]) => {

                const option =
                    document.createElement("option");

                option.value =
                    valorNormalizado;

                option.textContent =
                    obterNomeCurso(curso);

                filtroCurso.appendChild(option);

            }
        );

}


/* ==========================================================================
   CARREGAR ALUNOS
   ========================================================================== */

async function carregarAlunos() {

    mostrarStatusAlunos(
        "Carregando alunos..."
    );


    const {
        data,
        error
    } = await supabaseClient
        .from("alunos")
        .select(`
            id,
            nome,
            turma_id,
            turmas (
                id,
                nome,
                curso
            )
        `)
        .order("nome", {
            ascending: true
        });


    if (error) {

        console.error(
            "Erro ao carregar alunos:",
            error
        );

        mostrarStatusAlunos(
            "Não foi possível carregar os alunos.",
            "erro"
        );

        return;
    }


    alunos = data || [];


    await carregarCursos();

    renderizarAlunos(alunos);

    atualizarResumo(alunos);

}


/* ==========================================================================
   FILTROS
   ========================================================================== */

function obterAlunosFiltrados() {

    const textoBusca =
        normalizarTexto(
            campoBusca?.value
        );

    const turmaSelecionada =
        filtroTurma?.value || "";

    const cursoSelecionado =
        filtroCurso?.value || "";


    return alunos.filter(aluno => {

        const turma =
            Array.isArray(aluno.turmas)
                ? aluno.turmas[0]
                : aluno.turmas;


        const nomeAluno =
            normalizarTexto(
                aluno.nome
            );


        const cursoAluno =
            normalizarTexto(
                turma?.curso
            );


        const correspondeNome =
            !textoBusca ||
            nomeAluno.includes(
                textoBusca
            );


        const correspondeTurma =
            !turmaSelecionada ||
            String(aluno.turma_id) ===
                String(turmaSelecionada);


        const correspondeCurso =
            !cursoSelecionado ||
            cursoAluno ===
                cursoSelecionado;


        return (
            correspondeNome &&
            correspondeTurma &&
            correspondeCurso
        );

    });

}


/* ==========================================================================
   FILTRAR
   ========================================================================== */

function filtrarAlunos() {

    const alunosFiltrados =
        obterAlunosFiltrados();

    renderizarAlunos(
        alunosFiltrados
    );

    atualizarResumo(
        alunosFiltrados
    );

}


/* Compatibilidade com código antigo */

window.filtrarAlunos =
    filtrarAlunos;


/* ==========================================================================
   RENDERIZAR ALUNOS
   ========================================================================== */

function renderizarAlunos(
    lista
) {

    if (!listaAlunos) {
        return;
    }


    listaAlunos.innerHTML = "";


    if (!lista.length) {

        mostrarStatusAlunos(
            "Nenhum aluno encontrado com os filtros selecionados.",
            "vazio"
        );

        atualizarContador(0);

        return;
    }


    esconderStatusAlunos();


    lista.forEach(aluno => {

        const turma =
            Array.isArray(aluno.turmas)
                ? aluno.turmas[0]
                : aluno.turmas;


        const observacoesAluno =
            observacoes.filter(
                obs =>
                    String(obs.aluno_id) ===
                    String(aluno.id)
            );


        const ultimaObservacao =
            observacoesAluno
                .sort(
                    (a, b) =>
                        new Date(b.created_at) -
                        new Date(a.created_at)
                )[0];


        const artigo =
            document.createElement("article");

        artigo.className =
            "aluno";

        artigo.dataset.nome =
            aluno.nome || "";

        artigo.dataset.turma =
            turma?.nome || "";

        artigo.dataset.curso =
            turma?.curso || "";

        artigo.dataset.id =
            aluno.id;


        artigo.innerHTML = criarCardAluno(
            aluno,
            turma,
            ultimaObservacao
        );


        listaAlunos.appendChild(
            artigo
        );

    });


    atualizarContador(
        lista.length
    );

}


/* ==========================================================================
   CARD DO ALUNO
   ========================================================================== */

function criarCardAluno(
    aluno,
    turma,
    ultimaObservacao
) {

    const nome =
        escaparHTML(
            aluno.nome ||
            "Aluno sem nome"
        );


    const curso =
        escaparHTML(
            obterNomeCurso(
                turma?.curso
            )
        );


    const nomeTurma =
        escaparHTML(
            turma?.nome ||
            "Turma não informada"
        );


    let blocoObservacao = "";


    if (ultimaObservacao) {

        blocoObservacao = `
            <div class="ultima-observacao">

                <span>
                    Última observação:
                    <strong>
                        ${escaparHTML(
                            formatarData(
                                ultimaObservacao.created_at
                            )
                        )}
                    </strong>
                </span>

                <p>
                    "${escaparHTML(
                        ultimaObservacao.texto
                    )}"
                </p>

            </div>
        `;

    } else {

        blocoObservacao = `
            <div class="ultima-observacao sem-observacao">

                <span>
                    Nenhuma observação registrada
                </span>

                <p>
                    Seja o primeiro a registrar uma observação.
                </p>

            </div>
        `;

    }


    return `

        <div class="avatar">
            <i class="fa-solid fa-user"></i>
        </div>


        <div class="aluno-info">

            <h3>
                ${nome}
            </h3>

            <span>
                ${curso}
                •
                ${nomeTurma}
            </span>

        </div>


        ${blocoObservacao}


        <div class="acoes">

            <button
                type="button"
                class="btn-perfil"
                data-acao="perfil"
                data-aluno-id="${escaparHTML(
                    aluno.id
                )}"
            >

                <i class="fa-regular fa-eye"></i>

                Ver perfil

            </button>


            <button
                type="button"
                class="btn-observacao"
                data-acao="observacao"
                data-aluno-id="${escaparHTML(
                    aluno.id
                )}"
            >

                <i class="fa-solid fa-plus"></i>

                Observação

            </button>

        </div>

    `;

}


/* ==========================================================================
   CONTADOR
   ========================================================================== */

function atualizarContador(
    quantidade
) {

    if (!contadorAlunos) {
        return;
    }


    contadorAlunos.textContent =
        quantidade === 1
            ? "1 aluno"
            : `${quantidade} alunos`;

}


/* ==========================================================================
   RESUMO
   ========================================================================== */

function atualizarResumo(
    lista
) {

    const total =
        lista.length;


    const idsComObservacao =
        new Set(
            observacoes
                .filter(obs =>
                    lista.some(
                        aluno =>
                            String(
                                aluno.id
                            ) ===
                            String(
                                obs.aluno_id
                            )
                    )
                )
                .map(
                    obs =>
                        String(
                            obs.aluno_id
                        )
                )
        );


    const comObservacao =
        idsComObservacao.size;


    const semObservacao =
        Math.max(
            total - comObservacao,
            0
        );


    const percentual =
        total > 0
            ? Math.round(
                (
                    comObservacao /
                    total
                ) * 100
            )
            : 0;


    if (totalAlunos) {
        totalAlunos.textContent =
            total;
    }


    if (alunosComObservacao) {
        alunosComObservacao.textContent =
            comObservacao;
    }


    if (alunosSemObservacao) {
        alunosSemObservacao.textContent =
            semObservacao;
    }


    if (percentualAcompanhados) {
        percentualAcompanhados.textContent =
            `${percentual}%`;
    }

}


/* ==========================================================================
   CARREGAR OBSERVAÇÕES
   ========================================================================== */

async function carregarObservacoes() {

    const {
        data,
        error
    } = await supabaseClient
        .from("observacoes")
        .select(`
            id,
            aluno_id,
            professor_id,
            tipo,
            texto,
            created_at,
            alunos (
                id,
                nome
            )
        `)
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Erro ao carregar observações:",
            error
        );

        observacoes = [];

        renderizarObservacoesRecentes();

        atualizarResumo(
            obterAlunosFiltrados()
        );

        return;
    }


    observacoes =
        data || [];


    renderizarObservacoesRecentes();

    atualizarResumo(
        obterAlunosFiltrados()
    );

    renderizarAlunos(
        obterAlunosFiltrados()
    );

}


/* ==========================================================================
   OBSERVAÇÕES RECENTES
   ========================================================================== */

function renderizarObservacoesRecentes() {

    if (!listaObservacoesRecentes) {
        return;
    }


    const recentes =
        observacoes
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            )
            .slice(0, 3);


    if (!recentes.length) {

        listaObservacoesRecentes.innerHTML = `

            <div class="sem-observacoes">

                <i class="fa-regular fa-file-lines"></i>

                <span>
                    Nenhuma observação registrada.
                </span>

            </div>

        `;

        return;
    }


    listaObservacoesRecentes.innerHTML =
        recentes
            .map(obs => {

                const nome =
                    obs.alunos?.nome ||
                    "Aluno";


                return `

                    <div class="observacao-item">

                        <div class="obs-icon">

                            <i
                                class="fa-regular fa-file-lines"
                                aria-hidden="true"
                            ></i>

                        </div>


                        <div>

                            <strong>
                                ${escaparHTML(
                                    nome
                                )}
                            </strong>

                            <small>
                                ${escaparHTML(
                                    formatarDataHora(
                                        obs.created_at
                                    )
                                )}
                            </small>

                            <p>
                                "${escaparHTML(
                                    obs.texto
                                )}"
                            </p>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* ==========================================================================
   ABRIR MODAL
   ========================================================================== */

function abrirModal(
    alunoId
) {

    const aluno =
        alunos.find(
            item =>
                String(item.id) ===
                String(alunoId)
        );


    if (!aluno) {

        console.error(
            "Aluno não encontrado:",
            alunoId
        );

        return;
    }


    alunoAtual =
        aluno;


    alunoSelecionado.value =
        aluno.nome || "";


    alunoSelecionadoId.value =
        aluno.id;


    tipoObservacao.value =
        "Desempenho acadêmico";


    textoObservacao.value =
        "";


    atualizarContadorCaracteres();


    modal.classList.add(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(() => {

        textoObservacao.focus();

    }, 100);

}


/* Compatibilidade */

window.abrirModal =
    abrirModal;


/* ==========================================================================
   FECHAR MODAL
   ========================================================================== */

function fecharModal() {

    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    alunoAtual =
        null;

}


/* ==========================================================================
   SALVAR OBSERVAÇÃO
   ========================================================================== */

async function salvarObservacao() {

    if (!alunoAtual) {

        alert(
            "Selecione um aluno antes de salvar."
        );

        return;
    }


    const texto =
        textoObservacao.value.trim();


    if (!texto) {

        alert(
            "Digite uma observação antes de salvar."
        );

        textoObservacao.focus();

        return;
    }


    if (texto.length < 3) {

        alert(
            "A observação precisa ter pelo menos 3 caracteres."
        );

        textoObservacao.focus();

        return;
    }


    btnSalvarObservacao.disabled =
        true;


    btnSalvarObservacao.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Salvando...
    `;


    try {

        const {
            data: {
                user
            }
        } =
            await supabaseClient
                .auth
                .getUser();


        if (!user) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );

            return;
        }


        const novaObservacao = {

            aluno_id:
                alunoAtual.id,

            professor_id:
                user.id,

            tipo:
                tipoObservacao.value,

            texto:
                texto

        };


        const {
            data,
            error
        } =
            await supabaseClient
                .from("observacoes")
                .insert(
                    novaObservacao
                )
                .select(`
                    id,
                    aluno_id,
                    professor_id,
                    tipo,
                    texto,
                    created_at,
                    alunos (
                        id,
                        nome
                    )
                `)
                .single();


        if (error) {
            throw error;
        }


        observacoes.unshift(
            data
        );


        alert(
            "Observação registrada com sucesso!"
        );


        fecharModal();


        renderizarObservacoesRecentes();


        const alunosFiltrados =
            obterAlunosFiltrados();


        renderizarAlunos(
            alunosFiltrados
        );


        atualizarResumo(
            alunosFiltrados
        );


    } catch (error) {

        console.error(
            "Erro ao salvar observação:",
            error
        );


        alert(
            "Não foi possível salvar a observação. Verifique sua conexão e tente novamente."
        );

    } finally {

        btnSalvarObservacao.disabled =
            false;

        btnSalvarObservacao.innerHTML = `
            <i class="fa-solid fa-check"></i>
            Salvar observação
        `;

    }

}


/* ==========================================================================
   HISTÓRICO COMPLETO
   ========================================================================== */

function abrirTodasObservacoes() {

    if (!modalObservacoes) {
        return;
    }


    if (!observacoes.length) {

        listaTodasObservacoes.innerHTML = `

            <div class="lista-vazia">

                <i class="fa-regular fa-file-lines"></i>

                <span>
                    Nenhuma observação foi registrada.
                </span>

            </div>

        `;

    } else {

        listaTodasObservacoes.innerHTML =
            observacoes
                .slice()
                .sort(
                    (a, b) =>
                        new Date(b.created_at) -
                        new Date(a.created_at)
                )
                .map(obs => {

                    const nome =
                        obs.alunos?.nome ||
                        "Aluno";


                    return `

                        <article class="observacao-historico">

                            <div class="observacao-historico-topo">

                                <strong>
                                    ${escaparHTML(
                                        nome
                                    )}
                                </strong>

                                <small>
                                    ${escaparHTML(
                                        formatarDataHora(
                                            obs.created_at
                                        )
                                    )}
                                </small>

                            </div>


                            <span class="observacao-tipo">

                                ${escaparHTML(
                                    obs.tipo ||
                                    "Observação"
                                )}

                            </span>


                            <p>
                                ${escaparHTML(
                                    obs.texto
                                )}
                            </p>

                        </article>

                    `;

                })
                .join("");

    }


    modalObservacoes.classList.add(
        "active"
    );

    modalObservacoes.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


/* ==========================================================================
   FECHAR HISTÓRICO
   ========================================================================== */

function fecharTodasObservacoes() {

    modalObservacoes.classList.remove(
        "active"
    );

    modalObservacoes.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}


/* ==========================================================================
   CONTADOR DE CARACTERES
   ========================================================================== */

function atualizarContadorCaracteres() {

    if (!contadorCaracteres) {
        return;
    }


    const quantidade =
        textoObservacao.value.length;


    contadorCaracteres.textContent =
        `${quantidade} / 1000`;

}


/* ==========================================================================
   PERFIL DO ALUNO
   ========================================================================== */

function visualizarPerfilAluno(
    alunoId
) {

    const aluno =
        alunos.find(
            item =>
                String(item.id) ===
                String(alunoId)
        );


    if (!aluno) {
        return;
    }


    /*
     * Mantemos o botão funcional sem criar
     * uma página inexistente.
     *
     * Quando perfil.html estiver preparado
     * para receber o ID do aluno, podemos
     * trocar por:
     *
     * perfil.html?id=${aluno.id}
     */

    alert(
        `Perfil do aluno:\n\n${aluno.nome}`
    );

}


/* ==========================================================================
   EVENTOS
   ========================================================================== */

if (campoBusca) {

    campoBusca.addEventListener(
        "input",
        filtrarAlunos
    );

}


if (btnFiltrar) {

    btnFiltrar.addEventListener(
        "click",
        filtrarAlunos
    );

}


if (filtroTurma) {

    filtroTurma.addEventListener(
        "change",
        filtrarAlunos
    );

}


if (filtroCurso) {

    filtroCurso.addEventListener(
        "change",
        filtrarAlunos
    );

}


/* DELEGAÇÃO DE EVENTOS DOS ALUNOS */

if (listaAlunos) {

    listaAlunos.addEventListener(
        "click",
        event => {

            const botao =
                event.target.closest(
                    "button[data-acao]"
                );


            if (!botao) {
                return;
            }


            const alunoId =
                botao.dataset.alunoId;


            if (
                botao.dataset.acao ===
                "observacao"
            ) {

                abrirModal(
                    alunoId
                );

            }


            if (
                botao.dataset.acao ===
                "perfil"
            ) {

                visualizarPerfilAluno(
                    alunoId
                );

            }

        }
    );

}


/* MODAL */

if (btnFecharModal) {

    btnFecharModal.addEventListener(
        "click",
        fecharModal
    );

}


if (btnCancelarModal) {

    btnCancelarModal.addEventListener(
        "click",
        fecharModal
    );

}


if (btnSalvarObservacao) {

    btnSalvarObservacao.addEventListener(
        "click",
        salvarObservacao
    );

}


if (textoObservacao) {

    textoObservacao.addEventListener(
        "input",
        atualizarContadorCaracteres
    );

}


/* HISTÓRICO */

if (btnVerTodas) {

    btnVerTodas.addEventListener(
        "click",
        abrirTodasObservacoes
    );

}


if (btnTodasObservacoes) {

    btnTodasObservacoes.addEventListener(
        "click",
        abrirTodasObservacoes
    );

}


if (btnFecharObservacoes) {

    btnFecharObservacoes.addEventListener(
        "click",
        fecharTodasObservacoes
    );

}


/* FECHAR CLICANDO NO FUNDO */

if (modal) {

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                fecharModal();

            }

        }
    );

}


if (modalObservacoes) {

    modalObservacoes.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modalObservacoes
            ) {

                fecharTodasObservacoes();

            }

        }
    );

}


/* ESC */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        if (
            modal?.classList.contains(
                "active"
            )
        ) {

            fecharModal();

        }


        if (
            modalObservacoes?.classList.contains(
                "active"
            )
        ) {

            fecharTodasObservacoes();

        }

    }
);


/* ==========================================================================
   INICIALIZAÇÃO
   ========================================================================== */

async function inicializarMural() {

    try {

        mostrarStatusAlunos(
            "Carregando mural..."
        );


        await carregarAlunos();

        await carregarTurmas();

        await carregarObservacoes();


        /*
         * Re-renderiza depois de carregar
         * as observações.
         */

        const filtrados =
            obterAlunosFiltrados();


        renderizarAlunos(
            filtrados
        );


        atualizarResumo(
            filtrados
        );


    } catch (error) {

        console.error(
            "Erro ao inicializar Mural Docente:",
            error
        );


        mostrarStatusAlunos(
            "Ocorreu um erro ao carregar o mural.",
            "erro"
        );

    }

}


/* INICIA */

document.addEventListener(
    "DOMContentLoaded",
    inicializarMural
);