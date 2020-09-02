(() => {
    'use strict'
    // HELP BUTTON
    let btn_help = document.getElementById('app_help_cad'),
        // RETURN BUTTON
        btn_return = document.getElementById('btn_voltar_1'),
        // DIALOG
        dialog = document.getElementById('dialog'),
        // SNACKBAR
        snackbar = document.getElementById('app_snackbar'),
        // COMONETES DO CARD
        produces_description = document.getElementById('produces_description'),
        link1 = document.getElementById('link1'),
        link2 = document.getElementById('link2'),
        // PRODUCT LIST ACTIONS
        ul_productsList = document.querySelector('.pruducts_list'),
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
        };

    // WINDOW EVENT TO CHECK AUTHENTICATION
    window.addEventListener('load', () => {
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            // CHECK LOCALSTORAGE auth
            if (localStorage.hasOwnProperty('authCliente')) {
                let str_auth = localStorage.getItem('authCliente'),
                    obj_auth = JSON.parse(str_auth);
                OpenloaderToggle();
                if (localStorage.hasOwnProperty('idprodutor')) {
                    let str_produce = localStorage.getItem('idprodutor'),
                        obj_produce = JSON.parse(str_produce);
                    // NODE.JS API
                    fetch(`/data/user/produtor/${obj_produce.id}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(result => { return result.json() })
                        .then(data => {
                            // DATA 

                            let ano = data.respTemplate.dataNascimento.substr(0, 4),
                                mes = data.respTemplate.dataNascimento.substr(5, 2),
                                dia = data.respTemplate.dataNascimento.substr(8, 2),
                                template = null,
                                tel1 = data.respTemplate.telefone,
                                tel2 = tel1.replace('(', ''),
                                tel3 = tel2.replace(')', ''),
                                tel4 = tel3.replace(' ', ''),
                                tel5 = tel4.replace('-', '');
                            // CREATES A IMAGE
                            template = `Nome de Usuário: ${data.respTemplate.user_name}<br><br>
                            Nome: ${data.respTemplate.name}<br><br>
                            Tipo de Produtor: ${data.respTemplate.tipoDeProdutor}<br><br>
                            E-mail: ${data.respTemplate.email}<br><br>
                            Data de Nascimento:  ${dia}-${mes}-${ano}<br><br>
                            Endereço do seu local de vendas:<br> ${data.respTemplate.address}<br><br>
                            Telefone: ${data.respTemplate.telefone}`;

                            produces_description.innerHTML = template;

                            link1.href = `tel:${tel5}`;
                            link2.href = `http://api.whatsapp.com/send?1=pt_BR&phone=55${tel5}`;
                            // NODE.JS API
                            fetch(`/data/produtos/produtor/${obj_produce.id}`, {
                                method: 'GET',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(result => { return result.json() })
                                .then(data => {
                                    if (data.respTemplate.length > 0) {
                                        // ADD ITEMS TO THE LIST
                                        createList(ul_productsList, [...data.respTemplate]);
                                        CloseloaderToggle();
                                    }
                                    else {
                                        ul_productsList.innerHTML = `<li class="mdl-list__item mdl-list__item--two-line" id="${item.id_Produto_Por_Produtor}">
                                        <span class="mdl-list__item-primary-content">
                                            <i class="material-icons mdl-list__item-icon" style="color:#ff0000;">block</i>
                                            <span>Este produtor ainda não cadatrou algum produto</span>
                                        </span>
                                        </li>`;
                                        CloseloaderToggle();
                                    }
                                })
                                .catch(err => {
                                    console.error(err.message);
                                    CloseloaderToggle();
                                });

                        })
                        .catch(err => {
                            console.error(err.message);
                            CloseloaderToggle();
                            appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                        })
                }
                else {
                    window.location = 'index.html';
                }
            }
            else {
                window.location = 'index.html';
            }
        }
        else {
            window.location = 'index.html';
        }
    });

    // HELP EVENT
    btn_help.addEventListener('click', () => {
        appShowDialog({
            element: dialog,
            title: 'Ajuda',
            message: 'Favor verificar as informações do produtor e se você tem interesse em fazer negócio com ele, favor clicar no telefone para ser direcionado ao app de chamadas do seu celular ou para o WhatsApp',
            btn_ok() { appHideDialog(dialog); }
        });
    });

    // RETURN EVENT
    btn_return.addEventListener('click', () => {
        window.location = "telaMenuCliente.html";
    });
})();
