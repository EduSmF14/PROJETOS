(() => {
    'use strict'


    // CLIENTE OBJECT
    let obj_cliente = {
        // CLIENTES INPUTS
        ipt_user_name: document.querySelector('#nameUser'),
        ipt_name: document.querySelector('#nameCliente'),
        ipt_email: document.querySelector('#emailCliente'),
        ipt_dataNascimento: document.querySelector('#DataCliente'),
        ipt_senha: document.querySelector('#senhaCliente'),
        ipt_address: document.querySelector('#enderecoUser'),
        ipt_telefone: document.querySelector('#phoneCliente')
    },
        // PRODUTOR OBJECT
        obj_produtor = {
            // PRODUTOR INPUTS
            ipt_user_name: document.querySelector('#nameUserProdutor'),
            ipt_name: document.querySelector('#nameProdutor'),
            ipt_email: document.querySelector('#emailProdutor'),
            ipt_dataNascimento: document.querySelector('#DataProdutor'),
            ipt_tipoDeProdutor: document.querySelector('#select'),
            ipt_senha: document.querySelector('#senhaProdutor'),
            ipt_address: document.querySelector('#enderecoProdutor'),
            ipt_telefone: document.querySelector('#phoneProdutor')
        },

        // DIALOG
        dialog = document.querySelector('#dialog'),
        // SNACKBAR
        snackbar = document.querySelector('#app_snackbar'),
        // RETURN BUTTONS
        btn_voltar_1 = document.querySelector('#btn_voltar_1'),
        btn_voltar_2 = document.querySelector('#btn_voltar_2'),
        // HELP BUTTON
        btn_help = document.querySelector('#app_help_cad'),
        // CEP INPUT
        ipt_cep = document.querySelector("#cep"),
        // AUTOCOMPLETE COMPONENT
        com_address = document.querySelector('.autocomplete div'),
        // ENDEREÇO INPUT
        ipt_address_user = 'enderecoUser',
        ipt_address_produtor = 'enderecoProdutor',
        // REGISTER BUTTONS
        btn_register_1 = document.querySelector('#btn_cadastrar_cliente'),
        btn_register_2 = document.querySelector('#btn_cadastrar_produtor'),
        btn_confirmar = document.querySelector('#btn_cadastrar_produtor'),
        // ADDRESS BY CEP BUTTON
        btn_addressByCep = document.querySelector('#btn_endereco');


    // RETURN EVENTS BUTTONS
    $(btn_voltar_1).on('click', () => {
        window.location = "loginProdutor.html";
    });

    $(btn_voltar_2).on('click', () => {
        window.location = "loginCliente.html";
    });

    // ######### BUSCAR ENDEREÇO POR CEP - VIACEP ######### -- START

    // CEP EVENT
    btn_addressByCep.addEventListener('click', () => {
        OpenloaderToggle();
        // CHECK CEP INPUT
        if (ipt_cep.value === '') {
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Favor preencher o campo CEP');
            return;
        }
        if (!/^\d{8}$/.test(ipt_cep.value)) {
            ipt_cep.value = '';
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'CEP inválido');
            return;
        }
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            // VIACEP WEBSERVICE - https://viacep.com.br/
            let url_cep = `https://viacep.com.br/ws/${encodeURIComponent(ipt_cep.value)}/json/`;
            fetch(url_cep, {
                method: 'GET'
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    // CHECK DATA CONTENT
                    if (data.hasOwnProperty('erro')) {
                        ipt_cep.value = '';
                        CloseloaderToggle();
                        appShowSnackBar(snackbar, 'CEP inválido');
                    }
                    else {
                        let str_tela = localStorage.getItem('tela'),
                            obj_tela = JSON.parse(str_tela);
                        // FILL USER NAME
                        if (obj_tela.tela === 1) {
                            com_address.classList.add('is-dirty')
                            obj_cliente.ipt_address.value = `${data.logradouro}, ${data.localidade}, ${data.uf}`;
                        }
                        else {
                            com_address.classList.add('is-dirty')
                            obj_produtor.ipt_address.value = `${data.logradouro}, ${data.localidade}, ${data.uf}`;
                        }
                        CloseloaderToggle();
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

    // AUTOCOMPLETE ADDRESS EVENT
    function initialize1() {
        var autocomplete = new google.maps.places.Autocomplete(obj_cliente.ipt_address);

        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place1 = autocomplete.getPlace();
        });
    }

    function initialize2() {
        var autocomplete2 = new google.maps.places.Autocomplete(obj_produtor.ipt_address);

        google.maps.event.addListener(autocomplete2, 'place_changed', function () {
            var place2 = autocomplete2.getPlace();
        });
    }

    $(obj_cliente.ipt_address).on('focus change', function () {
        initialize1();
    });

    $(obj_produtor.ipt_address).on('focus change', function () {
        initialize2();
    });

    // HELP EVENT
    $(btn_help).on('click', () => {
        appShowDialog({
            element: dialog,
            title: 'Ajuda',
            message: 'Favor preencher corretamente os campos obrigatórios (*). Para preencher o endereço você pode optar por informar um CEP conhecido, clicando no botão OBTER ENDEREÇO POR CEP.',
            btn_ok() { appHideDialog(dialog); }
        });
    });

    // REGISTER EVENT
    $(btn_register_1).on('click', () => {
        OpenloaderToggle();
        // CHECK USER INPUTS
        let count = 0;
        for (let i in obj_cliente) {
            if (obj_cliente[i].value === '') {
                count++;
            }
        }
        if (count > 0) {
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Favor preencher os campos obrigatórios (*)');
            return;
        }
        // CHECK USER NAME INPUT
        if (!/^[a-zA-Z0-9_.-]*$/.test(obj_cliente.ipt_user_name.value)) {
            obj_cliente.ipt_user_name.value = '';
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Nome de usuário inválido');
            return;
        }
        // CHECK PASSWORD INPUT
        if (!/^[a-zA-Z0-9_.-]*$/.test(obj_cliente.ipt_senha.value)) {
            obj_cliente.ipt_senha.value = '';
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Senha inválida');
            return;
        }
        // CHECK E-MAIL INPUT
        if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test(obj_cliente.ipt_email.value)) {
            obj_cliente.ipt_email.value = '';
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'e-mail inválido');
            return;
        }
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            var geocoder = new google.maps.Geocoder();

            var address = document.getElementById(ipt_address_user).value;;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status === 'OK') {
                    let user = {
                        user_name: obj_cliente.ipt_user_name.value.trim(),
                        name: obj_cliente.ipt_name.value.trim(),
                        email: obj_cliente.ipt_email.value.trim(),
                        dataNascimento: obj_cliente.ipt_dataNascimento.value.trim(),
                        senha: obj_cliente.ipt_senha.value.trim(),
                        address: obj_cliente.ipt_address.value.trim(),
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng(),
                        telefone: obj_cliente.ipt_telefone.value.trim()
                    }
                    // NODE.JS API isAvailable
                    fetch('/available/cliente', {
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
                                CloseloaderToggle();
                                appShowSnackBar(snackbar, data.respTemplate[0]);
                                return;
                            }
                            // NODE.JS API createUser
                            fetch('/register/cliente', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(user)
                            })
                                .then(result => { return result.json() })
                                .then(data => {
                                    CloseloaderToggle();
                                    appShowDialog({
                                        element: dialog,
                                        title: data.title,
                                        message: data.message,
                                        btn_ok() { window.location = 'loginCliente.html'; }
                                    });
                                })
                                .catch(err => {
                                    console.error(err.message);
                                    CloseloaderToggle();
                                    appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                                })
                        })
                        .catch(err => {
                            console.error(err.message);
                            CloseloaderToggle();
                            appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                        })
                } else {
                    console.log(status);
                    CloseloaderToggle();
                    appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                }
            });
        }
        else {
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });

    $(btn_register_2).on('click', () => {
        OpenloaderToggle();
        // CHECK USER INPUTS
        let count = 0;
        for (let i in obj_produtor) {
            if (obj_produtor[i].value === '') {
                count++;
            }
        }
        if (count > 0) {
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Favor preencher os campos obrigatórios (*)');
            return;
        }
        // CHECK USER NAME INPUT
        if (!/^[a-zA-Z0-9_.-]*$/.test(obj_produtor.ipt_user_name.value)) {
            obj_produtor.ipt_user_name.value = '';
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Nome de usuário inválido');
            return;
        }
        // CHECK PASSWORD INPUT
        if (!/^[a-zA-Z0-9_.-]*$/.test(obj_produtor.ipt_senha.value)) {
            obj_produtor.ipt_senha.value = '';
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Senha inválida');
            return;
        }
        // CHECK E-MAIL INPUT
        if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test(obj_produtor.ipt_email.value)) {
            obj_produtor.ipt_email.value = '';
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'e-mail inválido');
            return;
        }
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            var geocoder = new google.maps.Geocoder();

            var address = document.getElementById(ipt_address_produtor).value;;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status === 'OK') {
                    let produtor = {
                        user_name: obj_produtor.ipt_user_name.value.trim(),
                        name: obj_produtor.ipt_name.value.trim(),
                        email: obj_produtor.ipt_email.value.trim(),
                        dataNascimento: obj_produtor.ipt_dataNascimento.value.trim(),
                        tipoDeProdutor: obj_produtor.ipt_tipoDeProdutor.value.trim(),
                        senha: obj_produtor.ipt_senha.value.trim(),
                        address: obj_produtor.ipt_address.value.trim(),
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng(),
                        telefone: obj_produtor.ipt_telefone.value.trim()
                    }
                    // NODE.JS API isAvailable
                    fetch('/available/produtor', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(produtor)
                    })
                        .then(result => { return result.json() })
                        .then(data => {
                            // IF user PARAMS ARE NOT AVAILABLE
                            if (data.respTemplate.length > 0) {
                                CloseloaderToggle();
                                appShowSnackBar(snackbar, data.respTemplate[0]);
                                return;
                            }
                            // NODE.JS API createUser
                            fetch('/register/produtor', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(produtor)
                            })
                                .then(result => { return result.json() })
                                .then(data => {
                                    CloseloaderToggle();
                                    appShowDialog({
                                        element: dialog,
                                        title: data.title,
                                        message: data.message,
                                        btn_ok() { window.location = "loginProdutor.html"; }
                                    });
                                })
                                .catch(err => {
                                    console.error(err.message);
                                    CloseloaderToggle();
                                    appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                                })
                        })
                        .catch(err => {
                            console.error(err.message);
                            CloseloaderToggle();
                            appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                        })
                } else {
                    console.log(status);
                    CloseloaderToggle();
                    appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                }
            });
        }
        else {
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });
})();