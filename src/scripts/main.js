(function ($) {
    let groupRepository = new GroupRepository();
    let contactRepository = new ContactRepository();

    groupRepository.init();
    contactRepository.initStore();

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

    $("#ModalAddContact").on("show.bs.modal", function () {
        groupRepository.refresh();
    });

    $("#ModalEditContactGroup").on("hidden.bs.modal", function () {
        $("#group-edit-form").parsley().destroy();
        groupRepository.refresh();
    });

    $(document).on("click", ".btnEditGroupModal", function () {
        let root = this.closest("tr");
        document.getElementById("edited-group-id").value = root.dataset.groupId;
        document.getElementById("edited-group-title").value = root.dataset.groupTitle;

        let targetEl = document.getElementById(this.dataset.target);
        targetEl.classList.add("is-active");

        $(targetEl.querySelector("form")).parsley().destroy();
    });

    $(document).on("click", "#btn-edit-group", function () {
        groupRepository.edit();
    });

    $(document).on("click", ".btnEditContactModal", function () {
        let root = this.closest("tr");

        document.getElementById("edited-contact-id").value = root.dataset.contactId;
        document.getElementById("edited-first-name").value = root.dataset.firstname;
        document.getElementById("edited-last-name").value = root.dataset.lastname;
        document.getElementById("edited-mobile").value = root.dataset.mobile;
        document.getElementById("edited-email").value = root.dataset.email;

        let select = document.getElementById("group-id");

        if(select) {
            for(let i = 0; i < select.options.length; i++) {
                if(select.options[i].value == root.dataset.groupId) {
                    $("select").val(root.dataset.groupId);
                    break;
                }
            }
        }

        let targetEl = document.getElementById(this.dataset.target);
        targetEl.classList.add("is-active");

        $(targetEl.querySelector("form")).parsley().destroy();
    });

    $(document).on("click", "#btn-edit-contact", function () {
        contactRepository.edit({
            id: +document.getElementById("edited-contact-id").value,
            firstName: document.getElementById("edited-first-name").value,
            lastName: document.getElementById("edited-last-name").value,
            mobile: document.getElementById("edited-mobile").value,
            email: document.getElementById("edited-email").value,
            groupId: +$(".updateGroupForContact select").find(":selected").val()
        });
    });

    $(document).on("click", ".btn-remove-group", function () {
        if(confirm("Are you sure?")) {
            let id = this.closest("tr").dataset.groupId;
            groupRepository.remove(+id);
        }
    });

    $(document).on("click", ".btn-remove-contact", function () {
        if(confirm("Are you sure?")) {
            let id = this.closest("tr").dataset.contactId;
            contactRepository.remove(+id);
        }
    });
})(jQuery);
