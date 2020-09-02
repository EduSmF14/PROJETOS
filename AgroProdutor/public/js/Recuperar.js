(() => {
    'use strict'

    // USER OBJECT
    let obj_cliente = {
        // CLIENTES INPUTS
        ipt_email: document.querySelector('#emailCliente')
    },
        // PRODUTOR OBJECT
        obj_produtor = {
            // PRODUTOR INPUTS
            ipt_email: document.querySelector('#emailProdutor'),
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
        // RECOVER BUTTON
        btn_recover_1 = document.querySelector('#app_recover_1'),
        btn_recover_2 = document.querySelector('#app_recover_2');


    // RETURN EVENTS BUTTONS
    $(btn_voltar_1).on('click', () => {
        window.location = "loginProdutor.html";
    });

    $(btn_voltar_2).on('click', () => {
        window.location = "loginCliente.html";
    });


    // HELP EVENT
    $(btn_help).on('click', () => {
        appShowDialog({
            element: dialog,
            title: 'Ajuda',
            message: 'Favor informar seu e-mail de cadastro e clicar em RECUPERAR para receber um e-mail com seu nome de usuário e senha.',
            btn_ok() { appHideDialog(dialog); }
        });
    });

    // RECOVER EVENT
    $(btn_recover_1).on('click', () => {
        OpenloaderToggle();
        // CHECK USER INPUT
        if (obj_produtor.ipt_email.value === '') {
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Favor preencher o campo e-mail');
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
            let user = {
                email: obj_produtor.ipt_email.value.trim(),
            }
            // NODE.JS API isRegistered
            fetch('/registered/produtor', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
                .then(result => { return result.json() })
                .then(data => {
                    // IF THE user_email NOT EXISTS
                    if (data.respTemplate.length > 0) {
                        CloseloaderToggle();
                        appShowSnackBar(snackbar, data.respTemplate[0]);
                        return;
                    }
                    // NODE.JS API recoverUser
                    fetch('/recover/produtor', {
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
                                btn_ok() { window.location = 'index.html'; }
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
        }
        else {
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });
    $(btn_recover_2).on('click', () => {
        OpenloaderToggle();
        // CHECK USER INPUT
        if (obj_cliente.ipt_email.value === '') {
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Favor preencher o campo e-mail');
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
            let user = {
                email: obj_cliente.ipt_email.value.trim(),
            }
            // NODE.JS API isRegistered
            fetch('/registered/cliente', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
                .then(result => { return result.json() })
                .then(data => {
                    // IF THE user_email NOT EXISTS
                    if (data.respTemplate.length > 0) {
                        CloseloaderToggle();
                        appShowSnackBar(snackbar, data.respTemplate[0]);
                        return;
                    }
                    // NODE.JS API recoverUser
                    fetch('/recover/cliente', {
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
                                btn_ok() { window.location = 'index.html'; }
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
        }
        else {
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });
})();