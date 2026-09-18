/* ==========================================================================
   MURAL.JS — STARTÊ / SENAC
   ==========================================================================

   Responsabilidades:
   - Conexão com Supabase
   - Busca de alunos
   - Filtros por nome, turma e curso
   - Modal de observações
   - Salvamento de observações
   - Histórico de observações recentes
   - Carregamento dos alunos do banco

   ========================================================================== */


/* ==========================================================================
   01. SUPABASE
   ========================================================================== */

const SUPABASE_URL = "https://fdpytnlvkdfvumejlbip.supabase.co";

const SUPABASE_KEY = "sb_publishable_G2loVvADj59-2OQZVNhl5w_PA4bIYgf";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* ==========================================================================
   02. ELEMENTOS DO DOM
   ========================================================================== */

const campoBusca = document.getElementById("buscarAluno");
const filtroTurma = document.getElementById("filtroTurma");
const filtroCurso = document.getElementById("filtroCurso");

const modal = document.getElementById("modal");
const alunoSelecionado = document.getElementById("alunoSelecionado");

const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelarModal = document.getElementById("btnCancelarModal");


/* ==========================================================================
   03. BUSCA POR NOME
   ========================================================================== */

if (campoBusca) {

    campoBusca.addEventListener("input", function () {

        filtrarAlunos();

    });

}


/* ==========================================================================
   04. FILTROS
   ========================================================================== */

function filtrarAlunos() {

    const busca = campoBusca
        ? campoBusca.value.trim().toLowerCase()
        : "";

    const turma = filtroTurma
        ? filtroTurma.value
        : "";

    const curso = filtroCurso
        ? filtroCurso.value
        : "";

    const alunos = document.querySelectorAll(".aluno");

    alunos.forEach(aluno => {

        const nome = (
            aluno.dataset.nome || ""
        ).toLowerCase();

        const turmaAluno =
            aluno.dataset.turma || "";

        const cursoAluno =
            aluno.dataset.curso || "";


        const nomeCorresponde =
            nome.includes(busca);

        const turmaCorresponde =
            turma === "" ||
            turmaAluno === turma;

        const cursoCorresponde =
            curso === "" ||
            cursoAluno === curso;


        const alunoVisivel =
            nomeCorresponde &&
            turmaCorresponde &&
            cursoCorresponde;


        aluno.style.display =
            alunoVisivel
                ? "grid"
                : "none";

    });

}


/* ==========================================================================
   05. MODAL DE OBSERVAÇÃO
   ========================================================================== */

function abrirModal(nomeAluno) {

    if (!modal || !alunoSelecionado) {
        return;
    }

    alunoSelecionado.value = nomeAluno;

    modal.classList.add("active");

    modal.setAttribute("aria-hidden", "false");


    const campoTexto =
        document.getElementById("textoObservacao");

    if (campoTexto) {

        setTimeout(() => {
            campoTexto.focus();
        }, 100);

    }

}


function fecharModal() {

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    modal.setAttribute("aria-hidden", "true");

}


/* ==========================================================================
   06. BOTÕES DO MODAL
   ========================================================================== */

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


/* ==========================================================================
   07. FECHAR MODAL CLICANDO FORA
   ========================================================================== */

if (modal) {

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {

            fecharModal();

        }

    });

}


/* ==========================================================================
   08. FECHAR MODAL COM ESC
   ========================================================================== */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        if (
            modal &&
            modal.classList.contains("active")
        ) {

            fecharModal();

        }

    }

});


/* ==========================================================================
   09. OBSERVAÇÕES
   ========================================================================== */

let observacoes =
    JSON.parse(
        localStorage.getItem("observacoes")
    ) || [];


/* ==========================================================================
   10. SALVAR OBSERVAÇÃO
   ========================================================================== */

function salvarObservacao() {

    const alunoElement =
        document.getElementById("alunoSelecionado");

    const tipoElement =
        document.getElementById("tipoObservacao");

    const textoElement =
        document.getElementById("textoObservacao");


    if (
        !alunoElement ||
        !tipoElement ||
        !textoElement
    ) {

        console.error(
            "Elementos da observação não encontrados."
        );

        return;

    }


    const aluno =
        alunoElement.value.trim();

    const tipo =
        tipoElement.value;

    const texto =
        textoElement.value.trim();


    /* ----------------------------------------------------------------------
       Validação
       ---------------------------------------------------------------------- */

    if (!aluno) {

        alert(
            "Selecione um aluno antes de registrar a observação."
        );

        return;

    }


    if (!texto) {

        alert(
            "Digite uma observação antes de salvar."
        );

        textoElement.focus();

        return;

    }


    /* ----------------------------------------------------------------------
       Criação da observação
       ---------------------------------------------------------------------- */

    const agora = new Date();

    const novaObservacao = {

        id: Date.now(),

        aluno: aluno,

        tipo: tipo,

        texto: texto,

        data: agora.toLocaleDateString(
            "pt-BR"
        ),

        hora: agora.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        )

    };


    /* ----------------------------------------------------------------------
       Salva no array
       ---------------------------------------------------------------------- */

    observacoes.push(
        novaObservacao
    );


    /* ----------------------------------------------------------------------
       Salva no navegador
       ---------------------------------------------------------------------- */

    localStorage.setItem(
        "observacoes",
        JSON.stringify(observacoes)
    );


    /* ----------------------------------------------------------------------
       Feedback
       ---------------------------------------------------------------------- */

    alert(
        "Observação registrada com sucesso!"
    );


    /* ----------------------------------------------------------------------
       Limpa formulário
       ---------------------------------------------------------------------- */

    textoElement.value = "";


    /* ----------------------------------------------------------------------
       Fecha modal
       ---------------------------------------------------------------------- */

    fecharModal();


    /* ----------------------------------------------------------------------
       Atualiza lista
       ---------------------------------------------------------------------- */

    atualizarObservacoes();

}


/* ==========================================================================
   11. ATUALIZAR OBSERVAÇÕES RECENTES
   ========================================================================== */

function atualizarObservacoes() {

    const container =
        document.querySelector(".observacoes");


    if (!container) {
        return;
    }


    /* ----------------------------------------------------------------------
       Pega as 3 observações mais recentes
       ---------------------------------------------------------------------- */

    const recentes =
        observacoes
            .slice()
            .reverse()
            .slice(0, 3);


    /* ----------------------------------------------------------------------
       Remove observações antigas da tela
       ---------------------------------------------------------------------- */

    const itens =
        container.querySelectorAll(
            ".observacao-item"
        );


    itens.forEach(item => {

        item.remove();

    });


    /* ----------------------------------------------------------------------
       Cria as observações
       ---------------------------------------------------------------------- */

    recentes.forEach(obs => {

        const item =
            document.createElement("div");

        item.classList.add(
            "observacao-item"
        );


        /* ------------------------------------------------------------------
           Evita inserir HTML diretamente com o texto digitado pelo usuário.
           ------------------------------------------------------------------ */

        const icone =
            document.createElement("div");

        icone.classList.add(
            "obs-icon"
        );

        icone.innerHTML =
            '<i class="fa-regular fa-file-lines"></i>';


        const conteudo =
            document.createElement("div");


        const nome =
            document.createElement("strong");

        nome.textContent =
            obs.aluno;


        const data =
            document.createElement("small");

        data.textContent =
            `${obs.data} às ${obs.hora}`;


        const texto =
            document.createElement("p");

        texto.textContent =
            `"${obs.texto}"`;


        conteudo.appendChild(nome);
        conteudo.appendChild(data);
        conteudo.appendChild(texto);


        item.appendChild(icone);
        item.appendChild(conteudo);


        /* ------------------------------------------------------------------
           Mantém o botão "Ver todas" no final.
           ------------------------------------------------------------------ */

        const botao =
            container.querySelector(".btn-todas");


        if (botao) {

            container.insertBefore(
                item,
                botao
            );

        } else {

            container.appendChild(
                item
            );

        }

    });

}


/* ==========================================================================
   12. CARREGAR ALUNOS DO SUPABASE
   ========================================================================== */

async function carregarAlunos() {

    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("alunos")

            .select(`
                id,
                nome,
                turmas (
                    id,
                    nome,
                    curso
                )
            `);


        /* ------------------------------------------------------------------
           Tratamento de erro
           ------------------------------------------------------------------ */

        if (error) {

            console.error(
                "Erro ao carregar alunos:",
                error
            );

            return;

        }


        console.log(
            "Alunos do banco:",
            data
        );


        /* ------------------------------------------------------------------
           Se ainda não existem alunos no banco
           ------------------------------------------------------------------ */

        if (!data || data.length === 0) {

            console.log(
                "Nenhum aluno encontrado no banco de dados."
            );

            return;

        }


        /* ------------------------------------------------------------------
           Atualiza filtros com os dados do banco
           ------------------------------------------------------------------ */

        preencherFiltros(data);


    } catch (erro) {

        console.error(
            "Erro inesperado ao carregar alunos:",
            erro
        );

    }

}


/* ==========================================================================
   13. PREENCHER FILTROS COM DADOS DO BANCO
   ========================================================================== */

function preencherFiltros(alunos) {

    /* ----------------------------------------------------------------------
       TURMAS
       ---------------------------------------------------------------------- */

    if (filtroTurma) {

        const turmas =
            new Map();


        alunos.forEach(aluno => {

            if (
                aluno.turmas &&
                aluno.turmas.id
            ) {

                turmas.set(
                    aluno.turmas.id,
                    aluno.turmas.nome
                );

            }

        });


        /* ------------------------------------------------------------------
           Mantém somente a opção padrão
           ------------------------------------------------------------------ */

        filtroTurma.innerHTML =
            '<option value="">Todas as turmas</option>';


        /* ------------------------------------------------------------------
           Adiciona as turmas encontradas
           ------------------------------------------------------------------ */

        turmas.forEach(
            (nome, id) => {

                const option =
                    document.createElement("option");

                option.value =
                    nome;

                option.textContent =
                    nome;

                filtroTurma.appendChild(
                    option
                );

            }
        );

    }


    /* ----------------------------------------------------------------------
       CURSOS
       ---------------------------------------------------------------------- */

    if (filtroCurso) {

        const cursos =
            new Set();


        alunos.forEach(aluno => {

            if (
                aluno.turmas &&
                aluno.turmas.curso
            ) {

                cursos.add(
                    aluno.turmas.curso
                );

            }

        });


        /* ------------------------------------------------------------------
           Mantém somente a opção padrão
           ------------------------------------------------------------------ */

        filtroCurso.innerHTML =
            '<option value="">Todos os cursos</option>';


        /* ------------------------------------------------------------------
           Adiciona cursos encontrados
           ------------------------------------------------------------------ */

        cursos.forEach(curso => {

            const option =
                document.createElement("option");

            option.value =
                curso;

            option.textContent =
                curso;

            filtroCurso.appendChild(
                option
            );

        });

    }

}


/* ==========================================================================
   14. FILTROS EM TEMPO REAL
   ========================================================================== */

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


/* ==========================================================================
   15. CARREGAMENTO INICIAL
   ========================================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        atualizarObservacoes();

        carregarAlunos();

    }
);


/* ==========================================================================
   16. EXPÕE FUNÇÕES PARA O HTML
   ==========================================================================

   Necessário porque o HTML atual utiliza:

   onclick="filtrarAlunos()"
   onclick="abrirModal(...)"
   onclick="salvarObservacao()"

   ========================================================================== */

window.filtrarAlunos =
    filtrarAlunos;

window.abrirModal =
    abrirModal;

window.fecharModal =
    fecharModal;

window.salvarObservacao =
    salvarObservacao;