import Group from './components/Group';
import Contact from './components/Contact';

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
    data: function() {
        return { db }
    }
}
