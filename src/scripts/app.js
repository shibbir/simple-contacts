import Group from './group';
import Dexie from 'dexie';

class App {
    constructor() {
        const db = new Dexie('dexie');

        db.version(1).stores({
            groups: '++id, &title',
            contacts: '++id, firstName, lastName, mobile, &email, groupId'
        });

        this.Group = new Group(db.groups);

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

let app = new App();

app.Group.refresh();
