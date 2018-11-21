let ContactRepository = function () {};

ContactRepository.prototype = function () {
    let contactStore, elementNodeCache = {};

    let initStore = function () {
        contactStore = new IDBStore({
            storeName: "contact",
            dbVersion: 1,
            keyPath: "id",
            autoIncrement: true,
            onStoreReady: refresh
        });

        ["btn-add-contact", "first-name", "last-name", "mobile", "email", "group-id"].forEach(function(id) {
            elementNodeCache[id] = document.getElementById(id);
        });

        elementNodeCache["btn-add-contact"].addEventListener("click", create);
    };

    function refresh () {
        contactStore.getAll(function (data) {
            let groupArray = [];

            $("#placeholder-groups table tbody tr").each(function () {
                groupArray[this.dataset.groupId] = this.dataset.groupTitle;
            });

            data.forEach(function (contact) {
                contact.groupTitle = groupArray[contact.groupId];
            });

            let source = $("#template-contacts").html();
            let template = Handlebars.compile(source);
            $("#placeholder-contacts").html(template({ contacts: data }));
        });
    }

    let create = function () {
        let parsleyForm = $("#contact-add-form").parsley();

        parsleyForm.validate();

        if(parsleyForm.isValid()) {
            let data = {
                firstName: elementNodeCache["first-name"].value,
                lastName: elementNodeCache["last-name"].value,
                email: elementNodeCache["email"].value,
                mobile: elementNodeCache["mobile"].value,
                groupId: +elementNodeCache["group-id"].value
            };

            contactStore.put(data, function() {
                refresh();
                $("input[type=text], input[type=email], select").val("");
            });
        }
    };

    let edit = function (contact) {
        let parsleyForm = $("#contact-edit-form").parsley();

        parsleyForm.validate();

        if(parsleyForm.isValid()) {
            contactStore.put(contact, refresh);
        }
    };

    let remove = function (id) {
        contactStore.remove(id, refresh);
    };

    return {
        initStore,
        edit,
        remove
    };
}();
