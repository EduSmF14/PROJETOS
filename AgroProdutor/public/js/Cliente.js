(() => {
    'use strict'
    // HELP BUTTON
    let btn_help = document.getElementById('app_help_cad'),
        // RETURN BUTTON
        btn_return = document.getElementById('btn_voltar_1'),
        // DIALOG
        dialog = document.querySelector('#dialog'),
        // SNACKBAR
        snackbar = document.getElementById('app_snackbar'),
        // COMONETES DO CARD
        cliente_description = document.getElementById('cliente_description'),
        link1 = document.getElementById('link1'),
        link2 = document.getElementById('link2');
    // WINDOW EVENT TO CHECK AUTHENTICATION
    window.addEventListener('load', () => {
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            // CHECK LOCALSTORAGE auth
            if (localStorage.hasOwnProperty('authProdutor')) {
                let str_auth = localStorage.getItem('authProdutor'),
                    obj_auth = JSON.parse(str_auth);
                OpenloaderToggle();
                if (localStorage.hasOwnProperty('client')) {
                    let str_client = localStorage.getItem('client'),
                        obj_client = JSON.parse(str_client);
                    // NODE.JS API
                    fetch(`/data/user/cliente/${obj_client.id}`, {
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
                            E-mail: ${data.respTemplate.email}<br><br>
                            Data de Nascimento:  ${dia}-${mes}-${ano}<br><br>
                            Telefone: ${data.respTemplate.telefone}`;

                            cliente_description.innerHTML = template;

                            link1.href = `tel:${tel5}`;
                            link2.href = `http://api.whatsapp.com/send?1=pt_BR&phone=55${tel5}`; 
                            CloseloaderToggle();
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
            message: 'Favor verificar as informações do cliente e se você tem interesse em fazer negócio com ele, favor clicar no telefone para ser direcionado ao app de chamadas do seu celular ou para o WhatsApp',
            btn_ok() { appHideDialog(dialog); }
        });
    });

    // RETURN EVENT
    btn_return.addEventListener('click', () => {
        window.location = "telaMenuProdutor.html";
    });
})();
