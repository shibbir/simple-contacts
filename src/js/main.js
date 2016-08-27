(function ($) {
    var groupRepository = new GroupRepository(),
        contactRepository = new ContactRepository();

    groupRepository.initGroupStore();

    $(document).on("CustomEvent::GroupStoreModified", function () {
        contactRepository.initContactStore();
    });

    $("#ModalAddContact").on("hidden.bs.modal", function () {
        $("#contact-add-form").parsley().destroy();
    });
    $("#ModalAddContact").on("show.bs.modal", function () {
        groupRepository.refreshGroups();
    });
    $("#ModalEditContact").on("hidden.bs.modal", function () {
        $("#contact-edit-form").parsley().destroy();
    });
    $("#ModalAddContactGroup").on("hidden.bs.modal", function () {
        $("#group-add-form").parsley().destroy();
    });
    $("#ModalEditContactGroup").on("hidden.bs.modal", function () {
        $("#group-edit-form").parsley().destroy();
        groupRepository.refreshGroups();
    });

    $(document).on("click", ".btnEditGroupModal", function () {
        var $this = $(this).closest("tr");

        document.getElementById("HiddenGroupId").value = $this.data("groupId");
        document.getElementById("EditGroupName").value = $this.data("groupName");
    });

    $(document).on("click", "#editGroup", function () {
        groupRepository.editGroup();
    });

    $(document).on("click", ".btnEditContactModal", function () {
        var $this = $(this).closest("tr");

        document.getElementById("HiddenContactId").value = $this.data("contactid");
        document.getElementById("EditFirstName").value = $this.data("firstname");
        document.getElementById("EditLastName").value = $this.data("lastname");
        document.getElementById("EditMobile").value = $this.data("mobile");
        document.getElementById("EditEmail").value = $this.data("email");

        var select = document.getElementById("Group");

        for(var i = 0; i < select.options.length; i++) {
            if(select.options[i].value == $this.data("group")) {
                $("select").val($this.data("group"));
                break;
            }
        }
    });

    $(document).on("click", "#editContact", function () {
        contactRepository.editContact({
            Id: document.getElementById("HiddenContactId").value,
            FirstName: document.getElementById("EditFirstName").value,
            LastName: document.getElementById("EditLastName").value,
            Mobile: document.getElementById("EditMobile").value,
            Email: document.getElementById("EditEmail").value,
            Group: $(".updateGroupForContact select").find(":selected").val()
        });
    });

    $(document).on("click", ".btn-remove-group", function () {
        if(confirm("Are you sure you want to delete this record?")) {
            var groupId = $(this).closest("tr").data("groupId");
            groupRepository.deleteGroup(groupId);
        }
    });

    $(document).on("click", ".btn-remove-contact", function () {
        var contactId = $(this).parents("td").data("contactId");
        contactRepository.deleteContact(contactId);
    });
})(jQuery);
