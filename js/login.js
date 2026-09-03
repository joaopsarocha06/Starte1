/* ==========================================================================
   LOGIN.JS — STARTÊ / SENAC

   Responsabilidades:
   1. Conectar ao Supabase Auth
   2. Cadastro de usuário
   3. Login
   4. Validação de senha
   5. Confirmação de senha
   6. Indicador de força
   7. Mostrar / ocultar senha
   8. Redirecionamento para home.html
   9. Recuperação de senha
   10. Compatibilidade com login.html
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
       VERIFICAR SE SUPABASE FOI CARREGADO
       ====================================================================== */

    if (!window.supabase) {

        console.error(
            "Supabase não foi carregado."
        );

        return;
    }


    /* ======================================================================
       CRIAR CLIENTE
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
       ELEMENTOS — LOGIN
       ====================================================================== */

    const loginForm =
        document.getElementById("loginForm");

    const loginEmail =
        document.getElementById("loginEmail");

    const loginPassword =
        document.getElementById("loginPassword");

    const loginMessage =
        document.getElementById("loginMessage");


    /* ======================================================================
       ELEMENTOS — CADASTRO
       ====================================================================== */

    const registerForm =
        document.getElementById("registerForm");

    const registerName =
        document.getElementById("registerName");

    const registerEmail =
        document.getElementById("registerEmail");

    const registerPassword =
        document.getElementById("registerPassword");

    const registerPasswordConfirm =
        document.getElementById(
            "registerPasswordConfirm"
        );

    const registerMessage =
        document.getElementById("registerMessage");


    /* ======================================================================
       ELEMENTOS — ABAS
       ====================================================================== */

    const loginTab =
        document.getElementById("loginTab");

    const registerTab =
        document.getElementById("registerTab");

    const goRegister =
        document.getElementById("goRegister");

    const goLogin =
        document.getElementById("goLogin");

    const formTitle =
        document.getElementById("formTitle");

    const formSubtitle =
        document.getElementById("formSubtitle");


    /* ======================================================================
       CONFIGURAÇÕES
       ====================================================================== */

    const SENHA_REGEX = {

        tamanho: /.{8,}/,

        maiuscula: /[A-Z]/,

        minuscula: /[a-z]/,

        numero: /[0-9]/,

        especial: /[^A-Za-z0-9]/

    };


    const EMAIL_REGEX =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    const EMAIL_SENAC_REGEX =
        /^[^\s@]+@(pe\.senac\.br|edu\.pe\.senac\.br)$/i;


    /* ======================================================================
       MOSTRAR MENSAGEM
       ====================================================================== */

    function mostrarMensagem(
        elemento,
        mensagem,
        tipo = "error"
    ) {

        if (!elemento) {
            return;
        }

        elemento.textContent =
            mensagem;

        elemento.classList.remove(
            "error",
            "success",
            "warning",
            "erro",
            "sucesso",
            "aviso"
        );

        elemento.classList.add(tipo);

        elemento.classList.add("show");

        elemento.style.display =
            "block";
    }


    /* ======================================================================
       LIMPAR MENSAGEM
       ====================================================================== */

    function limparMensagem(elemento) {

        if (!elemento) {
            return;
        }

        elemento.textContent = "";

        elemento.classList.remove(
            "error",
            "success",
            "warning",
            "erro",
            "sucesso",
            "aviso",
            "show"
        );

        elemento.style.display =
            "none";
    }


    /* ======================================================================
       VALIDAR SENHA
       ====================================================================== */

    function validarSenha(senha) {

        return {

            tamanho:
                SENHA_REGEX.tamanho.test(senha),

            maiuscula:
                SENHA_REGEX.maiuscula.test(senha),

            minuscula:
                SENHA_REGEX.minuscula.test(senha),

            numero:
                SENHA_REGEX.numero.test(senha),

            especial:
                SENHA_REGEX.especial.test(senha)

        };
    }


    /* ======================================================================
       SENHA FORTE
       ====================================================================== */

    function senhaEstaForte(senha) {

        const requisitos =
            validarSenha(senha);

        return (

            requisitos.tamanho &&

            requisitos.maiuscula &&

            requisitos.minuscula &&

            requisitos.numero &&

            requisitos.especial

        );
    }


    /* ======================================================================
       INDICADOR DE FORÇA
       ====================================================================== */

    function atualizarForcaSenha(senha) {

        const passwordStrength =
            document.getElementById(
                "passwordStrength"
            );

        if (!passwordStrength) {
            return;
        }

        const requisitos =
            validarSenha(senha);

        let pontos = 0;

        if (requisitos.tamanho) {
            pontos++;
        }

        if (requisitos.maiuscula) {
            pontos++;
        }

        if (requisitos.minuscula) {
            pontos++;
        }

        if (requisitos.numero) {
            pontos++;
        }

        if (requisitos.especial) {
            pontos++;
        }

        passwordStrength.classList.remove(
            "weak",
            "medium",
            "strong"
        );

        if (!senha) {

            passwordStrength.textContent = "";

            return;
        }

        if (pontos <= 2) {

            passwordStrength.classList.add(
                "weak"
            );

            passwordStrength.textContent =
                "Senha fraca";

        } else if (pontos <= 4) {

            passwordStrength.classList.add(
                "medium"
            );

            passwordStrength.textContent =
                "Senha média";

        } else {

            passwordStrength.classList.add(
                "strong"
            );

            passwordStrength.textContent =
                "Senha forte";
        }
    }


    /* ======================================================================
       ATUALIZAR REQUISITOS
       ====================================================================== */

    function atualizarRequisitosSenha(senha) {

        const requisitos =
            validarSenha(senha);


        function atualizarElemento(
            id,
            valido
        ) {

            const elemento =
                document.getElementById(id);

            if (!elemento) {
                return;
            }

            elemento.classList.toggle(
                "valid",
                valido
            );

            elemento.classList.toggle(
                "valido",
                valido
            );


            const icone =
                elemento.querySelector("i");

            if (!icone) {
                return;
            }


            if (valido) {

                icone.classList.remove(
                    "fa-circle",
                    "fa-xmark"
                );

                icone.classList.add(
                    "fa-check"
                );

            } else {

                icone.classList.remove(
                    "fa-check"
                );

                icone.classList.add(
                    "fa-circle"
                );
            }
        }


        atualizarElemento(
            "reqLength",
            requisitos.tamanho
        );

        atualizarElemento(
            "reqUppercase",
            requisitos.maiuscula
        );

        atualizarElemento(
            "reqLowercase",
            requisitos.minuscula
        );

        atualizarElemento(
            "reqNumber",
            requisitos.numero
        );

        atualizarElemento(
            "reqSpecial",
            requisitos.especial
        );
    }


    /* ======================================================================
       CONFIRMAÇÃO DA SENHA
       ====================================================================== */

    function validarConfirmacaoSenha() {

        if (
            !registerPassword ||
            !registerPasswordConfirm
        ) {

            return false;
        }


        const senha =
            registerPassword.value;

        const confirmacao =
            registerPasswordConfirm.value;


        if (!confirmacao) {

            registerPasswordConfirm.classList.remove(
                "campo-valido",
                "campo-invalido"
            );

            return false;
        }


        if (senha === confirmacao) {

            registerPasswordConfirm.classList.remove(
                "campo-invalido"
            );

            registerPasswordConfirm.classList.add(
                "campo-valido"
            );

            return true;
        }


        registerPasswordConfirm.classList.remove(
            "campo-valido"
        );

        registerPasswordConfirm.classList.add(
            "campo-invalido"
        );

        return false;
    }


    /* ======================================================================
       DIGITAÇÃO DA SENHA
       ====================================================================== */

    if (registerPassword) {

        registerPassword.addEventListener(
            "input",
            () => {

                const senha =
                    registerPassword.value;

                atualizarForcaSenha(
                    senha
                );

                atualizarRequisitosSenha(
                    senha
                );

                if (
                    registerPasswordConfirm &&
                    registerPasswordConfirm.value
                ) {

                    validarConfirmacaoSenha();
                }
            }
        );
    }


    /* ======================================================================
       DIGITAÇÃO DA CONFIRMAÇÃO
       ====================================================================== */

    if (registerPasswordConfirm) {

        registerPasswordConfirm.addEventListener(
            "input",
            validarConfirmacaoSenha
        );
    }


    /* ======================================================================
       MOSTRAR / OCULTAR SENHA
       ====================================================================== */

    function configurarToggleSenha(
        botao,
        campo
    ) {

        if (!botao || !campo) {
            return;
        }


        botao.addEventListener(
            "click",
            () => {

                const mostrando =
                    campo.type === "text";


                if (mostrando) {

                    campo.type =
                        "password";

                    botao.setAttribute(
                        "aria-label",
                        "Mostrar senha"
                    );

                } else {

                    campo.type =
                        "text";

                    botao.setAttribute(
                        "aria-label",
                        "Ocultar senha"
                    );
                }


                const icone =
                    botao.querySelector("i");


                if (icone) {

                    icone.classList.toggle(
                        "fa-eye"
                    );

                    icone.classList.toggle(
                        "fa-eye-slash"
                    );
                }

            }
        );
    }


    /* ======================================================================
       CONFIGURAR TODOS OS TOGGLES
       ====================================================================== */

    document
        .querySelectorAll(
            ".password-toggle"
        )
        .forEach(
            botao => {

                const target =
                    botao.getAttribute(
                        "data-target"
                    );

                const campo =
                    document.getElementById(
                        target
                    );

                configurarToggleSenha(
                    botao,
                    campo
                );
            }
        );


    /* ======================================================================
       CADASTRO — SUPABASE AUTH
       ====================================================================== */

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                limparMensagem(
                    registerMessage
                );


                const nome =
                    registerName?.value
                        .trim() || "";


                const email =
                    registerEmail?.value
                        .trim()
                        .toLowerCase() || "";


                const senha =
                    registerPassword?.value || "";


                const confirmacao =
                    registerPasswordConfirm?.value || "";


                /* ==========================================================
                   VALIDAR NOME
                ========================================================== */

                if (!nome) {

                    mostrarMensagem(
                        registerMessage,
                        "Digite seu nome completo.",
                        "error"
                    );

                    registerName?.focus();

                    return;
                }


                if (nome.length < 3) {

                    mostrarMensagem(
                        registerMessage,
                        "Digite seu nome completo corretamente.",
                        "error"
                    );

                    registerName?.focus();

                    return;
                }


                /* ==========================================================
                   VALIDAR E-MAIL
                ========================================================== */

                if (!email) {

                    mostrarMensagem(
                        registerMessage,
                        "Digite seu e-mail institucional.",
                        "error"
                    );

                    registerEmail?.focus();

                    return;
                }


                if (!EMAIL_REGEX.test(email)) {

                    mostrarMensagem(
                        registerMessage,
                        "Digite um e-mail válido.",
                        "error"
                    );

                    registerEmail?.focus();

                    return;
                }


                /* ==========================================================
                   VALIDAR E-MAIL SENAC
                ========================================================== */

                if (
                    !EMAIL_SENAC_REGEX.test(
                        email
                    )
                ) {

                    mostrarMensagem(
                        registerMessage,
                        "Use um e-mail institucional @pe.senac.br ou @edu.pe.senac.br.",
                        "error"
                    );

                    registerEmail?.focus();

                    return;
                }


                /* ==========================================================
                   VALIDAR SENHA
                ========================================================== */

                if (!senha) {

                    mostrarMensagem(
                        registerMessage,
                        "Crie uma senha.",
                        "error"
                    );

                    registerPassword?.focus();

                    return;
                }


                if (!senhaEstaForte(senha)) {

                    mostrarMensagem(
                        registerMessage,
                        "A senha deve ter pelo menos 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial.",
                        "error"
                    );

                    registerPassword?.focus();

                    return;
                }


                /* ==========================================================
                   CONFIRMAR SENHA
                ========================================================== */

                if (!confirmacao) {

                    mostrarMensagem(
                        registerMessage,
                        "Confirme sua senha.",
                        "error"
                    );

                    registerPasswordConfirm?.focus();

                    return;
                }


                if (
                    senha !== confirmacao
                ) {

                    mostrarMensagem(
                        registerMessage,
                        "As senhas não coincidem.",
                        "error"
                    );

                    registerPasswordConfirm?.focus();

                    return;
                }


                /* ==========================================================
                   DESABILITAR BOTÃO
                ========================================================== */

                const submitButton =
                    registerForm.querySelector(
                        ".submit-button"
                    );

                const submitText =
                    submitButton?.querySelector(
                        "span"
                    );


                if (submitButton) {
                    submitButton.disabled = true;
                }

                if (submitText) {
                    submitText.textContent =
                        "Criando conta...";
                }


                /* ==========================================================
                   CRIAR USUÁRIO NO SUPABASE
                ========================================================== */

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth.signUp({

                        email: email,

                        password: senha,

                        options: {

                            data: {

                                nome: nome,

                                name: nome,

                                full_name: nome

                            },

                            emailRedirectTo:
                                window.location.origin +
                                "/index.html"

                        }

                    });


                /* ==========================================================
                   ERRO
                ========================================================== */

                if (error) {

                    console.error(
                        "Erro no cadastro:",
                        error
                    );


                    let mensagem =
                        "Não foi possível criar sua conta.";


                    if (
                        error.message
                            ?.toLowerCase()
                            .includes(
                                "already registered"
                            )
                    ) {

                        mensagem =
                            "Este e-mail já está cadastrado.";

                    } else if (
                        error.message
                            ?.toLowerCase()
                            .includes(
                                "password"
                            )
                    ) {

                        mensagem =
                            "A senha informada não atende aos requisitos.";

                    } else if (
                        error.message
                            ?.toLowerCase()
                            .includes(
                                "email"
                            )
                    ) {

                        mensagem =
                            "Verifique o e-mail informado.";

                    }


                    mostrarMensagem(
                        registerMessage,
                        mensagem,
                        "error"
                    );


                    if (submitButton) {
                        submitButton.disabled =
                            false;
                    }

                    if (submitText) {
                        submitText.textContent =
                            "Criar minha conta";
                    }

                    return;
                }


                /* ==========================================================
                   CADASTRO COM CONFIRMAÇÃO DE E-MAIL
                ========================================================== */

                if (
                    data.user &&
                    !data.session
                ) {

                    mostrarMensagem(
                        registerMessage,
                        "Cadastro realizado! Verifique seu e-mail institucional para confirmar a conta.",
                        "success"
                    );

                    registerForm.reset();

                    atualizarForcaSenha("");

                    atualizarRequisitosSenha("");

                    if (submitButton) {
                        submitButton.disabled =
                            false;
                    }

                    if (submitText) {
                        submitText.textContent =
                            "Criar minha conta";
                    }

                    return;
                }


                /* ==========================================================
                   CADASTRO COM LOGIN AUTOMÁTICO
                ========================================================== */

                mostrarMensagem(
                    registerMessage,
                    `Cadastro realizado com sucesso! Bem-vindo, ${nome}.`,
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "./home.html";

                    },
                    800
                );

            }
        );
    }


    /* ======================================================================
       LOGIN — SUPABASE AUTH
       ====================================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                limparMensagem(
                    loginMessage
                );


                const email =
                    loginEmail?.value
                        .trim()
                        .toLowerCase() || "";


                const senha =
                    loginPassword?.value || "";


                /* ==========================================================
                   CAMPOS VAZIOS
                ========================================================== */

                if (!email || !senha) {

                    mostrarMensagem(
                        loginMessage,
                        "Preencha seu e-mail e sua senha.",
                        "error"
                    );

                    return;
                }


                /* ==========================================================
                   VALIDAR E-MAIL
                ========================================================== */

                if (!EMAIL_REGEX.test(email)) {

                    mostrarMensagem(
                        loginMessage,
                        "Digite um e-mail válido.",
                        "error"
                    );

                    return;
                }


                /* ==========================================================
                   BOTÃO
                ========================================================== */

                const submitButton =
                    loginForm.querySelector(
                        ".submit-button"
                    );

                const submitText =
                    submitButton?.querySelector(
                        "span"
                    );


                if (submitButton) {
                    submitButton.disabled = true;
                }

                if (submitText) {
                    submitText.textContent =
                        "Entrando...";
                }


                /* ==========================================================
                   LOGIN SUPABASE
                ========================================================== */

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({

                            email: email,

                            password: senha

                        });


                /* ==========================================================
                   ERRO
                ========================================================== */

                if (error) {

                    console.error(
                        "Erro no login:",
                        error
                    );


                    let mensagem =
                        "E-mail ou senha incorretos.";


                    if (
                        error.message
                            ?.toLowerCase()
                            .includes(
                                "email not confirmed"
                            )
                    ) {

                        mensagem =
                            "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.";

                    }


                    mostrarMensagem(
                        loginMessage,
                        mensagem,
                        "error"
                    );


                    if (submitButton) {
                        submitButton.disabled =
                            false;
                    }

                    if (submitText) {
                        submitText.textContent =
                            "Entrar";
                    }

                    return;
                }


                /* ==========================================================
                   LOGIN REALIZADO
                ========================================================== */

                if (data?.session) {

                    mostrarMensagem(
                        loginMessage,
                        "Login realizado com sucesso!",
                        "success"
                    );


                    /*
                     * Pequeno atraso para
                     * mostrar a mensagem.
                     */

                    setTimeout(
                        () => {

                            window.location.href =
                                "./home.html";

                        },
                        500
                    );

                }

            }
        );
    }


    /* ======================================================================
       TROCAR PARA CADASTRO
       ====================================================================== */

    function abrirCadastro() {

        if (loginForm) {

            loginForm.classList.remove(
                "active"
            );
        }


        if (registerForm) {

            registerForm.classList.add(
                "active"
            );
        }


        if (loginTab) {

            loginTab.classList.remove(
                "active"
            );
        }


        if (registerTab) {

            registerTab.classList.add(
                "active"
            );
        }


        if (formTitle) {

            formTitle.textContent =
                "Crie sua conta";
        }


        if (formSubtitle) {

            formSubtitle.textContent =
                "Cadastre-se para começar sua jornada profissional com o SENAC.";
        }


        limparMensagem(
            loginMessage
        );

        limparMensagem(
            registerMessage
        );
    }


    /* ======================================================================
       TROCAR PARA LOGIN
       ====================================================================== */

    function abrirLogin() {

        if (registerForm) {

            registerForm.classList.remove(
                "active"
            );
        }


        if (loginForm) {

            loginForm.classList.add(
                "active"
            );
        }


        if (registerTab) {

            registerTab.classList.remove(
                "active"
            );
        }


        if (loginTab) {

            loginTab.classList.add(
                "active"
            );
        }


        if (formTitle) {

            formTitle.textContent =
                "Bem-vindo de volta!";
        }


        if (formSubtitle) {

            formSubtitle.textContent =
                "Entre com seu e-mail institucional para continuar.";
        }


        limparMensagem(
            loginMessage
        );

        limparMensagem(
            registerMessage
        );
    }


    /* ======================================================================
       EVENTOS DAS ABAS
       ====================================================================== */

    if (registerTab) {

        registerTab.addEventListener(
            "click",
            abrirCadastro
        );
    }


    if (loginTab) {

        loginTab.addEventListener(
            "click",
            abrirLogin
        );
    }


    if (goRegister) {

        goRegister.addEventListener(
            "click",
            abrirCadastro
        );
    }


    if (goLogin) {

        goLogin.addEventListener(
            "click",
            abrirLogin
        );
    }


    /* ======================================================================
       ESQUECI MINHA SENHA
       ====================================================================== */

    const forgotPassword =
        document.getElementById(
            "forgotPassword"
        );


    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            async event => {

                event.preventDefault();


                const email =
                    loginEmail?.value
                        .trim()
                        .toLowerCase() || "";


                if (!email) {

                    mostrarMensagem(
                        loginMessage,
                        "Digite seu e-mail para recuperar a senha.",
                        "warning"
                    );

                    loginEmail?.focus();

                    return;
                }


                if (!EMAIL_REGEX.test(email)) {

                    mostrarMensagem(
                        loginMessage,
                        "Digite um e-mail válido.",
                        "warning"
                    );

                    return;
                }


                const {
                    error
                } =
                    await supabaseClient.auth
                        .resetPasswordForEmail(
                            email,
                            {
                                redirectTo:
                                    window.location.origin +
                                    "/index.html"
                            }
                        );


                if (error) {

                    console.error(
                        "Erro ao recuperar senha:",
                        error
                    );

                    mostrarMensagem(
                        loginMessage,
                        "Não foi possível enviar o e-mail de recuperação.",
                        "error"
                    );

                    return;
                }


                mostrarMensagem(
                    loginMessage,
                    "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.",
                    "success"
                );

            }
        );
    }


    /* ======================================================================
       SE JÁ ESTIVER LOGADO
       ====================================================================== */

    const {
        data
    } =
        await supabaseClient.auth.getSession();


    if (data?.session) {

        /*
         * Se o usuário já está autenticado
         * e abriu login.html, mandamos
         * diretamente para a home.
         */

        window.location.href =
            "./home.html";
    }


    /* ======================================================================
       ESC — LIMPAR MENSAGENS
       ====================================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }

            limparMensagem(
                loginMessage
            );

            limparMensagem(
                registerMessage
            );
        }
    );


    /* ======================================================================
       INICIALIZAÇÃO
       ====================================================================== */

    if (registerPassword) {

        atualizarForcaSenha(
            registerPassword.value
        );

        atualizarRequisitosSenha(
            registerPassword.value
        );
    }

});