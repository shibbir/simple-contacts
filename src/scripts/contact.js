export default class Contact {
    constructor(store) {
        this.store = store;
        this.elementNodeCache = {};

        this.refresh();
        this.bindDomEvents();
    }

    bindDomEvents() {
        let _this = this;

        ["first-name", "last-name", "mobile", "email", "group-id"].forEach(function(id) {
            _this.elementNodeCache[id] = document.getElementById(id);
        });

        document.getElementById('btn-add-contact').addEventListener('click', this.create.bind(this));
    }

    refresh() {
        this.store.toArray().then(function(contacts) {
            
            let template = Handlebars.compile(document.getElementById('template-contacts').innerHTML);
            document.getElementById('placeholder-contacts').innerHTML = template({ contacts });
        });
    }

    create() {
        let parsleyForm = $('#contact-add-form').parsley();

        parsleyForm.validate();

        if(parsleyForm.isValid()) {
            this.store.add({
                firstName: this.elementNodeCache['first-name'].value,
                lastName: this.elementNodeCache['last-name'].value,
                email: this.elementNodeCache['email'].value,
                mobile: this.elementNodeCache['mobile'].value,
                groupId: +this.elementNodeCache['group-id'].value
            }).then(() => this.refresh()).catch(error => console.error(error));
        }
    }

    update() {
        let parsleyForm = $("#group-edit-form").parsley();

        parsleyForm.validate();

        if(parsleyForm.isValid()) {
            this.store.put({
                id: +document.getElementById("edited-group-id").value,
                title: document.getElementById("edited-group-title").value
            }).then(() => this.refresh()).catch(error => console.error(error));
        }
    }

    delete(id) {
        this.store.delete(id).then(() => this.refresh());
    }
}
