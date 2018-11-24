export default {
    name: 'Group',

    props: ['store'],

    data: function() {
        return {
            group: {},
            groups: [],
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
    },

    methods: {
        refresh() {
            this.store.toArray().then(groups => {
                this.groups = groups;
                this.$root.$emit('refresh', groups);
            });
        },

        create() {
            this.store.add({
                title: this.group.title
            }).then(() => {
                this.refresh();
                this.isModalActive = false;
            }).catch(error => console.error(error));
        },

        update() {
            this.store.put({
                id: this.group.id,
                title: this.group.title
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
