<template>
    <div>
        <a class="button is-primary modal-button is-outlined" @click="isModalActive = true, isInsertState = true, group = {}">
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
                                    <a title="delete" @click="remove(row.id)">
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
                <ValidationObserver ref="observer" v-slot="{ validate }">
                    <form @submit.prevent="validate().then(submit)">
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
                            <button type="submit" class="button is-success is-outlined">
                                <span class="icon">
                                    <i class="fas fa-save"></i>
                                </span>
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
            if(this.isInsertState) this.create();
            else this.update();
        }
    }
}
</script>
