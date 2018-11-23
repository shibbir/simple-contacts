export default class Group {
    constructor(store) {
        this.store = store;

        document.getElementById("btn-add-group").addEventListener("click", this.create.bind(this));
    }

    refresh() {
        Handlebars.registerHelper("disableAddContactButton", function() {
            $("#addContact").attr("disabled", true);
        });
        Handlebars.registerHelper("enableAddContactButton", function() {
            $("#addContact").removeAttr("disabled");
        });

        let source = $("#template-groups").html();
        let template = Handlebars.compile(source);

        source = $("#template-group-dropdown").html();
        template = Handlebars.compile(source);

        this.store.toArray().then(function successCallback(groups) {
            $("#placeholder-groups").html(template({ groups }));
            $(".placeholder-group-dropdown").html(template({ groups }));
        });
    }

    create() {
        let parsleyForm = $("#group-add-form").parsley();

        parsleyForm.validate();

        if(parsleyForm.isValid()) {
            this.store.toArray().then(groups => {
                let newGroup = {};
                let dataExists = false;

                newGroup["title"] = document.getElementById("group-title").value;

                // groups.forEach(function (group) {
                //     if(newGroup.title.toLowerCase() === group.title.toLowerCase()) {
                //         dataExists = true;
                //     }
                // });

                //if(!dataExists) {
                    this.store.add({
                        title: document.getElementById("group-title").value
                    });

                    this.refresh();

                    // groupStore.put(newGroup, function() {
                    //     $("input").val("");
                    //     refresh();
                    // });
                //}
            });
        }
    }

    update() {
        let parsleyForm = $("#group-edit-form").parsley();

        parsleyForm.validate();

        if(parsleyForm.isValid()) {
            groupStore.getAll(function (groups) {
                let editedGroup = {}, dataExists = false;
                editedGroup = {
                    id: +document.getElementById("edited-group-id").value,
                    title: document.getElementById("edited-group-title").value
                };

                groups.forEach(function (group) {
                    if(editedGroup.id !== group.id) {
                        if(editedGroup.title.toLowerCase() === group.title.toLowerCase()) {
                            dataExists = true;
                        }
                    }
                });

                if(!dataExists) {
                    groupStore.put(editedGroup, function() {
                        refresh();
                    });
                }
            });
        }
    }

    delete (id) {
        groupStore.remove(id, refresh);
    };
}
