<template>
    <div>
        <a class="button is-primary modal-button" @click="isModalActive = true, isInsertState = true, group = {}">
            <span class="icon is-small">
                <i class="fas fa-plus"></i>
            </span>
            <span>ADD GROUP</span>
        </a>

        <br /><br />

        <div class="card">
            <header class="card-header">
                <p class="card-header-title">
                    Contact Group
                </p>
            </header>
            <div class="card-content">
                <div class="content">
                    <table class="table" v-if="groups.length">
                        <thead>
                            <tr>
                                <th>Group Title</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in groups">
                                <td v-text="row.title"></td>
                                <td>
                                    <a title="edit" class="modal-button" @click="isModalActive = true, isInsertState = false, group = row">
                                        <span class="icon is-small">
                                            <i class="far fa-edit"></i>
                                        </span>
                                    </a>
                                    <a title="delete" @click="confirmDelete(row.id)">
                                        <span class="icon has-text-danger">
                                            <i class="fas fa-ban"></i>
                                        </span>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-if="!groups.length">No contact groups are found!</p>
                </div>
            </div>
        </div>

        <b-modal :active.sync="isModalActive" has-modal-card>
            <div class="modal-card">
                <ValidationObserver ref="observer" v-slot="{ passes }">
                    <form @submit.prevent="passes(submit)">
                        <header class="modal-card-head">
                            <p class="modal-card-title">Contact Group</p>
                        </header>

                        <section class="modal-card-body">
                            <div class="field">
                                <label class="label">Title</label>
                                <ValidationProvider name="title" rules="required|min:4|max:15" v-slot="{ errors }">
                                    <div class="control is-clearfix">
                                        <input type="text" class="input" v-model="group.title" />
                                    </div>
                                    <p class="help is-danger" v-text="errors[0]"></p>
                                </ValidationProvider>
                            </div>
                        </section>

                        <footer class="modal-card-foot">
                            <button type="submit" class="button is-success">
                                <span>Save changes</span>
                            </button>
                        </footer>
                    </form>
                </ValidationObserver>
            </div>
        </b-modal>
    </div>
</template>

<script>

export default {
    name: 'Group',

    props: {
        store: Object
    },

    data() {
        return {
            group: {},
            groups: [],
            isModalActive: false,
            isInsertState: undefined
        }
    },

    watch: {
        isModalActive(val) {
            if(val) {
                this.$nextTick(() => {
                    this.$refs.observer.reset();
                });
            }
        }
    },

    mounted() {
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
                this.$buefy.toast.open({
                    message: 'New contact group created!',
                    type: 'is-info'
                });
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

        confirmDelete(id) {
            this.$buefy.dialog.confirm({
                title: 'Deleting group',
                message: 'Are you sure you want to <b>delete</b> this group? This action cannot be undone.',
                confirmText: 'Delete Group',
                type: 'is-danger',
                hasIcon: true,
                icon: 'fa-exclamation-circle',
                iconPack: 'fas',
                onConfirm: () => {
                    this.store.delete(id).then(() => {
                        this.$buefy.toast.open({
                            message: 'Group deleted!',
                            type: 'is-info'
                        });
                        this.refresh();
                    });
                }
            })
        },

        submit() {
            if(this.isInsertState) this.create();
            else this.update();
        }
    }
}
</script>
