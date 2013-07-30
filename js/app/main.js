(function ($) {
	var groupRepository = new GroupRepository(),
		contactRepository = new ContactRepository();

	groupRepository.initGroupStore();
	$(document).on("CustomEvent/GroupStoreInitialized", function () {
		contactRepository.initContactStore();
	});

	$("#ModalContactAdd").on("hidden.bs.modal", function () {
		$("input").val("");
		$("#contact-add-form").parsley("destroy");
	});
	$("#ModalContactEdit").on("hidden.bs.modal", function () {
		$("input").val("");
		$("#contact-edit-form").parsley("destroy");
	});
	$("#ModalContactGroupAdd").on("hidden.bs.modal", function () {
		$("input").val("");
		$("#group-add-form").parsley("destroy");
	});
	$("#ModalContactGroupEdit").on("hidden.bs.modal", function () {
		$("input").val("");
		$("#group-edit-form").parsley("destroy");
	});

	$(document).on("click", ".btnEditGroupModal", function () {
		var $this = $(this).closest("tr");
		document.getElementById("HiddenGroupId").value = $this.data("groupId");
		document.getElementById("EditGroupName").value = $this.data("groupName");
	});
	$(document).on("click", "#editGroup", function () {
		groupRepository.editGroup({
			Id: document.getElementById("HiddenGroupId").value,
			GroupName: document.getElementById("EditGroupName").value
		});
	});

	$(document).on("click", ".btnEditContactModal", function () {
		var $this = $(this).closest("tr");
		document.getElementById("HiddenContactId").value = $this.data("contactid");
		document.getElementById("EditFirstName").value = $this.data("firstname");
		document.getElementById("EditLastName").value = $this.data("lastname");
		document.getElementById("EditMobile").value = $this.data("mobile");
		document.getElementById("EditPhone").value = $this.data("phone");
		document.getElementById("EditEmail").value = $this.data("email");

		groupRepository.refreshGroups();
	});
	$(document).on("click", "#editContact", function () {
		contactRepository.editContact({
			Id: document.getElementById("HiddenContactId").value,
			FirstName: document.getElementById("EditFirstName").value,
			LastName: document.getElementById("EditLastName").value,
			Mobile: document.getElementById("EditMobile").value,
			Phone: document.getElementById("EditPhone").value,
			Email: document.getElementById("EditEmail").value,
			Group: "1375133409749"
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