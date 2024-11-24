const db = new Dexie("courses");
const dbVersion = 1;

db.version(dbVersion).stores({
    courses: "_id"
});