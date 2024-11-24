const db = new Dexie("CMS");
const dbVersion = 1;

db.version(dbVersion).stores({
    courses: "_id",
    removedCourses: "_id"
});