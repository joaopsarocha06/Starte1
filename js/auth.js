/* ==========================================================================
   AUTH.JS — STARTÊ / SENAC

   Responsabilidades:
   1. Conectar ao Supabase
   2. Verificar sessão
   3. Obter usuário logado
   4. Exibir nome do usuário
   5. Atualizar elementos data-user-name
   6. Menu do perfil
   7. Botão Meu Perfil
   8. Logout
   9. Observar alterações de autenticação
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    /* ======================================================================
       CONFIGURAÇÃO SUPABASE
       ====================================================================== */

    const SUPABASE_URL =
        "https://fdpytnlvkdfvumejlbip.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_G2loVvADj59-2OQZVNhl5w_PA4bIYgf";


    /* ======================================================================
       VERIFICAR SUPABASE
       ====================================================================== */

    if (!window.supabase) {

        console.error(
            "Supabase não foi carregado."
        );

        return;
    }


    /* ======================================================================
       CRIAR CLIENTE SUPABASE
       ====================================================================== */

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    /* ======================================================================
       ELEMENTOS DO PERFIL
       ====================================================================== */

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


    /* ======================================================================
       OBTER NOME DO USUÁRIO
       ====================================================================== */

    function obterNomeUsuario(user) {

        if (!user) {

            return "Usuário";

        }


        /*
         * Primeiro tenta pegar o nome salvo
         * nos metadados do Supabase.
         */

        const nome =
            user.user_metadata?.nome ||
            user.user_metadata?.name ||
            user.user_metadata?.full_name ||
            user.user_metadata?.display_name;


        if (
            nome &&
            typeof nome === "string" &&
            nome.trim()
        ) {

            /*
             * Mostra somente o primeiro nome.
             *
             * Exemplo:
             * João Pedro
             *
             * Resultado:
             * João
             */

            return nome
                .trim()
                .split(/\s+/)[0];
        }


        /*
         * Caso o nome não exista,
         * utiliza o e-mail.
         */

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


    /* ======================================================================
       ATUALIZAR NOME DO USUÁRIO
       ====================================================================== */

    function atualizarNomeUsuario(user) {

        const nome =
            obterNomeUsuario(user);


        /*
         * Nome principal do perfil.
         */

        if (userProfileName) {

            userProfileName.textContent =
                nome;

            userProfileName.setAttribute(
                "title",
                nome
            );
        }


        /*
         * Atualiza qualquer elemento
         * que possua:
         *
         * data-user-name
         *
         * Exemplo:
         *
         * <span data-user-name></span>
         */

        const elementosNome =
            document.querySelectorAll(
                "[data-user-name]"
            );


        elementosNome.forEach(
            (elemento) => {

                elemento.textContent =
                    nome;

                elemento.setAttribute(
                    "title",
                    nome
                );

            }
        );
    }


    /* ======================================================================
       MOSTRAR PERFIL
       ====================================================================== */

    function mostrarUsuario(user) {

        if (!user) {
            return;
        }


        atualizarNomeUsuario(
            user
        );


        if (userProfile) {

            /*
             * Flex é utilizado porque
             * normalmente o perfil do header
             * utiliza display:flex.
             */

            userProfile.style.display =
                "flex";

        }
    }


    /* ======================================================================
       ESCONDER PERFIL
       ====================================================================== */

    function esconderUsuario() {

        if (userProfile) {

            userProfile.style.display =
                "none";

        }
    }


    /* ======================================================================
       BOTÃO MEU PERFIL
       ====================================================================== */

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "perfil.html";

            }
        );
    }


    /* ======================================================================
       LOGOUT
       ====================================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();

                event.stopPropagation();


                /*
                 * Evita múltiplos cliques.
                 */

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


                /*
                 * Faz logout no Supabase.
                 */

                const {
                    error
                } =
                    await supabaseClient.auth.signOut();


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
                 * O listener SIGNED_OUT
                 * também será acionado.
                 */

                window.location.href =
                    "index.html";
            }
        );
    }


    /* ======================================================================
       VERIFICAR SESSÃO
       ====================================================================== */

    async function verificarSessao() {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Erro ao verificar sessão:",
                error
            );

            return;
        }


        const session =
            data?.session;


        /*
         * Usuário não está logado.
         */

        if (!session) {

            esconderUsuario();


            /*
             * Redireciona para o login.
             */

            if (
                !window.location.pathname
                    .toLowerCase()
                    .endsWith(
                        "home.html"
                    )
            ) {

                window.location.href =
                    "home.html";

            }

            return;
        }


        /*
         * Usuário está logado.
         */

        mostrarUsuario(
            session.user
        );
    }


    /* ======================================================================
       OBSERVAR ALTERAÇÕES DE AUTENTICAÇÃO
       ====================================================================== */

    supabaseClient.auth.onAuthStateChange(
        (
            event,
            session
        ) => {

            /*
             * Login realizado.
             */

            if (
                event === "SIGNED_IN" &&
                session?.user
            ) {

                mostrarUsuario(
                    session.user
                );

                return;
            }


            /*
             * Token/sessão atualizada.
             */

            if (
                event === "TOKEN_REFRESHED" &&
                session?.user
            ) {

                mostrarUsuario(
                    session.user
                );

                return;
            }


            /*
             * Usuário saiu.
             */

            if (
                event === "SIGNED_OUT"
            ) {

                esconderUsuario();

                window.location.href =
                    "login.html";

            }
        }
    );

    await verificarSessao();

});