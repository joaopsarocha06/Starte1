/* ==========================================================================
   AUTH.JS — STARTÊ / SENAC

   Responsabilidades:
   1. Conectar ao Supabase
   2. Disponibilizar o cliente Supabase globalmente
   3. Verificar sessão
   4. Proteger páginas privadas
   5. Obter usuário autenticado
   6. Exibir nome do usuário
   7. Menu do perfil
   8. Botão Meu Perfil
   9. Logout
   10. Observar alterações de autenticação
   ========================================================================== */


/* ==========================================================================
   CONFIGURAÇÃO SUPABASE
   ========================================================================== */

const SUPABASE_URL =
    "https://fdpytnlvkdfvumejlbip.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_G2loVvADj59-2OQZVNhl5w_PA4bIYgf";


/* ==========================================================================
   VERIFICAR BIBLIOTECA SUPABASE
   ========================================================================== */

if (!window.supabase) {

    console.error(
        "Supabase não foi carregado."
    );

} else {


    /* ======================================================================
       CRIAR CLIENTE SUPABASE
       ====================================================================== */

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            }
        );


    /* ======================================================================
       DISPONIBILIZAR CLIENTE GLOBALMENTE

       Outros arquivos, como perfil.js, poderão utilizar:

       window.supabaseClient

       sem precisar criar outro cliente.
       ====================================================================== */

    window.supabaseClient =
        supabaseClient;


    /* ======================================================================
       EXECUTAR APÓS CARREGAMENTO DO HTML
       ====================================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        async () => {


            /* ==============================================================
               DETECTAR PÁGINA ATUAL
            ============================================================== */

            const paginaAtual =
                window.location.pathname
                    .split("/")
                    .pop()
                    .toLowerCase();


            /* ==============================================================
               IDENTIFICAR PÁGINA DE LOGIN

               No projeto Startê:
               index.html = página de login
            ============================================================== */

            const paginaEhLogin =
                paginaAtual === "index.html" ||
                paginaAtual === "";


            /* ==============================================================
               IDENTIFICAR PÁGINA DE PERFIL
            ============================================================== */

            const paginaEhPerfil =
                paginaAtual === "perfil.html";


            /* ==============================================================
               PÁGINAS PRIVADAS
            ============================================================== */

            const paginasPrivadas = [

                "home.html",

                "cursos.html",

                "eventos.html",

                "conduta.html",

                "mural.html",

                "perfil.html"

            ];


            /* ==============================================================
               ELEMENTOS DO PERFIL
            ============================================================== */

            const userProfile =
                document.getElementById(
                    "userProfile"
                );


            const userProfileButton =
                document.getElementById(
                    "userProfileButton"
                );


            const userProfileMenu =
                document.getElementById(
                    "userProfileMenu"
                );


            const userProfileName =
                document.getElementById(
                    "userProfileName"
                );


            const logoutButton =
                document.getElementById(
                    "logoutButton"
                );


            const profileButton =
                document.getElementById(
                    "profileButton"
                );


            /* ==============================================================
               OBTER PRIMEIRO NOME DO USUÁRIO
            ============================================================== */

            function obterNomeUsuario(user) {

                if (!user) {

                    return "Usuário";

                }


                const metadata =
                    user.user_metadata || {};


                const nome =
                    metadata.nome ||
                    metadata.name ||
                    metadata.full_name ||
                    metadata.display_name;


                /* ----------------------------------------------------------
                   NOME CADASTRADO NO SUPABASE
                ---------------------------------------------------------- */

                if (
                    nome &&
                    typeof nome === "string" &&
                    nome.trim()
                ) {

                    return nome
                        .trim()
                        .split(/\s+/)[0];

                }


                /* ----------------------------------------------------------
                   FALLBACK PARA O E-MAIL
                ---------------------------------------------------------- */

                if (user.email) {

                    return user.email
                        .split("@")[0]
                        .replace(/[._-]/g, " ")
                        .split(" ")
                        .filter(Boolean)
                        .map(
                            palavra =>
                                palavra
                                    .charAt(0)
                                    .toUpperCase() +
                                palavra.slice(1)
                        )
                        .join(" ");

                }


                return "Usuário";

            }


            /* ==============================================================
               OBTER NOME COMPLETO
            ============================================================== */

            function obterNomeCompleto(user) {

                if (!user) {

                    return "Usuário";

                }


                const metadata =
                    user.user_metadata || {};


                const nome =
                    metadata.nome ||
                    metadata.name ||
                    metadata.full_name ||
                    metadata.display_name;


                if (
                    nome &&
                    typeof nome === "string" &&
                    nome.trim()
                ) {

                    return nome.trim();

                }


                /* ----------------------------------------------------------
                   FALLBACK PARA O E-MAIL
                ---------------------------------------------------------- */

                if (user.email) {

                    return user.email
                        .split("@")[0]
                        .replace(/[._-]/g, " ")
                        .split(" ")
                        .filter(Boolean)
                        .map(
                            palavra =>
                                palavra
                                    .charAt(0)
                                    .toUpperCase() +
                                palavra.slice(1)
                        )
                        .join(" ");

                }


                return "Usuário";

            }


            /* ==============================================================
               ATUALIZAR NOME DO USUÁRIO NA INTERFACE
            ============================================================== */

            function atualizarNomeUsuario(user) {

                if (!user) {

                    return;

                }


                const nomeHeader =
                    obterNomeUsuario(user);


                const nomeCompleto =
                    obterNomeCompleto(user);


                /* ----------------------------------------------------------
                   NOME NO HEADER
                ---------------------------------------------------------- */

                if (userProfileName) {

                    userProfileName.textContent =
                        nomeHeader;


                    userProfileName.setAttribute(
                        "title",
                        nomeCompleto
                    );

                }


                /* ----------------------------------------------------------
                   ELEMENTOS COM DATA-USER-NAME

                   Exemplo:

                   <span data-user-name></span>
                ---------------------------------------------------------- */

                const elementosNome =
                    document.querySelectorAll(
                        "[data-user-name]"
                    );


                elementosNome.forEach(
                    elemento => {

                        elemento.textContent =
                            nomeCompleto;


                        elemento.setAttribute(
                            "title",
                            nomeCompleto
                        );

                    }
                );


                /* ----------------------------------------------------------
                   ELEMENTOS COM DATA-USER-EMAIL
                ---------------------------------------------------------- */

                const elementosEmail =
                    document.querySelectorAll(
                        "[data-user-email]"
                    );


                elementosEmail.forEach(
                    elemento => {

                        elemento.textContent =
                            user.email || "";

                    }
                );

            }


            /* ==============================================================
               MOSTRAR USUÁRIO
            ============================================================== */

            function mostrarUsuario(user) {

                if (!user) {

                    return;

                }


                atualizarNomeUsuario(
                    user
                );


                if (userProfile) {

                    userProfile.style.display =
                        "flex";

                }

            }


            /* ==============================================================
               ESCONDER USUÁRIO
            ============================================================== */

            function esconderUsuario() {

                if (userProfile) {

                    userProfile.style.display =
                        "none";

                }

            }


            /* ==============================================================
               FECHAR MENU DO PERFIL
            ============================================================== */

            function fecharMenuPerfil() {

                if (
                    userProfile &&
                    userProfileButton &&
                    userProfileMenu
                ) {

                    userProfile.classList.remove(
                        "open"
                    );


                    userProfileButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    userProfileMenu.classList.remove(
                        "active"
                    );

                }

            }


            /* ==============================================================
               MENU DO PERFIL

               O perfil.html possui o perfil.js, que também
               controla esse menu.

               Para evitar conflito entre os dois scripts,
               o auth.js não registra o menu nessa página.
            ============================================================== */

            if (
                !paginaEhPerfil &&
                userProfile &&
                userProfileButton &&
                userProfileMenu
            ) {

                userProfileButton.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();


                        const aberto =
                            userProfile.classList.contains(
                                "open"
                            );


                        if (aberto) {

                            fecharMenuPerfil();

                        } else {

                            userProfile.classList.add(
                                "open"
                            );


                            userProfileMenu.classList.add(
                                "active"
                            );


                            userProfileButton.setAttribute(
                                "aria-expanded",
                                "true"
                            );

                        }

                    }
                );


                document.addEventListener(
                    "click",
                    event => {

                        if (
                            !userProfile.contains(
                                event.target
                            )
                        ) {

                            fecharMenuPerfil();

                        }

                    }
                );

            }


            /* ==============================================================
               BOTÃO MEU PERFIL
            ============================================================== */

            if (
                !paginaEhPerfil &&
                profileButton
            ) {

                profileButton.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();


                        window.location.href =
                            "./perfil.html";

                    }
                );

            }


            /* ==============================================================
               LOGOUT

               No perfil.html o logout será controlado
               pelo perfil.js para evitar conflito.
            ============================================================== */

            if (
                !paginaEhPerfil &&
                logoutButton
            ) {

                logoutButton.addEventListener(
                    "click",
                    async event => {

                        event.preventDefault();

                        event.stopPropagation();


                        if (
                            logoutButton.disabled
                        ) {

                            return;

                        }


                        const confirmar =
                            confirm(
                                "Deseja realmente sair da sua conta?"
                            );


                        if (!confirmar) {

                            return;

                        }


                        logoutButton.disabled =
                            true;


                        const span =
                            logoutButton.querySelector(
                                "span"
                            );


                        const textoOriginal =
                            span?.textContent ||
                            "Sair";


                        if (span) {

                            span.textContent =
                                "Saindo...";

                        }


                        try {

                            const {
                                error
                            } =
                                await supabaseClient
                                    .auth
                                    .signOut();


                            if (error) {

                                console.error(
                                    "Erro ao sair:",
                                    error
                                );


                                alert(
                                    `Não foi possível sair da conta.\n\n${error.message}`
                                );


                                if (span) {

                                    span.textContent =
                                        textoOriginal;

                                }


                                logoutButton.disabled =
                                    false;


                                return;

                            }


                            /* ------------------------------------------------
                               LOGOUT CONCLUÍDO
                            ------------------------------------------------ */

                            window.location.replace(
                                "./index.html"
                            );

                        } catch (error) {

                            console.error(
                                "Erro inesperado ao sair:",
                                error
                            );


                            alert(
                                "Ocorreu um erro ao sair da conta."
                            );


                            if (span) {

                                span.textContent =
                                    textoOriginal;

                            }


                            logoutButton.disabled =
                                false;

                        }

                    }
                );

            }


            /* ==============================================================
               VERIFICAR SESSÃO
            ============================================================== */

            async function verificarSessao() {

                try {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient
                            .auth
                            .getSession();


                    /* ------------------------------------------------------
                       ERRO AO CONSULTAR SESSÃO
                    ------------------------------------------------------ */

                    if (error) {

                        console.error(
                            "Erro ao verificar sessão:",
                            error
                        );


                        esconderUsuario();


                        return null;

                    }


                    const session =
                        data?.session;


                    /* ======================================================
                       USUÁRIO NÃO LOGADO
                    ====================================================== */

                    if (!session?.user) {

                        esconderUsuario();


                        /*
                         * Se estiver tentando acessar
                         * uma página privada sem estar
                         * autenticado, volta para index.html.
                         */

                        if (
                            paginasPrivadas.includes(
                                paginaAtual
                            )
                        ) {

                            window.location.replace(
                                "./index.html"
                            );


                            return null;

                        }


                        return null;

                    }


                    /* ======================================================
                       USUÁRIO LOGADO
                    ====================================================== */

                    mostrarUsuario(
                        session.user
                    );


                    /*
                     * Se já estiver logado e tentar
                     * abrir a página de login,
                     * volta para home.html.
                     */

                    if (paginaEhLogin) {

                        window.location.replace(
                            "./home.html"
                        );


                        return session;

                    }


                    return session;

                } catch (error) {

                    console.error(
                        "Erro inesperado ao verificar sessão:",
                        error
                    );


                    esconderUsuario();


                    return null;

                }

            }


            /* ==============================================================
               OBSERVAR ALTERAÇÕES DE AUTENTICAÇÃO
            ============================================================== */

            supabaseClient.auth.onAuthStateChange(
                (
                    event,
                    session
                ) => {

                    console.log(
                        "Supabase Auth:",
                        event
                    );


                    /* ======================================================
                       LOGIN
                    ====================================================== */

                    if (
                        event === "SIGNED_IN" &&
                        session?.user
                    ) {

                        mostrarUsuario(
                            session.user
                        );


                        /*
                         * Depois do login,
                         * vai para home.html.
                         */

                        if (paginaEhLogin) {

                            window.location.replace(
                                "./home.html"
                            );

                        }


                        return;

                    }


                    /* ======================================================
                       TOKEN ATUALIZADO
                    ====================================================== */

                    if (
                        event === "TOKEN_REFRESHED" &&
                        session?.user
                    ) {

                        mostrarUsuario(
                            session.user
                        );


                        return;

                    }


                    /* ======================================================
                       USUÁRIO ATUALIZADO
                    ============================================================== */

                    if (
                        event === "USER_UPDATED" &&
                        session?.user
                    ) {

                        mostrarUsuario(
                            session.user
                        );


                        return;

                    }


                    /* ======================================================
                       SESSÃO INICIAL
                    ============================================================== */

                    if (
                        event === "INITIAL_SESSION" &&
                        session?.user
                    ) {

                        mostrarUsuario(
                            session.user
                        );


                        return;

                    }


                    /* ======================================================
                       LOGOUT
                    ============================================================== */

                    if (
                        event === "SIGNED_OUT"
                    ) {

                        esconderUsuario();


                        /*
                         * Se saiu da conta e não está
                         * no index.html, volta para o login.
                         */

                        if (!paginaEhLogin) {

                            window.location.replace(
                                "./index.html"
                            );

                        }

                    }

                }
            );


            /* ==============================================================
               VERIFICAR SESSÃO AO ABRIR A PÁGINA
            ============================================================== */

            await verificarSessao();

        }

    );

}