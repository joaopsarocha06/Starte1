/* ==========================================================================
   PERFIL.JS — STARTÊ / SENAC

   Funcionalidades:
   1. Carregamento do usuário autenticado pelo Supabase
   2. Exibição do nome do usuário
   3. Exibição do e-mail
   4. Exibição do tipo de usuário
   5. Menu do perfil
   6. Edição do perfil
   7. Atualização do nome no Supabase Auth
   8. Meus eventos
   9. Logout
   10. Busca do footer
   11. Voltar ao topo
   12. Mensagem de sucesso
   ========================================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {


        /* ==============================================================
           VERIFICAR CLIENTE SUPABASE
        ============================================================== */

        if (!window.supabaseClient) {

            console.error(
                "Cliente Supabase não encontrado."
            );

            return;
        }


        const supabaseClient =
            window.supabaseClient;


        /* ==============================================================
           DADOS DO USUÁRIO
        ============================================================== */

        let usuario = null;


        /* ==============================================================
           ELEMENTOS DO PERFIL
        ============================================================== */

        const perfilNome =
            document.getElementById(
                "perfilNome"
            );


        const nomeUsuario =
            document.getElementById(
                "nomeUsuario"
            );


        const emailUsuario =
            document.getElementById(
                "emailUsuario"
            );


        const tipoUsuario =
            document.getElementById(
                "tipoUsuario"
            );


        const userProfileName =
            document.getElementById(
                "userProfileName"
            );


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


            /*
             * Caso não exista nome no metadata,
             * utiliza o início do e-mail.
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
                            palavra.slice(1)
                    )
                    .join(" ");

            }


            return "Usuário";

        }


        /* ==============================================================
           OBTER PRIMEIRO NOME
        ============================================================== */

        function obterPrimeiroNome(user) {

            const nomeCompleto =
                obterNomeCompleto(user);


            if (!nomeCompleto) {

                return "Usuário";

            }


            return nomeCompleto
                .trim()
                .split(/\s+/)[0];

        }


        /* ==============================================================
           OBTER TIPO DO USUÁRIO
        ============================================================== */

        function obterTipoUsuario(user) {

            if (!user) {

                return "Usuário";

            }


            const metadata =
                user.user_metadata || {};


            return (
                metadata.tipo ||
                metadata.tipo_usuario ||
                metadata.role ||
                "Usuário"
            );

        }


        /* ==============================================================
           ATUALIZAR PERFIL NA TELA
        ============================================================== */

        function atualizarPerfil(user) {

            if (!user) {

                return;

            }


            const nomeCompleto =
                obterNomeCompleto(user);


            const primeiroNome =
                obterPrimeiroNome(user);


            const email =
                user.email ||
                "";


            const tipo =
                obterTipoUsuario(user);


            /* ----------------------------------------------------------
               NOME PRINCIPAL DO PERFIL
            ---------------------------------------------------------- */

            if (perfilNome) {

                perfilNome.textContent =
                    nomeCompleto;

            }


            /* ----------------------------------------------------------
               NOME DO USUÁRIO
            ---------------------------------------------------------- */

            if (nomeUsuario) {

                nomeUsuario.textContent =
                    nomeCompleto;

            }


            /* ----------------------------------------------------------
               E-MAIL
            ---------------------------------------------------------- */

            if (emailUsuario) {

                emailUsuario.textContent =
                    email;

            }


            /* ----------------------------------------------------------
               TIPO DE USUÁRIO
            ---------------------------------------------------------- */

            if (tipoUsuario) {

                tipoUsuario.textContent =
                    tipo;

            }


            /* ----------------------------------------------------------
               NOME NO HEADER

               O Header utiliza o primeiro nome.
            ---------------------------------------------------------- */

            if (userProfileName) {

                userProfileName.textContent =
                    primeiroNome;


                userProfileName.setAttribute(
                    "title",
                    nomeCompleto
                );

            }


            /* ----------------------------------------------------------
               ELEMENTOS DATA-USER-NAME
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
               ELEMENTOS DATA-USER-EMAIL
            ---------------------------------------------------------- */

            const elementosEmail =
                document.querySelectorAll(
                    "[data-user-email]"
                );


            elementosEmail.forEach(
                elemento => {

                    elemento.textContent =
                        email;

                }
            );

        }


        /* ==============================================================
           CARREGAR USUÁRIO AUTENTICADO
        ============================================================== */

        async function carregarUsuario() {

            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .auth
                        .getSession();


                /* ------------------------------------------------------
                   ERRO
                ------------------------------------------------------ */

                if (error) {

                    console.error(
                        "Erro ao carregar sessão:",
                        error
                    );


                    window.location.replace(
                        "./index.html"
                    );


                    return null;

                }


                const session =
                    data?.session;


                /* ------------------------------------------------------
                   USUÁRIO NÃO AUTENTICADO
                ------------------------------------------------------ */

                if (!session?.user) {

                    window.location.replace(
                        "./index.html"
                    );


                    return null;

                }


                /* ------------------------------------------------------
                   USUÁRIO AUTENTICADO
                ------------------------------------------------------ */

                usuario =
                    session.user;


                atualizarPerfil(
                    usuario
                );


                return usuario;

            } catch (error) {

                console.error(
                    "Erro inesperado ao carregar usuário:",
                    error
                );


                window.location.replace(
                    "./index.html"
                );


                return null;

            }

        }


        /* ==============================================================
           CARREGAR USUÁRIO
        ============================================================== */

        await carregarUsuario();


        /*
         * Se não houver usuário, interrompe o restante
         * do código porque a página será redirecionada.
         */

        if (!usuario) {

            return;

        }


        /* ==============================================================
           MENU DO PERFIL
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


        const profileButton =
            document.getElementById(
                "profileButton"
            );


        if (
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

                        userProfile.classList.remove(
                            "open"
                        );


                        userProfileMenu.classList.remove(
                            "active"
                        );


                        userProfileButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

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

                        userProfile.classList.remove(
                            "open"
                        );


                        userProfileMenu.classList.remove(
                            "active"
                        );


                        userProfileButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }
            );

        }


        /* ==============================================================
           BOTÃO MEU PERFIL
        ============================================================== */

        if (profileButton) {

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
           MODAL
        ============================================================== */

        const modalPerfil =
            document.getElementById(
                "modalPerfil"
            );


        const editarPerfil =
            document.getElementById(
                "editarPerfil"
            );


        const editarDados =
            document.getElementById(
                "editarDados"
            );


        const fecharModal =
            document.getElementById(
                "fecharModal"
            );


        const cancelarEdicao =
            document.getElementById(
                "cancelarEdicao"
            );


        const formPerfil =
            document.getElementById(
                "formPerfil"
            );


        const editarNome =
            document.getElementById(
                "editarNome"
            );


        const editarEmail =
            document.getElementById(
                "editarEmail"
            );


        /* ==============================================================
           ABRIR MODAL
        ============================================================== */

        function abrirModal() {

            if (!modalPerfil) {

                return;

            }


            if (editarNome) {

                editarNome.value =
                    obterNomeCompleto(usuario);

            }


            if (editarEmail) {

                editarEmail.value =
                    usuario.email || "";

            }


            modalPerfil.classList.add(
                "active"
            );


            modalPerfil.setAttribute(
                "aria-hidden",
                "false"
            );


            setTimeout(
                () => {

                    if (editarNome) {

                        editarNome.focus();

                    }

                },
                100
            );

        }


        /* ==============================================================
           FECHAR MODAL
        ============================================================== */

        function fecharModalPerfil() {

            if (!modalPerfil) {

                return;

            }


            modalPerfil.classList.remove(
                "active"
            );


            modalPerfil.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        /* ==============================================================
           BOTÃO EDITAR PERFIL
        ============================================================== */

        if (editarPerfil) {

            editarPerfil.addEventListener(
                "click",
                abrirModal
            );

        }


        if (editarDados) {

            editarDados.addEventListener(
                "click",
                abrirModal
            );

        }


        /* ==============================================================
           FECHAR MODAL
        ============================================================== */

        if (fecharModal) {

            fecharModal.addEventListener(
                "click",
                fecharModalPerfil
            );

        }


        if (cancelarEdicao) {

            cancelarEdicao.addEventListener(
                "click",
                fecharModalPerfil
            );

        }


        /* ==============================================================
           CLICAR FORA DO MODAL
        ============================================================== */

        if (modalPerfil) {

            modalPerfil.addEventListener(
                "click",
                event => {

                    if (
                        event.target === modalPerfil
                    ) {

                        fecharModalPerfil();

                    }

                }
            );

        }


        /* ==============================================================
           ESC FECHA MODAL
        ============================================================== */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    modalPerfil &&
                    modalPerfil.classList.contains(
                        "active"
                    )
                ) {

                    fecharModalPerfil();

                }

            }
        );


        /* ==============================================================
           SALVAR PERFIL NO SUPABASE
        ============================================================== */

        if (formPerfil) {

            formPerfil.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    /* --------------------------------------------------
                       VALORES
                    -------------------------------------------------- */

                    const novoNome =
                        editarNome
                            ?.value
                            .trim();


                    const novoEmail =
                        editarEmail
                            ?.value
                            .trim();


                    /* --------------------------------------------------
                       VALIDAR NOME
                    -------------------------------------------------- */

                    if (!novoNome) {

                        alert(
                            "Digite seu nome completo."
                        );


                        if (editarNome) {

                            editarNome.focus();

                        }


                        return;

                    }


                    /* --------------------------------------------------
                       VALIDAR E-MAIL
                    -------------------------------------------------- */

                    if (!novoEmail) {

                        alert(
                            "Digite seu e-mail."
                        );


                        if (editarEmail) {

                            editarEmail.focus();

                        }


                        return;

                    }


                    /* --------------------------------------------------
                       BOTÃO DE ENVIO
                    -------------------------------------------------- */

                    const botaoSalvar =
                        formPerfil.querySelector(
                            'button[type="submit"]'
                        );


                    const textoOriginal =
                        botaoSalvar?.textContent ||
                        "Salvar";


                    if (botaoSalvar) {

                        botaoSalvar.disabled =
                            true;


                        botaoSalvar.textContent =
                            "Salvando...";

                    }


                    try {

                        /* ==================================================
                           ATUALIZAR DADOS NO SUPABASE AUTH
                        ================================================== */

                        const {
                            data,
                            error
                        } =
                            await supabaseClient
                                .auth
                                .updateUser({

                                    email:
                                        novoEmail,

                                    data: {

                                        nome:
                                            novoNome,

                                        name:
                                            novoNome,

                                        full_name:
                                            novoNome,

                                        display_name:
                                            novoNome,

                                        tipo:
                                            obterTipoUsuario(
                                                usuario
                                            )

                                    }

                                });


                        /* --------------------------------------------------
                           VERIFICAR ERRO
                        -------------------------------------------------- */

                        if (error) {

                            console.error(
                                "Erro ao atualizar perfil:",
                                error
                            );


                            alert(
                                `Não foi possível atualizar o perfil.\n\n${error.message}`
                            );


                            return;

                        }


                        /* --------------------------------------------------
                           ATUALIZAR USUÁRIO LOCAL
                        -------------------------------------------------- */

                        if (data?.user) {

                            usuario =
                                data.user;

                        } else {

                            usuario.user_metadata = {

                                ...usuario.user_metadata,

                                nome:
                                    novoNome,

                                name:
                                    novoNome,

                                full_name:
                                    novoNome,

                                display_name:
                                    novoNome

                            };


                            /*
                             * O e-mail pode exigir confirmação
                             * dependendo da configuração do Supabase.
                             */

                            if (novoEmail) {

                                usuario.email =
                                    novoEmail;

                            }

                        }


                        /* --------------------------------------------------
                           ATUALIZAR INTERFACE
                        -------------------------------------------------- */

                        atualizarPerfil(
                            usuario
                        );


                        /* --------------------------------------------------
                           FECHAR MODAL
                        -------------------------------------------------- */

                        fecharModalPerfil();


                        /* --------------------------------------------------
                           MENSAGEM
                        -------------------------------------------------- */

                        mostrarMensagem(
                            "Perfil atualizado com sucesso!"
                        );


                    } catch (error) {

                        console.error(
                            "Erro inesperado ao atualizar perfil:",
                            error
                        );


                        alert(
                            "Ocorreu um erro ao atualizar seu perfil."
                        );


                    } finally {

                        if (botaoSalvar) {

                            botaoSalvar.disabled =
                                false;


                            botaoSalvar.textContent =
                                textoOriginal;

                        }

                    }

                }
            );

        }


        /* ==============================================================
           MEUS EVENTOS
        ============================================================== */

        const meusEventos =
            document.getElementById(
                "meusEventos"
            );


        if (meusEventos) {

            meusEventos.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "./eventos.html";

                }
            );

        }


        /* ==============================================================
           LOGOUT
        ============================================================== */

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


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
                           REDIRECIONAR PARA O LOGIN
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
           BUSCA DO FOOTER
        ============================================================== */

        const footerSearchBtn =
            document.getElementById(
                "footerSearchBtn"
            );


        const footerSearch =
            document.getElementById(
                "footerSearch"
            );


        if (
            footerSearchBtn &&
            footerSearch
        ) {

            function realizarBusca() {

                const termo =
                    footerSearch.value.trim();


                if (!termo) {

                    return;

                }


                window.location.href =
                    `cursos.html?search=${encodeURIComponent(termo)}`;

            }


            footerSearchBtn.addEventListener(
                "click",
                realizarBusca
            );


            footerSearch.addEventListener(
                "keypress",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        realizarBusca();

                    }

                }
            );

        }


        /* ==============================================================
           VOLTAR AO TOPO
        ============================================================== */

        const backToTop =
            document.getElementById(
                "backToTop"
            );


        if (backToTop) {

            window.addEventListener(
                "scroll",
                () => {

                    if (
                        window.scrollY > 300
                    ) {

                        backToTop.classList.add(
                            "show"
                        );

                    } else {

                        backToTop.classList.remove(
                            "show"
                        );

                    }

                }
            );


            backToTop.addEventListener(
                "click",
                () => {

                    window.scrollTo({

                        top: 0,

                        behavior: "smooth"

                    });

                }
            );

        }


        /* ==============================================================
           MENSAGEM DE SUCESSO
        ============================================================== */

        function mostrarMensagem(texto) {

            const mensagemExistente =
                document.querySelector(
                    ".mensagem-sucesso"
                );


            if (mensagemExistente) {

                mensagemExistente.remove();

            }


            const mensagem =
                document.createElement(
                    "div"
                );


            mensagem.className =
                "mensagem-sucesso";


            mensagem.innerHTML = `
                <i class="fas fa-circle-check"></i>
                <span>${texto}</span>
            `;


            document.body.appendChild(
                mensagem
            );


            setTimeout(
                () => {

                    mensagem.classList.add(
                        "show"
                    );

                },
                20
            );


            setTimeout(
                () => {

                    mensagem.classList.remove(
                        "show"
                    );


                    setTimeout(
                        () => {

                            mensagem.remove();

                        },
                        300
                    );

                },
                3000
            );

        }


        /* ==============================================================
           OBSERVAR ALTERAÇÕES DO USUÁRIO
        ============================================================== */

        supabaseClient.auth.onAuthStateChange(
            (
                event,
                session
            ) => {

                console.log(
                    "Perfil — Supabase Auth:",
                    event
                );


                /* ------------------------------------------------------
                   USUÁRIO ATUALIZADO
                ------------------------------------------------------ */

                if (
                    event === "USER_UPDATED" &&
                    session?.user
                ) {

                    usuario =
                        session.user;


                    atualizarPerfil(
                        usuario
                    );

                }


                /* ------------------------------------------------------
                   SESSÃO INICIAL
                ------------------------------------------------------ */

                if (
                    event === "INITIAL_SESSION" &&
                    session?.user
                ) {

                    usuario =
                        session.user;


                    atualizarPerfil(
                        usuario
                    );

                }


                /* ------------------------------------------------------
                   TOKEN ATUALIZADO
                ------------------------------------------------------ */

                if (
                    event === "TOKEN_REFRESHED" &&
                    session?.user
                ) {

                    usuario =
                        session.user;


                    atualizarPerfil(
                        usuario
                    );

                }


                /* ------------------------------------------------------
                   USUÁRIO SAIU
                ------------------------------------------------------ */

                if (
                    event === "SIGNED_OUT"
                ) {

                    usuario =
                        null;


                    window.location.replace(
                        "./index.html"
                    );

                }

            }
        );

    }
);