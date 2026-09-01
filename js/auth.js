/* ==========================================================================
   AUTH.JS — STARTÊ / SENAC

   Responsabilidades:
   1. Conectar ao Supabase
   2. Verificar sessão
   3. Proteger páginas privadas
   4. Obter usuário autenticado
   5. Exibir nome do usuário
   6. Menu do perfil
   7. Botão Meu Perfil
   8. Logout
   9. Observar alterações de autenticação
   ========================================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /* ==============================================================
           CONFIGURAÇÃO SUPABASE
        ============================================================== */

        const SUPABASE_URL =
            "https://fdpytnlvkdfvumejlbip.supabase.co";


        const SUPABASE_KEY =
            "sb_publishable_G2loVvADj59-2OQZVNhl5w_PA4bIYgf";


        /* ==============================================================
           VERIFICAR SUPABASE
        ============================================================== */

        if (!window.supabase) {

            console.error(
                "Supabase não foi carregado."
            );

            return;
        }


        /* ==============================================================
           CRIAR CLIENTE
        ============================================================== */

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


        /* ==============================================================
           DETECTAR PÁGINA ATUAL
        ============================================================== */

        const paginaAtual =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        /*
         * Caso o Vercel esteja servindo
         * a raiz do site.
         */

        const paginaEhHome =
            paginaAtual === "home.html" ||
            paginaAtual === "" ||
            paginaAtual === "index.html";


        const paginaEhLogin =
            paginaAtual === "login.html";


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
           OBTER NOME DO USUÁRIO
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


            if (
                nome &&
                typeof nome === "string" &&
                nome.trim()
            ) {

                return nome
                    .trim()
                    .split(/\s+/)[0];
            }


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
                            palavra
                                .slice(1)
                    )
                    .join(" ");
            }


            return "Usuário";
        }


        /* ==============================================================
           ATUALIZAR NOME
        ============================================================== */

        function atualizarNomeUsuario(user) {

            const nome =
                obterNomeUsuario(user);


            if (userProfileName) {

                userProfileName.textContent =
                    nome;

                userProfileName.setAttribute(
                    "title",
                    nome
                );
            }


            const elementosNome =
                document.querySelectorAll(
                    "[data-user-name]"
                );


            elementosNome.forEach(
                elemento => {

                    elemento.textContent =
                        nome;

                    elemento.setAttribute(
                        "title",
                        nome
                    );
                }
            );


            const elementosEmail =
                document.querySelectorAll(
                    "[data-user-email]"
                );


            elementosEmail.forEach(
                elemento => {

                    elemento.textContent =
                        user?.email || "";
                }
            );
        }


        /* ==============================================================
           MOSTRAR PERFIL
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
           ESCONDER PERFIL
        ============================================================== */

        function esconderUsuario() {

            if (userProfile) {

                userProfile.style.display =
                    "none";
            }
        }


        /* ==============================================================
           MENU DO PERFIL
        ============================================================== */

        if (
            userProfileButton &&
            userProfileMenu
        ) {

            userProfileButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const aberto =
                        userProfileButton
                            .getAttribute(
                                "aria-expanded"
                            ) === "true";


                    userProfileButton.setAttribute(
                        "aria-expanded",
                        String(!aberto)
                    );


                    userProfileMenu.classList.toggle(
                        "active",
                        !aberto
                    );


                    userProfileMenu.style.display =
                        !aberto
                            ? "block"
                            : "";
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

                        userProfileButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        userProfileMenu.classList.remove(
                            "active"
                        );

                        userProfileMenu.style.display =
                            "";
                    }
                }
            );
        }


        /* ==============================================================
           MEU PERFIL
        ============================================================== */

        if (profileButton) {

            profileButton.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "./perfil.html";
                }
            );
        }


        /* ==============================================================
           LOGOUT
        ============================================================== */

        if (logoutButton) {

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


                    const {
                        error
                    } =
                        await supabaseClient.auth
                            .signOut();


                    if (error) {

                        console.error(
                            "Erro ao sair:",
                            error
                        );


                        if (span) {

                            span.textContent =
                                textoOriginal;
                        }


                        logoutButton.disabled =
                            false;

                        return;
                    }


                    /*
                     * Redirecionamento manual.
                     */

                    window.location.href =
                        "./login.html";
                }
            );
        }


        /* ==============================================================
           VERIFICAR SESSÃO
        ============================================================== */

        async function verificarSessao() {

            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .getSession();


            if (error) {

                console.error(
                    "Erro ao verificar sessão:",
                    error
                );

                return null;
            }


            const session =
                data?.session;


            /* ==========================================================
               USUÁRIO NÃO LOGADO
            ========================================================== */

            if (!session) {

                esconderUsuario();


                /*
                 * Páginas privadas.
                 *
                 * Caso o usuário tente acessar
                 * home, cursos, eventos, perfil
                 * etc. sem login, volta para login.
                 */


                const paginasPrivadas = [

                    "home.html",

                    "cursos.html",

                    "eventos.html",

                    "conduta.html",

                    "perfil.html"

                ];


                if (
                    paginasPrivadas.includes(
                        paginaAtual
                    )
                ) {

                    window.location.replace(
                        "./login.html"
                    );
                }


                return null;
            }


            /* ==========================================================
               USUÁRIO LOGADO
            ========================================================== */

            mostrarUsuario(
                session.user
            );


            /*
             * Se o usuário já estiver logado
             * e tentar abrir login.html,
             * volta para home.
             */

            if (paginaEhLogin) {

                window.location.replace(
                    "./home.html"
                );

                return session;
            }


            return session;
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
                   USUÁRIO SAIU
                ====================================================== */

                if (
                    event === "SIGNED_OUT"
                ) {

                    esconderUsuario();


                    if (
                        !paginaEhLogin
                    ) {

                        window.location.replace(
                            "./login.html"
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