var GroupRepository = function () {};

GroupRepository.prototype = function () {
	var groups, groupNodeCache = {};

	var initGroupStore = function () {
		groups = new IDBStore({
			storeName: "group",
			dbVersion: 1,
			autoIncrement: true,
			onStoreReady: refreshGroups
		});

		["addGroup", "GroupName"].forEach(function(id) {
			groupNodeCache[id] = document.getElementById(id);
		});

		groupNodeCache.addGroup.addEventListener("click", craeteGroup);
	};
	var refreshGroups = function () {
		groups.getAll(groupList);
	};

	var groupList = function (data) {
	 	var source = $("#template-groups").html();
		template = Handlebars.compile(source);
		$("#placeholder-groups").html(template(
			{
				groups: data
			})
		);

		source = $("#template-group-dropdown").html();
		template = Handlebars.compile(source);
		$(".placeholder-group-dropdown").html(template(
			{
				groups: data
			})
		);

		$(document).trigger("CustomEvent/GroupStoreInitialized");
	};

	var craeteGroup = function () {
		var groupAddForm = $("#group-add-form");
		groupAddForm.parsley("validate");

		if(groupAddForm.parsley("isValid")) {
			var data = {};
			["GroupName"].forEach(function(key) {
				var value = groupNodeCache[key].value.trim();
				data[key] = value;
			});
			groups.put(data, function() {
				$("input").val("");
				refreshGroups();
				$(".notification-add-group").html('<div class="alert alert-success"><span>New record created.</span></div>').fadeIn(200).delay(2000).fadeOut(300);
			});
		}
	};

	var editGroup = function (group) {
		var data = {
			id: parseInt(group.Id, 10),
			GroupName: group.GroupName.trim()
		};
		var groupEditForm = $("#group-edit-form");
		groupEditForm.parsley("validate");

		if(groupEditForm.parsley("isValid")) {
			groups.put(data, refreshGroups);
			$(".notification-edit-group").html('<div class="alert alert-success"><span>The record has been updated.</span></div>').fadeIn(200).delay(2000).fadeOut(300);
		}
	};

	var deleteGroup = function (id) {
		groups.remove(id, refreshGroups);
	};

	return {
		initGroupStore: initGroupStore,
		editGroup: editGroup,
		deleteGroup: deleteGroup,
		refreshGroups: refreshGroups
	};
}();