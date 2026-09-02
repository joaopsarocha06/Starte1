const SUPABASE_URL = "https://fdpytnlvkdfvumejlbip.supabase.co";

const SUPABASE_KEY = "sb_publishable_G2loVvADj59-2OQZVNhl5w_PA4bIYgf";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);





const campoBusca = document.getElementById("buscarAluno");

campoBusca.addEventListener("input", function () {

  const texto = this.value.toLowerCase();

  const alunos = document.querySelectorAll(".aluno");

  alunos.forEach(aluno => {

    const nome = aluno
      .dataset.nome
      .toLowerCase();

    if (nome.includes(texto)) {

      aluno.style.display = "grid";

    } else {

      aluno.style.display = "none";

    }

  });

});




// função para filtrar alunos por categorias 

function filtrarAlunos() {

  const busca =
    document
      .getElementById("buscarAluno")
      .value
      .toLowerCase();

  const turma =
    document
      .getElementById("filtroTurma")
      .value;

  const curso =
    document
      .getElementById("filtroCurso")
      .value;


  const alunos = document.querySelectorAll(".aluno");


  alunos.forEach(aluno => {

    const nome =
      aluno.dataset.nome.toLowerCase();

    const turmaAluno =
      aluno.dataset.turma;

    const cursoAluno =
      aluno.dataset.curso;


    const nomeCorresponde =
      nome.includes(busca);

    const turmaCorresponde =
      turma === "" ||
      turmaAluno === turma;

    const cursoCorresponde =
      curso === "" ||
      cursoAluno === curso;


    if (
      nomeCorresponde &&
      turmaCorresponde &&
      cursoCorresponde
    ) {

      aluno.style.display = "grid";

    } else {

      aluno.style.display = "none";

    }

  });

}

const modal = document.getElementById("modal");

const alunoSelecionado =
  document.getElementById("alunoSelecionado");

const btnFecharModal =
  document.getElementById("btnFecharModal");

const btnCancelarModal =
  document.getElementById("btnCancelarModal");


function abrirModal(nomeAluno) {

  alunoSelecionado.value = nomeAluno;

  modal.classList.add("active");

}

function fecharModal() {

  modal.classList.remove("active");

}

btnFecharModal.addEventListener(
  "click",
  fecharModal
);

btnCancelarModal.addEventListener(
  "click",
  fecharModal
);




let observacoes =
  JSON.parse(
    localStorage.getItem("observacoes")
  ) || [];

  function salvarObservacao() {

  const aluno =
    document
      .getElementById("alunoSelecionado")
      .value;

  const tipo =
    document
      .querySelector(".modal select")
      .value;

  const texto =
    document
      .querySelector(".modal textarea")
      .value
      .trim();


  if (!texto) {

    alert("Digite uma observação antes de salvar.");

    return;
  }


  const novaObservacao = {

    id: Date.now(),

    aluno: aluno,

    tipo: tipo,

    texto: texto,

    data: new Date().toLocaleDateString("pt-BR"),

    hora: new Date().toLocaleTimeString(
      "pt-BR",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    )

  };


  observacoes.push(novaObservacao);


  localStorage.setItem(
    "observacoes",
    JSON.stringify(observacoes)
  );


  alert("Observação registrada com sucesso!");


  document.querySelector(
    ".modal textarea"
  ).value = "";


  fecharModal();


  atualizarObservacoes();

}
function atualizarObservacoes() {

  const container =
    document.querySelector(".observacoes");

  const recentes =
    observacoes
      .slice()
      .reverse()
      .slice(0, 3);


  const itens =
    container.querySelectorAll(
      ".observacao-item"
    );


  itens.forEach(item => {
    item.remove();
  });


  recentes.forEach(obs => {

    const item =
      document.createElement("div");

    item.classList.add(
      "observacao-item"
    );


    item.innerHTML = `

      <div class="obs-icon">
        <i class="fa-regular fa-file-lines"></i>
      </div>

      <div>

        <strong>
          ${obs.aluno}
        </strong>

        <small>
          ${obs.data} às ${obs.hora}
        </small>

        <p>
          "${obs.texto}"
        </p>

      </div>

    `;


    const botao =
      container.querySelector(".btn-todas");

    container.insertBefore(
      item,
      botao
    );

  });

}

async function carregarAlunos() {

    const { data, error } = await supabaseClient
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

    if (error) {

        console.error(
            "Erro ao carregar alunos:",
            error
        );

        return;
    }

    console.log("Alunos do banco:", data);

}

carregarAlunos()