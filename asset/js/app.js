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
            <li class="courses-item">
              <div class="courses-img-title">
                <img
                  src="asset/images/courses/PWA.jpg"
                  alt=""
                  class="courses-img"
                />
                <h5 class="courses-name">${course.title}</h5>
              </div>
              <div class="courses-btns">
                <a href="" class="courses-btn-edit btn">ویرایش</a>
                <a href="" class="courses-btn-delete btn">حذف</a>
              </div>
            </li>
        `;

        coursesContainer.insertAdjacentHTML("beforeend", courseTemplate);
    });
}

window.addEventListener("load", async () => {
    const courses = await fetchCourses();
    showCourses(courses);
})