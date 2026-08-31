// ==========================================================
// EVENTOS.JS — STARTÊ / SENAC
// ==========================================================
// Funcionalidades:
// 01. Busca do header
// 02. Busca do footer
// 03. Menu mobile
// 04. Menu de perfil
// 05. Cadastro de eventos
// 06. Salvamento no localStorage
// 07. Exibição de TODOS os eventos cadastrados
// 08. Contador automático de eventos
// 09. Exclusão de eventos
// 10. Estado vazio
// 11. Upload de arquivos
// 12. Sincronização entre abas
// 13. Voltar ao topo
// 14. Efeito ripple
// 15. Animações de scroll
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================
  // CONFIGURAÇÃO
  // ==========================================================

  const STORAGE_KEY = 'eventosStare';


  // ==========================================================
  // BUSCA DO HEADER
  // ==========================================================

  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');

  if (searchBtn && searchInput) {

    searchBtn.addEventListener('click', (event) => {

      event.stopPropagation();

      const isActive =
        searchInput.classList.toggle('active');

      searchBtn.setAttribute(
        'aria-expanded',
        String(isActive)
      );

      if (isActive) {
        searchInput.focus();
      }

    });


    document.addEventListener('click', (event) => {

      if (!event.target.closest('.search-container')) {

        searchInput.classList.remove('active');

        searchBtn.setAttribute(
          'aria-expanded',
          'false'
        );

      }

    });


    searchInput.addEventListener('keydown', (event) => {

      if (event.key === 'Enter') {

        const term =
          searchInput.value.trim();

        if (term) {

          window.location.href =
            `cursos.html?search=${encodeURIComponent(term)}`;

        }

      }

    });

  }


  // ==========================================================
  // BUSCA DO RODAPÉ
  // ==========================================================

  const footerSearchBtn =
    document.getElementById('footerSearchBtn');

  const footerSearchInput =
    document.getElementById('footerSearch');


  if (footerSearchBtn && footerSearchInput) {

    const handleFooterSearch = () => {

      const term =
        footerSearchInput.value.trim();

      if (term) {

        window.location.href =
          `cursos.html?search=${encodeURIComponent(term)}`;

      }

    };


    footerSearchBtn.addEventListener(
      'click',
      handleFooterSearch
    );


    footerSearchInput.addEventListener(
      'keydown',
      (event) => {

        if (event.key === 'Enter') {
          handleFooterSearch();
        }

      }
    );

  }


  // ==========================================================
  // MENU MOBILE
  // ==========================================================

  const menuToggle =
    document.getElementById('menuToggle');

  const mainNav =
    document.getElementById('mainNav');


  if (menuToggle && mainNav) {

    const toggleMenu = (open) => {

      mainNav.classList.toggle(
        'open',
        open
      );

      menuToggle.setAttribute(
        'aria-expanded',
        String(open)
      );

      menuToggle.setAttribute(
        'aria-label',
        open
          ? 'Fechar menu'
          : 'Abrir menu'
      );

    };


    menuToggle.addEventListener(
      'click',
      () => {

        const isOpen =
          mainNav.classList.contains('open');

        toggleMenu(!isOpen);

      }
    );


    mainNav
      .querySelectorAll('a')
      .forEach((link) => {

        link.addEventListener(
          'click',
          () => {
            toggleMenu(false);
          }
        );

      });


    window.addEventListener(
      'resize',
      () => {

        if (
          window.innerWidth > 992 &&
          mainNav.classList.contains('open')
        ) {

          toggleMenu(false);

        }

      }
    );

  }


  // ==========================================================
  // MENU DO PERFIL
  // ==========================================================

  const userProfile =
    document.getElementById('userProfile');

  const userProfileButton =
    document.getElementById('userProfileButton');

  const profileButton =
    document.getElementById('profileButton');

  const logoutButton =
    document.getElementById('logoutButton');


  if (userProfile && userProfileButton) {

    userProfileButton.addEventListener(
      'click',
      (event) => {

        event.stopPropagation();

        const isOpen =
          userProfile.classList.toggle('open');

        userProfileButton.setAttribute(
          'aria-expanded',
          String(isOpen)
        );

      }
    );


    document.addEventListener(
      'click',
      (event) => {

        if (!event.target.closest('#userProfile')) {

          userProfile.classList.remove('open');

          userProfileButton.setAttribute(
            'aria-expanded',
            'false'
          );

        }

      }
    );

  }


  // ==========================================================
  // BOTÃO MEU PERFIL
  // ==========================================================

  if (profileButton) {

    profileButton.addEventListener(
      'click',
      () => {

        window.location.href =
          'perfil.html';

      }
    );

  }


  // ==========================================================
  // BOTÃO SAIR
  // ==========================================================

  if (logoutButton) {

    logoutButton.addEventListener(
      'click',
      () => {

        const confirmar =
          confirm(
            'Deseja realmente sair do seu perfil?'
          );

        if (!confirmar) {
          return;
        }

        localStorage.removeItem(
          'usuarioLogado'
        );

        window.location.href =
          'home.html';

      }
    );

  }


  // ==========================================================
  // ELEMENTOS DOS EVENTOS
  // ==========================================================

  const formEvento =
    document.getElementById('formEvento');

  const listaEventos =
    document.getElementById('listaEventos');

  const eventosVazio =
    document.getElementById('eventosVazio');


  // ==========================================================
  // CONTADOR DE EVENTOS
  // ==========================================================
  // Procura diferentes IDs possíveis para evitar conflito
  // com o HTML que já está sendo utilizado.
  // ==========================================================

  const contadorEventos =
    document.getElementById('contadorEventos') ||
    document.getElementById('totalEventos') ||
    document.querySelector('[data-contador-eventos]');


  // ==========================================================
  // OBTER EVENTOS DO LOCALSTORAGE
  // ==========================================================

  function obterEventos() {

    try {

      const dados =
        localStorage.getItem(STORAGE_KEY);

      if (!dados) {
        return [];
      }


      const eventos =
        JSON.parse(dados);


      if (!Array.isArray(eventos)) {
        return [];
      }


      return eventos.filter(
        (evento) =>
          evento &&
          typeof evento === 'object'
      );

    } catch (error) {

      console.error(
        'Erro ao carregar os eventos:',
        error
      );

      return [];

    }

  }


  // ==========================================================
  // SALVAR EVENTOS NO LOCALSTORAGE
  // ==========================================================

  function salvarEventos(eventos) {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(eventos)
      );

      return true;

    } catch (error) {

      console.error(
        'Erro ao salvar os eventos:',
        error
      );

      return false;

    }

  }


  // ==========================================================
  // ATUALIZAR CONTADOR
  // ==========================================================
  // O número é calculado automaticamente com base na
  // quantidade REAL de eventos armazenados.
  // ==========================================================

  function atualizarContador() {

    const eventos =
      obterEventos();

    const quantidade =
      eventos.length;


    if (!contadorEventos) {
      return;
    }


    contadorEventos.textContent =
      quantidade;


    // Acessibilidade

    contadorEventos.setAttribute(
      'aria-label',
      `${quantidade} ${quantidade === 1 ? 'evento cadastrado' : 'eventos cadastrados'}`
    );

  }


  // ==========================================================
  // ESCAPAR HTML
  // ==========================================================
  // Evita inserir conteúdo HTML digitado pelo usuário.
  // ==========================================================

  function escaparHTML(texto) {

    if (
      texto === null ||
      texto === undefined
    ) {

      return '';

    }


    const elemento =
      document.createElement('div');

    elemento.textContent =
      String(texto);

    return elemento.innerHTML;

  }


  // ==========================================================
  // FORMATAR DATA
  // ==========================================================

  function formatarData(data) {

    if (!data) {
      return 'Data não informada';
    }


    const partes =
      String(data).split('-');


    if (partes.length !== 3) {
      return data;
    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

  }


  // ==========================================================
  // FORMATAR TIPO DO EVENTO
  // ==========================================================

  function formatarTipoEvento(tipo) {

    const tipos = {

      presencial: 'Presencial',

      online: 'Online',

      hibrido: 'Híbrido'

    };


    return tipos[tipo] ||
      'Tipo não informado';

  }


  // ==========================================================
  // FORMATAR PÚBLICO
  // ==========================================================

  function formatarPublico(publico) {

    if (
      !Array.isArray(publico) ||
      publico.length === 0
    ) {

      return 'Público não informado';

    }


    const nomes = {

      alunos: 'Alunos',

      docentes: 'Docentes',

      comunidade: 'Comunidade'

    };


    return publico
      .map(
        (item) =>
          nomes[item] || item
      )
      .join(', ');

  }


  // ==========================================================
  // RENDERIZAR EVENTOS
  // ==========================================================

  function renderizarEventos() {

    if (!listaEventos || !eventosVazio) {

      atualizarContador();

      return;

    }


    // --------------------------------------------------------
    // OBTÉM TODOS OS EVENTOS
    // --------------------------------------------------------

    let eventos =
      obterEventos();


    // --------------------------------------------------------
    // ORDENA OS EVENTOS
    // --------------------------------------------------------
    // Evento mais recentemente cadastrado aparece primeiro.
    // --------------------------------------------------------

    eventos.sort(
      (a, b) => {

        const dataA =
          a.criadoEm
            ? new Date(a.criadoEm).getTime()
            : 0;

        const dataB =
          b.criadoEm
            ? new Date(b.criadoEm).getTime()
            : 0;

        return dataB - dataA;

      }
    );


    // --------------------------------------------------------
    // ATUALIZA CONTADOR
    // --------------------------------------------------------

    atualizarContador();


    // --------------------------------------------------------
    // LIMPA A LISTA
    // --------------------------------------------------------

    listaEventos.innerHTML = '';


    // --------------------------------------------------------
    // NENHUM EVENTO
    // --------------------------------------------------------

    if (eventos.length === 0) {

      eventosVazio.hidden = false;

      eventosVazio.style.display = '';

      return;

    }


    // --------------------------------------------------------
    // EXISTEM EVENTOS
    // --------------------------------------------------------

    eventosVazio.hidden = true;

    eventosVazio.style.display = 'none';


    // --------------------------------------------------------
    // CRIA TODOS OS CARDS
    // --------------------------------------------------------

    eventos.forEach(
      (evento, index) => {

        const card =
          document.createElement('article');

        card.className =
          'evento-card';


        // ------------------------------------------------------
        // PÚBLICO
        // ------------------------------------------------------

        const publico =
          formatarPublico(evento.publico);


        // ------------------------------------------------------
        // DESCRIÇÃO
        // ------------------------------------------------------

        const descricao =
          evento.descricao

            ? `
              <div class="evento-descricao">
                ${escaparHTML(evento.descricao)}
              </div>
            `

            : '';


        // ------------------------------------------------------
        // CARD
        // ------------------------------------------------------

        card.innerHTML = `

          <div class="evento-card-top">

            <div class="evento-data">

              <i
                class="fas fa-calendar-days"
                aria-hidden="true">
              </i>

              <span>
                ${formatarData(evento.data)}
              </span>

            </div>


            <button
              type="button"
              class="evento-excluir"
              data-id="${escaparHTML(evento.id)}"
              aria-label="Excluir evento ${escaparHTML(evento.nome)}">

              <i
                class="fas fa-trash"
                aria-hidden="true">
              </i>

            </button>

          </div>


          <h3 class="evento-nome">
            ${escaparHTML(evento.nome)}
          </h3>


          <div class="evento-informacoes">


            <div class="evento-info">

              <i
                class="fas fa-location-dot"
                aria-hidden="true">
              </i>

              <span>
                ${escaparHTML(
          evento.local ||
          'Local não informado'
        )}
              </span>

            </div>


            <div class="evento-info">

              <i
                class="fas fa-calendar-check"
                aria-hidden="true">
              </i>

              <span>
                ${formatarTipoEvento(evento.tipo)}
              </span>

            </div>


            <div class="evento-info">

              <i
                class="fas fa-users"
                aria-hidden="true">
              </i>

              <span>
                ${escaparHTML(publico)}
              </span>

            </div>


          </div>


          ${descricao}

        `;


        listaEventos.appendChild(card);

      }
    );


    // ========================================================
    // BOTÕES DE EXCLUSÃO
    // ========================================================

    const botoesExcluir =
      listaEventos.querySelectorAll(
        '.evento-excluir'
      );


    botoesExcluir.forEach(
      (botao) => {

        botao.addEventListener(
          'click',
          () => {

            const id =
              botao.dataset.id;

            excluirEvento(id);

          }
        );

      }
    );

  }


  // ==========================================================
  // EXCLUIR EVENTO
  // ==========================================================

  function excluirEvento(id) {

    const eventos =
      obterEventos();


    const index =
      eventos.findIndex(
        (evento) =>
          String(evento.id) === String(id)
      );


    if (index === -1) {

      console.warn(
        'Evento não encontrado para exclusão.'
      );

      return;

    }


    const evento =
      eventos[index];


    const confirmar =
      confirm(
        `Deseja realmente excluir o evento "${evento.nome}"?`
      );


    if (!confirmar) {
      return;
    }


    eventos.splice(index, 1);


    const salvo =
      salvarEventos(eventos);


    if (!salvo) {

      alert(
        'Não foi possível excluir o evento.'
      );

      return;

    }


    // --------------------------------------------------------
    // ATUALIZA A TELA
    // --------------------------------------------------------

    renderizarEventos();


    // --------------------------------------------------------
    // FEEDBACK
    // --------------------------------------------------------

    if (eventos.length === 0) {

      console.log(
        'Todos os eventos foram removidos.'
      );

    }

  }


  // ==========================================================
  // CADASTRO DE EVENTO
  // ==========================================================

  if (formEvento) {

    formEvento.addEventListener(
      'submit',
      (event) => {

        event.preventDefault();


        // ----------------------------------------------------
        // CAMPOS
        // ----------------------------------------------------

        const nomeInput =
          document.getElementById(
            'nomeEvento'
          );


        const dataInput =
          document.getElementById(
            'dataEvento'
          );


        const localInput =
          document.getElementById(
            'localEvento'
          );


        const descricaoInput =
          document.getElementById(
            'descricaoEvento'
          );


        // ----------------------------------------------------
        // VALORES
        // ----------------------------------------------------

        const nome =
          nomeInput
            ? nomeInput.value.trim()
            : '';


        const data =
          dataInput
            ? dataInput.value
            : '';


        const local =
          localInput
            ? localInput.value.trim()
            : '';


        const descricao =
          descricaoInput
            ? descricaoInput.value.trim()
            : '';


        // ----------------------------------------------------
        // TIPO
        // ----------------------------------------------------

        const tipoSelecionado =
          document.querySelector(
            'input[name="tipo"]:checked'
          );


        // ----------------------------------------------------
        // PÚBLICO
        // ----------------------------------------------------

        const publicoSelecionado =
          Array.from(
            document.querySelectorAll(
              'input[name="publico"]:checked'
            )
          ).map(
            (input) =>
              input.value
          );


        // ----------------------------------------------------
        // VALIDAÇÃO DO NOME
        // ----------------------------------------------------

        if (!nome) {

          alert(
            'Digite o nome do evento.'
          );

          if (nomeInput) {
            nomeInput.focus();
          }

          return;

        }


        // ----------------------------------------------------
        // VALIDAÇÃO DA DATA
        // ----------------------------------------------------

        if (!data) {

          alert(
            'Informe a data do evento.'
          );

          if (dataInput) {
            dataInput.focus();
          }

          return;

        }


        // ----------------------------------------------------
        // VALIDAÇÃO DO TIPO
        // ----------------------------------------------------

        if (!tipoSelecionado) {

          alert(
            'Selecione o tipo do evento.'
          );

          return;

        }


        // ----------------------------------------------------
        // CRIA EVENTO
        // ----------------------------------------------------

        const novoEvento = {

          id:
            `${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 9)}`,

          nome:
            nome,

          data:
            data,

          tipo:
            tipoSelecionado.value,

          local:
            local,

          publico:
            publicoSelecionado,

          descricao:
            descricao,

          criadoEm:
            new Date().toISOString()

        };


        // ----------------------------------------------------
        // RECUPERA EVENTOS ATUAIS
        // ----------------------------------------------------

        const eventos =
          obterEventos();


        // ----------------------------------------------------
        // ADICIONA O NOVO EVENTO
        // ----------------------------------------------------

        eventos.push(
          novoEvento
        );


        // ----------------------------------------------------
        // SALVA TODOS OS EVENTOS
        // ----------------------------------------------------

        const salvo =
          salvarEventos(eventos);


        if (!salvo) {

          alert(
            'Não foi possível salvar o evento. Tente novamente.'
          );

          return;

        }


        // ----------------------------------------------------
        // CONFIRMA NO CONSOLE
        // ----------------------------------------------------

        console.log(
          'Evento cadastrado:',
          novoEvento
        );

        console.log(
          'Total de eventos:',
          eventos.length
        );


        // ----------------------------------------------------
        // LIMPA FORMULÁRIO
        // ----------------------------------------------------

        formEvento.reset();


        // ----------------------------------------------------
        // ATUALIZA LISTA E CONTADOR
        // ----------------------------------------------------

        renderizarEventos();


        // ----------------------------------------------------
        // FEEDBACK
        // ----------------------------------------------------

        alert(
          'Evento cadastrado com sucesso!'
        );


        // ----------------------------------------------------
        // SCROLL PARA OS EVENTOS
        // ----------------------------------------------------

        const eventosCadastrados =
          document.getElementById(
            'eventosCadastrados'
          );


        if (eventosCadastrados) {

          setTimeout(
            () => {

              eventosCadastrados.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });

            },
            100
          );

        }

      }
    );

  }


  // ==========================================================
  // SINCRONIZAÇÃO DO LOCALSTORAGE
  // ==========================================================
  // Se o evento for cadastrado/excluído em outra aba da
  // mesma página/site, a lista é atualizada automaticamente.
  // ==========================================================

  window.addEventListener(
    'storage',
    (event) => {

      if (
        event.key === STORAGE_KEY
      ) {

        console.log(
          'Eventos atualizados pelo localStorage.'
        );

        renderizarEventos();

      }

    }
  );


  // ==========================================================
  // UPLOAD DE ARQUIVOS
  // ==========================================================

  const inputAnexos =
    document.getElementById('anexos');


  const uploadBox =
    document.querySelector('.upload-box');


  const uploadTexto =
    document.querySelector('.upload-texto');


  if (inputAnexos) {

    inputAnexos.addEventListener(
      'change',
      () => {

        const arquivos =
          Array.from(
            inputAnexos.files
          );


        if (
          !arquivos.length ||
          !uploadTexto
        ) {

          return;

        }


        const quantidade =
          arquivos.length;


        uploadTexto.innerHTML = `

          <strong>
            ${quantidade}
            ${quantidade === 1
            ? 'arquivo selecionado'
            : 'arquivos selecionados'}
          </strong>

          <small>
            Clique novamente para alterar os arquivos.
          </small>

        `;

      }
    );

  }


  // ==========================================================
  // DRAG AND DROP
  // ==========================================================

  if (
    uploadBox &&
    inputAnexos
  ) {

    uploadBox.addEventListener(
      'dragover',
      (event) => {

        event.preventDefault();

        uploadBox.classList.add(
          'drag-over'
        );

      }
    );


    uploadBox.addEventListener(
      'dragleave',
      () => {

        uploadBox.classList.remove(
          'drag-over'
        );

      }
    );


    uploadBox.addEventListener(
      'drop',
      (event) => {

        event.preventDefault();

        uploadBox.classList.remove(
          'drag-over'
        );


        if (
          event.dataTransfer &&
          event.dataTransfer.files
        ) {

          inputAnexos.files =
            event.dataTransfer.files;


          inputAnexos.dispatchEvent(
            new Event(
              'change',
              {
                bubbles: true
              }
            )
          );

        }

      }
    );

  }


  // ==========================================================
  // BOTÃO VOLTAR AO TOPO
  // ==========================================================

  const backToTop =
    document.getElementById(
      'backToTop'
    );


  if (backToTop) {

    const atualizarBackToTop =
      () => {

        backToTop.classList.toggle(
          'show',
          window.scrollY > 300
        );

      };


    window.addEventListener(
      'scroll',
      atualizarBackToTop,
      {
        passive: true
      }
    );


    backToTop.addEventListener(
      'click',
      () => {

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

      }
    );


    atualizarBackToTop();

  }


  // ==========================================================
  // EFEITO RIPPLE
  // ==========================================================

  const rippleTargets =
    document.querySelectorAll(
      '.btn-cursos, ' +
      '.btn-entrar, ' +
      '.btn-cta-action-orange, ' +
      '.search-btn, ' +
      '.btn-submit'
    );


  rippleTargets.forEach(
    (button) => {

      button.addEventListener(
        'click',
        function (event) {

          const rect =
            this.getBoundingClientRect();


          const x =
            event.clientX -
            rect.left;


          const y =
            event.clientY -
            rect.top;


          const ripple =
            document.createElement(
              'span'
            );


          ripple.className =
            'ripple-effect';


          ripple.style.left =
            `${x}px`;


          ripple.style.top =
            `${y}px`;


          this.appendChild(
            ripple
          );


          setTimeout(
            () => {

              ripple.remove();

            },
            600
          );

        }
      );

    }
  );


  // ==========================================================
  // ANIMAÇÃO DE SCROLL
  // ==========================================================

  const animatedElements =
    document.querySelectorAll(
      '.animate-on-scroll'
    );


  if (
    animatedElements.length > 0 &&
    'IntersectionObserver' in window
  ) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  'visible'
                );


                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.1
        }
      );


    animatedElements.forEach(
      (element) => {

        observer.observe(
          element
        );

      }
    );

  }


  // ==========================================================
  // INICIALIZAÇÃO
  // ==========================================================
  // Carrega TODOS os eventos salvos e atualiza o contador.
  // ==========================================================

  renderizarEventos();

});