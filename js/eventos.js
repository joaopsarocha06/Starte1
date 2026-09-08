// ================================================================
// EVENTOS.JS — STARTÊ / SENAC
// ================================================================
// Sistema de eventos integrado ao Supabase.
//
// FUNCIONALIDADES:
// 01. Menu mobile
// 02. Menu de perfil
// 03. Cadastro de eventos
// 04. Data + horário
// 05. Local + link separados
// 06. Listagem de eventos
// 07. Filtro por data
// 08. Contador de eventos
// 09. Exclusão REAL no Supabase
// 10. Estado vazio
// 11. Seleção de arquivos
// 12. Drag and Drop
// 13. Voltar ao topo
// 14. Efeito Ripple
// 15. Animações de Scroll
// ================================================================


document.addEventListener('DOMContentLoaded', async () => {

    // ============================================================
    // CONFIGURAÇÃO DO SUPABASE
    // ============================================================

    const supabase = window.supabaseClient;


    if (!supabase) {

        console.error(
            'Supabase não foi inicializado.'
        );

        alert(
            'Não foi possível conectar ao sistema de eventos.'
        );

        return;
    }


    // ============================================================
    // CONFIGURAÇÃO DA TABELA
    // ============================================================

    const TABELA_EVENTOS = 'eventos';


    // ============================================================
    // ELEMENTOS DO HTML
    // ============================================================

    const formEvento =
        document.getElementById('formEvento');


    const listaEventos =
        document.getElementById('listaEventos');


    const eventosVazio =
        document.getElementById('eventosVazio');


    const contadorEventos =
        document.getElementById('contadorEventos');


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


    // ============================================================
    // FILTRO POR DATA
    // ============================================================

    const filtroDataEvento =
        document.getElementById('filtroDataEvento');


    const btnFiltrarData =
        document.getElementById('btnFiltrarData');


    const btnLimparFiltro =
        document.getElementById('btnLimparFiltro');


    const filtroResultado =
        document.getElementById('filtroResultado');


    // Guarda a data atualmente selecionada no filtro.
    let dataFiltroAtual = '';


    // ============================================================
    // MENU MOBILE
    // ============================================================

    const menuToggle =
        document.getElementById('menuToggle');


    const mainNav =
        document.getElementById('mainNav');


    if (menuToggle && mainNav) {

        menuToggle.addEventListener(
            'click',
            () => {

                const aberto =
                    mainNav.classList.toggle('open');


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
            .forEach((link) => {

                link.addEventListener(
                    'click',
                    () => {

                        mainNav.classList.remove('open');


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

                if (window.innerWidth > 992) {

                    mainNav.classList.remove('open');


                    menuToggle.setAttribute(
                        'aria-expanded',
                        'false'
                    );

                }

            }
        );

    }


    // ============================================================
    // MENU DO PERFIL
    // ============================================================

    const userProfile =
        document.getElementById('userProfile');


    const userProfileButton =
        document.getElementById(
            'userProfileButton'
        );


    const profileButton =
        document.getElementById(
            'profileButton'
        );


    const logoutButton =
        document.getElementById(
            'logoutButton'
        );


    if (
        userProfile &&
        userProfileButton
    ) {

        userProfileButton.addEventListener(
            'click',
            (event) => {

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
            (event) => {

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


    // ============================================================
    // MEU PERFIL
    // ============================================================

    if (profileButton) {

        profileButton.addEventListener(
            'click',
            () => {

                window.location.href =
                    'perfil.html';

            }
        );

    }


    // ============================================================
    // LOGOUT
    // ============================================================

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
                            'Erro ao sair:',
                            error
                        );

                    }

                } catch (error) {

                    console.error(
                        'Erro no logout:',
                        error
                    );

                }


                localStorage.removeItem(
                    'usuarioLogado'
                );


                window.location.href =
                    'index.html';

            }
        );

    }


    // ============================================================
    // ESCAPAR HTML
    // ============================================================

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


    // ============================================================
    // FORMATAR DATA
    // ============================================================

    function formatarData(data) {

        if (!data) {

            return 'Data não informada';

        }


        const valor =
            String(data);


        /*
            Formato:
            2026-09-03
        */

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(valor)
        ) {

            const [
                ano,
                mes,
                dia
            ] =
                valor.split('-');


            return `${dia}/${mes}/${ano}`;

        }


        const dataObj =
            new Date(valor);


        if (
            !Number.isNaN(
                dataObj.getTime()
            )
        ) {

            return dataObj.toLocaleDateString(
                'pt-BR'
            );

        }


        return valor;

    }


    // ============================================================
    // FORMATAR HORÁRIO
    // ============================================================

    function formatarHorario(horario) {

        if (!horario) {

            return 'Horário não informado';

        }


        let valor =
            String(horario).trim();


        /*
            Caso o banco retorne:
            14:30:00
        */

        if (
            /^\d{2}:\d{2}:\d{2}$/.test(valor)
        ) {

            valor =
                valor.substring(0, 5);

        }


        /*
            Caso retorne:
            14:30
        */

        if (
            /^\d{2}:\d{2}$/.test(valor)
        ) {

            return valor;

        }


        return valor;

    }


    // ============================================================
    // FORMATAR TIPO
    // ============================================================

    function formatarTipoEvento(tipo) {

        const tipos = {

            presencial:
                'Presencial',

            online:
                'Online',

            hibrido:
                'Híbrido',

            híbrido:
                'Híbrido'

        };


        return tipos[tipo] ||
            'Tipo não informado';

    }


    // ============================================================
    // NORMALIZAR PÚBLICO
    // ============================================================

    function normalizarPublico(publico) {

        if (
            publico === null ||
            publico === undefined
        ) {

            return [];

        }


        if (Array.isArray(publico)) {

            return publico;

        }


        if (typeof publico === 'string') {

            try {

                const convertido =
                    JSON.parse(publico);


                if (
                    Array.isArray(convertido)
                ) {

                    return convertido;

                }

            } catch (error) {

                // Continua para tratamento por vírgula.
            }


            return publico
                .split(',')
                .map(
                    item =>
                        item.trim()
                )
                .filter(Boolean);

        }


        return [];

    }


    // ============================================================
    // FORMATAR PÚBLICO
    // ============================================================

    function formatarPublico(publico) {

        const lista =
            normalizarPublico(publico);


        if (
            lista.length === 0
        ) {

            return 'Público não informado';

        }


        const nomes = {

            alunos:
                'Alunos',

            docentes:
                'Docentes',

            comunidade:
                'Comunidade'

        };


        return lista
            .map(
                item =>
                    nomes[item] ||
                    item
            )
            .join(', ');

    }


    // ============================================================
    // OBTER DATA/HORA DE ORDENAÇÃO
    // ============================================================

    function obterDataOrdenacao(evento) {

        const data =
            evento.data
                ? String(evento.data).substring(0, 10)
                : '';


        const horario =
            evento.horario
                ? String(evento.horario)
                : '00:00:00';


        if (data) {

            const horarioNormalizado =
                horario.length === 5
                    ? `${horario}:00`
                    : horario;


            const dataCompleta =
                `${data}T${horarioNormalizado}`;


            const timestamp =
                new Date(dataCompleta).getTime();


            if (
                !Number.isNaN(timestamp)
            ) {

                return timestamp;

            }

        }


        /*
            Fallback para eventos antigos
            que não possuem data válida.
        */

        if (evento.created_at) {

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


    // ============================================================
    // ORDENAR EVENTOS
    // ============================================================

    function ordenarEventos(eventos) {

        return [...eventos].sort(
            (a, b) => {

                return obterDataOrdenacao(b) -
                    obterDataOrdenacao(a);

            }
        );

    }


    // ============================================================
    // OBTER EVENTOS DO SUPABASE
    // ============================================================

    async function obterEventos() {

        try {

            const {
                data,
                error
            } =
                await supabase
                    .from(TABELA_EVENTOS)
                    .select('*');


            if (error) {

                console.error(
                    'Erro ao buscar eventos no Supabase:',
                    error
                );

                return [];

            }


            if (
                !Array.isArray(data)
            ) {

                return [];

            }


            return ordenarEventos(data);

        } catch (error) {

            console.error(
                'Erro inesperado ao buscar eventos:',
                error
            );

            return [];

        }

    }


    // ============================================================
    // ATUALIZAR CONTADOR
    // ============================================================

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
            `${quantidade} ${quantidade === 1
                ? 'evento cadastrado'
                : 'eventos cadastrados'
            }`
        );

    }


    // ============================================================
    // MOSTRAR ESTADO VAZIO
    // ============================================================

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


        if (mostrar) {

            eventosVazio.hidden =
                false;


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

        } else {

            eventosVazio.hidden =
                true;


            eventosVazio.style.display =
                'none';

        }

    }


    // ============================================================
    // ATUALIZAR TEXTO DO FILTRO
    // ============================================================

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


        if (quantidade === 0) {

            filtroResultado.textContent =
                `Nenhum evento encontrado para ${dataFormatada}.`;

            return;

        }


        filtroResultado.textContent =
            `${quantidade} ${quantidade === 1
                ? 'evento encontrado'
                : 'eventos encontrados'
            } para ${dataFormatada}.`;

    }


    // ============================================================
    // CRIAR LINK SE EXISTIR
    // ============================================================

    function criarLinkEvento(link) {

        if (!link) {

            return '';

        }


        const valor =
            String(link).trim();


        if (!valor) {

            return '';

        }


        let urlValida =
            valor;


        /*
            Se o usuário digitar apenas:
            www.exemplo.com
        */

        if (
            !/^https?:\/\//i.test(
                urlValida
            )
        ) {

            urlValida =
                `https://${urlValida}`;

        }


        /*
            Validação básica.
        */

        try {

            const url =
                new URL(urlValida);


            return `
                <a
                    href="${escaparHTML(
                url.href
            )}"
                    target="_blank"
                    rel="noopener noreferrer">
                    ${escaparHTML(
                valor
            )}
                </a>
            `;

        } catch (error) {

            return `
                ${escaparHTML(
                valor
            )}
            `;

        }

    }


    // ============================================================
    // RENDERIZAR EVENTOS
    // ============================================================

    async function renderizarEventos() {

        if (!listaEventos) {
            return;
        }


        listaEventos.innerHTML = `

            <div class="eventos-loading">

                <i
                    class="fas fa-spinner fa-spin"
                    aria-hidden="true">
                </i>

                <span>
                    Carregando eventos...
                </span>

            </div>

        `;


        let eventos =
            await obterEventos();


        // ========================================================
        // FILTRO POR DATA
        // ========================================================

        if (dataFiltroAtual) {

            eventos =
                eventos.filter(
                    (evento) => {

                        if (!evento.data) {
                            return false;
                        }


                        const dataEvento =
                            String(
                                evento.data
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


        // ========================================================
        // NENHUM EVENTO
        // ========================================================

        if (
            eventos.length === 0
        ) {

            mostrarEstadoVazio(
                true,
                Boolean(dataFiltroAtual)
            );

            return;

        }


        mostrarEstadoVazio(
            false
        );


        // ========================================================
        // CRIAR CARDS
        // ========================================================

        eventos.forEach(
            (evento) => {

                const card =
                    document.createElement(
                        'article'
                    );


                card.className =
                    'evento-card';


                card.dataset.eventoId =
                    evento.id;


                const publico =
                    formatarPublico(
                        evento.publico
                    );


                const horario =
                    formatarHorario(
                        evento.horario
                    );


                const local =
                    evento.local
                        ? String(
                            evento.local
                        ).trim()
                        : '';


                const link =
                    evento.link
                        ? String(
                            evento.link
                        ).trim()
                        : '';


                const descricao =
                    evento.descricao
                        ? `
                            <div class="evento-descricao">
                                ${escaparHTML(
                            evento.descricao
                        )}
                            </div>
                        `
                        : '';


                const localHTML =
                    local
                        ? `
                            <div class="evento-info-item">

                                <div class="evento-info-icon">

                                    <i
                                        class="fas fa-location-dot"
                                        aria-hidden="true">
                                    </i>

                                </div>

                                <span class="evento-info-label">
                                    Local
                                </span>

                                <span class="evento-info-valor">
                                    ${escaparHTML(
                            local
                        )}
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
                                        aria-hidden="true">
                                    </i>

                                </div>

                                <span class="evento-info-label">
                                    Link
                                </span>

                                <span class="evento-info-valor">
                                    ${criarLinkEvento(
                            link
                        )}
                                </span>

                            </div>
                        `
                        : '';


                card.innerHTML = `

                    <!-- =========================================
                         CABEÇALHO
                    ========================================== -->

                    <div class="evento-card-header">

                        <h3 class="evento-nome">

                            ${escaparHTML(
                    evento.nome
                )}

                        </h3>


                        <span class="evento-tipo">

                            ${escaparHTML(
                    formatarTipoEvento(
                        evento.tipo
                    )
                )}

                        </span>

                    </div>


                    <!-- =========================================
                         INFORMAÇÕES
                    ========================================== -->

                    <div class="evento-info">

                        <!-- DATA -->

                        <div class="evento-info-item">

                            <div class="evento-info-icon">

                                <i
                                    class="fas fa-calendar-days"
                                    aria-hidden="true">
                                </i>

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


                        <!-- HORÁRIO -->

                        <div class="evento-info-item horario">

                            <div class="evento-info-icon">

                                <i
                                    class="fas fa-clock"
                                    aria-hidden="true">
                                </i>

                            </div>

                            <span class="evento-info-label">
                                Horário
                            </span>

                            <span class="evento-info-valor">
                                ${escaparHTML(
                    horario
                )}
                            </span>

                        </div>


                        <!-- LOCAL -->

                        ${localHTML}


                        <!-- LINK -->

                        ${linkHTML}


                        <!-- PÚBLICO -->

                        <div class="evento-info-item">

                            <div class="evento-info-icon">

                                <i
                                    class="fas fa-users"
                                    aria-hidden="true">
                                </i>

                            </div>

                            <span class="evento-info-label">
                                Público
                            </span>

                            <span class="evento-info-valor">
                                ${escaparHTML(
                    publico
                )}
                            </span>

                        </div>

                    </div>


                    <!-- =========================================
                         DESCRIÇÃO
                    ========================================== -->

                    ${descricao}


                    <!-- =========================================
                         RODAPÉ
                    ========================================== -->

                    <div class="evento-card-footer">

                        <span class="evento-data-cadastro">

                            <i
                                class="fas fa-calendar-check"
                                aria-hidden="true">
                            </i>

                            Evento cadastrado

                        </span>


                        <button
                            type="button"
                            class="btn-excluir-evento evento-excluir"
                            data-id="${escaparHTML(
                    evento.id
                )}"
                            aria-label="Excluir evento ${escaparHTML(
                    evento.nome
                )}">

                            <i
                                class="fas fa-trash"
                                aria-hidden="true">
                            </i>

                            <span>
                                Excluir
                            </span>

                        </button>

                    </div>

                `;


                listaEventos.appendChild(
                    card
                );

            }
        );

    }


    // ============================================================
    // EXCLUIR EVENTO DO SUPABASE
    // ============================================================

    async function excluirEvento(
        id,
        nomeEvento,
        botao
    ) {

        if (!id) {

            console.error(
                'ID do evento não informado.'
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
                    aria-hidden="true">
                </i>

                <span>
                    Excluindo...
                </span>

            `;

        }


        try {

            const {
                error
            } =
                await supabase
                    .from(TABELA_EVENTOS)
                    .delete()
                    .eq(
                        'id',
                        id
                    );


            if (error) {

                console.error(
                    'Erro ao excluir evento:',
                    error
                );


                alert(
                    'Não foi possível excluir o evento.\n\n' +
                    error.message
                );


                if (botao) {

                    botao.disabled =
                        false;


                    botao.innerHTML = `

                        <i
                            class="fas fa-trash"
                            aria-hidden="true">
                        </i>

                        <span>
                            Excluir
                        </span>

                    `;

                }


                return;

            }


            alert(
                'Evento excluído com sucesso!'
            );


            await renderizarEventos();

        } catch (error) {

            console.error(
                'Erro inesperado ao excluir evento:',
                error
            );


            alert(
                'Ocorreu um erro ao excluir o evento.'
            );


            if (botao) {

                botao.disabled =
                    false;


                botao.innerHTML = `

                    <i
                        class="fas fa-trash"
                        aria-hidden="true">
                    </i>

                    <span>
                        Excluir
                    </span>

                `;

            }

        }

    }


    // ============================================================
    // EVENTO DE EXCLUSÃO
    // ============================================================

    if (listaEventos) {

        listaEventos.addEventListener(
            'click',
            (event) => {

                const botao =
                    event.target.closest(
                        '.evento-excluir'
                    );


                if (!botao) {
                    return;
                }


                const id =
                    botao.dataset.id;


                const card =
                    botao.closest(
                        '.evento-card'
                    );


                const nomeElemento =
                    card
                        ? card.querySelector(
                            '.evento-nome'
                        )
                        : null;


                const nomeEvento =
                    nomeElemento
                        ? nomeElemento.textContent.trim()
                        : 'este evento';


                excluirEvento(
                    id,
                    nomeEvento,
                    botao
                );

            }
        );

    }


    // ============================================================
    // CADASTRO DE EVENTO
    // ============================================================

    if (formEvento) {

        formEvento.addEventListener(
            'submit',
            async (event) => {

                event.preventDefault();


                // ==================================================
                // CAMPOS
                // ==================================================

                const nomeInput =
                    document.getElementById(
                        'nomeEvento'
                    );


                const dataInput =
                    document.getElementById(
                        'dataEvento'
                    );


                const horarioInput =
                    document.getElementById(
                        'horarioEvento'
                    );


                const localInput =
                    document.getElementById(
                        'localEvento'
                    );


                const linkInput =
                    document.getElementById(
                        'linkEvento'
                    );


                const descricaoInput =
                    document.getElementById(
                        'descricaoEvento'
                    );


                const nome =
                    nomeInput
                        ? nomeInput.value.trim()
                        : '';


                const data =
                    dataInput
                        ? dataInput.value
                        : '';


                const horario =
                    horarioInput
                        ? horarioInput.value
                        : '';


                const local =
                    localInput
                        ? localInput.value.trim()
                        : '';


                const link =
                    linkInput
                        ? linkInput.value.trim()
                        : '';


                const descricao =
                    descricaoInput
                        ? descricaoInput.value.trim()
                        : '';


                // ==================================================
                // TIPO
                // ==================================================

                const tipoSelecionado =
                    document.querySelector(
                        'input[name="tipo"]:checked'
                    );


                // ==================================================
                // PÚBLICO
                // ==================================================

                const publicoSelecionado =
                    Array.from(
                        document.querySelectorAll(
                            'input[name="publico"]:checked'
                        )
                    ).map(
                        input =>
                            input.value
                    );


                // ==================================================
                // VALIDAÇÕES
                // ==================================================

                if (!nome) {

                    alert(
                        'Digite o nome do evento.'
                    );


                    if (nomeInput) {
                        nomeInput.focus();
                    }


                    return;

                }


                if (!data) {

                    alert(
                        'Informe a data do evento.'
                    );


                    if (dataInput) {
                        dataInput.focus();
                    }


                    return;

                }


                if (!horario) {

                    alert(
                        'Informe o horário do evento.'
                    );


                    if (horarioInput) {
                        horarioInput.focus();
                    }


                    return;

                }


                if (!tipoSelecionado) {

                    alert(
                        'Selecione o tipo do evento.'
                    );


                    return;

                }


                /*
                    Validação simples do link.
                */

                if (link) {

                    let linkTeste =
                        link;


                    if (
                        !/^https?:\/\//i.test(
                            linkTeste
                        )
                    ) {

                        linkTeste =
                            `https://${linkTeste}`;

                    }


                    try {

                        new URL(
                            linkTeste
                        );

                    } catch (error) {

                        alert(
                            'Informe um link de evento válido.'
                        );


                        if (linkInput) {
                            linkInput.focus();
                        }


                        return;

                    }

                }


                // ==================================================
                // BOTÃO
                // ==================================================

                const botaoSubmit =
                    formEvento.querySelector(
                        '.btn-submit'
                    );


                const textoOriginal =
                    botaoSubmit
                        ? botaoSubmit.innerHTML
                        : '';


                if (botaoSubmit) {

                    botaoSubmit.disabled =
                        true;


                    botaoSubmit.innerHTML = `

                        <i
                            class="fas fa-spinner fa-spin"
                            aria-hidden="true">
                        </i>

                        <span>
                            Cadastrando...
                        </span>

                    `;

                }


                // ==================================================
                // OBJETO PARA O SUPABASE
                // ==================================================

                const novoEvento = {

                    nome:
                        nome,

                    data:
                        data,

                    horario:
                        horario,

                    tipo:
                        tipoSelecionado.value,

                    local:
                        local || null,

                    link:
                        link || null,

                    publico:
                        publicoSelecionado,

                    descricao:
                        descricao || null

                };


                console.log(
                    'Enviando evento para o Supabase:',
                    novoEvento
                );


                // ==================================================
                // INSERT
                // ==================================================

                try {

                    const {
                        data: eventoCriado,
                        error
                    } =
                        await supabase
                            .from(
                                TABELA_EVENTOS
                            )
                            .insert(
                                [novoEvento]
                            )
                            .select()
                            .single();


                    if (error) {

                        console.error(
                            'Erro ao cadastrar evento:',
                            error
                        );


                        alert(
                            'Não foi possível cadastrar o evento.\n\n' +
                            error.message
                        );


                        if (botaoSubmit) {

                            botaoSubmit.disabled =
                                false;


                            botaoSubmit.innerHTML =
                                textoOriginal;

                        }


                        return;

                    }


                    console.log(
                        'Evento cadastrado:',
                        eventoCriado
                    );


                    // ==================================================
                    // LIMPAR FORMULÁRIO
                    // ==================================================

                    formEvento.reset();


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


                    alert(
                        'Evento cadastrado com sucesso!'
                    );


                    // ==================================================
                    // ATUALIZAR LISTA
                    // ==================================================

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
                                        behavior: 'smooth',
                                        block: 'start'
                                    }
                                );

                            },
                            100
                        );

                    }

                } catch (error) {

                    console.error(
                        'Erro inesperado ao cadastrar:',
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


    // ============================================================
    // FILTRAR POR DATA
    // ============================================================

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


    // ============================================================
    // ENTER NO FILTRO
    // ============================================================

    if (filtroDataEvento) {

        filtroDataEvento.addEventListener(
            'keydown',
            (event) => {

                if (
                    event.key === 'Enter'
                ) {

                    event.preventDefault();

                    aplicarFiltroData();

                }

            }
        );

    }


    // ============================================================
    // LIMPAR FILTRO
    // ============================================================

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


    // ============================================================
    // SELEÇÃO DE ARQUIVOS
    // ============================================================

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


        if (
            arquivos.length === 0
        ) {

            uploadTexto.innerHTML = `

                <strong>
                    Selecione seus arquivos
                </strong>

                <small>
                    PDF, imagens ou documentos
                </small>

            `;


            if (listaArquivos) {

                listaArquivos.innerHTML =
                    '';

            }


            return;

        }


        uploadTexto.innerHTML = `

            <strong>
                ${arquivos.length}
                ${arquivos.length === 1
                ? 'arquivo selecionado'
                : 'arquivos selecionados'
            }
            </strong>

            <small>
                Clique novamente para alterar os arquivos.
            </small>

        `;


        if (listaArquivos) {

            listaArquivos.innerHTML =
                '';


            arquivos.forEach(
                (arquivo) => {

                    const item =
                        document.createElement(
                            'div'
                        );


                    item.className =
                        'arquivo-item';


                    item.innerHTML = `

                        <i
                            class="fas fa-file"
                            aria-hidden="true">
                        </i>

                        <span>
                            ${escaparHTML(
                        arquivo.name
                    )}
                        </span>

                    `;


                    listaArquivos.appendChild(
                        item
                    );

                }
            );

        }

    }


    if (inputAnexos) {

        inputAnexos.addEventListener(
            'change',
            atualizarArquivosSelecionados
        );

    }


    // ============================================================
    // DRAG AND DROP
    // ============================================================

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

                    try {

                        inputAnexos.files =
                            event.dataTransfer.files;


                        atualizarArquivosSelecionados();

                    } catch (error) {

                        console.warn(
                            'Não foi possível aplicar o Drag and Drop:',
                            error
                        );

                    }

                }

            }
        );

    }


    // ============================================================
    // VOLTAR AO TOPO
    // ============================================================

    if (backToTop) {

        function atualizarBackToTop() {

            backToTop.classList.toggle(
                'show',
                window.scrollY > 300
            );

        }


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


    // ============================================================
    // EFEITO RIPPLE
    // ============================================================

    const rippleTargets =
        document.querySelectorAll(
            '.btn-submit, ' +
            '.btn-cadastrar-primeiro, ' +
            '.btn-filtrar-data, ' +
            '.btn-limpar-filtro, ' +
            '.search-btn'
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


    // ============================================================
    // ANIMAÇÃO DE SCROLL
    // ============================================================

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


    // ============================================================
    // INICIALIZAÇÃO
    // ============================================================

    console.log(
        '========================================'
    );


    console.log(
        'EVENTOS.JS INICIADO'
    );


    console.log(
        'Supabase:',
        supabase
            ? 'conectado'
            : 'não conectado'
    );


    console.log(
        'Tabela:',
        TABELA_EVENTOS
    );


    console.log(
        'Novos campos:',
        'horario, link'
    );


    console.log(
        'Filtro por data:',
        'ativo'
    );


    console.log(
        '========================================'
    );


    await renderizarEventos();

});