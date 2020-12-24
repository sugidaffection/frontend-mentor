window.item = [];

class Filter {
    static element() {
        if (!window.filter) {
            const el = document.createElement('div');
            el.className = 'filter card';
            el.innerHTML = `
            <div class="tag col" id="filter"></div>
            `
            const close = document.createElement('a');
            close.className = 'filter__clear';
            close.href = '#';
            close.innerText = 'Close';
            close.addEventListener('click', () => {
                this.clearTag();
            })
            el.append(close);
            document.querySelector('.container').prepend(el);
        };
    }

    static hasTag(tag) {
        if (window.filter) {
            return filter.querySelector(`.tag__item[tag-name=${tag}`);
        }
    }

    static addTag(tag) {
        const tag_item = document.createElement('div');
        tag_item.className = 'tag__item';
        tag_item.setAttribute('tag-name', tag);
        tag_item.innerText = tag;
        const tag_close = document.createElement('div');
        tag_close.className = 'tag__close';
        tag_close.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                                <path fill="#FFF" fill-rule="evenodd"
                                    d="M11.314 0l2.121 2.121-4.596 4.596 4.596 4.597-2.121 2.121-4.597-4.596-4.596 4.596L0 11.314l4.596-4.597L0 2.121 2.121 0l4.596 4.596L11.314 0z" />
                                </svg>`;
        tag_close.addEventListener('click', (e) => this.removeTag(tag_item))
        tag_item.append(tag_close);
        if (window.filter)
            filter.append(tag_item);
    }

    static selectTag(tag) {
        this.element();

        if (!this.hasTag(tag)) {
            this.addTag(tag);

            const cards = card_list.querySelectorAll('.card');
            for (let card of cards) {
                const role = card.getAttribute('data-role');
                const level = card.getAttribute('data-level');
                const languages = card.getAttribute('data-languages');
                const tools = card.getAttribute('data-tools');

                if (!(role.includes(tag) || level.includes(tag) || languages.includes(tag) || tools.includes(tag))) {
                    card.remove();
                }
            }

        }
    }

    static removeTag(tag) {
        tag.remove();

        if (window.filter) {
            let tags = [];

            if (!filter.hasChildNodes()) {
                filter.parentElement.remove();
            } else {
                tags = [...filter.querySelectorAll('.tag__item')];
            }

            tags = tags.map(tag => tag.innerText.trim())
            let items = item.filter(item => tags.every(tag => item.tags.includes(tag))).map(i => i.element);

            if (tags.length == 0) {
                card_list.innerHTML = '';
                items = item.sort((a, b) => a.id - b.id).map(i => i.element);
            }
            card_list.append(...items)
        }

    }

    static clearTag() {
        filter.parentElement.remove();
        if (window.item) {
            let items = window.item.sort((a, b) => a.id - b.id).map(i => i.element);
            card_list.innerHTML = '';
            card_list.append(...items)
        }

    }
}

class Item {

    constructor(data) {
        this.id = data.id;
        this.company = data.company;
        this.logo = data.logo;
        this.new = data.new;
        this.featured = data.featured;
        this.position = data.position;
        this.role = data.role;
        this.level = data.level;
        this.postedAt = data.postedAt;
        this.contract = data.contract;
        this.location = data.location;
        this.languages = data.languages;
        this.tools = data.tools;
        const languages = this.languages;
        const tools = this.tools;
        this.tags = [this.role, this.level, ...languages, ...tools]

        this.element = this.createElement();
    }

    createElement() {
        const card = document.createElement('div');
        card.className = 'card'
        card.setAttribute('data-role', this.role);
        card.setAttribute('data-level', this.level);
        card.setAttribute('data-languages', this.languages.join(', '));
        card.setAttribute('data-tools', this.tools.join(', '));

        const logo = new Image();
        logo.className = 'card__logo'
        logo.src = this.logo
        logo.alt = this.company

        const row1 = document.createElement('div');
        row1.className = 'card__row';
        row1.innerHTML = `<div class="card__col card__company">${this.company}</div>`

        if (this.new) { row1.innerHTML += `<div class="card__col badge badge-primary">New!</div>` }
        if (this.featured) {
            row1.innerHTML += `<div class="card__col badge badge-secondary">Featured!</div>`;
            card.classList.add('card-active')
        }

        const row2 = document.createElement('div');
        row2.className = 'card__row';
        row2.innerHTML = `<a href="#" class="card__col card__position">Senior Frontend Developer</a>`

        const row3 = document.createElement('div');
        row3.className = 'card__row';
        row3.innerHTML = `<ul class="card__col card__list">
                            <li class="card__list__item">${this.postedAt}</li>
                            <li class="card__list__item">${this.contract}</li>
                            <li class="card__list__item">${this.location}</li>
                        </ul>`

        const row4 = document.createElement('div');
        row4.className = 'card__row tag';



        for (let tag of this.tags) {
            const tagEl = document.createElement('div');
            tagEl.className = 'card__col tag__item';
            tagEl.innerText = tag;
            tagEl.addEventListener('click', () => Filter.selectTag(tag))
            row4.append(tagEl);
        }

        card.append(logo, row1, row2, row3, row4);

        return card;
    }
}

function fetchData() {
    fetch('./data.json')
        .then((resp) => {
            if (resp.ok) {
                return resp.json();
            }

            throw new Error('Response error with status ' + resp.status);
        })
        .then((result) => {
            item = [...item, ...result.filter(data => !item.find(i => i.id == data.id)).map(item => new Item(item))];
            card_list.append(...item.map(d => d.element));
        })
        .catch((error) => {
            console.error(error);
        })
}


document.addEventListener('DOMContentLoaded', () => {
    fetchData();
})

