export default {
    name: 'Contact',

    props: ['store'],

    data: function() {
        return {
            groups: [],
            contact: {},
            contacts: [],
            isModalActive: false,
            isInsertState: undefined
        }
    },

    watch: {
        isModalActive: function(val) {
            if(val) {
                this.$nextTick(() => {
                    this.$validator.reset();
                });
            }
        }
    },

    mounted: function() {
        this.refresh();
        this.$root.$on('refresh', data => {
            this.groups = data;
        });
    },

    methods: {
        refresh() {
            this.store.toArray().then(contacts => {
                if(this.groups.length) {
                    contacts.forEach(c => {
                        c.group = this.groups.filter(function(g) {
                            return g.id === c.groupId;
                        })[0].title;
                    });
                }

                this.contacts = contacts;
            });
        },

        create() {
            this.store.add({
                firstName: this.contact.firstName,
                lastName: this.contact.lastName,
                email: this.contact.email,
                mobile: this.contact.mobile,
                groupId: this.contact.groupId
            }).then(() => {
                this.refresh();
                this.isModalActive = false;
            }).catch(error => console.error(error));
        },

        update() {
            this.store.put({
                id: this.contact.id,
                firstName: this.contact.firstName,
                lastName: this.contact.lastName,
                email: this.contact.email,
                mobile: this.contact.mobile,
                groupId: this.contact.groupId
            }).then(() => {
                this.refresh();
                this.isModalActive = false;
            }).catch(error => console.error(error));
        },

        remove(id) {
            if(confirm('Are you sure?')) {
                this.store.delete(id).then(() => this.refresh());
            }
        },

        submit() {
            this.$validator.validateAll().then((result) => {
                if(result) {
                    if(this.isInsertState) this.create();
                    else this.update();
                    return;
                }
            });
        }
    }
}
