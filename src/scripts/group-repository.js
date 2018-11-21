const GroupRepository = function (store) {
    this.store = store;
};

GroupRepository.prototype = function () {
    let groupStore;

    // let init = function () {
    //     groupStore = new IDBStore({
    //         storeName: "group",
    //         dbVersion: 1,
    //         keyPath: "id",
    //         autoIncrement: true,
    //         onStoreReady: refresh
    //     });

    //     document.getElementById("btn-add-group").addEventListener("click", create);
    // };

    refresh();

    document.getElementById("btn-add-group").addEventListener("click", create);

    function refresh () {
        //groupStore.getAll(function (data) {

            let data = this.store.toArray();

            Handlebars.registerHelper("disableAddContactButton", function() {
                $("#addContact").attr("disabled", true);
            });
            Handlebars.registerHelper("enableAddContactButton", function() {
                $("#addContact").removeAttr("disabled");
            });

            let source = $("#template-groups").html();
            let template = Handlebars.compile(source);
            $("#placeholder-groups").html(template({ groups: data }));

            source = $("#template-group-dropdown").html();
            template = Handlebars.compile(source);
            $(".placeholder-group-dropdown").html(template({ groups: data }));
        //});
    }

    function create () {
        let parsleyForm = $("#group-add-form").parsley();

        parsleyForm.validate();

        if(parsleyForm.isValid()) {
            groupStore.getAll(function (groups) {
                let newGroup = {};
                let dataExists = false;

                newGroup["title"] = document.getElementById("group-title").value;

                groups.forEach(function (group) {
                    if(newGroup.title.toLowerCase() === group.title.toLowerCase()) {
                        dataExists = true;
                    }
                });

                if(!dataExists) {
                    store.add({
                        title: document.getElementById("group-title").value
                    });

                    groupStore.put(newGroup, function() {
                        $("input").val("");
                        refresh();
                    });
                }
            });
        }
    }

    let edit = function (group) {
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
    };

    let remove = function (id) {
        groupStore.remove(id, refresh);
    };

    return {
        edit,
        remove,
        refresh
    };
}();
