/* ==========================================================================
   LOGIN.JS — STARTÊ / SENAC
   Funcionalidades:
   1. Cadastro de usuário
   2. Login
   3. Validação de senha reforçada
   4. Confirmação de senha
   5. Indicador de força da senha
   6. Mostrar/ocultar senha
   7. Persistência do usuário
   8. Redirecionamento após login
   9. Compatibilidade com login.html atual
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================================
       ELEMENTOS — LOGIN
       ====================================================================== */

    const loginForm = document.getElementById("loginForm");
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const loginMessage = document.getElementById("loginMessage");

    /* ======================================================================
       ELEMENTOS — CADASTRO
       ====================================================================== */

    const registerForm = document.getElementById("registerForm");
    const registerName = document.getElementById("registerName");
    const registerEmail = document.getElementById("registerEmail");
    const registerPassword = document.getElementById("registerPassword");
    const registerPasswordConfirm = document.getElementById(
        "registerPasswordConfirm"
    );

    const registerMessage = document.getElementById("registerMessage");

    /* ======================================================================
       ELEMENTOS — ABAS
       ====================================================================== */

    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");

    const goRegister = document.getElementById("goRegister");
    const goLogin = document.getElementById("goLogin");

    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");

    /* ======================================================================
       CONFIGURAÇÕES
       ====================================================================== */

    const MINIMO_SENHA = 8;

    const SENHA_REGEX = {
        tamanho: /.{8,}/,
        maiuscula: /[A-Z]/,
        minuscula: /[a-z]/,
        numero: /[0-9]/,
        especial: /[^A-Za-z0-9]/
    };

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const EMAIL_SENAC_REGEX =
        /^[^\s@]+@(pe\.senac\.br|edu\.pe\.senac\.br)$/i;


    /* ======================================================================
       FUNÇÃO — MOSTRAR MENSAGEM
       ====================================================================== */

    function mostrarMensagem(elemento, mensagem, tipo = "error") {

        if (!elemento) {
            return;
        }

        elemento.textContent = mensagem;

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

        elemento.style.display = "block";
    }


    /* ======================================================================
       FUNÇÃO — LIMPAR MENSAGEM
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

        elemento.style.display = "none";
    }


    /* ======================================================================
       VALIDAÇÃO DA SENHA
       ====================================================================== */

    function validarSenha(senha) {

        return {
            tamanho: SENHA_REGEX.tamanho.test(senha),
            maiuscula: SENHA_REGEX.maiuscula.test(senha),
            minuscula: SENHA_REGEX.minuscula.test(senha),
            numero: SENHA_REGEX.numero.test(senha),
            especial: SENHA_REGEX.especial.test(senha)
        };
    }


    /* ======================================================================
       SENHA FORTE
       ====================================================================== */

    function senhaEstaForte(senha) {

        const requisitos = validarSenha(senha);

        return (
            requisitos.tamanho &&
            requisitos.maiuscula &&
            requisitos.minuscula &&
            requisitos.numero &&
            requisitos.especial
        );
    }


    /* ======================================================================
       INDICADOR DE FORÇA DA SENHA
       ====================================================================== */

    function atualizarForcaSenha(senha) {

        const passwordStrength =
            document.getElementById("passwordStrength");

        if (!passwordStrength) {
            return;
        }

        const requisitos = validarSenha(senha);

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

            passwordStrength.classList.add("weak");

            passwordStrength.textContent =
                "Senha fraca";

        } else if (pontos <= 4) {

            passwordStrength.classList.add("medium");

            passwordStrength.textContent =
                "Senha média";

        } else {

            passwordStrength.classList.add("strong");

            passwordStrength.textContent =
                "Senha forte";

        }
    }


    /* ======================================================================
       ATUALIZAR REQUISITOS VISUAIS
       ====================================================================== */

    function atualizarRequisitosSenha(senha) {

        const requisitos = validarSenha(senha);


        function atualizarElemento(id, valido) {

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


        /* Compatibilidade com IDs antigos */

        atualizarElemento(
            "requisitoTamanho",
            requisitos.tamanho
        );

        atualizarElemento(
            "requisitoMaiuscula",
            requisitos.maiuscula
        );

        atualizarElemento(
            "requisitoMinuscula",
            requisitos.minuscula
        );

        atualizarElemento(
            "requisitoNumero",
            requisitos.numero
        );

        atualizarElemento(
            "requisitoEspecial",
            requisitos.especial
        );
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


    if (registerPasswordConfirm) {

        registerPasswordConfirm.addEventListener(
            "input",
            validarConfirmacaoSenha
        );
    }


    /* ======================================================================
       MOSTRAR / OCULTAR SENHA
       ====================================================================== */

    function configurarToggleSenha(botao, campo) {

        if (!botao || !campo) {
            return;
        }


        botao.addEventListener(
            "click",
            () => {

                const mostrando =
                    campo.type === "text";


                if (mostrando) {

                    campo.type = "password";

                    botao.setAttribute(
                        "aria-label",
                        "Mostrar senha"
                    );

                } else {

                    campo.type = "text";

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
       CONFIGURAR TODOS OS BOTÕES DE SENHA
       ====================================================================== */

    document
        .querySelectorAll(".password-toggle")
        .forEach(botao => {

            const target =
                botao.getAttribute("data-target");

            const campo =
                document.getElementById(target);

            configurarToggleSenha(
                botao,
                campo
            );
        });


    /* ======================================================================
       BANCO LOCAL DE USUÁRIOS
       ====================================================================== */

    function obterUsuarios() {

        try {

            const dados =
                localStorage.getItem(
                    "usuariosStarte"
                );

            if (!dados) {
                return [];
            }

            const usuarios =
                JSON.parse(dados);

            return Array.isArray(usuarios)
                ? usuarios
                : [];

        } catch (erro) {

            console.error(
                "Erro ao carregar usuários:",
                erro
            );

            return [];
        }
    }


    function salvarUsuarios(usuarios) {

        localStorage.setItem(
            "usuariosStarte",
            JSON.stringify(usuarios)
        );
    }


    /* ======================================================================
       SALVAR USUÁRIO LOGADO
       ====================================================================== */

    function salvarUsuarioLogado(usuario) {

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            })
        );
    }


    /* ======================================================================
       CADASTRO
       ====================================================================== */

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            event => {

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


                /* ----------------------------------------------------------
                   NOME
                   ---------------------------------------------------------- */

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


                /* ----------------------------------------------------------
                   E-MAIL
                   ---------------------------------------------------------- */

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


                /* ----------------------------------------------------------
                   E-MAIL SENAC
                   ---------------------------------------------------------- */

                if (!EMAIL_SENAC_REGEX.test(email)) {

                    mostrarMensagem(
                        registerMessage,
                        "Use um e-mail institucional @pe.senac.br ou @edu.pe.senac.br.",
                        "error"
                    );

                    registerEmail?.focus();

                    return;
                }


                /* ----------------------------------------------------------
                   SENHA
                   ---------------------------------------------------------- */

                if (!senha) {

                    mostrarMensagem(
                        registerMessage,
                        "Crie uma senha.",
                        "error"
                    );

                    registerPassword?.focus();

                    return;
                }


                /* ----------------------------------------------------------
                   SENHA FORTE
                   ---------------------------------------------------------- */

                if (!senhaEstaForte(senha)) {

                    mostrarMensagem(
                        registerMessage,
                        "A senha deve ter pelo menos 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial.",
                        "error"
                    );

                    registerPassword?.focus();

                    return;
                }


                /* ----------------------------------------------------------
                   CONFIRMAÇÃO
                   ---------------------------------------------------------- */

                if (!confirmacao) {

                    mostrarMensagem(
                        registerMessage,
                        "Confirme sua senha.",
                        "error"
                    );

                    registerPasswordConfirm?.focus();

                    return;
                }


                if (senha !== confirmacao) {

                    mostrarMensagem(
                        registerMessage,
                        "As senhas não coincidem.",
                        "error"
                    );

                    registerPasswordConfirm?.focus();

                    return;
                }


                /* ----------------------------------------------------------
                   USUÁRIOS EXISTENTES
                   ---------------------------------------------------------- */

                const usuarios =
                    obterUsuarios();


                const usuarioExistente =
                    usuarios.find(
                        usuario =>
                            usuario.email
                                ?.toLowerCase() === email
                    );


                if (usuarioExistente) {

                    mostrarMensagem(
                        registerMessage,
                        "Este e-mail já está cadastrado.",
                        "error"
                    );

                    registerEmail?.focus();

                    return;
                }


                /* ----------------------------------------------------------
                   CRIAR USUÁRIO
                   ---------------------------------------------------------- */

                const novoUsuario = {

                    id:
                        Date.now(),

                    nome:
                        nome,

                    email:
                        email,

                    senha:
                        senha,

                    criadoEm:
                        new Date()
                            .toISOString()
                };


                usuarios.push(
                    novoUsuario
                );


                salvarUsuarios(
                    usuarios
                );


                /* ----------------------------------------------------------
                   SALVAR SESSÃO
                   ---------------------------------------------------------- */

                salvarUsuarioLogado(
                    novoUsuario
                );


                /* ----------------------------------------------------------
                   MENSAGEM
                   ---------------------------------------------------------- */

                mostrarMensagem(
                    registerMessage,
                    `Cadastro realizado com sucesso! Bem-vindo, ${nome}.`,
                    "success"
                );


                /* ----------------------------------------------------------
                   LIMPAR CAMPOS
                   ---------------------------------------------------------- */

                registerForm.reset();

                atualizarForcaSenha("");

                atualizarRequisitosSenha("");


                /* ----------------------------------------------------------
                   REDIRECIONAR
                   ---------------------------------------------------------- */

                setTimeout(
                    () => {

                        window.location.href =
                            "home.html";

                    },
                    1000
                );
            }
        );
    }


    /* ======================================================================
       LOGIN
       ====================================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            event => {

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


                /* ----------------------------------------------------------
                   CAMPOS VAZIOS
                   ---------------------------------------------------------- */

                if (!email || !senha) {

                    mostrarMensagem(
                        loginMessage,
                        "Preencha seu e-mail e sua senha.",
                        "error"
                    );

                    return;
                }


                /* ----------------------------------------------------------
                   BUSCAR USUÁRIO
                   ---------------------------------------------------------- */

                const usuarios =
                    obterUsuarios();


                const usuario =
                    usuarios.find(
                        item =>
                            item.email
                                ?.toLowerCase() === email &&
                            item.senha === senha
                    );


                /* ----------------------------------------------------------
                   USUÁRIO NÃO ENCONTRADO
                   ---------------------------------------------------------- */

                if (!usuario) {

                    mostrarMensagem(
                        loginMessage,
                        "E-mail ou senha incorretos.",
                        "error"
                    );

                    return;
                }


                /* ----------------------------------------------------------
                   SALVAR SESSÃO
                   ---------------------------------------------------------- */

                salvarUsuarioLogado(
                    usuario
                );


                /* ----------------------------------------------------------
                   MENSAGEM DE SUCESSO
                   ---------------------------------------------------------- */

                mostrarMensagem(
                    loginMessage,
                    `Bem-vindo, ${usuario.nome}!`,
                    "success"
                );


                /* ----------------------------------------------------------
                   REDIRECIONAMENTO
                   ---------------------------------------------------------- */

                setTimeout(
                    () => {

                        window.location.href =
                            "home.html";

                    },
                    800
                );
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
            event => {

                event.preventDefault();


                mostrarMensagem(
                    loginMessage,
                    "A recuperação de senha será disponibilizada em uma próxima etapa.",
                    "warning"
                );
            }
        );
    }


    /* ======================================================================
       CARREGAR USUÁRIO LOGADO
       ====================================================================== */

    function carregarUsuarioLogado() {

        try {

            const dados =
                localStorage.getItem(
                    "usuarioLogado"
                );


            if (!dados) {
                return;
            }


            const usuario =
                JSON.parse(dados);


            if (!usuario) {
                return;
            }


            const elementosNome =
                document.querySelectorAll(
                    "#userProfileName, .user-profile-name, [data-user-name]"
                );


            elementosNome.forEach(
                elemento => {

                    elemento.textContent =
                        usuario.nome || "Usuário";
                }
            );


            const elementosEmail =
                document.querySelectorAll(
                    "[data-user-email]"
                );


            elementosEmail.forEach(
                elemento => {

                    elemento.textContent =
                        usuario.email || "";
                }
            );


        } catch (erro) {

            console.error(
                "Erro ao carregar usuário logado:",
                erro
            );
        }
    }


    carregarUsuarioLogado();


    /* ======================================================================
       LOGOUT
       ====================================================================== */

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                localStorage.removeItem(
                    "usuarioLogado"
                );


                window.location.href =
                    "index.html";
            }
        );
    }


    /* ======================================================================
       INICIALIZAÇÃO DA SENHA
       ====================================================================== */

    if (registerPassword) {

        atualizarForcaSenha(
            registerPassword.value
        );

        atualizarRequisitosSenha(
            registerPassword.value
        );
    }


    /* ======================================================================
       ENTER / ESC
       ====================================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
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

});