// TOOLBAR

class Toolbar {
    constructor(obj) {
        this.target = obj.target;
        this.title = obj.title;
        this.theme = obj.theme;

        this.left_div = document.createElement('div');
        this.right_div = document.createElement('div');
    };

    createToolbar(position) {
        switch (position) {
            case 'top':
                let main_element = document.querySelector(this.target);
                main_element.classList.add('flex_box', 'top_toolbar');
                main_element.style.backgroundColor = this.theme.bg_color;

                this.left_div.classList.add('flex_box', 'top_toolbar_left');
                main_element.append(this.left_div);

                let left_title = document.createElement('h1');
                left_title.classList.add('unselected');
                left_title.style.color = this.theme.font_color;
                left_title.innerText = this.title;
                this.left_div.append(left_title);

                this.right_div.classList.add('flex_box', 'top_toolbar_right');
                main_element.append(this.right_div);
                break;

            default:
                break;
        }
    }
}

class TopToolbar extends Toolbar {
    constructor(obj) {
        super(obj);
        this.left_btn = obj.left_btn;
        this.right_btn = obj.right_btn;
    };

    createToolbar(position) {
        super.createToolbar(position);

        if (this.left_btn.return) {
            let return_btn = document.createElement('img');
            return_btn.id = 'return';
            return_btn.src = 'images/return.png';
            this.left_div.prepend(return_btn);
        }

        if (this.left_btn.menu) {
            let menu_btn = document.createElement('img');
            menu_btn.id = 'menu';
            menu_btn.src = 'images/menu.png';
            this.left_div.prepend(menu_btn);
        }

        for (let key in this.right_btn) {
            switch (key) {
                case 'help':
                    if (this.right_btn.help) {
                        let help_btn = document.createElement('img');
                        help_btn.id = 'help';
                        help_btn.src = 'images/help.png';
                        this.right_div.append(help_btn);
                    }
                    break;

                case 'more':
                    if (this.right_btn.more) {
                        let more_btn = document.createElement('img');
                        more_btn.id = 'more';
                        more_btn.src = 'images/more.png';
                        this.right_div.append(more_btn);
                    }
                    break;

                case 'delete':
                    if (this.right_btn.delete) {
                        let delete_btn = document.createElement('img');
                        delete_btn.id = 'delete';
                        delete_btn.src = 'images/delete.png';
                        this.right_div.append(delete_btn);
                    }
                    break;

                case 'refresh':
                    if (this.right_btn.refresh) {
                        let refresh_btn = document.createElement('img');
                        refresh_btn.id = 'refresh';
                        refresh_btn.src = 'images/refresh.png';
                        this.right_div.append(refresh_btn);
                    }
                    break;

                default:
                    break;
            }
        }
    }

    returnAddEvent(src) {
        if (this.left_btn.return) {
            let return_element = document.querySelector('#return');
            return_element.addEventListener('click', () => {
                window.location = src;
            });
        }
    }

    menuAddEvent(element) {
        if (this.left_btn.menu) {
            let main_element = document.querySelector(element);

            let body_element = document.querySelector('body');

            let menu_element = document.querySelector('#menu');
            menu_element.addEventListener('click', () => {
                if (main_element.style.display === 'none') {
                    main_element.classList.remove('left_menu_hide');
                    main_element.classList.add('left_menu_show');
                    main_element.style.display = 'flex';

                    body_element.style.overflow = 'hidden';
                }
            });

            document.addEventListener('click', (event) => {
                if (main_element.style.display === 'flex') {
                    if (event.target.id !== menu_element.id) {
                        main_element.classList.remove('left_menu_show');
                        main_element.classList.add('left_menu_hide');

                        body_element.style.overflow = 'auto';

                        setTimeout(() => { main_element.style.display = 'none'; }, 400);
                    }
                }
            });
        }
    }

    moreAddEvent(element) {
        if (this.right_btn.more) {
            let main_element = document.querySelector(element);
            let more_element = document.querySelector('#more');
            more_element.addEventListener('click', () => {
                if (main_element.style.display === 'none') {
                    main_element.classList.remove('top_more_hide');
                    main_element.classList.add('top_more_show');
                    main_element.style.display = 'flex';
                }
            });

            document.addEventListener('click', (event) => {
                if (main_element.style.display === 'flex') {
                    if (event.target.id !== more_element.id) {
                        main_element.classList.remove('top_more_show');
                        main_element.classList.add('top_more_hide');
                        setTimeout(() => { main_element.style.display = 'none'; }, 400);
                    }
                }
            });
        }
    }

    deleteAddEvent(func) {
        if (this.right_btn.delete) {
            let delete_element = document.querySelector('#delete');
            delete_element.addEventListener('click', func);
        }
    }
}

// MORE

class More {
    constructor(obj) {
        this.target = obj.target;
        this.theme = obj.theme;

        this.more_ul = document.createElement('ul');
    };

    createMore(position) {
        switch (position) {
            case 'top':
                let main_element = document.querySelector(this.target);
                main_element.classList.add('flex_box', 'top_more', 'top_more_hide');
                main_element.style.backgroundColor = this.theme.bg_color;
                main_element.style.color = this.theme.font_color;
                main_element.style.display = 'none';
                main_element.append(this.more_ul);
                break;

            default:
                break;
        }
    }
}

class TopMore extends More {
    constructor(obj) {
        super(obj);
        this.more = obj.more;

        this.more_array = [];
    };

    createMore(position) {
        super.createMore(position);
        for (let i = 0; i < this.more.length; i++) {
            let li = document.createElement('li');
            li.classList.add('flex_box', 'unselected');
            li.id = `li${i}`;
            li.innerText = this.more[i];
            this.more_ul.append(li);

            this.more_array.push(li);
        }
    }

    moreOptionsAddEvent(opt_func) {
        for (let i = 0; i < opt_func.length; i++) {
            let li_element = document.querySelector(`#${this.more_array[i].id}`);
            li_element.addEventListener('click', opt_func[i]);
        }
    }
}

// MENU

class Menu {
    constructor(obj) {
        this.target = obj.target;
        this.title = obj.title;
        this.user = obj.user;
        this.user_img = obj.user_img;
        this.theme = obj.theme;

        this.bottom_div = document.createElement('div');
    };

    createMenu(position) {
        switch (position) {
            case 'left':
                let main_element = document.querySelector(this.target);
                main_element.classList.add('flex_box', 'left_menu', 'left_menu_hide');
                main_element.style.display = 'none';

                let top_div = document.createElement('div');
                top_div.classList.add('flex_box', 'left_menu_top');
                top_div.style.backgroundColor = this.theme.bg_color;
                main_element.append(top_div);

                let left_title = document.createElement('h1');
                left_title.classList.add('unselected');
                left_title.style.color = this.theme.font_color;
                left_title.innerText = this.title;
                top_div.append(left_title);

                let center_img = document.createElement('img');
                center_img.style.border = `solid 6px ${this.theme.img_border_color}`;
                center_img.src = this.user_img;
                top_div.append(center_img);

                let left_user = document.createElement('h2');
                left_user.classList.add('unselected');
                left_user.style.color = this.theme.font_color;
                left_user.innerText = this.user;
                top_div.append(left_user);

                this.bottom_div.classList.add('flex_box', 'left_menu_bottom');
                main_element.append(this.bottom_div);
                break;

            default:
                break;
        }
    }
}

class LeftMenu extends Menu {
    constructor(obj) {
        super(obj);
        this.bottom_itens = obj.bottom_itens;
        this.bottom_itens_img = obj.bottom_itens_img;

        this.menu_array = [];
    };

    createMenu(position) {
        super.createMenu(position);
        for (let i = 0; i < this.bottom_itens.length; i++) {
            let ul = document.createElement('ul');
            this.bottom_div.append(ul);
            for (let j = 0; j < this.bottom_itens[i].length; j++) {
                let li = document.createElement('li');
                li.classList.add('flex_box', 'unselected');
                li.id = `li${i}${j}`;
                li.innerText = this.bottom_itens[i][j];
                ul.append(li);

                let img = document.createElement('img');
                img.src = this.bottom_itens_img[i][j];
                li.prepend(img);

                this.menu_array.push(li);
            }
        }
    }

    menuOptionsAddEvent(opt_func) {
        for (let i = 0; i < opt_func.length; i++) {
            let li_element = document.querySelector(`#${this.menu_array[i].id}`);
            li_element.addEventListener('click', opt_func[i]);
        }
    }
}

// PROGRESS DIALOG

class ProgressDialog {
    constructor(obj) {
        this.title = obj.title;
        this.message = obj.message;
        this.theme = obj.theme;

        this.bg_div = document.createElement('div');
    };

    createProgressDialog() {
        let body_element = document.querySelector('body');

        this.bg_div.classList.add('flex_box', 'progress_bg', 'progress_hide');
        this.bg_div.style.display = 'none';
        body_element.append(this.bg_div);

        let main_div = document.createElement('div');
        main_div.classList.add('flex_box', 'progress_div');
        main_div.style.backgroundColor = this.theme.bg_color;
        this.bg_div.append(main_div);

        let title_div = document.createElement('div');
        title_div.classList.add('flex_box', 'progress_title');
        main_div.append(title_div);

        let title = document.createElement('h1');
        title.innerText = this.title;
        title.style.color = this.theme.font_color;
        title_div.append(title);

        let message_div = document.createElement('div');
        message_div.classList.add('flex_box', 'progress_message');
        main_div.append(message_div);

        let svg = `<svg viewBox="0 0 32 32" width="32" height="32"><circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle></svg>`;
        message_div.innerHTML = svg;

        let message = document.createElement('h2');
        message.innerText = this.message;
        message.style.color = this.theme.font_color;
        message_div.append(message);
    }

    progressDialogToggle() {
        if (this.bg_div.style.display === 'none') {
            this.bg_div.classList.remove('progress_hide');
            this.bg_div.classList.add('progress_show');
            this.bg_div.style.display = 'flex';
        }
        else {
            this.bg_div.classList.remove('progress_show');
            this.bg_div.classList.add('progress_hide');
            setTimeout(() => { this.bg_div.style.display = 'none'; }, 400);
        }
    }
}