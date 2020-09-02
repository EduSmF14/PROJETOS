(() => {
    'use strict'

    // HELP BUTTON
    let btn_help = document.querySelector('#app_help_cad'),
        dialog = document.querySelector('#dialog');

    // SERVICEWORKER
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(registration => {
                console.log('ServiceWorker registrado com sucesso: ', registration.scope);
            }, function (err) {
                console.error('Sem suporte para ServiceWorker: ', err);
            });
        })
    }

    // HELP EVENT
    $(btn_help).on('click', () => {
        appShowDialog({
            element: dialog,
            title: 'Ajuda',
            message: `Bem Vindo ao AroProdutor. Clique em "CONECTAR COMO CLIENTE" ou "CONECTAR COMO PRODUTOR" para ser direcionado pra tela de login.`,
            btn_ok() { appHideDialog(dialog); }
        });
    });


    let obj_tela = {
        tela: 0
    },
        str_tela

    $('#btn_cliente').on('click', () => {
        obj_tela.tela = 1;
        str_tela = JSON.stringify(obj_tela);
        localStorage.setItem('tela', str_tela);
        window.location = "loginCliente.html";
    });

    $('#btn_produtor').on('click', () => {
        obj_tela.tela = 2;
        str_tela = JSON.stringify(obj_tela);
        localStorage.setItem('tela', str_tela);
        window.location = "loginProdutor.html";
    });
})();