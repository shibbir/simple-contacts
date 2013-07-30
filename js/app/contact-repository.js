var ContactRepository = function () {};

ContactRepository.prototype = function () {
	var contacts, contactNodeCache = {};

	var initContactStore = function () {
		contacts = new IDBStore({
			storeName: "contact",
			dbVersion: 1,
  			keyPath: 'contactid',
			autoIncrement: true,
			onStoreReady: refreshContacts
		});

		["addContact", "FirstName", "LastName", "Mobile", "Phone", "Email"].forEach(function(id) {
			contactNodeCache[id] = document.getElementById(id);
		});

		contactNodeCache.addContact.addEventListener("click", craeteContact);
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
		template = Handlebars.compile(source);
		$("#placeholder-contacts").html(template({
			contacts: data
		}));
	};

	var craeteContact = function () {
		var contactAddForm = $("#contact-add-form");
		contactAddForm.parsley("validate");

		if(contactAddForm.parsley("isValid")) {
			var data = {};
			["FirstName", "LastName", "Mobile", "Phone", "Email", "Group"].forEach(function(key) {
				if(key === "Group") {
					var value = document.getElementById(key).value.trim();
				}
				else {
					var value = contactNodeCache[key].value.trim();
				}
				data[key] = value;
			});
			contacts.put(data, function() {
				$("input").val("");
				refreshContacts();
				$(".notification-add-contact").html('<div class="alert alert-success"><span>New record created.</span></div>').fadeIn(200).delay(2000).fadeOut(300);
			});
		}
	};

	var editContact = function (contact) {
		var data = {
			contactid: parseInt(contact.Id, 10),
			FirstName: contact.FirstName.trim(),
			LastName: contact.LastName.trim(),
			Phone: contact.Phone.trim(),
			Mobile: contact.Mobile.trim(),
			Email: contact.Email.trim(),
			Group: contact.Group.trim()
		};

		var contactEditForm = $("#contact-edit-form");
		contactEditForm.parsley("validate");

		if(contactEditForm.parsley("isValid")) {
			contacts.put(data, refreshContacts);
			$(".notification-edit-contact").html('<div class="alert alert-success"><span>The record has been updated.</span></div>').fadeIn(200).delay(2000).fadeOut(300);
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