/* ==========================================================================
   STARTÊ — MURAL DOCENTE
   Cadastro de alunos + turmas + observações
   ========================================================================== */

"use strict";


/* ==========================================================================
   01. SUPABASE
   ========================================================================== */

const SUPABASE_URL =
    "https://fdpytnlvkdfvumejlbip.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_G2loVvADj59-2OQZVNhl5w_PA4bIYgf";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* ==========================================================================
   02. ESTADO
   ========================================================================== */

let alunos = [];
let turmas = [];
let observacoes = [];

let observacoesPorAluno = new Map();

let alunoAtual = null;
let historicoAlunoAtual = null;


/* ==========================================================================
   03. ELEMENTOS
   ========================================================================== */

const listaAlunos =
    document.getElementById("listaAlunos");

const statusAlunos =
    document.getElementById("statusAlunos");

const contadorAlunos =
    document.getElementById("contadorAlunos");

const totalAlunos =
    document.getElementById("totalAlunos");

const alunosComObservacao =
    document.getElementById("alunosComObservacao");

const alunosSemObservacao =
    document.getElementById("alunosSemObservacao");

const percentualAcompanhados =
    document.getElementById("percentualAcompanhados");

const buscarAluno =
    document.getElementById("buscarAluno");

const filtroTurma =
    document.getElementById("filtroTurma");

const filtroCurso =
    document.getElementById("filtroCurso");

const btnFiltrar =
    document.getElementById("btnFiltrar");


/* ==========================================================================
   04. MODAL CADASTRO
   ========================================================================== */

const modalCadastroAluno =
    document.getElementById("modalCadastroAluno");

const formCadastroAluno =
    document.getElementById("formCadastroAluno");

const btnAbrirCadastroAluno =
    document.getElementById("btnAbrirCadastroAluno");

const btnFecharCadastroAluno =
    document.getElementById("btnFecharCadastroAluno");

const btnCancelarCadastroAluno =
    document.getElementById("btnCancelarCadastroAluno");

const nomeNovoAluno =
    document.getElementById("nomeNovoAluno");

const turmaNovoAluno =
    document.getElementById("turmaNovoAluno");

const cursoSelecionadoInfo =
    document.getElementById("cursoSelecionadoInfo");

const btnMostrarNovaTurma =
    document.getElementById("btnMostrarNovaTurma");

const novaTurmaForm =
    document.getElementById("novaTurmaForm");

const nomeNovaTurma =
    document.getElementById("nomeNovaTurma");

const cursoNovaTurma =
    document.getElementById("cursoNovaTurma");

const btnSalvarTurma =
    document.getElementById("btnSalvarTurma");

const btnSalvarAluno =
    document.getElementById("btnSalvarAluno");

const erroNomeAluno =
    document.getElementById("erroNomeAluno");

const erroTurmaAluno =
    document.getElementById("erroTurmaAluno");

const erroNovaTurma =
    document.getElementById("erroNovaTurma");


/* ==========================================================================
   05. MODAL OBSERVAÇÃO
   ========================================================================== */

const modal =
    document.getElementById("modal");

const btnFecharModal =
    document.getElementById("btnFecharModal");

const btnCancelarModal =
    document.getElementById("btnCancelarModal");

const btnSalvarObservacao =
    document.getElementById("btnSalvarObservacao");

const alunoSelecionado =
    document.getElementById("alunoSelecionado");

const alunoSelecionadoId =
    document.getElementById("alunoSelecionadoId");

const tipoObservacao =
    document.getElementById("tipoObservacao");

const textoObservacao =
    document.getElementById("textoObservacao");

const contadorCaracteres =
    document.getElementById("contadorCaracteres");


/* ==========================================================================
   06. MODAL HISTÓRICO
   ========================================================================== */

const modalObservacoes =
    document.getElementById("modalObservacoes");

const btnFecharObservacoes =
    document.getElementById("btnFecharObservacoes");

const btnVerTodas =
    document.getElementById("btnVerTodas");

const btnTodasObservacoes =
    document.getElementById("btnTodasObservacoes");

const listaTodasObservacoes =
    document.getElementById("listaTodasObservacoes");

const tituloTodasObservacoes =
    document.getElementById("tituloTodasObservacoes");

const subtituloHistorico =
    document.getElementById("subtituloHistorico");

const listaObservacoesRecentes =
    document.getElementById("listaObservacoesRecentes");


/* ==========================================================================
   07. UTILITÁRIOS
   ========================================================================== */

function escapeHTML(valor) {

    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function normalizarTexto(valor) {

    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}


function obterIniciais(nome) {

    const partes =
        String(nome || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (!partes.length) {
        return "AL";
    }

    if (partes.length === 1) {
        return partes[0].substring(0, 2).toUpperCase();
    }

    return (
        partes[0][0] +
        partes[partes.length - 1][0]
    ).toUpperCase();
}


function formatarData(data) {

    if (!data) {
        return "Data não informada";
    }

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return "Data não informada";
    }

    return dataObj.toLocaleDateString(
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


function mostrarStatus(mensagem, tipo = "") {

    if (!statusAlunos) {
        return;
    }

    statusAlunos.className =
        `status-alunos ${tipo}`;

    statusAlunos.innerHTML =
        escapeHTML(mensagem);
}


function bloquearBotao(botao, bloqueado, textoOriginal) {

    if (!botao) {
        return;
    }

    botao.disabled = bloqueado;

    if (bloqueado) {

        botao.dataset.textoOriginal =
            textoOriginal ||
            botao.textContent.trim();

        botao.innerHTML =
            `<i class="fa-solid fa-spinner fa-spin"></i> Aguarde...`;

    } else {

        botao.innerHTML =
            textoOriginal ||
            botao.dataset.textoOriginal ||
            "Salvar";

    }
}


/* ==========================================================================
   08. CARREGAR TURMAS
   ========================================================================== */

async function carregarTurmas() {

    const {
        data,
        error
    } = await supabaseClient
        .from("turmas")
        .select("id,nome,curso,created_at")
        .order("nome", {
            ascending: true
        });

    if (error) {

        console.error(
            "Erro ao carregar turmas:",
            error
        );

        throw error;
    }

    turmas = data || [];

    preencherSelectTurmas();

    preencherSelectFiltroTurmas();
    preencherSelectFiltroCursos();
}


/* ==========================================================================
   09. SELECT DE TURMAS
   ========================================================================== */

function preencherSelectTurmas() {

    if (!turmaNovoAluno) {
        return;
    }

    const valorAtual =
        turmaNovoAluno.value;

    turmaNovoAluno.innerHTML = `
    <option value="">
      Selecione uma turma
    </option>
  `;

    turmas.forEach(turma => {

        const option =
            document.createElement("option");

        option.value =
            String(turma.id);

        option.textContent =
            `${turma.nome} — ${turma.curso}`;

        turmaNovoAluno.appendChild(option);

    });

    if (
        valorAtual &&
        turmas.some(
            turma => String(turma.id) === valorAtual
        )
    ) {

        turmaNovoAluno.value =
            valorAtual;

    }

    atualizarCursoTurma();
}


function preencherSelectFiltroTurmas() {

    if (!filtroTurma) {
        return;
    }

    const valorAtual =
        filtroTurma.value;

    filtroTurma.innerHTML = `
    <option value="">
      Todas as turmas
    </option>
  `;

    turmas.forEach(turma => {

        const option =
            document.createElement("option");

        option.value =
            String(turma.id);

        option.textContent =
            turma.nome;

        filtroTurma.appendChild(option);

    });

    if (
        valorAtual &&
        turmas.some(
            turma => String(turma.id) === valorAtual
        )
    ) {

        filtroTurma.value =
            valorAtual;

    }
}


function preencherSelectFiltroCursos() {

    if (!filtroCurso) {
        return;
    }

    const cursos =
        [
            ...new Set(
                turmas
                    .map(turma => turma.curso)
                    .filter(Boolean)
            )
        ]
            .sort((a, b) =>
                a.localeCompare(
                    b,
                    "pt-BR"
                )
            );

    const valorAtual =
        filtroCurso.value;

    filtroCurso.innerHTML = `
    <option value="">
      Todos os cursos
    </option>
  `;

    cursos.forEach(curso => {

        const option =
            document.createElement("option");

        option.value =
            curso;

        option.textContent =
            curso;

        filtroCurso.appendChild(option);

    });

    if (cursos.includes(valorAtual)) {
        filtroCurso.value =
            valorAtual;
    }
}


/* ==========================================================================
   10. CURSO DA TURMA SELECIONADA
   ========================================================================== */

function atualizarCursoTurma() {

    if (!turmaNovoAluno || !cursoSelecionadoInfo) {
        return;
    }

    const turmaId =
        turmaNovoAluno.value;

    if (!turmaId) {

        cursoSelecionadoInfo.textContent =
            "Selecione uma turma para visualizar o curso.";

        return;
    }

    const turma =
        turmas.find(
            item =>
                String(item.id) ===
                String(turmaId)
        );

    if (!turma) {

        cursoSelecionadoInfo.textContent =
            "Turma não encontrada.";

        return;
    }

    cursoSelecionadoInfo.innerHTML =
        `<strong>Curso:</strong> ${escapeHTML(turma.curso)}`;
}


/* ==========================================================================
   11. CARREGAR ALUNOS
   ========================================================================== */

async function carregarAlunos() {

    mostrarStatus(
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
      created_at,
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

        mostrarStatus(
            "Não foi possível carregar os alunos.",
            "erro"
        );

        throw error;
    }

    alunos = data || [];

    atualizarMapaObservacoes();

    renderizarAlunos();

    atualizarResumo();

    mostrarStatus(
        alunos.length
            ? ""
            : "Nenhum aluno cadastrado."
    );
}


/* ==========================================================================
   12. CARREGAR OBSERVAÇÕES
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
        nome,
        turma_id,
        turmas (
          nome,
          curso
        )
      )
    `)
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(
            "Erro ao carregar observações:",
            error
        );

        throw error;
    }

    observacoes =
        data || [];

    atualizarMapaObservacoes();

    renderizarObservacoesRecentes();

    renderizarAlunos();

    atualizarResumo();
}


/* ==========================================================================
   13. MAPA DE OBSERVAÇÕES
   ========================================================================== */

function atualizarMapaObservacoes() {

    observacoesPorAluno =
        new Map();

    observacoes.forEach(observacao => {

        if (
            !observacoesPorAluno.has(
                observacao.aluno_id
            )
        ) {

            observacoesPorAluno.set(
                observacao.aluno_id,
                []
            );

        }

        observacoesPorAluno
            .get(observacao.aluno_id)
            .push(observacao);

    });
}


/* ==========================================================================
   14. RENDERIZAR ALUNOS
   ========================================================================== */

function obterAlunosFiltrados() {

    const busca =
        normalizarTexto(
            buscarAluno?.value
        );

    const turmaSelecionada =
        filtroTurma?.value || "";

    const cursoSelecionado =
        normalizarTexto(
            filtroCurso?.value
        );

    return alunos.filter(aluno => {

        const nomeAluno =
            normalizarTexto(
                aluno.nome
            );

        const cursoAluno =
            normalizarTexto(
                aluno.turmas?.curso
            );

        const nomeTurma =
            normalizarTexto(
                aluno.turmas?.nome
            );

        const correspondeBusca =
            !busca ||
            nomeAluno.includes(busca) ||
            nomeTurma.includes(busca);

        const correspondeTurma =
            !turmaSelecionada ||
            String(aluno.turma_id) ===
            String(turmaSelecionada);

        const correspondeCurso =
            !cursoSelecionado ||
            cursoAluno === cursoSelecionado;

        return (
            correspondeBusca &&
            correspondeTurma &&
            correspondeCurso
        );

    });
}


function renderizarAlunos() {

    if (!listaAlunos) {
        return;
    }

    const alunosFiltrados =
        obterAlunosFiltrados();

    contadorAlunos.textContent =
        `${alunosFiltrados.length} aluno${alunosFiltrados.length === 1
            ? ""
            : "s"
        }`;

    if (!alunosFiltrados.length) {

        listaAlunos.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-user-graduate"></i>
        <strong>Nenhum aluno encontrado</strong>
        <span>
          Tente alterar os filtros ou cadastre um novo aluno.
        </span>
      </div>
    `;

        return;
    }


    listaAlunos.innerHTML =
        alunosFiltrados
            .map(aluno => {

                const turma =
                    aluno.turmas?.nome ||
                    "Turma não informada";

                const curso =
                    aluno.turmas?.curso ||
                    "Curso não informado";

                const observacoesAluno =
                    observacoesPorAluno
                        .get(aluno.id) ||
                    [];

                const ultimaObservacao =
                    observacoesAluno[0];

                const resumoObservacao =
                    ultimaObservacao
                        ? ultimaObservacao.texto
                        : "Nenhuma observação registrada.";

                return `
          <article
            class="aluno-card"
            data-aluno-id="${aluno.id}">

            <div class="aluno-topo">

              <div class="aluno-avatar">
                ${escapeHTML(
                    obterIniciais(aluno.nome)
                )}
              </div>

              <div class="aluno-identificacao">

                <h3 title="${escapeHTML(aluno.nome)}">
                  ${escapeHTML(aluno.nome)}
                </h3>

                <p>
                  ${escapeHTML(turma)}
                </p>

              </div>

            </div>


            <div class="aluno-info">

              <div class="aluno-info-item">

                <i class="fa-solid fa-layer-group"></i>

                <span>
                  ${escapeHTML(turma)}
                </span>

              </div>


              <div class="aluno-info-item">

                <i class="fa-solid fa-book-open"></i>

                <span>
                  ${escapeHTML(curso)}
                </span>

              </div>

            </div>


            <div class="aluno-observacao">

              <strong>
                Última observação:
              </strong>

              ${escapeHTML(
                    resumoObservacao
                )}

            </div>


            <div class="aluno-acoes">

              <button
                type="button"
                class="btn-aluno"
                data-action="perfil"
                data-id="${aluno.id}">

                <i class="fa-solid fa-user"></i>
                Perfil

              </button>


              <button
                type="button"
                class="btn-aluno"
                data-action="observacoes"
                data-id="${aluno.id}">

                <i class="fa-regular fa-file-lines"></i>
                Observações

              </button>


              <button
                type="button"
                class="btn-aluno destaque"
                data-action="adicionar"
                data-id="${aluno.id}">

                <i class="fa-solid fa-plus"></i>
                Adicionar

              </button>

            </div>

          </article>
        `;

            })
            .join("");
}


/* ==========================================================================
   15. RESUMO
   ========================================================================== */

function atualizarResumo() {

    const total =
        alunos.length;

    const alunosAcompanhados =
        alunos.filter(aluno =>
            (
                observacoesPorAluno
                    .get(aluno.id) ||
                []
            ).length > 0
        ).length;

    const semObservacao =
        total -
        alunosAcompanhados;

    const percentual =
        total > 0
            ? Math.round(
                (
                    alunosAcompanhados /
                    total
                ) * 100
            )
            : 0;

    totalAlunos.textContent =
        total;

    alunosComObservacao.textContent =
        alunosAcompanhados;

    alunosSemObservacao.textContent =
        semObservacao;

    percentualAcompanhados.textContent =
        `${percentual}%`;
}


/* ==========================================================================
   16. CADASTRO — ABRIR
   ========================================================================== */

function abrirModalCadastroAluno() {

    limparFormularioCadastro();

    modalCadastroAluno.classList.add("open");

    modalCadastroAluno.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "no-scroll"
    );

    setTimeout(() => {

        nomeNovoAluno?.focus();

    }, 100);
}


/* ==========================================================================
   17. CADASTRO — FECHAR
   ========================================================================== */

function fecharModalCadastroAluno() {

    modalCadastroAluno.classList.remove(
        "open"
    );

    modalCadastroAluno.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "no-scroll"
    );
}


function limparFormularioCadastro() {

    formCadastroAluno?.reset();

    if (erroNomeAluno) {
        erroNomeAluno.textContent = "";
    }

    if (erroTurmaAluno) {
        erroTurmaAluno.textContent = "";
    }

    if (erroNovaTurma) {
        erroNovaTurma.textContent = "";
    }

    if (cursoSelecionadoInfo) {

        cursoSelecionadoInfo.textContent =
            "Selecione uma turma para visualizar o curso.";

    }

    if (novaTurmaForm) {

        novaTurmaForm.hidden = true;

    }

    if (btnMostrarNovaTurma) {

        btnMostrarNovaTurma.innerHTML = `
      <i class="fa-solid fa-plus"></i>
      Cadastrar nova turma
    `;

    }

    bloquearBotao(
        btnSalvarAluno,
        false,
        `<i class="fa-solid fa-user-plus"></i> Cadastrar aluno`
    );

    bloquearBotao(
        btnSalvarTurma,
        false,
        `<i class="fa-solid fa-plus"></i> Criar turma`
    );
}


/* ==========================================================================
   18. VALIDAÇÃO DO ALUNO
   ========================================================================== */

function validarCadastroAluno() {

    let valido = true;

    erroNomeAluno.textContent = "";
    erroTurmaAluno.textContent = "";

    const nome =
        nomeNovoAluno.value.trim();

    const turmaId =
        turmaNovoAluno.value;


    if (nome.length < 3) {

        erroNomeAluno.textContent =
            "Digite o nome completo do aluno.";

        valido = false;

    }


    if (!turmaId) {

        erroTurmaAluno.textContent =
            "Selecione uma turma.";

        valido = false;

    }

    return {
        valido,
        nome,
        turmaId
    };
}


/* ==========================================================================
   19. CADASTRAR ALUNO NO SUPABASE
   ========================================================================== */

async function cadastrarAluno(event) {

    if (event) {
        event.preventDefault();
    }

    const validacao =
        validarCadastroAluno();

    if (!validacao.valido) {
        return;
    }

    const {
        nome,
        turmaId
    } = validacao;


    const turma =
        turmas.find(
            item =>
                String(item.id) ===
                String(turmaId)
        );


    if (!turma) {

        erroTurmaAluno.textContent =
            "A turma selecionada não existe.";

        return;
    }


    bloquearBotao(
        btnSalvarAluno,
        true
    );


    try {

        /*
         * Verifica se o mesmo aluno
         * já existe na mesma turma.
         */

        const {
            data: alunoExistente,
            error: erroBusca
        } = await supabaseClient
            .from("alunos")
            .select("id,nome")
            .eq("turma_id", turmaId)
            .ilike("nome", nome)
            .limit(1);


        if (erroBusca) {
            throw erroBusca;
        }


        if (
            alunoExistente &&
            alunoExistente.length > 0
        ) {

            erroNomeAluno.textContent =
                "Este aluno já está cadastrado nesta turma.";

            bloquearBotao(
                btnSalvarAluno,
                false,
                `<i class="fa-solid fa-user-plus"></i> Cadastrar aluno`
            );

            return;
        }


        /*
         * INSERÇÃO REAL NO SUPABASE
         */

        const {
            data,
            error
        } = await supabaseClient
            .from("alunos")
            .insert({
                nome,
                turma_id: Number(turmaId)
            })
            .select(`
        id,
        nome,
        turma_id,
        created_at,
        turmas (
          id,
          nome,
          curso
        )
      `)
            .single();


        if (error) {
            throw error;
        }


        console.log(
            "Aluno cadastrado:",
            data
        );


        /*
         * Atualiza os dados da tela
         */

        alunos.push(data);

        alunos.sort((a, b) =>
            a.nome.localeCompare(
                b.nome,
                "pt-BR"
            )
        );


        renderizarAlunos();

        atualizarResumo();


        /*
         * Fecha o modal
         */

        fecharModalCadastroAluno();


        /*
         * Mensagem de sucesso
         */

        mostrarStatus(
            `Aluno "${data.nome}" cadastrado com sucesso.`,
            "sucesso"
        );


        /*
         * Remove a mensagem depois de alguns segundos.
         */

        setTimeout(() => {

            if (
                statusAlunos &&
                statusAlunos.classList.contains(
                    "sucesso"
                )
            ) {

                mostrarStatus("");

            }

        }, 4500);


    } catch (error) {

        console.error(
            "Erro ao cadastrar aluno:",
            error
        );


        let mensagem =
            "Não foi possível cadastrar o aluno.";


        if (
            error?.code === "42501"
        ) {

            mensagem =
                "O cadastro foi bloqueado pelas políticas de segurança do Supabase.";

        }


        if (
            error?.code === "23503"
        ) {

            mensagem =
                "A turma selecionada não existe mais.";

        }


        mostrarStatus(
            mensagem,
            "erro"
        );


    } finally {

        bloquearBotao(
            btnSalvarAluno,
            false,
            `<i class="fa-solid fa-user-plus"></i> Cadastrar aluno`
        );

    }
}


/* ==========================================================================
   20. MOSTRAR / ESCONDER NOVA TURMA
   ========================================================================== */

function alternarNovaTurma() {

    if (!novaTurmaForm) {
        return;
    }

    novaTurmaForm.hidden =
        !novaTurmaForm.hidden;


    if (novaTurmaForm.hidden) {

        btnMostrarNovaTurma.innerHTML = `
      <i class="fa-solid fa-plus"></i>
      Cadastrar nova turma
    `;

    } else {

        btnMostrarNovaTurma.innerHTML = `
      <i class="fa-solid fa-minus"></i>
      Ocultar cadastro de turma
    `;

        nomeNovaTurma?.focus();

    }
}


/* ==========================================================================
   21. VALIDAR NOVA TURMA
   ========================================================================== */

function validarNovaTurma() {

    erroNovaTurma.textContent = "";

    const nome =
        nomeNovaTurma.value
            .trim()
            .toUpperCase();

    const curso =
        cursoNovaTurma.value.trim();


    /*
     * Formato:
     * 13.2026.001
     */

    const regexTurma =
        /^\d{2}\.\d{4}\.\d{3}$/;


    if (!regexTurma.test(nome)) {

        erroNovaTurma.textContent =
            "Use o formato 13.2026.XXX, por exemplo 13.2026.001.";

        return {
            valido: false,
            nome,
            curso
        };
    }


    if (curso.length < 3) {

        erroNovaTurma.textContent =
            "Informe o curso da turma.";

        return {
            valido: false,
            nome,
            curso
        };
    }


    const turmaExiste =
        turmas.some(
            turma =>
                normalizarTexto(turma.nome) ===
                normalizarTexto(nome)
        );


    if (turmaExiste) {

        erroNovaTurma.textContent =
            "Esta turma já está cadastrada.";

        return {
            valido: false,
            nome,
            curso
        };
    }


    return {
        valido: true,
        nome,
        curso
    };
}


/* ==========================================================================
   22. CRIAR TURMA
   ========================================================================== */

async function salvarNovaTurma() {

    const validacao =
        validarNovaTurma();

    if (!validacao.valido) {
        return;
    }


    bloquearBotao(
        btnSalvarTurma,
        true
    );


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("turmas")
            .insert({
                nome: validacao.nome,
                curso: validacao.curso
            })
            .select(
                "id,nome,curso,created_at"
            )
            .single();


        if (error) {
            throw error;
        }


        /*
         * Atualiza array local
         */

        turmas.push(data);

        turmas.sort((a, b) =>
            a.nome.localeCompare(
                b.nome,
                "pt-BR"
            )
        );


        /*
         * Atualiza selects
         */

        preencherSelectTurmas();

        preencherSelectFiltroTurmas();
        preencherSelectFiltroCursos();


        /*
         * Seleciona automaticamente
         * a turma recém-criada.
         */

        turmaNovoAluno.value =
            String(data.id);

        atualizarCursoTurma();


        /*
         * Limpa formulário
         */

        nomeNovaTurma.value = "";
        cursoNovaTurma.value = "";

        erroNovaTurma.textContent = "";


        /*
         * Fecha área de nova turma
         */

        novaTurmaForm.hidden =
            true;

        btnMostrarNovaTurma.innerHTML = `
      <i class="fa-solid fa-plus"></i>
      Cadastrar nova turma
    `;


        alert(
            `Turma ${data.nome} cadastrada com sucesso.`
        );


    } catch (error) {

        console.error(
            "Erro ao criar turma:",
            error
        );


        erroNovaTurma.textContent =
            "Não foi possível criar a turma. Verifique as permissões do Supabase.";


    } finally {

        bloquearBotao(
            btnSalvarTurma,
            false,
            `<i class="fa-solid fa-plus"></i> Criar turma`
        );

    }
}


/* ==========================================================================
   23. MODAL DE OBSERVAÇÃO
   ========================================================================== */

function abrirModalObservacao(id) {

    const aluno =
        alunos.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (!aluno) {
        return;
    }

    alunoAtual =
        aluno;

    alunoSelecionado.value =
        aluno.nome;

    alunoSelecionadoId.value =
        aluno.id;

    tipoObservacao.value =
        "Desempenho acadêmico";

    textoObservacao.value =
        "";

    atualizarContadorCaracteres();

    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "no-scroll"
    );

    setTimeout(() => {

        textoObservacao.focus();

    }, 100);
}


function fecharModalObservacao() {

    modal.classList.remove(
        "open"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "no-scroll"
    );

    alunoAtual = null;
}


/* ==========================================================================
   24. CONTADOR DE CARACTERES
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
   25. SALVAR OBSERVAÇÃO
   ========================================================================== */

async function salvarObservacao() {

    const alunoId =
        alunoSelecionadoId.value;

    const tipo =
        tipoObservacao.value;

    const texto =
        textoObservacao.value.trim();


    if (!alunoId) {

        alert(
            "Nenhum aluno foi selecionado."
        );

        return;
    }


    if (texto.length < 3) {

        alert(
            "Digite uma observação antes de salvar."
        );

        textoObservacao.focus();

        return;
    }


    bloquearBotao(
        btnSalvarObservacao,
        true
    );


    try {

        const {
            data: sessionData,
            error: sessionError
        } = await supabaseClient.auth.getSession();


        if (sessionError) {
            throw sessionError;
        }


        const session =
            sessionData?.session;


        if (!session?.user?.id) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );

            return;
        }


        const {
            data,
            error
        } = await supabaseClient
            .from("observacoes")
            .insert({
                aluno_id: Number(alunoId),
                professor_id: session.user.id,
                tipo,
                texto
            })
            .select(`
        id,
        aluno_id,
        professor_id,
        tipo,
        texto,
        created_at
      `)
            .single();


        if (error) {
            throw error;
        }


        const aluno =
            alunos.find(
                item =>
                    String(item.id) ===
                    String(alunoId)
            );


        observacoes.unshift({
            ...data,
            alunos: aluno
        });


        atualizarMapaObservacoes();

        renderizarObservacoesRecentes();

        renderizarAlunos();

        atualizarResumo();

        fecharModalObservacao();


        mostrarStatus(
            "Observação registrada com sucesso.",
            "sucesso"
        );


        setTimeout(() => {

            if (
                statusAlunos.classList.contains(
                    "sucesso"
                )
            ) {

                mostrarStatus("");

            }

        }, 4000);


    } catch (error) {

        console.error(
            "Erro ao salvar observação:",
            error
        );


        alert(
            "Não foi possível salvar a observação. Verifique as permissões do Supabase."
        );


    } finally {

        bloquearBotao(
            btnSalvarObservacao,
            false,
            `<i class="fa-solid fa-check"></i> Salvar observação`
        );

    }
}


/* ==========================================================================
   26. OBSERVAÇÕES RECENTES
   ========================================================================== */

function renderizarObservacoesRecentes() {

    if (!listaObservacoesRecentes) {
        return;
    }


    const recentes =
        observacoes.slice(0, 5);


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
            .map(observacao => {

                const nome =
                    observacao.alunos?.nome ||
                    "Aluno";

                return `
          <div class="observacao-recente">

            <strong>
              ${escapeHTML(nome)}
            </strong>

            <span>
              ${escapeHTML(observacao.tipo)}
              •
              ${formatarData(observacao.created_at)}
            </span>

            <p>
              ${escapeHTML(observacao.texto)}
            </p>

          </div>
        `;

            })
            .join("");
}


/* ==========================================================================
   27. HISTÓRICO
   ========================================================================== */

function abrirHistorico(alunoId = null) {

    historicoAlunoAtual =
        alunoId
            ? Number(alunoId)
            : null;


    renderizarHistorico();

    modalObservacoes.classList.add(
        "open"
    );

    modalObservacoes.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "no-scroll"
    );
}


function fecharHistorico() {

    modalObservacoes.classList.remove(
        "open"
    );

    modalObservacoes.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "no-scroll"
    );

    historicoAlunoAtual = null;
}


function renderizarHistorico() {

    let dados =
        observacoes;


    if (historicoAlunoAtual) {

        dados =
            observacoes.filter(
                observacao =>
                    Number(
                        observacao.aluno_id
                    ) ===
                    Number(
                        historicoAlunoAtual
                    )
            );

        const aluno =
            alunos.find(
                item =>
                    Number(item.id) ===
                    Number(historicoAlunoAtual)
            );

        tituloTodasObservacoes.textContent =
            aluno
                ? `Observações de ${aluno.nome}`
                : "Observações do aluno";

        subtituloHistorico.textContent =
            `${dados.length} observação${dados.length === 1
                ? ""
                : "ões"
            } registrada${dados.length === 1
                ? ""
                : "s"
            } para este aluno.`;

    } else {

        tituloTodasObservacoes.textContent =
            "Todas as observações";

        subtituloHistorico.textContent =
            `${dados.length} observação${dados.length === 1
                ? ""
                : "ões"
            } registrada${dados.length === 1
                ? ""
                : "s"
            } no mural.`;

    }


    if (!dados.length) {

        listaTodasObservacoes.innerHTML = `
      <div class="sem-observacoes">

        <i class="fa-regular fa-file-lines"></i>

        <span>
          Nenhuma observação encontrada.
        </span>

      </div>
    `;

        return;
    }


    listaTodasObservacoes.innerHTML =
        dados
            .map(observacao => {

                const nome =
                    observacao.alunos?.nome ||
                    alunos.find(
                        aluno =>
                            Number(aluno.id) ===
                            Number(observacao.aluno_id)
                    )?.nome ||
                    "Aluno";

                return `
          <article class="historico-item">

            <div class="historico-topo">

              <strong class="historico-aluno">
                ${escapeHTML(nome)}
              </strong>

              <span class="historico-data">
                ${formatarData(
                    observacao.created_at
                )}
              </span>

            </div>

            <span class="historico-tipo">
              ${escapeHTML(
                    observacao.tipo
                )}
            </span>

            <p class="historico-texto">
              ${escapeHTML(
                    observacao.texto
                )}
            </p>

          </article>
        `;

            })
            .join("");
}


/* ==========================================================================
   28. PERFIL DO ALUNO
   ========================================================================== */

function abrirPerfilAluno(id) {

    const aluno =
        alunos.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (!aluno) {
        return;
    }

    window.location.href =
        `perfil.html?id=${encodeURIComponent(id)}`;
}


/* ==========================================================================
   29. EVENTOS DOS CARDS
   ========================================================================== */

listaAlunos?.addEventListener(
    "click",
    event => {

        const botao =
            event.target.closest(
                "[data-action]"
            );

        if (!botao) {
            return;
        }

        const id =
            botao.dataset.id;

        const action =
            botao.dataset.action;


        if (action === "perfil") {

            abrirPerfilAluno(id);

            return;
        }


        if (action === "observacoes") {

            abrirHistorico(id);

            return;
        }


        if (action === "adicionar") {

            abrirModalObservacao(id);

            return;
        }

    }
);


/* ==========================================================================
   30. FILTROS
   ========================================================================== */

function filtrarAlunos() {

    renderizarAlunos();

}


buscarAluno?.addEventListener(
    "input",
    filtrarAlunos
);

filtroTurma?.addEventListener(
    "change",
    filtrarAlunos
);

filtroCurso?.addEventListener(
    "change",
    filtrarAlunos
);

btnFiltrar?.addEventListener(
    "click",
    filtrarAlunos
);


/* ==========================================================================
   31. EVENTOS — CADASTRO
   ========================================================================== */

btnAbrirCadastroAluno?.addEventListener(
    "click",
    abrirModalCadastroAluno
);

btnFecharCadastroAluno?.addEventListener(
    "click",
    fecharModalCadastroAluno
);

btnCancelarCadastroAluno?.addEventListener(
    "click",
    fecharModalCadastroAluno
);

formCadastroAluno?.addEventListener(
    "submit",
    cadastrarAluno
);

turmaNovoAluno?.addEventListener(
    "change",
    atualizarCursoTurma
);

btnMostrarNovaTurma?.addEventListener(
    "click",
    alternarNovaTurma
);

btnSalvarTurma?.addEventListener(
    "click",
    salvarNovaTurma
);


/* ==========================================================================
   32. EVENTOS — OBSERVAÇÃO
   ========================================================================== */

btnFecharModal?.addEventListener(
    "click",
    fecharModalObservacao
);

btnCancelarModal?.addEventListener(
    "click",
    fecharModalObservacao
);

btnSalvarObservacao?.addEventListener(
    "click",
    salvarObservacao
);

textoObservacao?.addEventListener(
    "input",
    atualizarContadorCaracteres
);


/* ==========================================================================
   33. EVENTOS — HISTÓRICO
   ========================================================================== */

btnFecharObservacoes?.addEventListener(
    "click",
    fecharHistorico
);

btnVerTodas?.addEventListener(
    "click",
    () => abrirHistorico()
);

btnTodasObservacoes?.addEventListener(
    "click",
    () => abrirHistorico()
);


/* ==========================================================================
   34. FECHAR MODAIS CLICANDO FORA
   ========================================================================== */

modalCadastroAluno?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modalCadastroAluno
        ) {

            fecharModalCadastroAluno();

        }

    }
);


modal?.addEventListener(
    "click",
    event => {

        if (
            event.target === modal
        ) {

            fecharModalObservacao();

        }

    }
);


modalObservacoes?.addEventListener(
    "click",
    event => {

        if (
            event.target === modalObservacoes
        ) {

            fecharHistorico();

        }

    }
);


/* ==========================================================================
   35. ESC
   ========================================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        if (
            modalCadastroAluno?.classList.contains(
                "open"
            )
        ) {

            fecharModalCadastroAluno();

            return;
        }

        if (
            modal?.classList.contains(
                "open"
            )
        ) {

            fecharModalObservacao();

            return;
        }

        if (
            modalObservacoes?.classList.contains(
                "open"
            )
        ) {

            fecharHistorico();

        }

    }
);


/* ==========================================================================
   36. NOVA TURMA — FORMATAÇÃO
   ========================================================================== */

nomeNovaTurma?.addEventListener(
    "input",
    () => {

        let valor =
            nomeNovaTurma.value
                .replace(/[^\d]/g, "");

        /*
         * Mantém somente os 9 números:
         * 13 2026 001
         */

        valor =
            valor.substring(0, 9);


        let formatado =
            valor;


        if (valor.length > 2) {

            formatado =
                `${valor.substring(0, 2)}.${valor.substring(2)}`;

        }

        if (valor.length > 6) {

            formatado =
                `${valor.substring(0, 2)}.${valor.substring(2, 6)}.${valor.substring(6)}`;

        }


        nomeNovaTurma.value =
            formatado;
    }
);


/* ==========================================================================
   37. BOTÃO VOLTAR AO TOPO
   ========================================================================== */

const backToTop =
    document.getElementById(
        "backToTop"
    );


window.addEventListener(
    "scroll",
    () => {

        if (!backToTop) {
            return;
        }

        if (window.scrollY > 500) {

            backToTop.classList.add(
                "show"
            );

        } else {

            backToTop.classList.remove(
                "show"
            );

        }

    },
    {
        passive: true
    }
);


backToTop?.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* ==========================================================================
   38. PESQUISA DO FOOTER
   ========================================================================== */

const footerSearch =
    document.getElementById(
        "footerSearch"
    );

const footerSearchBtn =
    document.getElementById(
        "footerSearchBtn"
    );


function executarPesquisaFooter() {

    const termo =
        footerSearch?.value.trim();

    if (!termo) {
        return;
    }

    window.location.href =
        `cursos.html?busca=${encodeURIComponent(termo)}`;
}


footerSearchBtn?.addEventListener(
    "click",
    executarPesquisaFooter
);

footerSearch?.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            executarPesquisaFooter();

        }

    }
);


/* ==========================================================================
   39. EXPOR FUNÇÕES
   Compatibilidade com código antigo
   ========================================================================== */

window.filtrarAlunos =
    filtrarAlunos;

window.salvarObservacao =
    salvarObservacao;

window.abrirModalObservacao =
    abrirModalObservacao;

window.cadastrarAluno =
    cadastrarAluno;

window.abrirModalCadastroAluno =
    abrirModalCadastroAluno;


/* ==========================================================================
   40. INICIALIZAÇÃO
   ========================================================================== */

async function inicializarMural() {

    try {

        mostrarStatus(
            "Carregando dados do mural..."
        );


        await carregarTurmas();


        await carregarAlunos();


        await carregarObservacoes();


        mostrarStatus("");


    } catch (error) {

        console.error(
            "Erro ao inicializar Mural Docente:",
            error
        );


        mostrarStatus(
            "Não foi possível carregar o Mural Docente. Verifique sua conexão e as permissões do Supabase.",
            "erro"
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    inicializarMural
);