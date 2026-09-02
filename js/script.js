/* ==========================================================================
   SCRIPT.JS — STARTÊ / SENAC

   Responsabilidades:
   1. Menu mobile
   2. Busca do header 
   3. Busca do footer
   4. Botão voltar ao topo
   5. Animações
   6. Cards interativos
   7. Acessibilidade
   8. Menu visual do perfil

   IMPORTANTE:
   A autenticação e o nome do usuário são controlados pelo auth.js.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================================
       ELEMENTOS GERAIS
       ====================================================================== */

    const body = document.body;

    const menuToggle =
        document.getElementById("menuToggle");

    const mainNav =
        document.getElementById("mainNav");

    const searchBtn =
        document.getElementById("searchBtn");

    const searchInput =
        document.getElementById("searchInput");

    const footerSearchForm =
        document.getElementById("footerSearchForm");

    const footerSearch =
        document.getElementById("footerSearch");

    const backToTop =
        document.getElementById("backToTop");

    const navLinks =
        document.querySelectorAll(".nav-link");

    const categoryLinks =
        document.querySelectorAll(".card-link");


    /* ======================================================================
       ELEMENTOS DO PERFIL

       O auth.js é responsável pelo usuário.
       Aqui cuidamos somente do comportamento visual do menu.
       ====================================================================== */

    const userProfile =
        document.getElementById("userProfile");

    const userProfileButton =
        document.getElementById("userProfileButton");

    const userProfileMenu =
        document.getElementById("userProfileMenu");


    /* ======================================================================
       MENU DO PERFIL
       ====================================================================== */

    function abrirPerfil() {

        if (
            !userProfile ||
            !userProfileButton ||
            !userProfileMenu
        ) {
            return;
        }

        userProfileMenu.classList.add("show");

        userProfileButton.classList.add("active");

        userProfileButton.setAttribute(
            "aria-expanded",
            "true"
        );
    }


    function fecharPerfil() {

        if (
            !userProfile ||
            !userProfileButton ||
            !userProfileMenu
        ) {
            return;
        }

        userProfileMenu.classList.remove("show");

        userProfileButton.classList.remove("active");

        userProfileButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }


    function alternarPerfil() {

        if (!userProfileMenu) {
            return;
        }

        const aberto =
            userProfileMenu.classList.contains("show");

        if (aberto) {

            fecharPerfil();

        } else {

            abrirPerfil();

        }
    }


    if (userProfileButton) {

        userProfileButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                event.stopPropagation();

                alternarPerfil();

            }
        );
    }


    /*
     * Impede que o clique dentro do menu
     * feche o próprio menu.
     */

    if (userProfileMenu) {

        userProfileMenu.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

            }
        );
    }


    /*
     * Fecha o perfil ao clicar fora.
     */

    document.addEventListener(
        "click",
        (event) => {

            if (
                userProfile &&
                !userProfile.contains(event.target)
            ) {

                fecharPerfil();

            }
        }
    );


    /*
     * Fecha o perfil com ESC.
     */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                fecharPerfil();

            }
        }
    );


    /* ======================================================================
       MENU MOBILE
       ====================================================================== */

    function openMenu() {

        if (!mainNav || !menuToggle) {
            return;
        }

        mainNav.classList.add("open");

        body.classList.add("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Fechar menu"
        );

        const icon =
            menuToggle.querySelector("i");

        if (icon) {

            icon.classList.remove(
                "fa-bars"
            );

            icon.classList.add(
                "fa-xmark"
            );
        }
    }


    function closeMenu() {

        if (!mainNav || !menuToggle) {
            return;
        }

        mainNav.classList.remove("open");

        body.classList.remove("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Abrir menu"
        );

        const icon =
            menuToggle.querySelector("i");

        if (icon) {

            icon.classList.remove(
                "fa-xmark"
            );

            icon.classList.add(
                "fa-bars"
            );
        }
    }


    if (
        menuToggle &&
        mainNav
    ) {

        menuToggle.addEventListener(
            "click",
            () => {

                const aberto =
                    mainNav.classList.contains("open");

                if (aberto) {

                    closeMenu();

                } else {

                    openMenu();

                }
            }
        );


        navLinks.forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        closeMenu();

                    }
                );
            }
        );


        mainNav.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === mainNav
                ) {

                    closeMenu();

                }
            }
        );
    }


    /* ======================================================================
       BUSCA DO HEADER
       ====================================================================== */

    function openSearch() {

        if (
            !searchInput ||
            !searchBtn
        ) {
            return;
        }

        searchInput.classList.add(
            "active"
        );

        searchBtn.setAttribute(
            "aria-expanded",
            "true"
        );

        setTimeout(
            () => {

                searchInput.focus();

            },
            100
        );
    }


    function closeSearch() {

        if (
            !searchInput ||
            !searchBtn
        ) {
            return;
        }

        searchInput.classList.remove(
            "active"
        );

        searchBtn.setAttribute(
            "aria-expanded",
            "false"
        );
    }


    function executeHeaderSearch() {

        if (!searchInput) {
            return;
        }

        const searchTerm =
            searchInput.value.trim();

        if (!searchTerm) {

            searchInput.focus();

            return;
        }


        const normalizedTerm =
            searchTerm.toLowerCase();


        const pageContent =
            document.body.innerText.toLowerCase();


        if (
            pageContent.includes(
                normalizedTerm
            )
        ) {

            const elements =
                document.querySelectorAll(
                    "h1, h2, h3, h4, p, a"
                );


            let foundElement = null;


            elements.forEach(
                (element) => {

                    if (
                        !foundElement &&
                        element.textContent &&
                        element.textContent
                            .toLowerCase()
                            .includes(
                                normalizedTerm
                            )
                    ) {

                        foundElement =
                            element;

                    }
                }
            );


            if (foundElement) {

                foundElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


                foundElement.classList.add(
                    "search-highlight"
                );


                setTimeout(
                    () => {

                        foundElement.classList.remove(
                            "search-highlight"
                        );

                    },
                    1800
                );
            }

        } else {

            alert(
                `Nenhum resultado encontrado para "${searchTerm}".`
            );
        }
    }


    if (
        searchBtn &&
        searchInput
    ) {

        searchBtn.addEventListener(
            "click",
            () => {

                const ativo =
                    searchInput.classList.contains(
                        "active"
                    );


                if (!ativo) {

                    openSearch();

                    return;
                }


                if (
                    searchInput.value.trim()
                ) {

                    executeHeaderSearch();

                } else {

                    closeSearch();

                }
            }
        );


        searchInput.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    executeHeaderSearch();

                }

                if (
                    event.key === "Escape"
                ) {

                    closeSearch();

                }
            }
        );


        document.addEventListener(
            "click",
            (event) => {

                const clickedInside =
                    event.target.closest(
                        ".search-container"
                    );


                if (!clickedInside) {

                    if (
                        !searchInput.value.trim()
                    ) {

                        closeSearch();

                    }
                }
            }
        );
    }


    /* ======================================================================
       BUSCA DO FOOTER
       ====================================================================== */

    if (
        footerSearchForm &&
        footerSearch
    ) {

        footerSearchForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const term =
                    footerSearch.value.trim();


                if (!term) {

                    footerSearch.focus();

                    return;
                }


                if (searchInput) {

                    searchInput.value =
                        term;

                    openSearch();

                    executeHeaderSearch();

                } else {

                    alert(
                        `Pesquisa realizada por: "${term}"`
                    );
                }
            }
        );
    }


    /* ======================================================================
       BOTÃO VOLTAR AO TOPO
       ====================================================================== */

    function updateBackToTop() {

        if (!backToTop) {
            return;
        }

        if (
            window.scrollY > 450
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


    if (backToTop) {

        window.addEventListener(
            "scroll",
            updateBackToTop,
            {
                passive: true
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


        updateBackToTop();
    }


    /* ======================================================================
       ANIMAÇÕES DE ENTRADA
       ====================================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".hero-content, " +
            ".hero-media, " +
            ".category-card, " +
            ".benefit-item, " +
            ".benefits-image"
        );


    if (
        "IntersectionObserver" in window &&
        animatedElements.length
    ) {

        const observer =
            new IntersectionObserver(
                (
                    entries,
                    observerInstance
                ) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            entry.target.classList.add(
                                "is-visible"
                            );


                            observerInstance.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        animatedElements.forEach(
            (element) => {

                element.classList.add(
                    "animate-on-scroll"
                );

                observer.observe(
                    element
                );

            }
        );

    } else {

        animatedElements.forEach(
            (element) => {

                element.classList.add(
                    "is-visible"
                );

            }
        );
    }


    /* ======================================================================
       CARDS DE CATEGORIA
       ====================================================================== */

    categoryLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        href === "#" ||
                        !href
                    ) {

                        event.preventDefault();


                        const category =
                            link.dataset.category ||
                            link.closest(
                                ".category-card"
                            )
                                ?.querySelector(
                                    "h3"
                                )
                                ?.textContent
                                .trim();


                        if (category) {

                            console.log(
                                `Categoria selecionada: ${category}`
                            );

                        }
                    }
                }
            );
        }
    );


    /* ======================================================================
       FECHAR TUDO COM ESC
       ====================================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }

            closeMenu();

            closeSearch();

            fecharPerfil();

        }
    );


    /* ======================================================================
       FECHAR MENU AO REDIMENSIONAR
       ====================================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 992 &&
                mainNav &&
                mainNav.classList.contains(
                    "open"
                )
            ) {

                closeMenu();

            }
        }
    );


    /* ======================================================================
       ANO AUTOMÁTICO
       ====================================================================== */

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    yearElements.forEach(
        (element) => {

            element.textContent =
                new Date().getFullYear();

        }
    );

});