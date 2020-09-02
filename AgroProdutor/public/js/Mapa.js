// VARIAVEIS GLOBAIS ============================================================================ START

let mapTarget = document.getElementById('map'),
    // INFO
    snackbarInfoProduce = document.querySelector('#info'),
    btn_perfil = document.querySelector('#mdl-card__actions_perfil'),

    // VARIAVEIS GLOBAIS ============================================================================ END

    // VIEW
    view = new ol.View({
        projection: 'EPSG:3857', // REFERENCE SYSTEM: SPHERICAL MERCATOR - UNIT METRIC AND DATUM WGS84
        center: [-5117762.53253, -2667844.79835], // VIEW CENTER => [X, Y]
        zoom: 11, // INITIAL ZOOM
        extent: [-5142639.01572, -2687818.25181, -5092886.04933, -2647871.34490], // VIEW EXTENT [MINX, MINY, MAXX, MAXY]
        maxZoom: 19, // ZOOM IN
        minZoom: 11 // ZOOM OUT
    }),

    // FUNCTION TO CREATE IMG FOR BUTTONS
    newImg = (src) => { // PARAMETER IMG SOURCE
        let img = document.createElement('img');
        img.src = src;
        img.style.backgroundRepeat = 'no-repeat';
        img.style.backgroundPosition = 'center center';
        img.style.width = '25.08px';
        img.style.height = '25.08px';
        return img;
    },

    // // CONTROL - FULLSCREEN 
    // var olFullscreen = new ol.control.FullScreen({
    //     label: newImg('./img/fullscreen.png'), // IMG BUTTON OFF
    //     labelActive: newImg('./img/fechar.png'), // IMG BUTTON ON
    //     tipLabel: 'Tela Cheia' // TIP
    // });

    // CONTROL - ROTATE 
    olRotate = new ol.control.Rotate({
        label: newImg('./images/acima.png'), // IMG BUTTON
        autoHide: false, // AUTO HIDE OFF
        tipLabel: 'Rotacionar' // TIP
    }),

    // CONTROL - SCALE 
    olScale = new ol.control.ScaleLine(),

    // CONTROL - EXTENT
    olExtent = new ol.control.ZoomToExtent({
        label: newImg('./images/extensao.png'), // IMG BUTTON
        tipLabel: 'Zoom para extensão', // TIP
        extent: [-5142639.01572, -2687818.25181, -5092886.04933, -2647871.34490] // EXTENT
    }),
    // THE SOURCE PRODUCES LAYER
    markerSource = null,
    // PRODUCES LAYER
    markerLayer = null,
    // CREATER MARKER
    addSVGMarkers = (map, data) => {
        // THE SOURCE PRODUCES LAYER
        markerSource = new ol.source.Vector({});

        // PRODUCES LAYER
        markerLayer = new ol.layer.Vector({
            source: markerSource,
            zIndex: 3,
        });

        // STYLES THE MARKERS
        let pruduce_icon_1 = new ol.style.Style({
            image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: 'images/marker1.svg'
            }))
        }),
            pruduce_icon_2 = new ol.style.Style({
                image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */({
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: 'images/marker2.svg'
                }))
            }),

            pruduce_icon_3 = new ol.style.Style({
                image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */({
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: 'images/marker3.svg'
                }))
            });
        data.map(item => {
            let pruduce_icon = null,
                pruduce_marker = null,
                x = item.lng * 20037508.34 / 180,
                y = Math.log(Math.tan((90 + item.lat) * Math.PI / 360)) / (Math.PI / 180);
            y = y * 20037508.34 / 180;
            // MARKER
            pruduce_marker = new ol.Feature({
                geometry: new ol.geom.Point([x, y]),
                idProdutor: item.idProdutor,
                user_name: item.user_name,
                name: item.name,
                tipoDeProdutor: item.tipoDeProdutor,
                address: item.address,
                telefone: item.telefone,
                lat: item.lat,
                lng: item.lng,
                geom: item.geom
            });
            switch (item.tipoDeProdutor) {
                case 'Produtor Orgânico':
                    pruduce_marker.setStyle(pruduce_icon_1);
                    break;
                case 'Produtor Agroecológico':
                    pruduce_marker.setStyle(pruduce_icon_2);
                    break;
                case 'Produtor Comum':
                    pruduce_marker.setStyle(pruduce_icon_3);
                    break;
                default:
                    break;
            };

            // ADD THE MARKER TO THE SOURCE  
            markerSource.addFeature(pruduce_marker);
        });
        map.addLayer(markerLayer);
    },

    circle = null,
    CircleFeature = null,
    filterSource = null,
    filterLayer = null,

    addCircleToMap = (map, distance, longitude, latitude) => {
        let style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "rgb(70, 182, 172)",
                width: 2
            }),
            fill: new ol.style.Fill({
                color: "rgba(70, 182, 172,0.3)"
            }),
        })

        circle = new ol.geom.Circle(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'), distance);

        CircleFeature = new ol.Feature(circle);


        filterSource = new ol.source.Vector({});

        filterSource.addFeatures([CircleFeature]);


        filterLayer = new ol.layer.Vector({
            source: filterSource,
            style: style
        });


        map.addLayer(filterLayer);
    },

    // MAP
    map = new ol.Map({
        target: mapTarget, // MAP RENDER TARGET
        view: view, // MAP VIEW
        layers: [ // LAYERS
            new ol.layer.Tile({
                title: 'basemap',
                source: new ol.source.OSM(),
                visible: true
            })
        ],
        controls: ol.control.defaults({ rotate: false }).extend([
            olRotate,
            olScale,
            olExtent
        ]),
    });

// MAP EVENT INFO 
map.on('click', function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
            return feature;
        });
    if (feature) {
        $("#info").fadeIn();
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
                let visualizador = {
                  id: obj_auth.id,
                  user_name: data.respTemplate.user_name,
                  name: data.respTemplate.name,
                  email: data.respTemplate.email,
                  telefone: data.respTemplate.telefone,
                  idProdutor: feature.get('idProdutor')
                }
                // NODE.JS API createUser
                fetch('/visualizador', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(visualizador)
                })
                    .then(result => { return result.json() })
                    .then(data => {
                        let tel1 = feature.get('telefone'),
                            tel2 = tel1.replace('(', ''),
                            tel3 = tel2.replace(')', ''),
                            tel4 = tel3.replace(' ', ''),
                            tel5 = tel4.replace('-', '');
                        snackbarInfoProduce.children[0].children[0].children[0].innerText = feature.get('user_name');
                        snackbarInfoProduce.children[0].children[1].children[0].innerText = feature.get('name');
                        snackbarInfoProduce.children[0].children[1].children[1].innerText = feature.get('tipoDeProdutor');
                        snackbarInfoProduce.children[0].children[2].children[0].children[0].children[0].children[1].innerText = feature.get('address');
                        snackbarInfoProduce.children[0].children[2].children[0].children[1].children[0].href = `http://api.whatsapp.com/send?1=pt_BR&phone=55${tel5}`;
                        snackbarInfoProduce.children[0].children[2].children[0].children[1].children[0].children[1].innerText = feature.get('telefone');
                        snackbarInfoProduce.children[0].children[3].children[0].children[0].id = feature.get('idProdutor');
                        CloseloaderToggle();
                    })
                    .catch(err => {
                        console.error(err.message);
                        CloseloaderToggle();
                        $("#info").fadeOut();
                        appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
                    })
            })
            .catch(err => {
                console.error(err.message);
                CloseloaderToggle();
                $("#info").fadeOut();
                appShowSnackBar(snackbar, 'Ocorreu um erro, por favor tente novamente');
            })
    } else {
        $("#info").fadeOut();
    }
});

btn_perfil.addEventListener('click', event => {
    let obj_id = {
        id: snackbarInfoProduce.children[0].children[3].children[0].children[0].id
    },
        str_id = JSON.stringify(obj_id);
    localStorage.setItem('idprodutor', str_id);
    window.location = 'produtor.html';
});