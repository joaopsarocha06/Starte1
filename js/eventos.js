// ================================================================
// EVENTOS.JS — STARTÊ / SENAC
// ================================================================
// Sistema de eventos integrado ao Supabase.
//
// FUNCIONALIDADES:
// 01. Menu mobile
// 02. Menu de perfil
// 03. Cadastro de eventos
// 04. Listagem de eventos
// 05. Contador de eventos
// 06. Exclusão REAL no Supabase
// 07. Estado vazio
// 08. Seleção de arquivos
// 09. Drag and Drop
// 10. Voltar ao topo
// 11. Efeito Ripple
// 12. Animações de Scroll
// ================================================================


document.addEventListener('DOMContentLoaded', async () => {

    // ============================================================
    // CONFIGURAÇÃO DO SUPABASE
    // ============================================================

    /*
        IMPORTANTE:

        O auth.js cria o cliente do Supabase e disponibiliza
        através de:

            window.supabaseClient

        Por isso NÃO usamos simplesmente:

            supabaseClient

        aqui.
    */

    const supabase = window.supabaseClient;


    // ============================================================
    // VERIFICAÇÃO DO SUPABASE
    // ============================================================

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

                    if (supabase) {

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
            document.createElement(
                'div'
            );


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
            Caso venha no formato:

            2026-09-03
        */

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                valor
            )
        ) {

            const [
                ano,
                mes,
                dia
            ] =
                valor.split('-');


            return `${dia}/${mes}/${ano}`;

        }


        /*
            Caso venha como timestamp.
        */

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


        /*
            Se o Supabase retornar array.
        */

        if (
            Array.isArray(publico)
        ) {

            return publico;

        }


        /*
            Se vier como JSON em texto.
        */

        if (
            typeof publico === 'string'
        ) {

            try {

                const convertido =
                    JSON.parse(publico);


                if (
                    Array.isArray(
                        convertido
                    )
                ) {

                    return convertido;

                }

            } catch (error) {

                // Não é JSON.
            }


            /*
                Caso seja uma string simples
                separada por vírgulas.
            */

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
            normalizarPublico(
                publico
            );


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
    // ORDENAR EVENTOS
    // ============================================================

    function ordenarEventos(eventos) {

        return [...eventos].sort(
            (a, b) => {

                const dataA =
                    new Date(
                        a.created_at ||
                        a.criadoEm ||
                        0
                    ).getTime();


                const dataB =
                    new Date(
                        b.created_at ||
                        b.criadoEm ||
                        0
                    ).getTime();


                return dataB - dataA;

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
                    .from(
                        TABELA_EVENTOS
                    )
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


            return ordenarEventos(
                data
            );

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
            `${quantidade} ${
                quantidade === 1
                    ? 'evento cadastrado'
                    : 'eventos cadastrados'
            }`
        );

    }


    // ============================================================
    // MOSTRAR ESTADO VAZIO
    // ============================================================

    function mostrarEstadoVazio(
        mostrar
    ) {

        if (!eventosVazio) {
            return;
        }


        if (mostrar) {

            eventosVazio.hidden =
                false;


            eventosVazio.style.display =
                '';

        } else {

            eventosVazio.hidden =
                true;


            eventosVazio.style.display =
                'none';

        }

    }


    // ============================================================
    // RENDERIZAR EVENTOS
    // ============================================================

    async function renderizarEventos() {

        if (!listaEventos) {
            return;
        }


        /*
            Mostra um estado de carregamento
            enquanto consulta o banco.
        */

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


        const eventos =
            await obterEventos();


        atualizarContador(
            eventos.length
        );


        listaEventos.innerHTML =
            '';


        /*
            Nenhum evento.
        */

        if (
            eventos.length === 0
        ) {

            mostrarEstadoVazio(
                true
            );

            return;

        }


        /*
            Existem eventos.
        */

        mostrarEstadoVazio(
            false
        );


        // ========================================================
        // CRIA OS CARDS
        // ========================================================

        eventos.forEach(
            (evento) => {

                const card =
                    document.createElement(
                        'article'
                    );


                card.className =
                    'evento-card';


                /*
                    Guardamos o ID REAL
                    do Supabase no card.
                */

                card.dataset.eventoId =
                    evento.id;


                const publico =
                    formatarPublico(
                        evento.publico
                    );


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


                card.innerHTML = `

                    <div class="evento-card-top">

                        <div class="evento-data">

                            <i
                                class="fas fa-calendar-days"
                                aria-hidden="true">
                            </i>

                            <span>
                                ${formatarData(
                                    evento.data
                                )}
                            </span>

                        </div>


                        <button
                            type="button"
                            class="evento-excluir"
                            data-id="${escaparHTML(
                                evento.id
                            )}"
                            aria-label="Excluir evento ${escaparHTML(
                                evento.nome
                            )}"
                        >

                            <i
                                class="fas fa-trash"
                                aria-hidden="true">
                            </i>

                        </button>

                    </div>


                    <h3 class="evento-nome">
                        ${escaparHTML(
                            evento.nome
                        )}
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
                                ${formatarTipoEvento(
                                    evento.tipo
                                )}
                            </span>

                        </div>


                        <div class="evento-info">

                            <i
                                class="fas fa-users"
                                aria-hidden="true">
                            </i>

                            <span>
                                ${escaparHTML(
                                    publico
                                )}
                            </span>

                        </div>


                    </div>


                    ${descricao}

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


        /*
            Evita duplo clique.
        */

        if (botao) {

            botao.disabled =
                true;

            botao.innerHTML = `

                <i
                    class="fas fa-spinner fa-spin"
                    aria-hidden="true">
                </i>

            `;

        }


        try {

            console.log(
                'Excluindo evento do Supabase:',
                id
            );


            const {
                error
            } =
                await supabase
                    .from(
                        TABELA_EVENTOS
                    )
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

                    `;

                }


                return;

            }


            console.log(
                'Evento excluído com sucesso.'
            );


            alert(
                'Evento excluído com sucesso!'
            );


            /*
                Busca novamente no banco.
            */

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

                `;

            }

        }

    }


    // ============================================================
    // EVENTO DE EXCLUSÃO
    // ============================================================

    if (listaEventos) {

        /*
            Usamos apenas UM listener.

            Isso funciona inclusive para cards
            criados depois pelo JavaScript.
        */

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


                const localInput =
                    document.getElementById(
                        'localEvento'
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


                const local =
                    localInput
                        ? localInput.value.trim()
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


                if (!tipoSelecionado) {

                    alert(
                        'Selecione o tipo do evento.'
                    );


                    return;

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

                    tipo:
                        tipoSelecionado.value,

                    local:
                        local || null,

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
                // INSERT NO SUPABASE
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


                    // ==============================================
                    // ERRO
                    // ==============================================

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


                    // ==============================================
                    // SUCESSO
                    // ==============================================

                    console.log(
                        'Evento cadastrado:',
                        eventoCriado
                    );


                    formEvento.reset();


                    /*
                        Atualiza texto dos arquivos.
                    */

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


                    /*
                        Busca novamente todos
                        os eventos no Supabase.
                    */

                    await renderizarEventos();


                    /*
                        Vai até a lista.
                    */

                    const eventosCadastrados =
                        document.getElementById(
                            'eventos-cadastrados'
                        );


                    if (
                        eventosCadastrados
                    ) {

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

                    /*
                        DataTransfer permite
                        atualizar os arquivos
                        selecionados.
                    */

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
        '========================================'
    );


    /*
        Carrega os eventos diretamente
        do Supabase.
    */

    await renderizarEventos();

});