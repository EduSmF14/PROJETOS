(() => {
    'use strict'

    // INDEXED DB
    let request, db;
    if (!window.indexedDB) {
        console.error("Sem suporte para IndexedDB");
    }
    else {
        request = window.indexedDB.open("AgroProdutor_cliente", 1);
        request.onerror = function (event) {
            console.error("Erro ao abrir o banco de dados", event);
        }
        request.onupgradeneeded = function (event) {
            console.log("Atualizando");
            db = event.target.result;
            var objectStore = db.createObjectStore("vProdutor", { keyPath: "idProdutor" });
        };
        request.onsuccess = function (event) {
            console.log("Banco de dados aberto com sucesso");
            db = event.target.result;
        }
    }


    // OBJECT
    let tela = {
        span_user_name: document.querySelector('#user_name'),
    },
        // MAP CONTAINER
        section_map = document.querySelector('#map'),
        // DIALOG
        dialog = document.querySelector('#dialog'),
        // SNACKBAR
        snackbar = document.querySelector('#app_snackbar'),
        // HELP BUTTON
        btn_help = document.querySelector('#app_help'),
        // FILTER BUTTON
        btn_filter = document.getElementById('app_filter'),
        div_filter = document.getElementById('app_divFilter'),
        // MENU COMPONENTS
        com_menu = document.querySelector('.mdl-navigation'),

        // GET PET TYPE
        getProducesType = el_group => {
            let _type = null;
            [...el_group].map(item => {
                if (item.checked) {
                    _type = item.value;
                }
            });
            return _type;
        },
        // GET PET TYPE
        getProductType = el_group => {
            let _type = null;
            [...el_group].map(item => {
                if (item.checked) {
                    _type = item.value;
                }
            });
            return _type;
        },
        // LOCATION OPTIONS
        locationOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        },

        // FUNCTION TO ADD SVG MARKERS
        producesData = null;
    // WINDOW EVENT TO FILL USER INFO / REMIND ME
    $(window).on('load', () => {
        OpenloaderToggle();
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            // CHECK LOCALSTORAGE auth
            // CHECK LOCALSTORAGE authCliente
            if (localStorage.hasOwnProperty('authCliente')) {
                let str_auth = localStorage.getItem('authCliente'),
                    obj_auth = JSON.parse(str_auth);
                tela.span_user_name.innerText = obj_auth.user_name;
                // NODE.JS API getPets
                fetch('/produtores', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(result => { return result.json() })
                    .then(data => {
                        producesData = [...data.respTemplate];
                        // ADD SVG MARKER TO THE MAP
                        addSVGMarkers(map, [...data.respTemplate]);
                        // INDEXED DB
                        var transaction = db.transaction(["vProdutor"], "readwrite");
                        transaction.oncomplete = function (event) {
                            console.log("Sucesso");
                        };
                        transaction.onerror = function (event) {
                            console.error("Erro");
                        };
                        var objectStore = transaction.objectStore("vProdutor");
                        objectStore.clear();
                        producesData.map(item => {
                            objectStore.add(item);
                        });

                        CloseloaderToggle();
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
                message: 'A maioria dos recursos da aplicação é desativado em modo offline, mas ainda é possível verificar a localização dos Produtores no mapa.',
                btn_ok() { appHideDialog(dialog); }
            });

            let dbProduces = [],
                transaction = db.transaction(['vProdutor'], 'readonly'),
                objectStore = transaction.objectStore('vProdutor');
            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    dbProduces.push(cursor.value);
                    cursor.continue();
                }
                else {
                    // ADD SVG MARKER TO THE MAP
                    addSVGMarkers(map, dbProduces);
                }
            };
        }
    });

    // FILTER EVENT
    btn_filter.addEventListener('click', () => {
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            appShowFilter(div_filter);

            div_filter.children[0].children[1].children[11].children[0].addEventListener('click', () => {
                let dist = div_filter.children[0].children[1].children[11].children[1];
                if (parseInt(dist.innerHTML) >= 100 && parseInt(dist.innerHTML) < 3000) {
                    dist.innerHTML = parseInt(dist.innerHTML) + 50;
                }
            });

            div_filter.children[0].children[1].children[11].children[2].addEventListener('click', () => {
                let dist = div_filter.children[0].children[1].children[11].children[1];
                if (parseInt(dist.innerHTML) > 100 && parseInt(dist.innerHTML) <= 3000) {
                    dist.innerHTML = parseInt(dist.innerHTML) - 50;
                }
            });
        }
        else {
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });

    // FILTER OK EVENT
    div_filter.children[0].children[2].children[1].addEventListener('click', () => {
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            map.removeLayer(markerLayer);
            markerLayer = null;
            markerSource = null;

            if (circle) {
                map.removeLayer(circle);
                circle = null;
            }

            appHideFilter(div_filter);

            OpenloaderToggle();
            // CHECK BROWSER GEOLOCATION SUPPORT
            if ("geolocation" in navigator) {
                OpenloaderToggle();
                getPosition(locationOptions)
                    .then(response => {
                        let obj_position = {
                            latitude: response.coords.latitude.toFixed(6),
                            longitude: response.coords.longitude.toFixed(6)
                        };

                        let dist = div_filter.children[0].children[1].children[11].children[1],
                            distance = parseInt(dist.innerHTML),
                            produceType = document.getElementsByName('produces_typeF'),
                            productType = document.getElementsByName('product_typeF'),
                            value = getProductType(productType),
                            typeProduct = '',
                            lat = parseFloat(obj_position.latitude),
                            lng = parseFloat(obj_position.longitude);

                        if (value != null) {
                            typeProduct = value;
                        }

                        let filter = {
                            coordinates: `${obj_position.longitude} ${obj_position.latitude}`,
                            type: getProducesType(produceType),
                            typeProduct: typeProduct,
                            distance: (distance / 1000) / 111.12
                        };
                        // NODE.JS API filter
                        fetch('/filter', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(filter)
                        })
                            .then(result => { return result.json() })
                            .then(data => {
                                if (data.respTemplate.length > 0) {
                                    producesData = [...data.respTemplate];
                                    // ADD SVG MARKER TO THE MAP
                                    addSVGMarkers(map, [...data.respTemplate]);

                                    addCircleToMap(map, distance, lng, lat);
                                    appShowSnackBar(snackbar, `${data.respTemplate.length} produtor(es) encontrado(s)`);
                                }
                                else {
                                    appShowSnackBar(snackbar, 'Nennhum Produtor encontrado');
                                }

                                CloseloaderToggle();
                            })
                            .catch(err => {
                                console.error(err.message);
                                CloseloaderToggle();
                            });

                    })
                    .catch((err) => {
                        // CHECK ERROR MESSAGE
                        if (err.message === 'User denied Geolocation') {
                            // CHECK BROWSER - MOZILLA ALLOWS TO REVOKE PERMISSIONS
                            if (navigator.userAgent.includes("Firefox")) {
                                CloseloaderToggle();
                                navigator.permissions.revoke({ name: 'geolocation' }).then(result => {
                                    report(result.state);
                                });
                            }
                            // OTHER BROWSERS NOT ALLOW TO REVOKE PERMISSIONS
                            else {
                                CloseloaderToggle();
                                appShowDialog({
                                    element: dialog,
                                    title: 'Erro',
                                    message: 'A permissão para localização foi negada, por favor acesse as configurações da aplicação para alterar.',
                                    btn_ok() { appHideDialog(dialog); }
                                });
                            }
                        }
                        else {
                            console.error(err.message);
                            CloseloaderToggle();
                            appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente1');
                        }
                    })
            } else {
                CloseloaderToggle();
                appShowSnackBar(snackbar, 'Dispositivo sem suporte para localização2');
            }
        }
        else {
            appHideFilter(div_filter);
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });

    // FILTER CANCEL EVENT
    div_filter.children[0].children[2].children[0].addEventListener('click', () => {
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            map.removeLayer(markerLayer);
            markerLayer = null;
            markerSource = null;

            if (circle) {
                map.removeLayer(filterLayer);
                circle = null;
                CircleFeature = null;
                filterSource = null;
                filterLayer = null;
            }

            appHideFilter(div_filter);

            OpenloaderToggle();
            // NODE.JS API 
            fetch('/produtores', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(result => { return result.json() })
                .then(data => {
                    producesData = [...data.respTemplate];
                    // ADD SVG MARKER TO THE MAP
                    addSVGMarkers(map, [...data.respTemplate]);

                    CloseloaderToggle();
                })
                .catch(err => {
                    console.error(err.message);
                    appHideLoading(spinner, spinner.children[0]);
                });
        }
        else {
            appHideFilter(div_filter);
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });

    // HELP EVENT
    $(btn_help).on('click', () => {
        appShowDialog({
            element: dialog,
            title: 'Ajuda',
            message: 'Na aba MAPA você pode visualizar os locais em que os produtores foram cadastrados, adicionar filtros para visualizações específicas e visualizar o portifólio do produtor.',
            btn_ok() { appHideDialog(dialog); }
        });
    });

    // PROFILE EVENT
    com_menu.children[0].addEventListener('click', () => {
        // CHECK ONLINE STATE
        if (navigator.onLine) {
            window.location = 'perfilCliente.html';
        }
        else {
            let event = new Event('click');
            document.getElementsByClassName('mdl-layout__obfuscator')[0].dispatchEvent(event);
            appShowSnackBar(snackbar, 'Sem internet');
        }
    });

    // CREDITS EVENT
    com_menu.children[1].addEventListener('click', () => {
        appShowDialog({
            element: dialog,
            title: 'Créditos',
            message: 'Esta Aplicação foi desenvolvida como trabalho de conclusão do curso superior de tecnologia em geoprocessamento, da faculdade de tecnologia de Jacareí - FATEC Jacareí.\nA aplicação é um piloto para as cidade de Jacareí e tem como finalidade o "Desenvolvimento de uma plataforma para dispositivos móveis para aproximar produtores e consumidores de produtos naturais".\nO trabalho foi orientado por Arley Ferreira de Souza e têm como autor Eduardo Santos Miguel Filho.',
            btn_ok() { appHideDialog(dialog); }
        });
    });

    // LOGOUT EVENT
    com_menu.children[2].addEventListener('click', () => {
        appShowDialog({
            element: dialog,
            title: 'Sair',
            message: 'Você realmente deseja sair da aplicação?',
            btn_no() { appHideDialog(dialog); },
            btn_yes() {
                localStorage.removeItem('authCliente');
                window.location = 'index.html';
            }
        });
    });
})();