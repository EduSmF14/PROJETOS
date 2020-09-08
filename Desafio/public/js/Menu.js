(() => {
    'use strict'

    // INDEXED DB
    let request, db;
    if (!window.indexedDB) {
        console.log("Seu navegador não suporta o recurso IndexedDB");
    } else {
        request = window.indexedDB.open("Desafio", 1);
        request.onerror = function(event) {
            console.log("Erro ao abrir o banco de dados", event);
        }
        request.onupgradeneeded = function(event) {
            console.log("Atualizando");
            db = event.target.result;
            var objectStore1 = db.createObjectStore("tbFormsCriado", { autoIncrement: true });
            var objectStore2 = db.createObjectStore("tbFormsResp", { autoIncrement: true });
        };
        request.onsuccess = function(event) {
            console.log("Banco de dados aberto com sucesso");
            db = event.target.result;
        }
    }

    // CREATES A TOP TOOLBAR
    let top_toolbar = new TopToolbar({
        target: '#top_toolbar',
        title: 'Modelo de App',
        theme: {
            bg_color: '#00838f',
            font_color: '#fff'
        },
        left_btn: {
            return: true,
            menu: false
        },
        right_btn: {
            delete: false,
            refresh: false,
            help: false
        }
    });
    top_toolbar.createToolbar('top');


    let obj_questoes = {
            titulo: document.querySelector('#pesq_titulo'),
            pergunta_1: document.querySelector('#pergunta_4'),
            pergunta_2: document.querySelector('#pergunta_5'),
            pergunta_3: document.querySelector('#pergunta_6'),
            pergunta_4: document.querySelector('#pergunta_7')
        },
        obj_ques_resp = {
            pergunta_1: document.querySelector('#per_1'),
            pergunta_2: document.querySelector('#per_2'),
            pergunta_3: document.querySelector('#per_3'),
            pergunta_4: document.querySelector('#per_4')
        },
        obj_responder = {
            titulo: document.querySelector('#titulo_resp'),
            pergunta_1: document.querySelector('#form_1'),
            pergunta_2: document.querySelector('#form_2'),
            pergunta_3: document.querySelector('#form_3'),
            pergunta_4: document.querySelector('#form_4')
        },
        obj_input = {
            pergunta_1: document.querySelector('#res_1'),
            pergunta_2: document.querySelector('#res_2'),
            pergunta_3: document.querySelector('#res_3'),
            pergunta_4: document.querySelector('#res_4'),
            pergunta_5: document.querySelector('#res_5'),
            pergunta_6: document.querySelector('#res_6'),
            pergunta_7: document.querySelector('#res_7')
        },
        id_temporario = "",
        titulo_temporario = "",
        windowContent = document.querySelector('.mdl-layout__content'),
        // DIALOG
        dialog = document.querySelector('#dialog'),
        // COMONETES DO CARD
        respostas_description = document.getElementById('respostas_description'),
        // CARDS BUTTONS
        btn_criar = document.querySelector('#btn_criar'),
        btn_responder = document.querySelector('#btn_responder'),
        btn_gerenciar = document.querySelector('#btn_gerenciar'),
        // FLOAT BUTTON
        btn_float = document.getElementById('app_float'),
        btn_confirmar = document.querySelector('#btn_confirmar'),
        btn_respostas = document.querySelector('#btn_respostas'),
        // FORMS LIST ACTIONS
        ul_formsList = document.querySelector('.forms_list'),
        ul_formsList_2 = document.querySelector('.forms_list_2'),
        section_content_1 = $('#fixed-tab-1'), // CONTENT CONTAINER 
        section_content_2 = $('#fixed-tab-2'), // CONTENT CONTAINER
        section_content_3 = $('#fixed-tab-3'), // CONTENT CONTAINER
        section_content_4 = $('#fixed-tab-4'), // CONTENT CONTAINER
        section_content_5 = $('#fixed-tab-5'), // CONTENT CONTAINER
        section_content_6 = $('#fixed-tab-6'); // CONTENT CONTAINER

    // CARDS EVENT
    $(btn_criar).on('click', () => {
        contentToggle_2();
        $('#return').css("display", "block");
        btn_float.style.display = 'flex';
    });

    $('#return').on('click', () => {
        if (section_content_2.css('display') === 'block') {
            contentToggle_1();
            btn_float.style.display = 'none';
            $('#return').css("display", "none");
        }

        if (section_content_3.css('display') === 'block') {
            contentToggle_2();
            btn_float.style.display = 'none';
            $('#return').css("display", "none");
        }
        if (section_content_4.css('display') === 'block') {
            contentToggle_3();
            btn_float.style.display = 'none';
            $('#return').css("display", "none");
        }
        if (section_content_5.css('display') === 'block') {
            contentToggle_4();
            obj_responder.titulo.innerHTML = "";
            obj_input.pergunta_1.value = "";
            obj_input.pergunta_2.value = "";
            obj_input.pergunta_3.value = "";
            obj_responder.pergunta_1.value = "";
            obj_responder.pergunta_2.value = "";
            obj_responder.pergunta_3.value = "";
            obj_responder.pergunta_4.value = "";
            obj_ques_resp.pergunta_1.style.display = 'none';
            obj_ques_resp.pergunta_2.style.display = 'none';
            obj_ques_resp.pergunta_3.style.display = 'none';
            obj_ques_resp.pergunta_4.style.display = 'none';
        }
        if (section_content_6.css('display') === 'block') {
            contentToggle_5();
            respostas_description.innerHTML = "";
        }
    });

    // WINDOW > FLOAT BUTTON ON SCROLL EVENT
    windowContent.addEventListener('scroll', () => {
        if (windowContent.scrollTop === 0) {
            btn_float.children[0].innerHTML = 'keyboard_arrow_down';
        } else {
            btn_float.children[0].innerHTML = 'keyboard_arrow_up';
        }
    });

    // // FLOAT BUTTON
    btn_float.addEventListener('click', () => {
        if (btn_float.children[0].innerHTML === 'keyboard_arrow_down') {
            windowContent.scroll({ top: windowContent.scrollHeight, left: 0, behavior: 'smooth' });
        } else {
            windowContent.scroll({ top: 0, left: 0, behavior: 'smooth' });
        }
    });

    $(btn_confirmar).on('click', () => {
        OpenloaderToggle();
        let obj_forms = {
            titulo: '',
            pergunta_1: '',
            pergunta_2: '',
            pergunta_3: '',
            pergunta_4: ''
        }
        if (obj_questoes.titulo.value === '') {
            CloseloaderToggle();
            appShowDialog({
                element: dialog,
                title: 'Aviso',
                message: 'Favor preencher o campo Título.',
                btn_ok() { appHideDialog(dialog); }
            });
            return;
        }
        for (let i in obj_questoes) {
            if (obj_questoes[i].value === '') {
                obj_forms[i] = 'vazio';
            } else {
                obj_forms[i] = obj_questoes[i].value
            }
        }
        console.log(obj_forms);

        // INDEXED DB
        var transaction = db.transaction(["tbFormsCriado"], "readwrite");
        transaction.oncomplete = function(event) {
            console.log("Sucesso");
        };
        transaction.onerror = function(event) {
            console.log("Erro");
        };
        var objectStore = transaction.objectStore("tbFormsCriado");
        objectStore.add({...obj_forms });

        obj_questoes.titulo.value = '';
        obj_questoes.pergunta_1.value = '';
        obj_questoes.pergunta_2.value = '';
        obj_questoes.pergunta_3.value = '';
        obj_questoes.pergunta_4.value = '';
        CloseloaderToggle();
        appShowDialog({
            element: dialog,
            title: 'Sucesso',
            message: 'Seu formulário foi criado com sucesso.',
            btn_ok() { appHideDialog(dialog); }
        });
    });

    // CREATES THE LIST
    let createFormsList = (el_list, data) => {
        el_list.innerHTML = '';
        let template = '';
        for (let key in data) {
            template += `<li class="mdl-list__item mdl-list__item--two-line" id="${key}">
                <span class="mdl-list__item-primary-content">
                    <i class="material-icons md-24 mdl-list__item-icon" style="color:#6ec6ff;">assignment</i>
                    <span>${data[key].titulo}</span>
                </span>
                </li>`;
        }
        el_list.innerHTML = template;
        [...el_list.children].map(item => {
            item.addEventListener('click', event => {
                OpenloaderToggle();
                id_temporario = `${event.currentTarget.id}`;
                titulo_temporario = data[event.currentTarget.id].titulo
                obj_responder.titulo.innerHTML = data[event.currentTarget.id].titulo;
                obj_responder.pergunta_1.innerHTML = data[event.currentTarget.id].pergunta_1;
                obj_responder.pergunta_2.innerHTML = data[event.currentTarget.id].pergunta_2;
                obj_responder.pergunta_3.innerHTML = data[event.currentTarget.id].pergunta_3;
                obj_responder.pergunta_4.innerHTML = data[event.currentTarget.id].pergunta_4;
                if (obj_responder.pergunta_1.value != 'vazio') {
                    obj_ques_resp.pergunta_1.style.display = 'flex';
                }
                if (obj_responder.pergunta_2.value != 'vazio') {
                    obj_ques_resp.pergunta_2.style.display = 'flex';
                }
                if (obj_responder.pergunta_3.value != 'vazio') {
                    obj_ques_resp.pergunta_3.style.display = 'flex';
                }
                if (obj_responder.pergunta_4.value != 'vazio') {
                    obj_ques_resp.pergunta_4.style.display = 'flex';
                }
                var options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                };

                function success(pos) {
                    let str_date = new Date(),
                        _data = str_date.toLocaleDateString(),
                        crd = pos.coords;
                    obj_input.pergunta_2.value = _data;
                    obj_input.pergunta_3.value = `Lat: ${crd.latitude} Long: ${crd.longitude}`;
                    contentToggle_4();
                    CloseloaderToggle();
                };

                function error(err) {
                    CloseloaderToggle();
                    appShowDialog({
                        element: dialog,
                        title: 'Aviso',
                        message: `ERRO(${err.code}): ${err.message}`,
                        btn_ok() { appHideDialog(dialog); }
                    });
                };

                navigator.geolocation.getCurrentPosition(success, error, options);
            });
        });
    };

    let createFormsList2 = (el_list, data) => {
        el_list.innerHTML = '';
        let template = '';
        for (let key in data) {
            template += `<li class="mdl-list__item mdl-list__item--two-line" id="${key}">
                <span class="mdl-list__item-primary-content">
                    <i class="material-icons md-18 mdl-list__item-icon" style="color:#6ec6ff;">assignment</i>
                    <span>${data[key].titulo}</span>
                    <span class="mdl-list__item-sub-title">${data[key].pergunta_1} - ${data[key].pergunta_2}</span>
                </span>
                </li>`;
        }
        el_list.innerHTML = template;
        [...el_list.children].map(item => {
            item.addEventListener('click', event => {
                OpenloaderToggle();
                id_temporario = parseInt(event.currentTarget.id, 10);

                let dbforms = [],
                    transaction = db.transaction(['tbFormsCriado'], 'readonly'),
                    objectStore = transaction.objectStore('tbFormsCriado');
                objectStore.openCursor().onsuccess = function(event) {
                    var cursor = event.target.result;
                    let dados = {};

                    if (cursor) {
                        dbforms.push(cursor.value);
                        cursor.continue();
                    } else {
                        for (let key in dbforms) {
                            if (key == data[id_temporario].id_form) {
                                dados = dbforms[key];
                                break
                            }
                        }

                        template = `Título do Questionário: ${dados.titulo}<br><br>
                            Qual é o nome do pesquisador?<br>
                            R: ${data[id_temporario].pergunta_1}<br><br>
                            Qual é a Data da Pesquisa?:<br>
                            R: ${data[id_temporario].pergunta_2}<br><br>
                            Qual é sua coordenada atual?:<br>
                            R: ${data[id_temporario].pergunta_3}<br><br>`;
                        if (dados.pergunta_1 != 'vazio') {
                            template += `${dados.pergunta_1}<br>
                            R: ${data[id_temporario].pergunta_4}<br><br>`;
                        }
                        if (dados.pergunta_2 != 'vazio') {
                            template += `${dados.pergunta_2}<br>
                            R: ${data[id_temporario].pergunta_5}<br><br>`;
                        }
                        if (dados.pergunta_3 != 'vazio') {
                            template += `${dados.pergunta_3}<br>
                            R: ${data[id_temporario].pergunta_6}<br><br>`;
                        }
                        if (dados.pergunta_4 != 'vazio') {
                            template += `${dados.pergunta_4}<br>
                            R: ${data[id_temporario].pergunta_7}<br><br>`;
                        }

                        respostas_description.innerHTML = template;
                        CloseloaderToggle();
                        contentToggle_5();
                    }
                };
            });
        });
    };

    $(btn_responder).on('click', () => {
        let dbforms = [],
            transaction = db.transaction(['tbFormsCriado'], 'readonly'),
            objectStore = transaction.objectStore('tbFormsCriado');
        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                dbforms.push(cursor.value);
                cursor.continue();
            } else {
                // ADD ITEMS TO THE LIST
                createFormsList(ul_formsList, dbforms);
            }
        };
        contentToggle_1();
        $('#return').css("display", "block");
        btn_float.style.display = 'flex';
    });

    $(btn_respostas).on('click', () => {
        OpenloaderToggle();

        if (obj_input.pergunta_1.value === '') {
            CloseloaderToggle();
            appShowDialog({
                element: dialog,
                title: 'Aviso',
                message: 'Favor preencher o campo "Qual é o nome do pesquisador?".',
                btn_ok() { appHideDialog(dialog); }
            });
            return
        }

        let obj_resp = {
            id_form: id_temporario,
            titulo: titulo_temporario,
            pergunta_1: obj_input.pergunta_1.value,
            pergunta_2: obj_input.pergunta_2.value,
            pergunta_3: obj_input.pergunta_3.value,
            pergunta_4: obj_input.pergunta_4.value,
            pergunta_5: obj_input.pergunta_5.value,
            pergunta_6: obj_input.pergunta_6.value,
            pergunta_7: obj_input.pergunta_7.value
        }

        // INDEXED DB
        var transaction = db.transaction(["tbFormsResp"], "readwrite");
        transaction.oncomplete = function(event) {
            console.log("Sucesso");
        };
        transaction.onerror = function(event) {
            console.log("Erro");
        };
        var objectStore = transaction.objectStore("tbFormsResp");
        objectStore.add({...obj_resp });

        obj_responder.titulo.innerHTML = "";
        obj_input.pergunta_1.value = "";
        obj_input.pergunta_2.value = "";
        obj_input.pergunta_3.value = "";
        obj_responder.pergunta_1.value = "";
        obj_responder.pergunta_2.value = "";
        obj_responder.pergunta_3.value = "";
        obj_responder.pergunta_4.value = "";
        obj_ques_resp.pergunta_1.style.display = 'none';
        obj_ques_resp.pergunta_2.style.display = 'none';
        obj_ques_resp.pergunta_3.style.display = 'none';
        obj_ques_resp.pergunta_4.style.display = 'none';
        CloseloaderToggle();
        appShowDialog({
            element: dialog,
            title: 'Sucesso',
            message: 'Suas respostas foram confirmadas com sucesso.',
            btn_ok() {
                appHideDialog(dialog);
                contentToggle_4();
            }
        });
    });

    $(btn_gerenciar).on('click', () => {
        let dbforms = [],
            transaction = db.transaction(['tbFormsResp'], 'readonly'),
            objectStore = transaction.objectStore('tbFormsResp');
        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                dbforms.push(cursor.value);
                cursor.continue();
            } else {
                // ADD ITEMS TO THE LIST
                createFormsList2(ul_formsList_2, dbforms);
            }
        };
        contentToggle_3();
        $('#return').css("display", "block");
        btn_float.style.display = 'flex';
    });

})();