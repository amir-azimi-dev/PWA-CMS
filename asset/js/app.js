// Service Worker Registration
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js")
            // .then(registration => console.log("Service Worker registered:", registration))
            .catch(error => {
                console.error("Service Worker registration failed:", error);
            });
    });
}


// CMS
const coursesContainer = document.querySelector(".courses-list");

const getCoursesFromIndexedDB = async () => {
    const courses = await db.courses.toArray();
    return courses;
}

const fetchCourses = async () => {
    const response = await fetch("https://pwa-cms.iran.liara.run/api/courses");
    if (!response.ok) {
        const courses = await getCoursesFromIndexedDB();
        return courses;
    }

    const courses = await response.json();
    return courses;
}

const showCourses = (courses) => {
    coursesContainer.innerHTML = "";
    courses.forEach(course => {
        const courseTemplate = `
            <li class="courses-item" id="${course._id}">
              <div class="courses-img-title">
                <img
                  src="asset/images/courses/PWA.jpg"
                  alt=""
                  class="courses-img"
                />
                <h5 class="courses-name">${course.title}</h5>
              </div>
              <div class="courses-btns">
                <span onclick="editCourse('${course._id}')" class="courses-btn-edit btn">ویرایش</span>
                <span onclick="removeCourse('${course._id}')" class="courses-btn-delete btn">حذف</span>
              </div>
            </li>
        `;

        coursesContainer.insertAdjacentHTML("beforeend", courseTemplate);
    });
}

const isBGSyncAvailable = () => {
    return ("serviceWorker" in navigator) && ("SyncManager" in window);
}

const editCourse = async _id => {
    if (!isBGSyncAvailable()) {
        return alert("You must install a sync manager!!!");
    }
}

const removeCourse = async _id => {
    if (!isBGSyncAvailable()) {
        return alert("You must install a sync manager!!!");
    }

    const course = document.getElementById(_id);
    course.remove();

    await db.removedCourses.put({ _id });
    await db.courses.delete(_id);

    const sw = await navigator.serviceWorker.ready;
    sw.sync.register("remove-course");
}


window.addEventListener("load", async () => {
    const courses = await fetchCourses();
    showCourses(courses);
})