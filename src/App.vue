<template>
    <div class="columns">
        <div class="column is-one-third">
            <Group :store="db.groups"/>
        </div>

        <div class="column">
            <Contact :store="db.contacts"/>
        </div>
    </div>
</template>

<script>

import Dexie from 'dexie';
import Group from './components/Group.vue';
import Contact from './components/Contact.vue';

const db = new Dexie('dexie');

db.version(1).stores({
    groups: '++id, &title',
    contacts: '++id, firstName, lastName, &mobile, &email, groupId'
});

export default {
    name: 'app',
    components: {
        Group,
        Contact
    },
    data() {
        return { db };
    }
}

</script>
