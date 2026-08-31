// ============================================================
// PERFIL.JS — STARTÊ SENAC
// Funcionalidades:
// - Menu do perfil
// - Busca
// - Carregamento do usuário
// - Edição do perfil
// - Salvamento no localStorage
// - Meus eventos
// - Logout
// - Voltar ao topo
// ============================================================

document.addEventListener('DOMContentLoaded', () => {


    // ==========================================================
    // DADOS DO USUÁRIO
    // ==========================================================

    const usuarioPadrao = {
        nome: 'Usuário',
        email: 'usuario@email.com',
        tipo: 'Usuário'
    };


    // Recupera usuário salvo
    let usuarioSalvo = localStorage.getItem('usuarioStare');

    let usuario;


    try {

        usuario = usuarioSalvo
            ? JSON.parse(usuarioSalvo)
            : usuarioPadrao;

    } catch (error) {

        usuario = usuarioPadrao;

    }


    // Se ainda não existir usuário,
    // cria um registro inicial.
    if (!usuarioSalvo) {

        localStorage.setItem(
            'usuarioStare',
            JSON.stringify(usuario)
        );

    }


    // ==========================================================
    // ELEMENTOS DO PERFIL
    // ==========================================================

    const perfilNome =
        document.getElementById('perfilNome');

    const nomeUsuario =
        document.getElementById('nomeUsuario');

    const emailUsuario =
        document.getElementById('emailUsuario');

    const tipoUsuario =
        document.getElementById('tipoUsuario');

    const userProfileName =
        document.getElementById('userProfileName');


    // ==========================================================
    // ATUALIZA PERFIL NA TELA
    // ==========================================================

    function atualizarPerfil() {

        if (perfilNome) {

            perfilNome.textContent =
                usuario.nome;
        }


        if (nomeUsuario) {

            nomeUsuario.textContent =
                usuario.nome;
        }


        if (emailUsuario) {

            emailUsuario.textContent =
                usuario.email;
        }


        if (tipoUsuario) {

            tipoUsuario.textContent =
                usuario.tipo;
        }


        if (userProfileName) {

            userProfileName.textContent =
                usuario.nome;
        }

    }


    atualizarPerfil();


    // ==========================================================
    // MENU DO PERFIL
    // ==========================================================

    const userProfile =
        document.getElementById('userProfile');

    const userProfileButton =
        document.getElementById('userProfileButton');

    const profileButton =
        document.getElementById('profileButton');


    if (
        userProfile &&
        userProfileButton
    ) {

        userProfileButton.addEventListener(
            'click',
            (event) => {

                event.stopPropagation();

                const aberto =
                    userProfile.classList.toggle('open');

                userProfileButton.setAttribute(
                    'aria-expanded',
                    aberto
                );

            }
        );


        document.addEventListener(
            'click',
            (event) => {

                if (
                    !event.target.closest('.user-profile')
                ) {

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
    // BUSCA DO HEADER
    // ==========================================================

    const searchBtn =
        document.getElementById('searchBtn');

    const searchInput =
        document.getElementById('searchInput');


    if (
        searchBtn &&
        searchInput
    ) {

        searchBtn.addEventListener(
            'click',
            (event) => {

                event.stopPropagation();

                const ativa =
                    searchInput.classList.toggle('active');

                searchBtn.setAttribute(
                    'aria-expanded',
                    ativa
                );


                if (ativa) {

                    searchInput.focus();

                }

            }
        );


        document.addEventListener(
            'click',
            (event) => {

                if (
                    !event.target.closest('.search-container')
                ) {

                    searchInput.classList.remove('active');

                    searchBtn.setAttribute(
                        'aria-expanded',
                        'false'
                    );

                }

            }
        );


        searchInput.addEventListener(
            'keypress',
            (event) => {

                if (event.key === 'Enter') {

                    const termo =
                        searchInput.value.trim();


                    if (termo) {

                        window.location.href =
                            `cursos.html?search=${encodeURIComponent(termo)}`;

                    }

                }

            }
        );

    }


    // ==========================================================
    // MODAL
    // ==========================================================

    const modalPerfil =
        document.getElementById('modalPerfil');

    const editarPerfil =
        document.getElementById('editarPerfil');

    const editarDados =
        document.getElementById('editarDados');

    const fecharModal =
        document.getElementById('fecharModal');

    const cancelarEdicao =
        document.getElementById('cancelarEdicao');

    const formPerfil =
        document.getElementById('formPerfil');

    const editarNome =
        document.getElementById('editarNome');

    const editarEmail =
        document.getElementById('editarEmail');


    // ==========================================================
    // ABRIR MODAL
    // ==========================================================

    function abrirModal() {

        if (!modalPerfil) {
            return;
        }


        editarNome.value =
            usuario.nome;

        editarEmail.value =
            usuario.email;


        modalPerfil.classList.add('active');

        modalPerfil.setAttribute(
            'aria-hidden',
            'false'
        );


        setTimeout(() => {

            if (editarNome) {

                editarNome.focus();

            }

        }, 100);

    }


    // ==========================================================
    // FECHAR MODAL
    // ==========================================================

    function fecharModalPerfil() {

        if (!modalPerfil) {
            return;
        }


        modalPerfil.classList.remove('active');

        modalPerfil.setAttribute(
            'aria-hidden',
            'true'
        );

    }


    if (editarPerfil) {

        editarPerfil.addEventListener(
            'click',
            abrirModal
        );

    }


    if (editarDados) {

        editarDados.addEventListener(
            'click',
            abrirModal
        );

    }


    if (fecharModal) {

        fecharModal.addEventListener(
            'click',
            fecharModalPerfil
        );

    }


    if (cancelarEdicao) {

        cancelarEdicao.addEventListener(
            'click',
            fecharModalPerfil
        );

    }


    // ==========================================================
    // CLICAR FORA DO MODAL
    // ==========================================================

    if (modalPerfil) {

        modalPerfil.addEventListener(
            'click',
            (event) => {

                if (
                    event.target === modalPerfil
                ) {

                    fecharModalPerfil();

                }

            }
        );

    }


    // ==========================================================
    // ESC FECHA MODAL
    // ==========================================================

    document.addEventListener(
        'keydown',
        (event) => {

            if (
                event.key === 'Escape' &&
                modalPerfil &&
                modalPerfil.classList.contains('active')
            ) {

                fecharModalPerfil();

            }

        }
    );


    // ==========================================================
    // SALVAR PERFIL
    // ==========================================================

    if (formPerfil) {

        formPerfil.addEventListener(
            'submit',
            (event) => {

                event.preventDefault();


                const novoNome =
                    editarNome.value.trim();

                const novoEmail =
                    editarEmail.value.trim();


                if (!novoNome) {

                    alert(
                        'Digite seu nome completo.'
                    );

                    editarNome.focus();

                    return;

                }


                if (!novoEmail) {

                    alert(
                        'Digite seu e-mail.'
                    );

                    editarEmail.focus();

                    return;

                }


                // Atualiza os dados
                usuario.nome =
                    novoNome;

                usuario.email =
                    novoEmail;


                // Salva no navegador
                localStorage.setItem(
                    'usuarioStare',
                    JSON.stringify(usuario)
                );


                // Atualiza a interface
                atualizarPerfil();


                // Fecha modal
                fecharModalPerfil();


                // Feedback
                mostrarMensagem(
                    'Perfil atualizado com sucesso!'
                );

            }
        );

    }


    // ==========================================================
    // MEUS EVENTOS
    // ==========================================================

    const meusEventos =
        document.getElementById('meusEventos');


    if (meusEventos) {

        meusEventos.addEventListener(
            'click',
            () => {

                window.location.href =
                    'eventos.html';

            }
        );

    }


    // ==========================================================
    // LOGOUT
    // ==========================================================

    const logoutButton =
        document.getElementById('logoutButton');


    if (logoutButton) {

        logoutButton.addEventListener(
            'click',
            () => {

                const confirmar =
                    confirm(
                        'Deseja realmente sair da sua conta?'
                    );


                if (!confirmar) {
                    return;
                }


                // Remove apenas os dados
                // do usuário.
                localStorage.removeItem(
                    'usuarioStare'
                );


                window.location.href =
                    'home.html';

            }
        );

    }


    // ==========================================================
    // BUSCA DO FOOTER
    // ==========================================================

    const footerSearchBtn =
        document.getElementById('footerSearchBtn');

    const footerSearch =
        document.getElementById('footerSearch');


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
            'click',
            realizarBusca
        );


        footerSearch.addEventListener(
            'keypress',
            (event) => {

                if (event.key === 'Enter') {

                    realizarBusca();

                }

            }
        );

    }


    // ==========================================================
    // VOLTAR AO TOPO
    // ==========================================================

    const backToTop =
        document.getElementById('backToTop');


    if (backToTop) {

        window.addEventListener(
            'scroll',
            () => {

                if (
                    window.scrollY > 300
                ) {

                    backToTop.classList.add('show');

                } else {

                    backToTop.classList.remove('show');

                }

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

    }


    // ==========================================================
    // MENSAGEM DE SUCESSO
    // ==========================================================

    function mostrarMensagem(texto) {

        const mensagemExistente =
            document.querySelector('.mensagem-sucesso');


        if (mensagemExistente) {

            mensagemExistente.remove();

        }


        const mensagem =
            document.createElement('div');

        mensagem.className =
            'mensagem-sucesso';


        mensagem.innerHTML = `
      <i class="fas fa-circle-check"></i>
      <span>${texto}</span>
    `;


        document.body.appendChild(
            mensagem
        );


        setTimeout(() => {

            mensagem.classList.add('show');

        }, 20);


        setTimeout(() => {

            mensagem.classList.remove('show');

            setTimeout(() => {

                mensagem.remove();

            }, 300);

        }, 3000);

    }

});