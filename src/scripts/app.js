import Group from './group';
import Contact from './contact';

class App {
    constructor() {
        const db = new Dexie('dexie');

        db.version(1).stores({
            groups: '++id, &title',
            contacts: '++id, firstName, lastName, mobile, &email, groupId'
        });

        new Group(db.groups);
        new Contact(db.contacts);

        this.bindDomEvents();
    }

    bindDomEvents() {
        let modalButtons = document.querySelectorAll(".modal-button");

        [].forEach.call(modalButtons, function(el) {
            el.addEventListener("click", function() {
                let targetEl = document.getElementById(el.dataset.target);
                targetEl.classList.add("is-active");

                $(targetEl.querySelector("form")).parsley().destroy();
            });
        });

        let modalCloseButtons = document.querySelectorAll(".modal-close");

        [].forEach.call(modalCloseButtons, function(el) {
            el.addEventListener("click", function() {
                el.parentElement.classList.remove("is-active");
            });
        });
    }
}

new App();
