import Group from './group';

class App {
    constructor() {
        const db = new Dexie('dexie');

        db.version(1).stores({
            groups: '++id, &title',
            contacts: '++id, firstName, lastName, mobile, &email, groupId'
        });

        this.Group = new Group(db.groups);
    }
}

let app = new App();

app.Group.refresh();
