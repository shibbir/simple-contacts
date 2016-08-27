var ContactRepository = function () {};

ContactRepository.prototype = function () {
    var contacts, contactNodeCache = {};

    var initContactStore = function () {
        contacts = new IDBStore({
            storeName: "contact",
            dbVersion: 1,
            keyPath: "contactid",
            autoIncrement: true,
            onStoreReady: refreshContacts
        });

        ["addContact", "FirstName", "LastName", "Mobile", "Email"].forEach(function(id) {
            contactNodeCache[id] = document.getElementById(id);
        });

        contactNodeCache.addContact.addEventListener("click", createContact);
    };

    var refreshContacts = function () {
        contacts.getAll(contactList);
    };

    var contactList = function (data) {
        var groupArray = [];

        $("#placeholder-groups table tbody tr").each(function () {
            var $this = $(this);
            groupArray[$this.data("groupId")] = $this.data("groupName");
        });

        data.forEach(function (contact) {
            contact.GroupName = groupArray[contact.Group];
        });

        var source = $("#template-contacts").html();
        var template = Handlebars.compile(source);
        $("#placeholder-contacts").html(template({ contacts: data }));
    };

    var createContact = function () {
        var parsleyForm = $("#contact-add-form").parsley();

        parsleyForm.validate();

        if(parsleyForm.isValid()) {
            var data = {}, value = "";

            ["FirstName", "LastName", "Mobile", "Email", "Group"].forEach(function(key) {
                if(key === "Group") {
                    value = document.getElementById(key).value.trim();
                } else {
                    value = contactNodeCache[key].value.trim();
                }
                data[key] = value;
            });

            contacts.put(data, function() {
                refreshContacts();
                $("input[type=text], input[type=email], select").val("");
                $(".notification-add-contact").html("<div class=\"alert alert-success\"><span>New record created.</span></div>").fadeIn(200).delay(1500).fadeOut(300);
            });
        }
    };

    var editContact = function (contact) {
        var data = {
            contactid: parseInt(contact.Id, 10),
            FirstName: contact.FirstName.trim(),
            LastName: contact.LastName.trim(),
            Mobile: contact.Mobile.trim(),
            Email: contact.Email.trim(),
            Group: contact.Group
        };

        var parsleyForm = $("#contact-edit-form").parsley();

        parsleyForm.validate();

        if(parsleyForm.isValid()) {
            contacts.put(data, refreshContacts);
            $(".notification-edit-contact").html("<div class=\"alert alert-success\"><span>The record has been updated.</span></div>").fadeIn(200).delay(1500).fadeOut(300);
        }
    };

    var deleteContact = function (id) {
        contacts.remove(id, refreshContacts);
    };

    return {
        initContactStore: initContactStore,
        editContact: editContact,
        deleteContact: deleteContact
    };
}();
