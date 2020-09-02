(() => {
    'use strict'

    // USER OBJECT
    let obj_cliente = {
        // USER INPUTS
        ipt_user_name: document.querySelector('#nameUser'),
        ipt_senha: document.querySelector('#senhaCliente')
    },
        obj_produtor = {
            // USER INPUTS
            ipt_user_name: document.querySelector('#nameUserProdutor'),
            ipt_senha: document.querySelector('#senhaProdutor')
        },
        // DIALOG
        dialog = document.querySelector('#dialog'),
        // SNACKBAR
        snackbar = document.querySelector('#app_snackbar'),
        // LOGIN COMPONENTS
        com_login = document.querySelector('.mdl-card__actions'),
        // HELP BUTTON
        btn_help_1 = document.querySelector('#app_help_cad_cliente'),
        btn_help_2 = document.querySelector('#app_help_cad_produtor'),
        // SHOW PASSWORD SWITCH
        swi_showPassword_1 = document.querySelector('#app_showPassword_cliente'),
        swi_showPassword_2 = document.querySelector('#app_showPassword_produtor'),
        // REMIND ME SWITCH
        swi_remindMe_1 = document.querySelector('#app_remindMe_cliente'),
        swi_remindMe_2 = document.querySelector('#app_remindMe_produtor'),
        // LOGIN BUTTON
        btn_login_1 = document.querySelector('#btn_entrar_menu_cliente'),
        btn_login_2 = document.querySelector('#btn_entrar_menu_produtor'),
        // REGISTER BUTTON
        btn_register_1 = document.querySelector('#btn_cadastrar_cliente'),
        btn_register_2 = document.querySelector('#btn_cadastrar_produtor'),
        // FORGOT PASSWORD BUTTON
        btn_forgotPassword_1 = document.querySelector('#btn_esqueci_senha_cliente'),
        btn_forgotPassword_2 = document.querySelector('#btn_esqueci_senha_produtor'),
        // SHOW PASSWORD FUNCTION
        showPasswordChangedCliente = () => {
            // CHECK SHOW PASSWORD CHECKBOX
            if (swi_showPassword_1.checked === true) {
                obj_cliente.ipt_senha.type = 'text';
            }
            else {
                obj_cliente.ipt_senha.type = 'password';
            }
        },

        showPasswordChangedProdutor = () => {
            // CHECK SHOW PASSWORD CHECKBOX
            if (swi_showPassword_2.checked === true) {
                obj_produtor.ipt_senha.type = 'text';
            }
            else {
                obj_produtor.ipt_senha.type = 'password';
            }
        };

    // WINDOW EVENT TO FILL USER INFO / REMIND ME
    $(window).on('load', () => {
        // CHECK LOCALSTORAGE remind_me
        if (localStorage.hasOwnProperty('remind_me_1')) {
            let str_remindMe = localStorage.getItem('remind_me_1'),
                obj_remindMe = JSON.parse(str_remindMe),
                str_tela = localStorage.getItem('tela'),
                obj_tela = JSON.parse(str_tela);
            // FILL USER NAME
            if (obj_tela.tela === 1) {
                com_login.children[0].classList.add('is-dirty');
                com_login.children[1].classList.add('is-dirty');
                obj_cliente.ipt_user_name.value = obj_remindMe.name;
                obj_cliente.ipt_senha.value = obj_remindMe.password;
            }
            // CHECK PASSWORD SWITCH
            if (obj_remindMe.show_password === true && obj_tela.tela === 1) {
                com_login.children[2].classList.add('is-checked');
                swi_showPassword_1.checked = true;
                showPasswordChangedCliente();
            }
            // CHECK REMIND ME SWITCH
            if (obj_remindMe.remind_me === true && obj_tela.tela === 1) {
                com_login.children[3].classList.add('is-checked');
                swi_remindMe_1.checked = true;
            }
        }
        if (localStorage.hasOwnProperty('remind_me_2')) {
            let str_remindMe = localStorage.getItem('remind_me_2'),
                obj_remindMe = JSON.parse(str_remindMe),
                str_tela = localStorage.getItem('tela'),
                obj_tela = JSON.parse(str_tela);
            // FILL USER NAME
            if (obj_tela.tela === 2) {
                com_login.children[0].classList.add('is-dirty');
                com_login.children[1].classList.add('is-dirty');
                obj_produtor.ipt_user_name.value = obj_remindMe.name;
                obj_produtor.ipt_senha.value = obj_remindMe.password;
            }
            // CHECK PASSWORD SWITCH
            if (obj_remindMe.show_password === true && obj_tela.tela === 2) {
                com_login.children[2].classList.add('is-checked');
                swi_showPassword_2.checked = true;
                showPasswordChangedProdutor();
            }
            // CHECK REMIND ME SWITCH
            if (obj_remindMe.remind_me === true && obj_tela.tela === 2) {
                com_login.children[3].classList.add('is-checked');
                swi_remindMe_2.checked = true;
            }
        }
    });


    // REGISTER EVENTS
    $(btn_register_1).on('click', () => {
        window.location = "telaCadastroCliente.html";
    });

    $(btn_register_2).on('click', () => {
        window.location = "telaCadastroProdutor.html";
    });

    // FORGOT PASSWORD EVENTS
    $(btn_forgotPassword_1).on('click', () => {    
        window.location = 'recuperarCliente.html';
    });
    $(btn_forgotPassword_2).on('click', () => {    
        window.location = 'recuperarProdutor.html';
    });

    // HELP EVENTS
    $(btn_help_1).on('click', () => {
        appShowDialog({
            element: dialog,
            title: 'Ajuda',
            message: 'Favor preencher seu nome de usuário e senha para entrar na aplicação, caso ainda não possua um cadastro favor clicar em CADASTRAR. Se você esqueceu sua senha favor clicar em ESQUECI SENHA. Caso sua conta for de Produtor favor clicar em CONECTAR COMO PRODUTOR.',
            btn_ok() { appHideDialog(dialog); }
        });
    });

    $(btn_help_2).on('click', () => {
        appShowDialog({
            element: dialog,
            title: 'Ajuda',
            message: 'Favor preencher seu nome de usuário e senha para entrar na aplicação, caso ainda não possua um cadastro favor clicar em CADASTRAR. Se você esqueceu sua senha favor clicar em ESQUECI SENHA. Caso sua conta for de Cliente favor clicar em CONECTAR COMO CLIENTE.',
            btn_ok() { appHideDialog(dialog); }
        });
    });

    // SHOW PASSWORD EVENTS
    $(swi_showPassword_1).on('change', () => {
        showPasswordChangedCliente();
    });

    $(swi_showPassword_2).on('change', () => {
        showPasswordChangedProdutor();
    });

    // REMIND ME EVENTS
    $(swi_remindMe_1).on('change', () => {
        // CHECK REMIND ME CHECKBOX
        if (swi_remindMe_1.checked === true) {
            // CHECK USER INPUTS
            if (obj_cliente.ipt_user_name.value !== '' && obj_cliente.ipt_senha.value !== '') {
                let obj_remindMe = {
                    name: obj_cliente.ipt_user_name.value,
                    password: obj_cliente.ipt_senha.value,
                    show_password: swi_showPassword_1.checked,
                    remind_me: swi_remindMe_1.checked
                },
                    str_remindMe = JSON.stringify(obj_remindMe);
                localStorage.setItem('remind_me_1', str_remindMe);
            }
        }
        else {
            localStorage.clear();
        }
    });

    $(swi_remindMe_2).on('change', () => {
        // CHECK REMIND ME CHECKBOX
        if (swi_remindMe_2.checked === true) {
            // CHECK USER INPUTS
            if (obj_produtor.ipt_user_name.value !== '' && obj_produtor.ipt_senha.value !== '') {
                let obj_remindMe = {
                    name: obj_produtor.ipt_user_name.value,
                    password: obj_produtor.ipt_senha.value,
                    show_password: swi_showPassword_2.checked,
                    remind_me: swi_remindMe_2.checked
                },
                    str_remindMe = JSON.stringify(obj_remindMe);
                localStorage.setItem('remind_me_2', str_remindMe);
            }
        }
        else {
            localStorage.clear();
        }
    });

    // LOGIN EVENTS
    $(btn_login_1).on('click', () => {
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
            appShowSnackBar(snackbar, 'Favor preencher corretamente os campos');
            return;
        }
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            let user = {
                name: obj_cliente.ipt_user_name.value.trim(),
                password: obj_cliente.ipt_senha.value.trim()
            };
            // NODE.JS API userLogin
            fetch('/login/cliente', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
                .then(result => { return result.json() })
                .then(data => {
                    if (!data.hasOwnProperty('token')) {
                        CloseloaderToggle();
                        appShowSnackBar(snackbar, data.message);
                        return;
                    }
                    console.log(data);
                    let obj_auth = {
                        token: data.token,
                        id: data.id,
                        user_name: data.user_name
                    },
                        str_auth = JSON.stringify(obj_auth);
                    localStorage.setItem('authCliente', str_auth);
                    CloseloaderToggle();
                    window.location = 'telaMenuCliente.html';
                })
                .catch(err => {
                    CloseloaderToggle();
                    console.error(err.message);
                    appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                })
        }
        else {
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });

    $(btn_login_2).on('click', () => {
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
            appShowSnackBar(snackbar, 'Favor preencher corretamente os campos');
            return;
        }
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            let user = {
                name: obj_produtor.ipt_user_name.value.trim(),
                password: obj_produtor.ipt_senha.value.trim()
            };
            // NODE.JS API userLogin
            fetch('/login/produtor', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
                .then(result => { return result.json() })
                .then(data => {
                    if (!data.hasOwnProperty('token')) {
                        CloseloaderToggle();
                        appShowSnackBar(snackbar, data.message);
                        return;
                    }
                    let obj_auth = {
                        token: data.token,
                        id: data.id,
                        user_name: data.user_name
                    },
                        str_auth = JSON.stringify(obj_auth);
                    localStorage.setItem('authProdutor', str_auth);
                    CloseloaderToggle();
                    window.location = 'telaMenuProdutor.html';
                })
                .catch(err => {
                    CloseloaderToggle();
                    console.error(err.message);
                    appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                })
        }
        else {
            CloseloaderToggle();
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });
})();
