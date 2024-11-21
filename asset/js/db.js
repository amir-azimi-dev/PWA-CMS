const db = new Dexie("my-db");
const dbVersion = 1;

db.version(dbVersion).stores({
    courses: "_id"
});