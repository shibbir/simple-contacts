export default class Group {
    constructor(store) {
        this.store = store;

        this.refresh();
        this.bindDomEvents();
    }

    bindDomEvents() {
        let _this = this;

        document.getElementById('btn-add-group').addEventListener('click', this.create.bind(this));

        $(document).on("click", ".btnEditGroupModal", function () {
            let root = this.closest("tr");
            document.getElementById("edited-group-id").value = root.dataset.groupId;
            document.getElementById("edited-group-title").value = root.dataset.groupTitle;
    
            let targetEl = document.getElementById(this.dataset.target);
            targetEl.classList.add("is-active");
    
            $(targetEl.querySelector("form")).parsley().destroy();
        });
    
        $(document).on("click", "#btn-edit-group", () => this.update());

        $(document).on("click", "#btn-remove-group", function() {
            if(confirm("Are you sure?")) {
                let id = this.closest("tr").dataset.groupId;
                _this.delete(+id);
            }
        });
    }

    refresh() {
        this.store.toArray().then(function(groups) {
            let groupTemplate = Handlebars.compile(document.getElementById('template-groups').innerHTML);
            let groupDropdownTemplate = Handlebars.compile(document.getElementById('template-group-dropdown').innerHTML);
            
            document.getElementById('placeholder-groups').innerHTML = groupTemplate({ groups });
            document.querySelector('.placeholder-group-dropdown').innerHTML = groupDropdownTemplate({ groups });
        });
    }

    create() {
        let parsleyForm = $("#group-add-form").parsley();

        parsleyForm.validate();

        if(parsleyForm.isValid()) {
            this.store.add({
                title: document.getElementById("group-title").value
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
