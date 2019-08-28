<template>
    <div>
        <a class="button is-primary modal-button" @click="isModalActive = true, isInsertState = true, contact = { groupId: '' }">
            <span class="icon is-small">
                <i class="fas fa-plus"></i>
            </span>
            <span>ADD CONTACT</span>
        </a>

        <br /><br />

        <div class="card">
            <header class="card-header">
                <p class="card-header-title">
                    Contacts
                </p>
            </header>
            <div class="card-content">
                <div class="content">
                    <table class="table" v-if="contacts.length">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Group</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in contacts">
                                <td>{{row.firstName}} {{row.lastName}}</td>
                                <td>{{row.mobile}}</td>
                                <td>{{row.email}}</td>
                                <td>{{row.group}}</td>
                                <td>
                                    <a title="edit" class="modal-button" @click="isModalActive = true, isInsertState = false, contact = row">
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

                    <p v-if="!contacts.length">Sorry! No contacts are found.</p>
                </div>
            </div>
        </div>

        <b-modal :active.sync="isModalActive" has-modal-card>
            <div class="modal-card">
                <ValidationObserver ref="observer" v-slot="{ passes }">
                    <form @submit.prevent="passes(submit)">
                        <header class="modal-card-head">
                            <p class="modal-card-title">Contact</p>
                        </header>

                        <section class="modal-card-body">
                            <div class="field">
                                <label class="label">First Name</label>
                                <ValidationProvider name="first name" rules="required|max:15" v-slot="{ errors }">
                                    <div class="control">
                                        <input type="text" class="input" v-model="contact.firstName" />
                                    </div>
                                    <p class="help is-danger" v-text="errors[0]"></p>
                                </ValidationProvider>
                            </div>

                            <div class="field">
                                <label class="label">Last Name</label>
                                <ValidationProvider name="last name" rules="required|max:15" v-slot="{ errors }">
                                    <div class="control">
                                        <input type="text" class="input" v-model="contact.lastName" />
                                    </div>
                                    <p class="help is-danger" v-text="errors[0]"></p>
                                </ValidationProvider>
                            </div>

                            <div class="field">
                                <label class="label">Mobile</label>
                                <ValidationProvider name="mobile" rules="required" v-slot="{ errors }">
                                    <div class="control">
                                        <input type="text" class="input" v-model="contact.mobile" />
                                    </div>
                                    <p class="help is-danger" v-text="errors[0]"></p>
                                </ValidationProvider>
                            </div>

                            <div class="field">
                                <label class="label">Email</label>
                                <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
                                    <div class="control">
                                        <input type="email" class="input" v-model="contact.email" />
                                    </div>
                                    <p class="help is-danger" v-text="errors[0]"></p>
                                </ValidationProvider>
                            </div>

                            <div class="field" v-if="groups && groups.length">
                                <label class="label">Contact Group</label>
                                <ValidationProvider name="group" rules="required" v-slot="{ errors }">
                                    <div class="control">
                                        <div class="select">
                                            <select v-model="contact.groupId">
                                                <option value="">Select group</option>
                                                <option v-for="group in groups" :value="group.id">{{ group.title }}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <p class="help is-danger" v-text="errors[0]"></p>
                                </ValidationProvider>
                            </div>

                            <b-notification
                                v-if="!groups || !groups.length"
                                type="is-warning"
                                :closable="false"
                                role="alert">
                                You don't have any contact groups yet!
                            </b-notification>
                        </section>

                        <footer class="modal-card-foot">
                            <div class="field buttons is-right">
                                <div class="control">
                                    <button type="submit" class="button is-success is-outlined">
                                        <span>Save changes</span>
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </form>
                </ValidationObserver>
            </div>
        </b-modal>
    </div>
</template>

<script>

export default {
    name: 'Contact',

    props: {
        store: Object
    },

    data() {
        return {
            groups: [],
            contact: {},
            contacts: [],
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
        this.$root.$on('refresh', data => {
            this.groups = data;
            this.refresh();
        });
    },

    methods: {
        refresh() {
            this.store.toArray().then(contacts => {
                contacts.forEach(c => {
                    let group = this.groups.find(g => g.id === c.groupId);

                    c.group = group ? group.title : 'Uncategorized';
                });

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

        confirmDelete(id) {
            this.$buefy.dialog.confirm({
                title: 'Deleting contact',
                message: 'Are you sure you want to <b>delete</b> this contact? This action cannot be undone.',
                confirmText: 'Delete Contact',
                type: 'is-danger',
                hasIcon: true,
                icon: 'fa-exclamation-circle',
                iconPack: 'fas',
                onConfirm: () => {
                    this.store.delete(id).then(() => {
                        this.$buefy.toast.open({
                            message: 'Contact deleted!',
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
