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
                                <td>{{row.title}}</td>
                                <td>
                                    <a title="edit" class="modal-button" @click="isModalActive = true, isInsertState = false, group = row">
                                        <span class="icon is-small">
                                            <i class="far fa-edit"></i>
                                        </span>
                                    </a>
                                    <a title="delete" @click="remove(row.id)"><i class="far fa-trash-alt"></i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-if="!groups.length">No contact groups are found!</p>
                </div>
            </div>
        </div>

        <div class="modal" :class="{ 'is-active': isModalActive }">
            <div class="modal-background"></div>
            <div class="modal-content">
                <p class="title">Contact Group</p>
                <hr />

                <form @submit.prevent="submit">
                    <div class="field">
                        <label class="label">Title</label>
                        <div class="control">
                            <input type="text" class="input" name="group_title" v-model="group.title" v-validate="'required|min:4|max:15'" />
                        </div>
                        <p class="help is-danger">{{ errors.first('group_title') }}</p>
                    </div>
                    <div class="control">
                        <button type="submit" class="button is-success">
                            <span class="icon">
                                <i class="fas fa-save"></i>
                            </span>
                            <span>Save changes</span>
                        </button>
                    </div>
                </form>
            </div>
            <button class="modal-close is-large" @click="isModalActive = false"></button>
        </div>
    </div>
</template>


<script>

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
</script>
