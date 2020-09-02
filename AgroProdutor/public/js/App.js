// LOADER
let div_loader = $('#loader'),

    OpenloaderToggle = () => {
        div_loader.fadeIn();
        div_loader.css({ "display": "flex" });
    },
    CloseloaderToggle = () => {
        div_loader.fadeOut();
    },

    // ROOT
    section_content_1 = $('#fixed-tab-1'), // CONTENT CONTAINER 
    section_content_2 = $('#fixed-tab-2'), // CONTENT CONTAINER
    section_content_3 = $('#fixed-tab-3'), // CONTENT CONTAINER
    section_content_4 = $('#fixed-tab-4'), // CONTENT CONTAINER

    contentToggle_1 = () => {
        if (section_content_2.css('display') === 'none') {
            section_content_1.hide();
            section_content_2.show();
        }
        else {
            section_content_1.show();
            section_content_2.hide();
        }
    },

    contentToggle_2 = () => {
        if (section_content_3.css('display') === 'none') {
            section_content_1.hide();
            section_content_3.show();
        }
        else {
            section_content_1.show();
            section_content_3.hide();
        }
    },
    contentToggle_3 = () => {
        if (section_content_4.css('display') === 'none') {
            section_content_2.hide();
            section_content_4.show();
        }
        else {
            section_content_2.show();
            section_content_4.hide();
        }
    },

    // FUNCTION TO SHOW SNACKBAR
    appShowSnackBar = (element, msg) => {
        let data = { message: msg };
        element.MaterialSnackbar.showSnackbar(data);
    },
    // FUNCTION TO SHOW DIALOG
    appShowDialog = (obj) => {
        // REMOVE DIALOG BUTTON
        obj.element.children[0].children[2].innerHTML = '';
        // ADD DIALOG CONTENT
        obj.element.children[0].children[0].innerText = obj.title;
        obj.element.children[0].children[1].children[0].innerText = obj.message;
        // CASE DIALOG TYPE OK
        if (obj.hasOwnProperty('btn_ok')) {
            let btn_ok = document.createElement('button');
            btn_ok.innerText = 'OK';
            btn_ok.addEventListener('click', () => {
                obj.btn_ok();
            });
            // ADD DIALOG BUTTON
            obj.element.children[0].children[2].appendChild(btn_ok);
            obj.element.style.display = 'flex';
            document.documentElement.style.overflow = 'hidden';
            return;
        }
        // CASE DIALOG TYPE NO AND YES
        if (obj.hasOwnProperty('btn_no') && obj.hasOwnProperty('btn_yes')) {
            let btn_no = document.createElement('button'),
                btn_yes = document.createElement('button');
            btn_no.innerText = 'NÃO';
            btn_yes.innerText = 'SIM';
            btn_no.addEventListener('click', () => {
                obj.btn_no();
            });
            btn_yes.addEventListener('click', () => {
                obj.btn_yes();
            });
            // ADD DIALOG BUTTONS
            obj.element.children[0].children[2].appendChild(btn_no);
            obj.element.children[0].children[2].appendChild(btn_yes);
            obj.element.style.display = 'flex';
            document.documentElement.style.overflow = 'hidden';
            return;
        }
    },
    // FUNCTION TO HIDE DIALOG
    appHideDialog = element => {
        element.style.display = 'none';
        document.documentElement.style.overflow = 'scroll';
    },
    // FUNCTION TO SHOW FILTER
    appShowFilter = element => {
        element.style.display = 'flex';
        document.documentElement.style.overflow = 'hidden';
    },
    // FUNCTION TO HIDE FILTER
    appHideFilter = element => {
        element.style.display = 'none';
        document.documentElement.style.overflow = 'scroll';
    },
    // FUNCTION TO GET CURRENT POSITION
    getPosition = options => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    };