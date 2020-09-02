(() => {
    'use strict'

    // INDEXED DB
    let request, db;
    if (!window.indexedDB) {
        console.error("Sem suporte para IndexedDB");
    }
    else {
        request = window.indexedDB.open("AgroProdutor_produtor", 1);
        request.onerror = function (event) {
            console.error("Erro ao abrir o banco de dados", event);
        }
        request.onupgradeneeded = function (event) {
            console.log("Atualizando");
            db = event.target.result;
            var objectStore = db.createObjectStore("vProdutosPorProdutor", { keyPath: "id_Produto_Por_Produtor" });
        };
        request.onsuccess = function (event) {
            console.log("Banco de dados aberto com sucesso");
            db = event.target.result;
        }
    }

    // OBJECT
    let str_auth_produtor = localStorage.getItem('authProdutor'),
        obj_auth_produtor = JSON.parse(str_auth_produtor),
        tela = {
            span_user_name: document.querySelector('#user_name'),
        },
        data = {
            produtos: [],
            idproduto: []
        },
        frutas = { // OBJETO COM OS PRODUTOS DE TIPO FRUTA (ID CHECKBOX = KEY)
            Abacate: [obj_auth_produtor.id, 1, "Disponível"],
            Abacaxi: [obj_auth_produtor.id, 2, "Disponível"],
            Acai: [obj_auth_produtor.id, 3, "Disponível"],
            Ameixa: [obj_auth_produtor.id, 4, "Disponível"],
            Banana: [obj_auth_produtor.id, 5, "Disponível"],
            Blueberries: [obj_auth_produtor.id, 6, "Disponível"],
            Caju: [obj_auth_produtor.id, 7, "Disponível"],
            Cereja: [obj_auth_produtor.id, 8, "Disponível"],
            Figo: [obj_auth_produtor.id, 9, "Disponível"],
            Framboesa: [obj_auth_produtor.id, 10, "Disponível"],
            Goiaba: [obj_auth_produtor.id, 11, "Disponível"],
            Laranja: [obj_auth_produtor.id, 12, "Disponível"],
            Limao: [obj_auth_produtor.id, 13, "Disponível"],
            Maca: [obj_auth_produtor.id, 14, "Disponível"],
            Mamao: [obj_auth_produtor.id, 15, "Disponível"],
            Manga: [obj_auth_produtor.id, 16, "Disponível"],
            Maracuja: [obj_auth_produtor.id, 17, "Disponível"],
            Morango: [obj_auth_produtor.id, 18, "Disponível"],
            Nectarina: [obj_auth_produtor.id, 19, "Disponível"],
            Pera: [obj_auth_produtor.id, 20, "Disponível"],
            Pessego: [obj_auth_produtor.id, 21, "Disponível"],
            Tangerina: [obj_auth_produtor.id, 22, "Disponível"],
            Uva: [obj_auth_produtor.id, 23, "Disponível"]
        },
        legumes = { // OBJETO COM OS PRODUTOS DE TIPO FRUTA (ID CHECKBOX = KEY)
            Aipo: [obj_auth_produtor.id, 24, "Disponível"],
            Batata: [obj_auth_produtor.id, 25, "Disponível"],
            Beterraba: [obj_auth_produtor.id, 26, "Disponível"],
            Cenoura: [obj_auth_produtor.id, 27, "Disponível"],
            Chuchu: [obj_auth_produtor.id, 28, "Disponível"],
            Mandioca: [obj_auth_produtor.id, 29, "Disponível"],
            Pepino: [obj_auth_produtor.id, 30, "Disponível"],
            Pimenta: [obj_auth_produtor.id, 31, "Disponível"],
            Pimentao: [obj_auth_produtor.id, 32, "Disponível"],
            Tomate: [obj_auth_produtor.id, 33, "Disponível"],
            TomateCereja: [obj_auth_produtor.id, 34, "Disponível"]
        },
        verduras = { // OBJETO COM OS PRODUTOS DE TIPO FRUTA (ID CHECKBOX = KEY)
            Acelga: [obj_auth_produtor.id, 35, "Disponível"],
            Agriao: [obj_auth_produtor.id, 36, "Disponível"],
            Alface: [obj_auth_produtor.id, 37, "Disponível"],
            Almeirao: [obj_auth_produtor.id, 38, "Disponível"],
            Brocolis: [obj_auth_produtor.id, 39, "Disponível"],
            Couve: [obj_auth_produtor.id, 40, "Disponível"],
            Escarola: [obj_auth_produtor.id, 41, "Disponível"],
            Espinafre: [obj_auth_produtor.id, 42, "Disponível"],
            Repolho: [obj_auth_produtor.id, 43, "Disponível"],
            Rucula: [obj_auth_produtor.id, 44, "Disponível"]
        },
        ervas = { // OBJETO COM OS PRODUTOS DE TIPO FRUTA (ID CHECKBOX = KEY)
            Camomila: [obj_auth_produtor.id, 45, "Disponível"],
            CapimLimao: [obj_auth_produtor.id, 46, "Disponível"],
            CheiroVerde: [obj_auth_produtor.id, 47, "Disponível"],
            Coentro: [obj_auth_produtor.id, 48, "Disponível"],
            Couve_flor: [obj_auth_produtor.id, 49, "Disponível"],
            Erva_doce: [obj_auth_produtor.id, 50, "Disponível"],
            Hortela: [obj_auth_produtor.id, 51, "Disponível"],
            Manjericao: [obj_auth_produtor.id, 52, "Disponível"],
            Salsa: [obj_auth_produtor.id, 53, "Disponível"]
        },
        graos = { // OBJETO COM OS PRODUTOS DE TIPO FRUTA (ID CHECKBOX = KEY)
            Arroz: [obj_auth_produtor.id, 54, "Disponível"],
            Ervilha: [obj_auth_produtor.id, 55, "Disponível"],
            Feijao: [obj_auth_produtor.id, 56, "Disponível"],
            Milho: [obj_auth_produtor.id, 57, "Disponível"]
        },
        // WINDOW CONTENT FOR MATERIAL DESIGN LITE
        windowContent = document.querySelector('.mdl-layout__content'),
        // DIALOG
        dialog = document.querySelector('#dialog'),
        // SNACKBAR
        snackbar = document.querySelector('#app_snackbar'),
        // RETURN BUTTONS
        btn_voltar_1 = document.querySelector('#btn_voltar_1'),
        btn_voltar_2 = document.querySelector('#btn_voltar_2'),
        btn_voltar_3 = document.querySelector('#btn_voltar_3'),
        // HELP BUTTON
        btn_help = document.querySelector('#app_help'),
        // MENU COMPONENTS
        btn_menu = document.querySelector('.mdl-layout__drawer-button'),
        com_menu = document.querySelector('.mdl-navigation'),
        // FLOAT BUTTON
        btn_float = document.getElementById('app_float'),
        // CARDS BUTTONS
        btn_editar = document.querySelector('#btn_editar'),
        btn_gerenciar = document.querySelector('#btn_gerenciar'),
        btn_tela_add = document.querySelector('#add_pruduct'),
        btn_register = document.querySelector('#btn_cadastrar_produtos'),
        // CLIENT LIST
        ul_clientList = document.querySelector('.cliente_list'),
        // PRODUCT LIST ACTIONS
        ul_productsList = document.querySelector('.pruducts_list'),
        ul_list_frutas = document.getElementById('frutas_itens'),
        ul_list_legumes = document.getElementById('legumes_itens'),
        ul_list_verduras = document.getElementById('verduras_itens'),
        ul_list_ervas = document.getElementById('ervas_itens'),
        ul_list_graos = document.getElementById('graos_itens'),
        div_frutas = $('#frutas'),
        div_legumes = $('#legumes'),
        div_verduras = $('#verduras'),
        div_ervas = $('#ervas'),
        div_graos = $('#graos'),
        img_frutas = $('#frutas_itens_img'),
        img_legumes = $('#legumes_itens_img'),
        img_verduras = $('#verduras_itens_img'),
        img_ervas = $('#ervas_itens_img'),
        img_graos = $('#graos_itens_img'),

        checkboxEvent = (el_list, dataInicial, dataFinal) => {
            [...el_list.children].map(item => {
                item.addEventListener('change', event => {
                    let id = event.currentTarget.children[0].children[0].children[0].id; // RECEBE O ID DO CHECKBOX MARCADO
                    // CHECK ONLINE STATE
                    if (event.currentTarget.children[0].children[0].children[0].checked) {
                        dataFinal.produtos.push(dataInicial[id]);
                        dataFinal.idproduto.push(dataInicial[id][1]);
                    }
                    else {
                        Object.keys(dataFinal.produtos).map(function (i) {
                            if (dataFinal.produtos[i] == dataInicial[id]) {
                                dataFinal.produtos.splice(i, 1);
                            }
                        });
                        Object.keys(dataFinal.idproduto).map(function (i) {
                            if (dataFinal.idproduto[i] == dataInicial[id][1]) {
                                dataFinal.idproduto.splice(i, 1);
                            }
                        });
                    }
                });
            });
        },
        // CREATES THE LIST
        createList = (el_list, data) => {
            el_list.innerHTML = '';
            let template = '';
            data.map(item => {
                switch (item.type) {
                    case 'Fruta':
                        template += `<li class="mdl-list__item mdl-list__item--two-line" id="${item.id_Produto_Por_Produtor}">
                        <span class="mdl-list__item-primary-content">
                            <i class="material-icons mdl-list__item-icon" style="color:#d4b00e;">spa</i>
                            <span id="${item.type}">${item.nome_produto}</span>
                            <span id="${item.disponibilidade}" class="mdl-list__item-sub-title">
                              ${item.type} - ${item.disponibilidade}
                            </span>
                        </span>
                        </li>`;
                        break;
                    case 'Legume':
                        template += `<li class="mdl-list__item mdl-list__item--two-line" id="${item.id_Produto_Por_Produtor}">
                        <span class="mdl-list__item-primary-content">
                            <i class="material-icons mdl-list__item-icon" style="color:#FF9800;">spa</i>
                            <span id="${item.type}">${item.nome_produto}</span>
                            <span id="${item.disponibilidade}" class="mdl-list__item-sub-title">
                              ${item.type} - ${item.disponibilidade}
                            </span>
                        </span>
                        </li>`;
                        break;
                    case 'Verdura':
                        template += `<li class="mdl-list__item mdl-list__item--two-line" id="${item.id_Produto_Por_Produtor}">
                        <span class="mdl-list__item-primary-content">
                            <i class="material-icons mdl-list__item-icon" style="color:#2bff00;">spa</i>
                            <span id="${item.type}">${item.nome_produto}</span>
                            <span id="${item.disponibilidade}" class="mdl-list__item-sub-title">
                              ${item.type} - ${item.disponibilidade}
                            </span>
                        </span>
                        </li>`;
                        break;
                    case 'Erva':
                        template += `<li class="mdl-list__item mdl-list__item--two-line" id="${item.id_Produto_Por_Produtor}">
                        <span class="mdl-list__item-primary-content">
                            <i class="material-icons mdl-list__item-icon" style="color:#00eeff;">spa</i>
                            <span id="${item.type}">${item.nome_produto}</span>
                            <span id="${item.disponibilidade}" class="mdl-list__item-sub-title">
                              ${item.type} - ${item.disponibilidade}
                            </span>
                        </span>
                        </li>`;
                        break;
                    case 'Grãos':
                        template += `<li class="mdl-list__item mdl-list__item--two-line" id="${item.id_Produto_Por_Produtor}">
                        <span class="mdl-list__item-primary-content">
                            <i class="material-icons mdl-list__item-icon" style="color:#cf421f;">spa</i>
                            <span id="${item.type}">${item.nome_produto}</span>
                            <span id="${item.disponibilidade}" class="mdl-list__item-sub-title">
                              ${item.type} - ${item.disponibilidade}
                            </span>
                        </span>
                        </li>`;
                        break;
                    default:
                        break;
                };
            });
            el_list.innerHTML = template;
            [...el_list.children].map(item => {
                item.addEventListener('click', event => {
                    // CHECK ONLINE STATE
                    if (navigator.onLine) {
                        let obj_produc = {
                            id_list: event.currentTarget.id,
                            type: event.currentTarget.children[0].children[1].id,
                            availability: event.currentTarget.children[0].children[2].id
                        }
                        if (obj_produc.availability == 'Disponível') {
                            appShowDialog({
                                element: dialog,
                                title: 'Alterar disponibilidade',
                                message: `Você realmente deseja alterar a disponibilidade deste produto para 'Indisponível'?`,
                                btn_no() { appHideDialog(dialog); },
                                btn_yes() {
                                    appHideDialog(dialog);
                                    OpenloaderToggle();
                                    // NODE.JS API getPets
                                    fetch(`/data/recover/indisponivel/produtos/produtor/${obj_produc.id_list}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                        },
                                    })
                                        .then(result => { return result.json() })
                                        .then(data => {
                                            searchList();
                                            CloseloaderToggle();
                                            appShowSnackBar(snackbar, data.message);
                                        })
                                        .catch(err => {
                                            console.error(err.message);
                                            CloseloaderToggle();
                                            appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                                        })
                                }
                            });
                        }
                        else {
                            appShowDialog({
                                element: dialog,
                                title: 'Alterar disponibilidade',
                                message: `Você realmente deseja alterar a disponibilidade deste produto para 'Disponível'?`,
                                btn_no() { appHideDialog(dialog); },
                                btn_yes() {
                                    appHideDialog(dialog);
                                    OpenloaderToggle();
                                    // NODE.JS API getPets
                                    fetch(`/data/recover/disponivel/produtos/produtor/${obj_produc.id_list}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                        },
                                    })
                                        .then(result => { return result.json() })
                                        .then(data => {
                                            searchList();
                                            CloseloaderToggle();
                                            appShowSnackBar(snackbar, data.message);
                                        })
                                        .catch(err => {
                                            console.error(err.message);
                                            CloseloaderToggle();
                                            appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                                        })
                                }
                            });
                        }
                    }
                    else {
                        appShowSnackBar(snackbar, 'Sem internet');
                    }
                });
            });
        },
        // CREATES THE LIST
        createClientList = (el_list, data) => {
            el_list.innerHTML = '';
            let template = '';
            data.map(item => {
                template += `<li class="mdl-list__item mdl-list__item--two-line" id="${item.idCliente}">
                        <span class="mdl-list__item-primary-content">
                            <i class="material-icons mdl-list__item-icon" style="color:#6ec6ff;">account_circle</i>
                            <span>${item.user_name}</span>
                            <span class="mdl-list__item-sub-title">
                              ${item.email}
                            </span>
                        </span>
                        </li>`;
            });
            el_list.innerHTML = template;
            [...el_list.children].map(item => {
                item.addEventListener('click', event => {
                    // CHECK ONLINE STATE
                    if (navigator.onLine) {
                        let obj_client = {
                            id: event.currentTarget.id
                        },
                            str_client = JSON.stringify(obj_client);
                        localStorage.setItem('client', str_client);
                        window.location = 'cliente.html';
                    }
                    else {
                        appShowSnackBar(snackbar, 'Sem internet');
                    }
                });
            });
        },

        productsData = null,
        // CREATES THE LIST
        searchList = () => {
            OpenloaderToggle();
            // CHECK ONLINE STATE
            if (navigator.onLine) {
                // CHECK LOCALSTORAGE auth
                if (localStorage.hasOwnProperty('authProdutor')) {
                    let str_auth = localStorage.getItem('authProdutor'),
                        obj_auth = JSON.parse(str_auth);
                    tela.span_user_name.innerText = obj_auth.user_name;
                    // NODE.JS API getPets
                    fetch(`/data/produtos/produtor/${obj_auth.id}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(result => { return result.json() })
                        .then(data => {
                            if (data.respTemplate.length > 0) {
                                productsData = [...data.respTemplate];

                                // ADD ITEMS TO THE LIST
                                createList(ul_productsList, [...data.respTemplate]);

                                // INDEXED DB
                                var transaction = db.transaction(["vProdutosPorProdutor"], "readwrite");
                                transaction.oncomplete = function (event) {
                                    console.log("Sucesso");
                                };
                                transaction.onerror = function (event) {
                                    console.error("Erro");
                                };
                                var objectStore = transaction.objectStore("vProdutosPorProdutor");
                                objectStore.clear();
                                productsData.map(item => {
                                    objectStore.add(item);
                                });

                                CloseloaderToggle();
                            }
                            else {
                                CloseloaderToggle();
                                appShowDialog({
                                    element: dialog,
                                    title: 'Aviso',
                                    message: `Você não tem produtos cadastrados!\nClick no botão editar e depois no botão de '+' no canto inferior da tela para ser direcionado a tela de adicionar seus produtos.`,
                                    btn_ok() { appHideDialog(dialog); }
                                });
                            }
                        })
                        .catch(err => {
                            console.error(err.message);
                            CloseloaderToggle();
                        });
                }
                else {
                    window.location = 'index.html';
                }
            }
            else {
                CloseloaderToggle();
                appShowDialog({
                    element: dialog,
                    title: 'Offline',
                    message: 'A maioria dos recursos da aplicação é desativado em modo offline, mas ainda é possível verificar seus produtos e gerenciar sua conta.',
                    btn_ok() { appHideDialog(dialog); }
                });

                let dbProducts = [],
                    transaction = db.transaction(['vProdutosPorProdutor'], 'readonly'),
                    objectStore = transaction.objectStore('vProdutosPorProdutor');
                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        dbProducts.push(cursor.value);
                        cursor.continue();
                    }
                    else {
                        // ADD ITEMS TO THE LIST
                        createList(ul_productsList, dbProducts);
                    }
                };
            }
        }

    // WINDOW > FLOAT BUTTON ON SCROLL EVENT
    windowContent.addEventListener('scroll', () => {
        if (windowContent.scrollTop === 0) {
            btn_float.children[0].innerHTML = 'keyboard_arrow_down';
        }
        else {
            btn_float.children[0].innerHTML = 'keyboard_arrow_up';
        }
    });

    // WINDOW EVENT
    window.addEventListener('load', () => {
        searchList();
    });

    // RETURN EVENTS BUTTONS
    $(btn_voltar_1).on('click', () => {
        contentToggle_1();
        $('#btn_1').css("display", "none");
        $('.mdl-layout__header-row').removeClass("header");
        $('.mdl-layout__drawer-button').css("display", "block");
        btn_float.style.display = 'none';
    });

    $(btn_voltar_2).on('click', () => {
        contentToggle_2();
        $('#btn_2').css("display", "none");
        $('.mdl-layout__header-row').removeClass("header");
        $('.mdl-layout__drawer-button').css("display", "block");
        btn_float.style.display = 'none';
    });

    $(btn_voltar_3).on('click', () => {
        contentToggle_3();
        $('#btn_3').css("display", "none");
        $('#btn_1').css("display", "block");
    });

    // // FLOAT BUTTON
    btn_float.addEventListener('click', () => {
        if (btn_float.children[0].innerHTML === 'keyboard_arrow_down') {
            windowContent.scroll({ top: windowContent.scrollHeight, left: 0, behavior: 'smooth' });
        }
        else {
            windowContent.scroll({ top: 0, left: 0, behavior: 'smooth' });
        }
    });

    // HELP EVENT
    $(btn_help).on('click', () => {
        appShowDialog({
            element: dialog,
            title: 'Ajuda',
            message: 'Favor cadastre seus produtos clicando no botão "EDITAR", você pode gerenciar sua conta e serviços clicando no botão "GERENCIAR"',
            btn_ok() { appHideDialog(dialog); }
        });
    });

    // MENU EVENTS
    // PROFILE EVENT
    $(com_menu.children[0]).on('click', () => {
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            window.location = 'perfilProdutor.html';
        }
        else {
            let event = new Event('click');
            document.getElementsByClassName('mdl-layout__obfuscator')[0].dispatchEvent(event);
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });

    // CREDITS EVENT
    $(com_menu.children[1]).on('click', () => {
        appShowDialog({
            element: dialog,
            title: 'Créditos',
            message: 'Esta Aplicação foi desenvolvida como trabalho de conclusão do curso superior de tecnologia em geoprocessamento, da faculdade de tecnologia de Jacareí - FATEC Jacareí.\nA aplicação é um piloto para as cidade de Jacareí e tem como finalidade o "Desenvolvimento de uma plataforma para dispositivos móveis para aproximar produtores e consumidores de produtos naturais".\nO trabalho foi orientado por Arley Ferreira de Souza e têm como autor Eduardo Santos Miguel Filho.',
            btn_ok() { appHideDialog(dialog); }
        });
    });

    // LOGOUT EVENT
    $(com_menu.children[2]).on('click', () => {
        appShowDialog({
            element: dialog,
            title: 'Sair',
            message: 'Você realmente deseja sair da aplicação?',
            btn_no() { appHideDialog(dialog); },
            btn_yes() {
                localStorage.removeItem('authProdutor');
                window.location = 'index.html';
            }
        });
    });

    // CARDS EVENT
    $(btn_editar).on('click', () => {
        contentToggle_1();
        $('.mdl-layout__drawer-button').css("display", "none");
        $('.mdl-layout__header-row').addClass("header");
        $('#btn_1').css("display", "block");
        btn_float.style.display = 'flex';
    });
    $(btn_gerenciar).on('click', () => {
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            // CHECK LOCALSTORAGE auth
            if (localStorage.hasOwnProperty('authProdutor')) {
                let str_auth = localStorage.getItem('authProdutor'),
                    obj_auth = JSON.parse(str_auth);
                // NODE.JS API getPets
                fetch(`/visualizador/data/${obj_auth.id}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(result => { return result.json() })
                    .then(data => {
                        if (data.respTemplate.length > 0) {
                            productsData = [...data.respTemplate];
                            // ADD ITEMS TO THE LIST
                            createClientList(ul_clientList, [...data.respTemplate]);
                            CloseloaderToggle();
                            contentToggle_2();
                            $('.mdl-layout__drawer-button').css("display", "none");
                            $('.mdl-layout__header-row').addClass("header");
                            $('#btn_2').css("display", "block");
                            btn_float.style.display = 'flex';
                        }
                        else {
                            CloseloaderToggle();
                            appShowDialog({
                                element: dialog,
                                title: 'Aviso',
                                message: `Ninguém visualizou seu perfil hoje.`,
                                btn_ok() { appHideDialog(dialog); }
                            });
                        }
                    })
                    .catch(err => {
                        console.error(err.message);
                        CloseloaderToggle();
                    });
            }
            else {
                window.location = 'index.html';
            }
        }
        else {
            CloseloaderToggle();
            appShowDialog({
                element: dialog,
                title: 'Offline',
                message: 'A maioria dos recursos da aplicação é desativado em modo offline, mas ainda é possível verificar seus produtos.',
                btn_ok() { appHideDialog(dialog); }
            });
        }
    });
    $(btn_tela_add).on('click', () => {
        contentToggle_3();
        $('#btn_1').css("display", "none");
        $('#btn_3').css("display", "block");
        btn_float.style.display = 'flex';
    });


    // FUNCTION TO SET CONTAINER SHOW/HIDE AND img src
    let containerToggle = (img, list) => {
        list.slideToggle(); // CONTAINER SHOW/HIDE
        img.text() === 'expand_less' // IF img src EQUALS TO reduzirBlack
            ? img.text('expand_more')
            : img.text('expand_less')
    }

    // CONTAINER OF FRUIT TYPE PRODUCTS - SHOW - HIDE - CHECKBOX
    img_frutas.on('click', () => { // ON click EVENT
        containerToggle(img_frutas, $('#frutas_itens')); // FUNCTION TO SET CONTAINER SHOW/HIDE AND IMG TEXT
    });

    checkboxEvent(ul_list_frutas, frutas, data);
    // CONTAINER OF VEGETABLES TYPE PRODUCTS - SHOW - HIDE - CHECKBOX
    img_legumes.on('click', () => { // ON click EVENT
        containerToggle(img_legumes, $('#legumes_itens')); // FUNCTION TO SET CONTAINER SHOW/HIDE AND IMG TEXT
    });

    checkboxEvent(ul_list_legumes, legumes, data);
    // CONTAINER OF VEGETABLES TYPE PRODUCTS - SHOW - HIDE - CHECKBOX
    img_verduras.on('click', () => { // ON click EVENT
        containerToggle(img_verduras, $('#verduras_itens')); // FUNCTION TO SET CONTAINER SHOW/HIDE AND IMG TEXT
    });

    checkboxEvent(ul_list_verduras, verduras, data);
    // CONTAINER OF HERBS TYPE PRODUCTS - SHOW - HIDE - CHECKBOX
    img_ervas.on('click', () => { // ON click EVENT
        containerToggle(img_ervas, $('#ervas_itens')); // FUNCTION TO SET CONTAINER SHOW/HIDE AND IMG TEXT
    });

    checkboxEvent(ul_list_ervas, ervas, data);
    // CONTAINER OF GRAINS TYPE PRODUCTS - SHOW - HIDE - CHECKBOX
    img_graos.on('click', () => { // ON click EVENT
        containerToggle(img_graos, $('#graos_itens')); // FUNCTION TO SET CONTAINER SHOW/HIDE AND IMG TEXT
    });

    checkboxEvent(ul_list_graos, graos, data);

    // REGISTRAR PRODUTOS
    $(btn_register).on('click', () => {
        OpenloaderToggle();
        // CHECK USER INPUTS
        let count = 0;
        for (let i in data.produtos) {
            count++;
        }
        if (count == 0) {
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Favor selecione algum produto');
            return;
        }
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            let obj_produto = data.valueOf(),
                user = {
                    user_name: tela.span_user_name.innerText.trim()
                }
            // NODE.JS API isAvailable
            fetch('/available/produtor/produto', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
                .then(result => { return result.json() })
                .then(data => {
                    // IF user PARAMS ARE NOT AVAILABLE
                    if (data.respTemplate.length > 0) {
                        let products_notAvaliable = '';
                        Object.keys(data.respTemplate).map(function (item) {
                            Object.keys(obj_produto.idproduto).map(function (i) {
                                if (obj_produto.idproduto[i] == data.respTemplate[item].id) {
                                    products_notAvaliable += `${data.respTemplate[item].name}\n`
                                }
                            });
                        });
                        if (products_notAvaliable != '') {
                            CloseloaderToggle();
                            appShowDialog({
                                element: dialog,
                                title: 'Ajuda',
                                message: `Os produtos abaixo já se encontram cadastrado:\n${products_notAvaliable}Verifique sua lista de produtos para saber quais produtos ainda não foram cadastrado.`,
                                btn_ok() { appHideDialog(dialog); }
                            });
                            return;
                        }
                        else {
                            // NODE.JS API createUser
                            fetch('/data/produtor/produtos', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(obj_produto)
                            })
                                .then(result => { return result.json() })
                                .then(data => {
                                    CloseloaderToggle();
                                    appShowDialog({
                                        element: dialog,
                                        title: data.title,
                                        message: data.message,
                                        btn_ok() {
                                            contentToggle_3();
                                            searchList();
                                            $('#btn_3').css("display", "none");
                                            $('#btn_1').css("display", "block");
                                            appHideDialog(dialog);
                                        }
                                    });
                                })
                                .catch(err => {
                                    console.error(err.message);
                                    CloseloaderToggle();
                                    appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                                })
                        }
                    }
                    else {
                        // NODE.JS API createUser
                        fetch('/data/produtor/produtos', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(obj_produto)
                        })
                            .then(result => { return result.json() })
                            .then(data => {
                                CloseloaderToggle();
                                appShowDialog({
                                    element: dialog,
                                    title: data.title,
                                    message: data.message,
                                    btn_ok() {
                                        contentToggle_3();
                                        searchList();
                                        $('#btn_3').css("display", "none");
                                        $('#btn_1').css("display", "block");
                                        appHideDialog(dialog);
                                    }
                                });
                            })
                            .catch(err => {
                                console.error(err.message);
                                CloseloaderToggle();
                                appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                            })
                    }
                })
                .catch(err => {
                    console.error(err.message);
                    CloseloaderToggle();
                    appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                })
        }
        else {
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });
})();