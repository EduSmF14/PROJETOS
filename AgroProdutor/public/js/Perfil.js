(() => {
    'use strict'


    // CLIENTE OBJECT
    let obj_cliente = {
        // CLIENTES INPUTS
        ipt_user_name: document.querySelector('#nameUser'),
        ipt_name: document.querySelector('#nameCliente'),
        ipt_email: document.querySelector('#emailCliente'),
        ipt_dataNascimento: document.querySelector('#DataCliente'),
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
            ipt_address: document.querySelector('#enderecoProdutor'),
            ipt_telefone: document.querySelector('#phoneProdutor'),
        },

        obj_password_cliente = {
            ipt_password: document.getElementById('senhaCliente')
        },
        obj_password_produtor = {
            ipt_password: document.getElementById('senhaProdutor')
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
        // PROFILE COMPONENTS
        com_profile = document.querySelector('.mdl-card__actions'),
        // UPDATE USER PASSWORD BUTTON
        btn_updatePassword_1 = document.getElementById('app_updatePassword_cliente'),
        btn_updatePassword_2 = document.getElementById('app_updatePassword_produtor'),
        // UPDATE USER INFO BUTTON
        btn_updateInfo_1 = document.getElementById('app_updateInfo_cliente'),
        btn_updateInfo_2 = document.getElementById('app_updateInfo_produtor'),
        // CEP INPUT
        ipt_cep = document.querySelector("#cep"),
        // AUTOCOMPLETE COMPONENT
        com_address = document.querySelector('.autocomplete div'),
        // ENDEREÇO INPUT
        ipt_address_user = 'enderecoUser',
        ipt_address_produtor = 'enderecoProdutor',
        // ADDRESS BY CEP BUTTON
        btn_addressByCep = document.querySelector('#btn_endereco');


    // RETURN EVENTS BUTTONS
    $(btn_voltar_1).on('click', () => {
        window.location = "telaMenuProdutor.html";
    });

    $(btn_voltar_2).on('click', () => {
        window.location = "telaMenuCliente.html";
    });

    // ######### BUSCAR ENDEREÇO POR CEP - VIACEP ######### -- START

    // WINDOW EVENT TO FILL USER INFO
    window.addEventListener('load', () => {
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            // CHECK LOCALSTORAGE auth
            if (localStorage.hasOwnProperty('authProdutor')) {
                let str_auth = localStorage.getItem('authProdutor'),
                    obj_auth = JSON.parse(str_auth);
                OpenloaderToggle();
                // NODE.JS API getUser
                fetch(`/data/user/produtor/${obj_auth.id}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(result => { return result.json() })
                    .then(data => {
                        com_profile.children[3].classList.add('is-dirty');
                        obj_produtor.ipt_user_name.value = data.respTemplate.user_name;
                        com_profile.children[4].classList.add('is-dirty');
                        obj_produtor.ipt_name.value = data.respTemplate.name;
                        com_profile.children[5].classList.add('is-dirty');
                        obj_produtor.ipt_email.value = data.respTemplate.email;
                        com_profile.children[6].classList.add('is-dirty');
                        obj_produtor.ipt_dataNascimento.value = data.respTemplate.dataNascimento;
                        com_profile.children[7].classList.add('is-dirty');
                        obj_produtor.ipt_telefone.value = data.respTemplate.telefone;
                        com_profile.children[8].classList.add('is-dirty');
                        switch (data.respTemplate.tipoDeProdutor) {
                            case 'Produtor Orgânico':
                                com_profile.children[8].classList.add('is-dirty');
                                obj_produtor.ipt_tipoDeProdutor.value = 'Produtor Orgânico';
                                break;
                            case 'Produtor Agroecológico':
                                com_profile.children[8].classList.add('is-dirty');
                                obj_produtor.ipt_tipoDeProdutor.value = 'Produtor Agroecológico';
                                break;
                            case 'Produtor Comum':
                                com_profile.children[8].classList.add('is-dirty');
                                obj_produtor.ipt_tipoDeProdutor.value = 'Produtor Comum';
                                break;
                            default:
                                break;
                        };
                        com_address.classList.add('is-dirty');
                        obj_produtor.ipt_address.value = data.respTemplate.address;
                        CloseloaderToggle();
                    })
                    .catch(err => {
                        console.error(err.message);
                        window.location = 'index.html';
                    })
            }
            else if (localStorage.hasOwnProperty('authCliente')) {
                let str_auth = localStorage.getItem('authCliente'),
                    obj_auth = JSON.parse(str_auth);
                OpenloaderToggle();
                // NODE.JS API getUser
                fetch(`/data/user/cliente/${obj_auth.id}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(result => { return result.json() })
                    .then(data => {
                        com_profile.children[3].classList.add('is-dirty');
                        obj_cliente.ipt_user_name.value = data.respTemplate.user_name;
                        com_profile.children[4].classList.add('is-dirty');
                        obj_cliente.ipt_name.value = data.respTemplate.name;
                        com_profile.children[5].classList.add('is-dirty');
                        obj_cliente.ipt_email.value = data.respTemplate.email;
                        com_profile.children[6].classList.add('is-dirty');
                        obj_cliente.ipt_dataNascimento.value = data.respTemplate.dataNascimento;
                        com_profile.children[7].classList.add('is-dirty');
                        obj_cliente.ipt_telefone.value = data.respTemplate.telefone;
                        com_address.classList.add('is-dirty');
                        obj_cliente.ipt_address.value = data.respTemplate.address;
                        CloseloaderToggle();
                    })
                    .catch(err => {
                        console.error(err.message);
                        window.location = 'index.html';
                    })
            }
            else {
                window.location = 'index.html';
            }
        }
        else {
            window.location = 'index.html';
        }
    });

    // CEP EVENT
    btn_addressByCep.addEventListener('click', () => {
        // CHECK CEP INPUT
        if (ipt_cep.value === '') {
            appShowSnackBar(snackbar, 'Favor preencher o campo CEP');
            return;
        }
        if (!/^\d{8}$/.test(ipt_cep.value)) {
            ipt_cep.value = '';
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
                    }
                })
                .catch(err => {
                    console.error(err.message);
                    appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                })
        }
        else {
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
    btn_help.addEventListener('click', () => {
        appShowDialog({
            element: dialog,
            title: 'Ajuda',
            message: 'Favor verifique seus dados e caso exista a necessidade de atualizações, favor preencher corretamente os campos. Para preencher o endereço você pode optar por informar um CEP conhecido, clicando no botão OBTER ENDEREÇO POR CEP.',
            btn_ok() { appHideDialog(dialog); }
        });
    });

    // UPDATE USER PASSWORD EVENT
    $(btn_updatePassword_1).on('click', () => {
        // CHECK USER INPUTS
        let count = 0;
        for (let i in obj_password_cliente) {
            if (obj_password_cliente[i].value === '') {
                count++;
            }
        }
        if (count > 0) {
            appShowSnackBar(snackbar, 'Favor preencher os campos obrigatórios (*)');
            return;
        }
        // CHECK NEW PASSWORD INPUT
        if (!/^[a-zA-Z0-9_.-]*$/.test(obj_password_cliente.ipt_password.value)) {
            obj_password_cliente.ipt_password.value = '';
            appShowSnackBar(snackbar, 'Nova senha inválida');
            return;
        }
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            let str_auth = localStorage.getItem('authCliente'),
                obj_auth = JSON.parse(str_auth),
                password = {
                    id: obj_auth.id,
                    new: obj_password_cliente.ipt_password.value.trim()
                };
            OpenloaderToggle();
            // NODE.JS API setUserPassword
            fetch('/password/cliente', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(password)
            })
                .then(result => { return result.json() })
                .then(data => {
                    CloseloaderToggle();
                    appShowDialog({
                        element: dialog,
                        title: data.title,
                        message: data.message,
                        btn_ok() { window.location = "telaMenuCliente.html"; }
                    });
                })
                .catch(err => {
                    console.error(err.message);
                    CloseloaderToggle();
                    appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                })
        }
        else {
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });

    $(btn_updatePassword_2).on('click', () => {
        // CHECK USER INPUTS
        let count = 0;
        for (let i in obj_password_produtor) {
            if (obj_password_produtor[i].value === '') {
                count++;
            }
        }
        if (count > 0) {
            appShowSnackBar(snackbar, 'Favor preencher os campos obrigatórios (*)');
            return;
        }
        // CHECK NEW PASSWORD INPUT
        if (!/^[a-zA-Z0-9_.-]*$/.test(obj_password_produtor.ipt_password.value)) {
            obj_password_produtor.ipt_password.value = '';
            appShowSnackBar(snackbar, 'Nova senha inválida');
            return;
        }
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            let str_auth = localStorage.getItem('authProdutor'),
                obj_auth = JSON.parse(str_auth),
                password = {
                    id: obj_auth.id,
                    new: obj_password_produtor.ipt_password.value.trim()
                };
            OpenloaderToggle();
            // NODE.JS API setUserPassword
            fetch('/password/produtor', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(password)
            })
                .then(result => { return result.json() })
                .then(data => {
                    CloseloaderToggle();
                    appShowDialog({
                        element: dialog,
                        title: data.title,
                        message: data.message,
                        btn_ok() { window.location = "telaMenuProdutor.html"; }
                    });
                })
                .catch(err => {
                    console.error(err.message);
                    CloseloaderToggle();
                    appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                })
        }
        else {
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });

    // REGISTER EVENT
    $(btn_updateInfo_1).on('click', () => {
        // CHECK USER INPUTS
        let count = 0;
        for (let i in obj_cliente) {
            if (obj_cliente[i].value === '') {
                count++;
            }
        }
        if (count > 0) {
            appShowSnackBar(snackbar, 'Favor preencher os campos obrigatórios (*)');
            return;
        }
        // CHECK USER NAME INPUT
        if (!/^[a-zA-Z0-9_.-]*$/.test(obj_cliente.ipt_user_name.value)) {
            obj_cliente.ipt_user_name.value = '';
            appShowSnackBar(snackbar, 'Nome de usuário inválido');
            return;
        }
        // CHECK PASSWORD INPUT
        if (!/^[a-zA-Z0-9_.-]*$/.test(obj_cliente.ipt_senha.value)) {
            obj_cliente.ipt_senha.value = '';
            appShowSnackBar(snackbar, 'Senha inválida');
            return;
        }
        // CHECK E-MAIL INPUT
        if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test(obj_cliente.ipt_email.value)) {
            obj_cliente.ipt_email.value = '';
            appShowSnackBar(snackbar, 'e-mail inválido');
            return;
        }
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            var geocoder = new google.maps.Geocoder();

            var address = document.getElementById(ipt_address_user).value;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status === 'OK') {
                    let str_auth = localStorage.getItem('authCliente'),
                        obj_auth = JSON.parse(str_auth),

                        user = {
                            user_name: obj_cliente.ipt_user_name.value.trim(),
                            name: obj_cliente.ipt_name.value.trim(),
                            email: obj_cliente.ipt_email.value.trim(),
                            dataNascimento: obj_cliente.ipt_dataNascimento.value.trim(),
                            address: obj_cliente.ipt_address.value.trim(),
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng(),
                            telefone: obj_cliente.ipt_telefone.value.trim(),
                            id: obj_auth.id
                        }

                    // // NODE.JS API createUser
                    fetch('/data/cliente', {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(user)
                    })
                        .then(result => { return result.json() })
                        .then(data => {
                            appShowDialog({
                                element: dialog,
                                title: data.title,
                                message: data.message,
                                btn_ok() { window.location = "telaMenuCliente.html"; }
                            });

                        })
                        .catch(err => {
                            console.error(err.message);
                            appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                        })

                } else {
                    console.log(status);
                    appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                }
            });
        }
        else {
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });

    $(btn_updateInfo_2).on('click', () => {
        // CHECK USER INPUTS
        let count = 0;
        for (let i in obj_produtor) {
            if (obj_produtor[i].value === '') {
                count++;
            }
        }
        if (count > 0) {
            appShowSnackBar(snackbar, 'Favor preencher os campos obrigatórios (*)');
            return;
        }
        // CHECK USER NAME INPUT
        if (!/^[a-zA-Z0-9_.-]*$/.test(obj_produtor.ipt_user_name.value)) {
            obj_produtor.ipt_user_name.value = '';
            appShowSnackBar(snackbar, 'Nome de usuário inválido');
            return;
        }
        // CHECK E-MAIL INPUT
        if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test(obj_produtor.ipt_email.value)) {
            obj_produtor.ipt_email.value = '';
            appShowSnackBar(snackbar, 'e-mail inválido');
            return;
        }
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            var geocoder = new google.maps.Geocoder();

            var address = document.getElementById(ipt_address_produtor).value;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status === 'OK') {
                    let str_auth = localStorage.getItem('authProdutor'),
                        obj_auth = JSON.parse(str_auth),

                        produtor = {
                            user_name: obj_produtor.ipt_user_name.value.trim(),
                            name: obj_produtor.ipt_name.value.trim(),
                            email: obj_produtor.ipt_email.value.trim(),
                            dataNascimento: obj_produtor.ipt_dataNascimento.value.trim(),
                            tipoDeProdutor: obj_produtor.ipt_tipoDeProdutor.value.trim(),
                            address: obj_produtor.ipt_address.value.trim(),
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng(),
                            telefone: obj_produtor.ipt_telefone.value.trim(),
                            id: obj_auth.id
                        }
                    // NODE.JS API createUser
                    fetch('/data/produtor', {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(produtor)
                    })
                        .then(result => { return result.json() })
                        .then(data => {
                            appShowDialog({
                                element: dialog,
                                title: data.title,
                                message: data.message,
                                btn_ok() { window.location = "telaMenuProdutor.html"; }
                            });
                        })
                        .catch(err => {
                            console.error(err.message);
                            appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                        })

                } else {
                    console.log(status);
                    appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                }
            });
        }
        else {
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });
})();