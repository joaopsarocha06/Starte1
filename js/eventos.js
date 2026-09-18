/* ==========================================================================
   EVENTOS.JS — STARTÊ / SENAC
   Versão limpa e compatível com Supabase
   ==========================================================================

   Banco esperado: public.eventos

   Colunas:
   - id          uuid
   - nome        text
   - data        date
   - horario     time
   - tipo        text
   - local       text
   - link        text
   - publico     text[]
   - descricao   text
   - created_at  timestamptz
   - updated_at  timestamptz

   Observação:
   Os anexos continuam sendo tratados no navegador. Para salvar arquivos
   permanentemente, é necessário configurar um bucket no Supabase Storage.
   ========================================================================== */


document.addEventListener('DOMContentLoaded', async () => {
    'use strict';


    /* ======================================================================
       01. CONFIGURAÇÃO
       ====================================================================== */

    const supabase = window.supabaseClient;
    const TABELA_EVENTOS = 'eventos';

    if (!supabase) {
        console.error(
            '[EVENTOS] window.supabaseClient não foi inicializado.'
        );

        alert(
            'Não foi possível conectar ao sistema de eventos.'
        );

        return;
    }


    /* ======================================================================
       02. ELEMENTOS
       ====================================================================== */

    const formEvento =
        document.getElementById('formEvento');

    const listaEventos =
        document.getElementById('listaEventos');

    const eventosVazio =
        document.getElementById('eventosVazio');

    const contadorEventos =
        document.getElementById('contadorEventos');

    const filtroDataEvento =
        document.getElementById('filtroDataEvento');

    const btnFiltrarData =
        document.getElementById('btnFiltrarData');

    const btnLimparFiltro =
        document.getElementById('btnLimparFiltro');

    const filtroResultado =
        document.getElementById('filtroResultado');

    const inputAnexos =
        document.getElementById('anexos');

    const uploadBox =
        document.querySelector('.upload-box');

    const uploadTexto =
        document.querySelector('.upload-texto');

    const listaArquivos =
        document.getElementById('listaArquivos');

    const backToTop =
        document.getElementById('backToTop');

    const menuToggle =
        document.getElementById('menuToggle');

    const mainNav =
        document.getElementById('mainNav');

    const userProfile =
        document.getElementById('userProfile');

    const userProfileButton =
        document.getElementById('userProfileButton');

    const profileButton =
        document.getElementById('profileButton');

    const logoutButton =
        document.getElementById('logoutButton');

    const userProfileName =
        document.getElementById('userProfileName') ||
        document.querySelector('.user-profile-name');

    let dataFiltroAtual = '';


    /* ======================================================================
       03. UTILITÁRIOS
       ====================================================================== */

    function escaparHTML(valor) {
        if (
            valor === null ||
            valor === undefined
        ) {
            return '';
        }

        const elemento =
            document.createElement('div');

        elemento.textContent =
            String(valor);

        return elemento.innerHTML;
    }


    function normalizarTipo(tipo) {
        const valor =
            String(tipo || '')
                .trim()
                .toLowerCase();

        if (valor === 'híbrido') {
            return 'hibrido';
        }

        if (
            valor === 'presencial' ||
            valor === 'online' ||
            valor === 'hibrido'
        ) {
            return valor;
        }

        return '';
    }


    function normalizarPublico(publico) {
        if (Array.isArray(publico)) {
            return publico
                .map(item =>
                    String(item)
                        .trim()
                        .toLowerCase()
                )
                .filter(Boolean);
        }

        if (typeof publico === 'string') {
            const valor =
                publico.trim();

            if (!valor) {
                return [];
            }

            try {
                const convertido =
                    JSON.parse(valor);

                if (Array.isArray(convertido)) {
                    return normalizarPublico(
                        convertido
                    );
                }
            } catch {
                // Não é JSON.
            }

            return valor
                .split(',')
                .map(item =>
                    item
                        .trim()
                        .toLowerCase()
                )
                .filter(Boolean);
        }

        return [];
    }


    function formatarData(data) {
        if (!data) {
            return 'Data não informada';
        }

        const valor =
            String(data).substring(0, 10);

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(valor)
        ) {
            const [
                ano,
                mes,
                dia
            ] = valor.split('-');

            return `${dia}/${mes}/${ano}`;
        }

        const dataObj =
            new Date(data);

        if (!Number.isNaN(dataObj.getTime())) {
            return dataObj.toLocaleDateString(
                'pt-BR'
            );
        }

        return String(data);
    }


    function formatarHorario(horario) {
        if (!horario) {
            return 'Horário não informado';
        }

        const valor =
            String(horario).trim();

        if (
            /^\d{2}:\d{2}:\d{2}$/.test(valor)
        ) {
            return valor.substring(0, 5);
        }

        return valor;
    }


    function formatarTipoEvento(tipo) {
        const tipos = {
            presencial: 'Presencial',
            online: 'Online',
            hibrido: 'Híbrido',
            'híbrido': 'Híbrido'
        };

        return (
            tipos[
                String(tipo || '')
                    .toLowerCase()
            ] ||
            'Tipo não informado'
        );
    }


    function formatarPublico(publico) {
        const lista =
            normalizarPublico(publico);

        if (!lista.length) {
            return 'Público não informado';
        }

        const nomes = {
            alunos: 'Alunos',
            docentes: 'Docentes',
            comunidade: 'Comunidade'
        };

        return lista
            .map(item =>
                nomes[item] || item
            )
            .join(', ');
    }


    function obterDataOrdenacao(evento) {
        const data =
            evento?.data
                ? String(evento.data)
                    .substring(0, 10)
                : '';

        const horario =
            evento?.horario
                ? String(evento.horario)
                : '00:00:00';

        if (data) {
            const horarioNormalizado =
                horario.length === 5
                    ? `${horario}:00`
                    : horario;

            const timestamp =
                new Date(
                    `${data}T${horarioNormalizado}`
                ).getTime();

            if (
                !Number.isNaN(timestamp)
            ) {
                return timestamp;
            }
        }

        if (evento?.created_at) {
            const timestamp =
                new Date(
                    evento.created_at
                ).getTime();

            if (
                !Number.isNaN(timestamp)
            ) {
                return timestamp;
            }
        }

        return 0;
    }


    function ordenarEventos(eventos) {
        return [...eventos].sort(
            (a, b) =>
                obterDataOrdenacao(b) -
                obterDataOrdenacao(a)
        );
    }


    function criarLinkEvento(link) {
        if (!link) {
            return '';
        }

        const valor =
            String(link).trim();

        if (!valor) {
            return '';
        }

        let urlTexto = valor;

        if (
            !/^https?:\/\//i.test(urlTexto)
        ) {
            urlTexto =
                `https://${urlTexto}`;
        }

        try {
            const url =
                new URL(urlTexto);

            if (
                ![
                    'http:',
                    'https:'
                ].includes(url.protocol)
            ) {
                return escaparHTML(valor);
            }

            return `
                <a
                    href="${escaparHTML(url.href)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${escaparHTML(valor)}
                </a>
            `;
        } catch {
            return escaparHTML(valor);
        }
    }


    /* ======================================================================
       04. PERFIL / AUTENTICAÇÃO
       ====================================================================== */

    async function atualizarNomeUsuario() {
        if (!userProfileName) {
            return;
        }

        try {
            const {
                data: {
                    user
                },
                error
            } = await supabase.auth.getUser();

            if (
                error ||
                !user
            ) {
                return;
            }

            const metadata =
                user.user_metadata || {};

            const nome =
                metadata.nome ||
                metadata.name ||
                metadata.full_name ||
                metadata.fullName ||
                user.email?.split('@')[0] ||
                'Usuário';

            userProfileName.textContent =
                nome;

        } catch (error) {
            console.warn(
                '[EVENTOS] Não foi possível obter o nome do usuário:',
                error
            );
        }
    }


    if (
        userProfile &&
        userProfileButton
    ) {
        userProfileButton.addEventListener(
            'click',
            event => {
                event.stopPropagation();

                const aberto =
                    userProfile.classList.toggle(
                        'open'
                    );

                userProfileButton.setAttribute(
                    'aria-expanded',
                    String(aberto)
                );
            }
        );


        document.addEventListener(
            'click',
            event => {
                if (
                    !event.target.closest(
                        '#userProfile'
                    )
                ) {
                    userProfile.classList.remove(
                        'open'
                    );

                    userProfileButton.setAttribute(
                        'aria-expanded',
                        'false'
                    );
                }
            }
        );
    }


    if (profileButton) {
        profileButton.addEventListener(
            'click',
            () => {
                window.location.href =
                    'perfil.html';
            }
        );
    }


    if (logoutButton) {
        logoutButton.addEventListener(
            'click',
            async () => {
                const confirmar =
                    confirm(
                        'Deseja realmente sair do seu perfil?'
                    );

                if (!confirmar) {
                    return;
                }

                try {
                    const {
                        error
                    } =
                        await supabase.auth.signOut();

                    if (error) {
                        console.error(
                            '[EVENTOS] Erro ao sair:',
                            error
                        );

                        alert(
                            'Não foi possível sair da conta.\n\n' +
                            error.message
                        );

                        return;
                    }

                    localStorage.removeItem(
                        'usuarioLogado'
                    );

                    window.location.href =
                        'index.html';

                } catch (error) {
                    console.error(
                        '[EVENTOS] Erro inesperado no logout:',
                        error
                    );

                    alert(
                        'Ocorreu um erro ao sair da conta.'
                    );
                }
            }
        );
    }


    /* ======================================================================
       05. MENU MOBILE
       ====================================================================== */

    if (
        menuToggle &&
        mainNav
    ) {
        menuToggle.addEventListener(
            'click',
            () => {
                const aberto =
                    mainNav.classList.toggle(
                        'open'
                    );

                menuToggle.setAttribute(
                    'aria-expanded',
                    String(aberto)
                );

                menuToggle.setAttribute(
                    'aria-label',
                    aberto
                        ? 'Fechar menu'
                        : 'Abrir menu'
                );
            }
        );


        mainNav
            .querySelectorAll('a')
            .forEach(link => {
                link.addEventListener(
                    'click',
                    () => {
                        mainNav.classList.remove(
                            'open'
                        );

                        menuToggle.setAttribute(
                            'aria-expanded',
                            'false'
                        );
                    }
                );
            });


        window.addEventListener(
            'resize',
            () => {
                if (
                    window.innerWidth > 992
                ) {
                    mainNav.classList.remove(
                        'open'
                    );

                    menuToggle.setAttribute(
                        'aria-expanded',
                        'false'
                    );
                }
            }
        );
    }


    /* ======================================================================
       06. SUPABASE — BUSCAR EVENTOS
       ====================================================================== */

    async function obterEventos() {
        try {
            const {
                data,
                error
            } = await supabase
                .from(TABELA_EVENTOS)
                .select(
                    'id,nome,data,horario,tipo,local,link,publico,descricao,created_at,updated_at'
                )
                .order(
                    'data',
                    {
                        ascending: false
                    }
                )
                .order(
                    'horario',
                    {
                        ascending: false
                    }
                );

            if (error) {
                console.error(
                    '[EVENTOS] Erro ao buscar eventos:',
                    error
                );

                return [];
            }

            return ordenarEventos(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {
            console.error(
                '[EVENTOS] Erro inesperado ao buscar eventos:',
                error
            );

            return [];
        }
    }


    /* ======================================================================
       07. INTERFACE — CONTADOR / ESTADO VAZIO
       ====================================================================== */

    function atualizarContador(
        quantidade
    ) {
        if (!contadorEventos) {
            return;
        }

        contadorEventos.textContent =
            quantidade;

        contadorEventos.setAttribute(
            'aria-label',
            `${quantidade} ${
                quantidade === 1
                    ? 'evento cadastrado'
                    : 'eventos cadastrados'
            }`
        );
    }


    function mostrarEstadoVazio(
        mostrar,
        usandoFiltro = false
    ) {
        if (!eventosVazio) {
            return;
        }

        const titulo =
            eventosVazio.querySelector('h3');

        const texto =
            eventosVazio.querySelector('p');


        if (!mostrar) {
            eventosVazio.hidden = true;

            eventosVazio.style.display =
                'none';

            return;
        }


        eventosVazio.hidden = false;

        eventosVazio.style.display =
            '';


        if (titulo) {
            titulo.textContent =
                usandoFiltro
                    ? 'Nenhum evento encontrado para esta data'
                    : 'Nenhum evento encontrado';
        }


        if (texto) {
            texto.textContent =
                usandoFiltro
                    ? 'Não existem eventos cadastrados para a data selecionada.'
                    : 'Ainda não existem eventos cadastrados na plataforma.';
        }
    }


    function atualizarTextoFiltro(
        quantidade
    ) {
        if (!filtroResultado) {
            return;
        }

        if (!dataFiltroAtual) {
            filtroResultado.textContent =
                '';

            return;
        }

        const dataFormatada =
            formatarData(
                dataFiltroAtual
            );

        filtroResultado.textContent =
            quantidade === 0
                ? `Nenhum evento encontrado para ${dataFormatada}.`
                : `${quantidade} ${
                    quantidade === 1
                        ? 'evento encontrado'
                        : 'eventos encontrados'
                } para ${dataFormatada}.`;
    }


    /* ======================================================================
       08. RENDERIZAÇÃO DOS CARDS
       ====================================================================== */

    function criarCardEvento(
        evento
    ) {
        const card =
            document.createElement(
                'article'
            );

        card.className =
            'evento-card';

        card.dataset.eventoId =
            evento.id;


        const local =
            String(
                evento.local || ''
            ).trim();

        const link =
            String(
                evento.link || ''
            ).trim();

        const descricao =
            String(
                evento.descricao || ''
            ).trim();


        const localHTML =
            local
                ? `
                    <div class="evento-info-item">
                        <div class="evento-info-icon">
                            <i
                                class="fas fa-location-dot"
                                aria-hidden="true"
                            ></i>
                        </div>

                        <span class="evento-info-label">
                            Local
                        </span>

                        <span class="evento-info-valor">
                            ${escaparHTML(local)}
                        </span>
                    </div>
                `
                : '';


        const linkHTML =
            link
                ? `
                    <div class="evento-info-item link">
                        <div class="evento-info-icon">
                            <i
                                class="fas fa-link"
                                aria-hidden="true"
                            ></i>
                        </div>

                        <span class="evento-info-label">
                            Link
                        </span>

                        <span class="evento-info-valor">
                            ${criarLinkEvento(link)}
                        </span>
                    </div>
                `
                : '';


        const descricaoHTML =
            descricao
                ? `
                    <div class="evento-descricao">
                        ${escaparHTML(descricao)}
                    </div>
                `
                : '';


        card.innerHTML = `
            <div class="evento-card-header">

                <h3 class="evento-nome">
                    ${escaparHTML(evento.nome)}
                </h3>

                <span class="evento-tipo">
                    ${escaparHTML(
                        formatarTipoEvento(
                            evento.tipo
                        )
                    )}
                </span>

            </div>


            <div class="evento-info">

                <div class="evento-info-item">

                    <div class="evento-info-icon">
                        <i
                            class="fas fa-calendar-days"
                            aria-hidden="true"
                        ></i>
                    </div>

                    <span class="evento-info-label">
                        Data
                    </span>

                    <span class="evento-info-valor">
                        ${escaparHTML(
                            formatarData(
                                evento.data
                            )
                        )}
                    </span>

                </div>


                <div class="evento-info-item horario">

                    <div class="evento-info-icon">
                        <i
                            class="fas fa-clock"
                            aria-hidden="true"
                        ></i>
                    </div>

                    <span class="evento-info-label">
                        Horário
                    </span>

                    <span class="evento-info-valor">
                        ${escaparHTML(
                            formatarHorario(
                                evento.horario
                            )
                        )}
                    </span>

                </div>


                ${localHTML}

                ${linkHTML}


                <div class="evento-info-item">

                    <div class="evento-info-icon">
                        <i
                            class="fas fa-users"
                            aria-hidden="true"
                        ></i>
                    </div>

                    <span class="evento-info-label">
                        Público
                    </span>

                    <span class="evento-info-valor">
                        ${escaparHTML(
                            formatarPublico(
                                evento.publico
                            )
                        )}
                    </span>

                </div>

            </div>


            ${descricaoHTML}


            <div class="evento-card-footer">

                <span class="evento-data-cadastro">
                    <i
                        class="fas fa-calendar-check"
                        aria-hidden="true"
                    ></i>

                    Evento cadastrado
                </span>


                <button
                    type="button"
                    class="btn-excluir-evento evento-excluir"
                    data-id="${escaparHTML(evento.id)}"
                    aria-label="Excluir evento ${escaparHTML(evento.nome)}"
                >

                    <i
                        class="fas fa-trash"
                        aria-hidden="true"
                    ></i>

                    <span>
                        Excluir
                    </span>

                </button>

            </div>
        `;


        return card;
    }


    async function renderizarEventos() {
        if (!listaEventos) {
            return;
        }


        listaEventos.innerHTML = `
            <div class="eventos-loading">

                <i
                    class="fas fa-spinner fa-spin"
                    aria-hidden="true"
                ></i>

                <span>
                    Carregando eventos...
                </span>

            </div>
        `;


        let eventos =
            await obterEventos();


        if (dataFiltroAtual) {
            eventos =
                eventos.filter(
                    evento => {
                        const dataEvento =
                            String(
                                evento.data || ''
                            ).substring(
                                0,
                                10
                            );

                        return (
                            dataEvento ===
                            dataFiltroAtual
                        );
                    }
                );
        }


        atualizarContador(
            eventos.length
        );

        atualizarTextoFiltro(
            eventos.length
        );


        listaEventos.innerHTML =
            '';


        if (!eventos.length) {
            mostrarEstadoVazio(
                true,
                Boolean(
                    dataFiltroAtual
                )
            );

            return;
        }


        mostrarEstadoVazio(
            false
        );


        const fragment =
            document.createDocumentFragment();


        eventos.forEach(
            evento => {
                fragment.appendChild(
                    criarCardEvento(
                        evento
                    )
                );
            }
        );


        listaEventos.appendChild(
            fragment
        );
    }


    /* ======================================================================
       09. EXCLUSÃO
       ====================================================================== */

    async function excluirEvento(
        id,
        nomeEvento,
        botao
    ) {
        if (!id) {
            console.error(
                '[EVENTOS] ID do evento não informado.'
            );

            return;
        }


        const confirmar =
            confirm(
                `Deseja realmente excluir o evento "${nomeEvento}"?`
            );


        if (!confirmar) {
            return;
        }


        if (botao) {
            botao.disabled =
                true;

            botao.innerHTML = `
                <i
                    class="fas fa-spinner fa-spin"
                    aria-hidden="true"
                ></i>

                <span>
                    Excluindo...
                </span>
            `;
        }


        try {
            const {
                data,
                error
            } = await supabase
                .from(TABELA_EVENTOS)
                .delete()
                .eq('id', id)
                .select('id')
                .maybeSingle();


            if (error) {
                console.error(
                    '[EVENTOS] Erro ao excluir:',
                    error
                );

                alert(
                    'Não foi possível excluir o evento.\n\n' +
                    error.message
                );

                return;
            }


            if (!data) {
                alert(
                    'O evento não foi encontrado ou não pode ser excluído.'
                );

                return;
            }


            await renderizarEventos();


            alert(
                'Evento excluído com sucesso!'
            );

        } catch (error) {
            console.error(
                '[EVENTOS] Erro inesperado ao excluir:',
                error
            );

            alert(
                'Ocorreu um erro ao excluir o evento.'
            );

        } finally {
            if (botao) {
                botao.disabled =
                    false;

                botao.innerHTML = `
                    <i
                        class="fas fa-trash"
                        aria-hidden="true"
                    ></i>

                    <span>
                        Excluir
                    </span>
                `;
            }
        }
    }


    if (listaEventos) {
        listaEventos.addEventListener(
            'click',
            event => {
                const botao =
                    event.target.closest(
                        '.evento-excluir'
                    );


                if (!botao) {
                    return;
                }


                const card =
                    botao.closest(
                        '.evento-card'
                    );


                const nomeElemento =
                    card?.querySelector(
                        '.evento-nome'
                    );


                const nomeEvento =
                    nomeElemento
                        ?.textContent
                        .trim() ||
                    'este evento';


                excluirEvento(
                    botao.dataset.id,
                    nomeEvento,
                    botao
                );
            }
        );
    }


    /* ======================================================================
       10. CADASTRO — CAMPOS
       ====================================================================== */

    function obterCamposFormulario() {
        return {
            nomeInput:
                document.getElementById(
                    'nomeEvento'
                ),

            dataInput:
                document.getElementById(
                    'dataEvento'
                ),

            horarioInput:
                document.getElementById(
                    'horarioEvento'
                ),

            localInput:
                document.getElementById(
                    'localEvento'
                ),

            linkInput:
                document.getElementById(
                    'linkEvento'
                ),

            descricaoInput:
                document.getElementById(
                    'descricaoEvento'
                )
        };
    }


    function validarLink(link) {
        if (!link) {
            return null;
        }


        let urlTexto =
            link.trim();


        if (
            !/^https?:\/\//i.test(
                urlTexto
            )
        ) {
            urlTexto =
                `https://${urlTexto}`;
        }


        try {
            const url =
                new URL(urlTexto);


            if (
                ![
                    'http:',
                    'https:'
                ].includes(
                    url.protocol
                )
            ) {
                return null;
            }


            return url.href;

        } catch {
            return null;
        }
    }


    async function verificarUsuarioAutenticado() {
        const {
            data,
            error
        } = await supabase.auth.getUser();


        if (error) {
            console.error(
                '[EVENTOS] Erro ao verificar usuário:',
                error
            );

            return null;
        }


        return data?.user || null;
    }


    /* ======================================================================
       11. CADASTRO — INSERT NO SUPABASE
       ====================================================================== */

    if (formEvento) {
        formEvento.addEventListener(
            'submit',
            async event => {

                event.preventDefault();


                const campos =
                    obterCamposFormulario();


                const nome =
                    campos.nomeInput
                        ?.value
                        .trim() ||
                    '';


                const data =
                    campos.dataInput
                        ?.value ||
                    '';


                const horario =
                    campos.horarioInput
                        ?.value ||
                    '';


                const local =
                    campos.localInput
                        ?.value
                        .trim() ||
                    '';


                const linkDigitado =
                    campos.linkInput
                        ?.value
                        .trim() ||
                    '';


                const descricao =
                    campos.descricaoInput
                        ?.value
                        .trim() ||
                    '';


                const tipoSelecionado =
                    document.querySelector(
                        'input[name="tipo"]:checked'
                    );


                const publicoSelecionado =
                    Array.from(
                        document.querySelectorAll(
                            'input[name="publico"]:checked'
                        )
                    )
                    .map(
                        input =>
                            input.value
                                .trim()
                                .toLowerCase()
                    )
                    .filter(Boolean);


                /* ----------------------------------------------------------
                   Campos obrigatórios
                   ---------------------------------------------------------- */

                if (!nome) {
                    alert(
                        'Digite o nome do evento.'
                    );

                    campos.nomeInput?.focus();

                    return;
                }


                if (!data) {
                    alert(
                        'Informe a data do evento.'
                    );

                    campos.dataInput?.focus();

                    return;
                }


                if (!horario) {
                    alert(
                        'Informe o horário do evento.'
                    );

                    campos.horarioInput?.focus();

                    return;
                }


                if (!tipoSelecionado) {
                    alert(
                        'Selecione o tipo do evento.'
                    );

                    return;
                }


                /* ----------------------------------------------------------
                   Tipo compatível com o banco
                   ---------------------------------------------------------- */

                const tipo =
                    normalizarTipo(
                        tipoSelecionado.value
                    );


                if (!tipo) {
                    alert(
                        'O tipo de evento selecionado é inválido.'
                    );

                    return;
                }


                /* ----------------------------------------------------------
                   Link
                   ---------------------------------------------------------- */

                let link = null;


                if (linkDigitado) {
                    link =
                        validarLink(
                            linkDigitado
                        );


                    if (!link) {
                        alert(
                            'Informe um link de evento válido.'
                        );

                        campos.linkInput?.focus();

                        return;
                    }
                }


                /* ----------------------------------------------------------
                   Usuário autenticado
                   ---------------------------------------------------------- */

                const usuario =
                    await verificarUsuarioAutenticado();


                if (!usuario) {
                    alert(
                        'Você precisa estar autenticado para cadastrar um evento.'
                    );

                    return;
                }


                /* ----------------------------------------------------------
                   Botão
                   ---------------------------------------------------------- */

                const botaoSubmit =
                    formEvento.querySelector(
                        '.btn-submit'
                    );


                const textoOriginal =
                    botaoSubmit?.innerHTML ||
                    '';


                if (botaoSubmit) {
                    botaoSubmit.disabled =
                        true;


                    botaoSubmit.innerHTML = `
                        <i
                            class="fas fa-spinner fa-spin"
                            aria-hidden="true"
                        ></i>

                        <span>
                            Cadastrando...
                        </span>
                    `;
                }


                /* ----------------------------------------------------------
                   OBJETO ENVIADO PARA public.eventos
                   ---------------------------------------------------------- */

                const novoEvento = {
                    nome,
                    data,
                    horario,
                    tipo,
                    local: local || null,
                    link,
                    publico: publicoSelecionado,
                    descricao:
                        descricao || null
                };


                console.log(
                    '[EVENTOS] Enviando para Supabase:',
                    novoEvento
                );


                try {
                    const {
                        data: eventoCriado,
                        error
                    } = await supabase
                        .from(
                            TABELA_EVENTOS
                        )
                        .insert(
                            novoEvento
                        )
                        .select()
                        .single();


                    if (error) {
                        console.error(
                            '[EVENTOS] Erro no INSERT:',
                            error
                        );

                        alert(
                            'Não foi possível cadastrar o evento.\n\n' +
                            error.message
                        );

                        return;
                    }


                    console.log(
                        '[EVENTOS] Evento cadastrado:',
                        eventoCriado
                    );


                    formEvento.reset();


                    restaurarUpload();


                    alert(
                        'Evento cadastrado com sucesso!'
                    );


                    await renderizarEventos();


                    const eventosCadastrados =
                        document.getElementById(
                            'eventos-cadastrados'
                        );


                    if (eventosCadastrados) {
                        setTimeout(
                            () => {
                                eventosCadastrados.scrollIntoView(
                                    {
                                        behavior:
                                            'smooth',

                                        block:
                                            'start'
                                    }
                                );
                            },
                            100
                        );
                    }

                } catch (error) {
                    console.error(
                        '[EVENTOS] Erro inesperado no cadastro:',
                        error
                    );

                    alert(
                        'Ocorreu um erro inesperado ao cadastrar o evento.'
                    );

                } finally {
                    if (botaoSubmit) {
                        botaoSubmit.disabled =
                            false;

                        botaoSubmit.innerHTML =
                            textoOriginal;
                    }
                }
            }
        );
    }


    /* ======================================================================
       12. FILTRO POR DATA
       ====================================================================== */

    async function aplicarFiltroData() {
        if (!filtroDataEvento) {
            return;
        }


        const dataSelecionada =
            filtroDataEvento.value;


        if (!dataSelecionada) {
            alert(
                'Selecione uma data para procurar os eventos.'
            );

            filtroDataEvento.focus();

            return;
        }


        dataFiltroAtual =
            dataSelecionada;


        await renderizarEventos();
    }


    if (btnFiltrarData) {
        btnFiltrarData.addEventListener(
            'click',
            aplicarFiltroData
        );
    }


    if (filtroDataEvento) {
        filtroDataEvento.addEventListener(
            'keydown',
            event => {

                if (
                    event.key !==
                    'Enter'
                ) {
                    return;
                }


                event.preventDefault();


                aplicarFiltroData();
            }
        );
    }


    if (btnLimparFiltro) {
        btnLimparFiltro.addEventListener(
            'click',
            async () => {

                dataFiltroAtual =
                    '';


                if (filtroDataEvento) {
                    filtroDataEvento.value =
                        '';
                }


                if (filtroResultado) {
                    filtroResultado.textContent =
                        '';
                }


                await renderizarEventos();
            }
        );
    }


    /* ======================================================================
       13. ANEXOS — INTERFACE
       ====================================================================== */

    function restaurarUpload() {
        if (uploadTexto) {
            uploadTexto.innerHTML = `
                <strong>
                    Selecione seus arquivos
                </strong>

                <small>
                    PDF, imagens ou documentos
                </small>
            `;
        }


        if (listaArquivos) {
            listaArquivos.innerHTML =
                '';
        }


        if (inputAnexos) {
            inputAnexos.value =
                '';
        }
    }


    function atualizarArquivosSelecionados() {
        if (
            !inputAnexos ||
            !uploadTexto
        ) {
            return;
        }


        const arquivos =
            Array.from(
                inputAnexos.files || []
            );


        if (!arquivos.length) {
            restaurarUpload();

            return;
        }


        uploadTexto.innerHTML = `
            <strong>
                ${arquivos.length}
                ${
                    arquivos.length === 1
                        ? 'arquivo selecionado'
                        : 'arquivos selecionados'
                }
            </strong>

            <small>
                Clique novamente para alterar os arquivos.
            </small>
        `;


        if (!listaArquivos) {
            return;
        }


        listaArquivos.innerHTML =
            '';


        const fragment =
            document.createDocumentFragment();


        arquivos.forEach(
            arquivo => {

                const item =
                    document.createElement(
                        'div'
                    );


                item.className =
                    'arquivo-item';


                item.innerHTML = `
                    <i
                        class="fas fa-file"
                        aria-hidden="true"
                    ></i>

                    <span>
                        ${escaparHTML(
                            arquivo.name
                        )}
                    </span>
                `;


                fragment.appendChild(
                    item
                );
            }
        );


        listaArquivos.appendChild(
            fragment
        );
    }


    if (inputAnexos) {
        inputAnexos.addEventListener(
            'change',
            atualizarArquivosSelecionados
        );
    }


    if (
        uploadBox &&
        inputAnexos
    ) {

        uploadBox.addEventListener(
            'dragover',
            event => {

                event.preventDefault();


                uploadBox.classList.add(
                    'drag-over'
                );
            }
        );


        uploadBox.addEventListener(
            'dragleave',
            event => {

                if (
                    !uploadBox.contains(
                        event.relatedTarget
                    )
                ) {
                    uploadBox.classList.remove(
                        'drag-over'
                    );
                }
            }
        );


        uploadBox.addEventListener(
            'drop',
            event => {

                event.preventDefault();


                uploadBox.classList.remove(
                    'drag-over'
                );


                const arquivos =
                    event.dataTransfer?.files;


                if (
                    !arquivos?.length
                ) {
                    return;
                }


                try {
                    const dataTransfer =
                        new DataTransfer();


                    Array.from(
                        arquivos
                    ).forEach(
                        arquivo => {
                            dataTransfer.items.add(
                                arquivo
                            );
                        }
                    );


                    inputAnexos.files =
                        dataTransfer.files;


                    atualizarArquivosSelecionados();

                } catch (error) {
                    console.warn(
                        '[EVENTOS] Não foi possível aplicar o Drag and Drop:',
                        error
                    );
                }
            }
        );
    }


    /* ======================================================================
       14. VOLTAR AO TOPO
       ====================================================================== */

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

                window.scrollTo(
                    {
                        top: 0,
                        behavior: 'smooth'
                    }
                );
            }
        );


        atualizarBackToTop();
    }


    /* ======================================================================
       15. EFEITO RIPPLE
       ====================================================================== */

    const rippleTargets =
        document.querySelectorAll(
            '.btn-submit, ' +
            '.btn-cadastrar-primeiro, ' +
            '.btn-filtrar-data, ' +
            '.btn-limpar-filtro, ' +
            '.search-btn'
        );


    rippleTargets.forEach(
        button => {

            button.addEventListener(
                'click',
                function (event) {

                    const rect =
                        this.getBoundingClientRect();


                    const ripple =
                        document.createElement(
                            'span'
                        );


                    ripple.className =
                        'ripple-effect';


                    ripple.style.left =
                        `${
                            event.clientX -
                            rect.left
                        }px`;


                    ripple.style.top =
                        `${
                            event.clientY -
                            rect.top
                        }px`;


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


    /* ======================================================================
       16. ANIMAÇÃO DE SCROLL
       ====================================================================== */

    const animatedElements =
        document.querySelectorAll(
            '.animate-on-scroll'
        );


    if (
        animatedElements.length &&
        'IntersectionObserver' in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            entry.target.classList.add(
                                'visible'
                            );


                            observer.unobserve(
                                entry.target
                            );
                        }
                    );
                },
                {
                    threshold: 0.1
                }
            );


        animatedElements.forEach(
            element => {
                observer.observe(
                    element
                );
            }
        );

    } else {

        animatedElements.forEach(
            element => {
                element.classList.add(
                    'visible'
                );
            }
        );
    }


    /* ======================================================================
       17. VERIFICAÇÃO DO SUPABASE
       ====================================================================== */

    async function verificarBanco() {
        try {

            const {
                error
            } = await supabase
                .from(
                    TABELA_EVENTOS
                )
                .select('id')
                .limit(1);


            if (error) {

                console.error(
                    '[EVENTOS] Tabela eventos não pôde ser acessada:',
                    error
                );

                return false;
            }


            console.log(
                '[EVENTOS] ✓ Tabela "eventos" acessível.'
            );


            return true;

        } catch (error) {

            console.error(
                '[EVENTOS] Erro ao verificar banco:',
                error
            );

            return false;
        }
    }


    /* ======================================================================
       18. INICIALIZAÇÃO
       ====================================================================== */

    console.log(
        '========================================'
    );


    console.log(
        'EVENTOS.JS — STARTÊ / SENAC'
    );


    console.log(
        'Supabase: conectado'
    );


    console.log(
        `Tabela: ${TABELA_EVENTOS}`
    );


    await atualizarNomeUsuario();


    await verificarBanco();


    await renderizarEventos();


    console.log(
        'EVENTOS.JS inicializado com sucesso.'
    );


    console.log(
        '========================================'
    );

});