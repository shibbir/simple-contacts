<template>
    <div>
        <a class="button is-primary modal-button" @click="isModalActive = true, isInsertState = true, contact = {}">
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
                                    <a title="delete" @click="remove(row.id)"><i class="far fa-trash-alt"></i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <p v-if="!contacts.length">Sorry! No contacts are found.</p>
                </div>
            </div>
        </div>

        <div class="modal" :class="{ 'is-active': isModalActive }">
            <div class="modal-background"></div>
            <div class="modal-content">
                <p class="title">Contact</p>
                <hr />

                <form @submit.prevent="submit">
                    <div class="field">
                        <label class="label">First Name</label>
                        <div class="control">
                            <input type="text" name="first_name" class="input" v-model="contact.firstName" v-validate="'required|max:15'" />
                        </div>
                        <p class="help is-danger">{{ errors.first('first_name') }}</p>
                    </div>
                    <div class="field">
                        <label class="label">Last Name</label>
                        <div class="control">
                            <input type="text" name="last_name" class="input" v-model="contact.lastName" v-validate="'required|max:15'" />
                        </div>
                        <p class="help is-danger">{{ errors.first('last_name') }}</p>
                    </div>
                    <div class="field">
                        <label class="label">Mobile</label>
                        <div class="control">
                            <input type="text" name="mobile" class="input" v-model="contact.mobile" v-validate="'required'" />
                        </div>
                        <p class="help is-danger">{{ errors.first('mobile') }}</p>
                    </div>
                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control">
                            <input type="email" name="email" class="input" v-model="contact.email" v-validate="'required|email'" />
                        </div>
                        <p class="help is-danger">{{ errors.first('email') }}</p>
                    </div>

                    <div class="field">
                        <label class="label">Contact Group</label>
                        <div class="control">
                            <div class="select">
                                <select name="group" v-model="contact.groupId" v-validate="'required'">
                                    <option value="">Select group</option>
                                    <option v-for="group in groups" :value="group.id">{{ group.title }}</option>
                                </select>
                            </div>
                        </div>
                        <p class="help is-danger">{{ errors.first('group') }}</p>
                    </div>

                    <hr />

                    <div class="field buttons is-right">
                        <div class="control">
                            <button type="submit" class="button is-success">
                                <span class="icon">
                                    <i class="fas fa-save"></i>
                                </span>
                                <span>Save changes</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <button class="modal-close is-large" @click="isModalActive = false"></button>
        </div>
    </div>
</template>


<script>

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

</script>
