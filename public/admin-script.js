let allStudents = [];


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function getStudentValue(student, fields, fallback = "") {

    for (const field of fields) {

        if (
            student[field] !== undefined &&
            student[field] !== null &&
            String(student[field]).trim() !== ""
        ) {
            return String(student[field]).trim();
        }

    }

    return fallback;
}


function normalizeValue(value) {

    return String(value || "")
        .trim()
        .toLowerCase();

}


function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   GET STUDENT INFORMATION
========================================================= */

function getStudentName(student) {

    return getStudentValue(
        student,
        ["name", "full_name", "student_name"],
        "UNKNOWN STUDENT"
    );

}


function getStudentID(student) {

    return getStudentValue(
        student,
        ["student_id", "id_number", "id"],
        "NOT SET"
    );

}


function getStudentYear(student) {

    return getStudentValue(
        student,
        ["year_level", "year", "college_year"],
        "NOT SET"
    );

}


function getStudentStatus(student) {

    return getStudentValue(
        student,
        ["academic_status", "status"],
        "NOT SET"
    );

}


function getStudentGender(student) {

    return getStudentValue(
        student,
        ["gender", "sex"],
        "NOT RECORDED"
    );

}


function getStudentReligion(student) {

    return getStudentValue(
        student,
        ["religion", "religious_affiliation"],
        "NOT RECORDED"
    );

}


function getStudentEmail(student) {

    return getStudentValue(
        student,
        ["email", "student_email"],
        ""
    );

}


function getStudentPhoto(student) {

    return getStudentValue(
        student,
        ["photo_url", "photo"],
        ""
    );

}


/* =========================================================
   SUMMARY STATISTICS
========================================================= */

function updateSummaryStatistics() {

    const total = allStudents.length;

    let regular = 0;
    let irregular = 0;

    let fourthYear = 0;

    let male = 0;
    let female = 0;


    allStudents.forEach(student => {

        const status = normalizeValue(
            getStudentStatus(student)
        );

        const year = normalizeValue(
            getStudentYear(student)
        );

        const gender = normalizeValue(
            getStudentGender(student)
        );


        /* Academic Status */

        if (status === "regular") {
            regular++;
        }

        if (status === "irregular") {
            irregular++;
        }


        /* Fourth Year */

        if (
            year === "4th year" ||
            year === "4th" ||
            year === "fourth year" ||
            year === "4"
        ) {
            fourthYear++;
        }


       /* Gender */

if (
    gender === "male" ||
    gender === "m"
) {
    male++;
}

if (
    gender === "female" ||
    gender === "f"
) {
    female++;
}

    });


    const totalElement =
        document.getElementById("totalStudents");

    const regularElement =
        document.getElementById("regularStudents");

    const irregularElement =
        document.getElementById("irregularStudents");

    const fourthYearElement =
        document.getElementById("fourthYearStudents");


    if (totalElement) {
        totalElement.textContent = total;
    }

    if (regularElement) {
        regularElement.textContent = regular;
    }

    if (irregularElement) {
        irregularElement.textContent = irregular;
    }

    if (fourthYearElement) {
        fourthYearElement.textContent = fourthYear;
    }


    updateGenderChart(male, female);

    updateYearChart();

    updateReligionStatistics();

}


/* =========================================================
   YEAR LEVEL CHART
========================================================= */

function updateYearChart() {

    const yearCounts = {
        "1st Year": 0,
        "2nd Year": 0,
        "3rd Year": 0,
        "4th Year": 0
    };


    allStudents.forEach(student => {

        const year = normalizeValue(
            getStudentYear(student)
        );


        if (
            year === "1st year" ||
            year === "1st" ||
            year === "first year" ||
            year === "1"
        ) {

            yearCounts["1st Year"]++;

        }

        else if (
            year === "2nd year" ||
            year === "2nd" ||
            year === "second year" ||
            year === "2"
        ) {

            yearCounts["2nd Year"]++;

        }

        else if (
            year === "3rd year" ||
            year === "3rd" ||
            year === "third year" ||
            year === "3"
        ) {

            yearCounts["3rd Year"]++;

        }

        else if (
            year === "4th year" ||
            year === "4th" ||
            year === "fourth year" ||
            year === "4"
        ) {

            yearCounts["4th Year"]++;

        }

    });


    const maximum =
        Math.max(
            ...Object.values(yearCounts),
            1
        );


    const years = [
        {
            name: "1st Year",
            countId: "year1Count",
            barId: "year1Bar"
        },
        {
            name: "2nd Year",
            countId: "year2Count",
            barId: "year2Bar"
        },
        {
            name: "3rd Year",
            countId: "year3Count",
            barId: "year3Bar"
        },
        {
            name: "4th Year",
            countId: "year4Count",
            barId: "year4Bar"
        }
    ];


    years.forEach(year => {

        const count =
            yearCounts[year.name];


        const countElement =
            document.getElementById(year.countId);

        const barElement =
            document.getElementById(year.barId);


        if (countElement) {
            countElement.textContent = count;
        }


        if (barElement) {

            const percentage =
                (count / maximum) * 100;

            const height =
                Math.max(5, percentage);

            barElement.style.height =
                `${height}%`;

        }

    });

}


/* =========================================================
   GENDER CHART
========================================================= */

function updateGenderChart(male, female) {

    const total =
        male + female;


    const maleElement =
        document.getElementById("maleCount");

    const femaleElement =
        document.getElementById("femaleCount");

    const totalElement =
        document.getElementById("genderTotal");

    const donut =
        document.getElementById("genderDonut");


    if (maleElement) {
        maleElement.textContent = male;
    }

    if (femaleElement) {
        femaleElement.textContent = female;
    }

    if (totalElement) {
        totalElement.textContent = total;
    }


    if (!donut) {
        return;
    }


    if (total === 0) {

        donut.style.background =
            "#e2e8f0";

        return;
    }


    const maleDegrees =
        (male / total) * 360;


    donut.style.background =
        `conic-gradient(
            #002244 0deg ${maleDegrees}deg,
            #ffcc00 ${maleDegrees}deg 360deg
        )`;

}


/* =========================================================
   RELIGION STATISTICS
========================================================= */

function updateReligionStatistics() {

    const religionList =
        document.getElementById("religionList");


    if (!religionList) {
        return;
    }


    const religionCounts = {};


    allStudents.forEach(student => {

        const religion =
            getStudentReligion(student);


        const cleanReligion =
            religion.trim() || "NOT RECORDED";


        if (!religionCounts[cleanReligion]) {

            religionCounts[cleanReligion] = 0;

        }


        religionCounts[cleanReligion]++;

    });


    const sortedReligions =
        Object.entries(religionCounts)
            .sort((a, b) => b[1] - a[1]);


    if (sortedReligions.length === 0) {

        religionList.innerHTML = `
            <div class="empty-state">
                <strong>No religion data available.</strong>
                Religion information has not been recorded.
            </div>
        `;

        return;
    }


    const maximum =
        Math.max(
            ...sortedReligions.map(item => item[1]),
            1
        );


    religionList.innerHTML =
        sortedReligions.map(([religion, count]) => {

            const percentage =
                (count / maximum) * 100;


            return `
                <div class="religion-item">

                    <div class="religion-info">

                        <span class="religion-name">
                            ${escapeHTML(religion)}
                        </span>

                        <span class="religion-count">
                            ${count}
                        </span>

                    </div>

                    <div class="religion-track">

                        <div
                            class="religion-fill"
                            style="width:${percentage}%"
                        ></div>

                    </div>

                </div>
            `;

        }).join("");

}


/* =========================================================
   FILTER OPTIONS
========================================================= */

function populateFilters() {

    const yearFilter =
        document.getElementById("yearFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const genderFilter =
        document.getElementById("genderFilter");

    const religionFilter =
        document.getElementById("religionFilter");


    if (
        !yearFilter ||
        !statusFilter ||
        !genderFilter ||
        !religionFilter
    ) {
        return;
    }


    const years = new Set();
    const statuses = new Set();
    const genders = new Set();
    const religions = new Set();


    allStudents.forEach(student => {

        const year =
            getStudentYear(student);

        const status =
            getStudentStatus(student);

        const gender =
            getStudentGender(student);

        const religion =
            getStudentReligion(student);


        if (year && year !== "NOT SET") {
            years.add(year);
        }

        if (status && status !== "NOT SET") {
            statuses.add(status);
        }

        if (gender && gender !== "NOT RECORDED") {
            genders.add(gender);
        }

        if (religion && religion !== "NOT RECORDED") {
            religions.add(religion);
        }

    });


    function addOptions(select, values) {

        while (select.options.length > 1) {
            select.remove(1);
        }


        Array.from(values)
            .sort((a, b) =>
                a.localeCompare(b)
            )
            .forEach(value => {

                const option =
                    document.createElement("option");

                option.value = value;
                option.textContent = value;

                select.appendChild(option);

            });

    }


    addOptions(yearFilter, years);
    addOptions(statusFilter, statuses);
    addOptions(genderFilter, genders);
    addOptions(religionFilter, religions);

}


/* =========================================================
   DISPLAY STUDENT DIRECTORY
========================================================= */

function displayStudentDirectory(students) {

    const gridContainer =
        document.getElementById("studentGrid");

    const directoryCount =
        document.getElementById("directoryCount");


    if (!gridContainer) {
        return;
    }


    if (directoryCount) {

        directoryCount.textContent =
            `${students.length} ${
                students.length === 1
                    ? "Student"
                    : "Students"
            }`;

    }


    if (!students || students.length === 0) {

        gridContainer.innerHTML = `
            <div class="empty-state">

                <strong>
                    No students found
                </strong>

                Try changing your search or filters.

            </div>
        `;

        return;
    }


    gridContainer.innerHTML = "";


    students.forEach(student => {

        const card =
            document.createElement("div");


        card.className =
            "student-row";


        const name =
            getStudentName(student);

        const id =
            getStudentID(student);

        const year =
            getStudentYear(student);

        const status =
            getStudentStatus(student);

        const gender =
            getStudentGender(student);

        const religion =
            getStudentReligion(student);

        const email =
            getStudentEmail(student);

        const photo =
            getStudentPhoto(student);


        const normalizedStatus =
            normalizeValue(status);


        let statusBackground =
            "#f1f5f9";

        let statusColor =
            "#475569";


        if (normalizedStatus === "regular") {

            statusBackground =
                "#e9f7ed";

            statusColor =
                "#21753a";

        }

        else if (
            normalizedStatus === "irregular"
        ) {

            statusBackground =
                "#fff0e8";

            statusColor =
                "#b95019";

        }


        const safeName =
            escapeHTML(name);

        const safeId =
            escapeHTML(id);

        const safeYear =
            escapeHTML(year);

        const safeStatus =
            escapeHTML(status);

        const safeGender =
            escapeHTML(gender);

        const safeReligion =
            escapeHTML(religion);

        const safeEmail =
            escapeHTML(email);

        const safePhoto =
            escapeHTML(photo);


        const encodedStudentId =
            encodeURIComponent(id);


        card.innerHTML = `

            <div class="student-photo">

                <img
                    src="${safePhoto}"
                    alt="${safeName}"
                    onerror="
                        this.src='https://placehold.co/110x110?text=No+Photo';
                    "
                >

            </div>


            <div class="student-info">

                <div class="student-name">
                    ${safeName}
                </div>

                <div class="student-id">

                    Student ID:
                    <strong>
                        ${safeId}
                    </strong>

                    ${
                        safeEmail
                            ? `&nbsp; • &nbsp;${safeEmail}`
                            : ""
                    }

                </div>


                <div class="student-tags">

                    <span
                        class="student-tag"
                        style="
                            color:#1e3a8a;
                            background:#eff6ff;
                        "
                    >
                        ${safeYear}
                    </span>


                    <span
                        class="student-tag"
                        style="
                            color:${statusColor};
                            background:${statusBackground};
                        "
                    >
                        ${safeStatus}
                    </span>


                    <span
                        class="student-tag"
                        style="
                            color:#475569;
                            background:#f1f5f9;
                        "
                    >
                        ${safeGender}
                    </span>


                    <span
                        class="student-tag"
                        style="
                            color:#475569;
                            background:#f8fafc;
                        "
                    >
                        ${safeReligion}
                    </span>

                </div>

            </div>


            <button
                type="button"
                class="view-student-btn"
                data-student-id="${encodedStudentId}"
            >
                VIEW
            </button>

        `;


        const viewButton =
            card.querySelector(
                ".view-student-btn"
            );


        if (viewButton) {

            viewButton.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    window.location.href =
                        `edit-grades.html?id=${encodedStudentId}`;

                }
            );

        }


        card.addEventListener(
            "click",
            function () {

                window.location.href =
                    `edit-grades.html?id=${encodedStudentId}`;

            }
        );


        gridContainer.appendChild(card);

    });

}


/* =========================================================
   APPLY FILTERS
========================================================= */

function applyFilters() {

    const searchInput =
        document.getElementById("searchBox");

    const yearFilter =
        document.getElementById("yearFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const genderFilter =
        document.getElementById("genderFilter");

    const religionFilter =
        document.getElementById("religionFilter");


    const searchTerm =
        normalizeValue(
            searchInput
                ? searchInput.value
                : ""
        );


    const selectedYear =
        normalizeValue(
            yearFilter
                ? yearFilter.value
                : ""
        );


    const selectedStatus =
        normalizeValue(
            statusFilter
                ? statusFilter.value
                : ""
        );


    const selectedGender =
        normalizeValue(
            genderFilter
                ? genderFilter.value
                : ""
        );


    const selectedReligion =
        normalizeValue(
            religionFilter
                ? religionFilter.value
                : ""
        );


    const filteredStudents =
        allStudents.filter(student => {

            const name =
                normalizeValue(
                    getStudentName(student)
                );

            const id =
                normalizeValue(
                    getStudentID(student)
                );

            const email =
                normalizeValue(
                    getStudentEmail(student)
                );

            const year =
                normalizeValue(
                    getStudentYear(student)
                );

            const status =
                normalizeValue(
                    getStudentStatus(student)
                );

            const gender =
                normalizeValue(
                    getStudentGender(student)
                );

            const religion =
                normalizeValue(
                    getStudentReligion(student)
                );


            const matchesSearch =
                !searchTerm ||
                name.includes(searchTerm) ||
                id.includes(searchTerm) ||
                email.includes(searchTerm);


            const matchesYear =
                !selectedYear ||
                year === selectedYear;


            const matchesStatus =
                !selectedStatus ||
                status === selectedStatus;


            const matchesGender =
                !selectedGender ||
                gender === selectedGender;


            const matchesReligion =
                !selectedReligion ||
                religion === selectedReligion;


            return (
                matchesSearch &&
                matchesYear &&
                matchesStatus &&
                matchesGender &&
                matchesReligion
            );

        });


    displayStudentDirectory(
        filteredStudents
    );

}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearFilters() {

    const searchInput =
        document.getElementById("searchBox");

    const yearFilter =
        document.getElementById("yearFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const genderFilter =
        document.getElementById("genderFilter");

    const religionFilter =
        document.getElementById("religionFilter");


    if (searchInput) {
        searchInput.value = "";
    }

    if (yearFilter) {
        yearFilter.value = "";
    }

    if (statusFilter) {
        statusFilter.value = "";
    }

    if (genderFilter) {
        genderFilter.value = "";
    }

    if (religionFilter) {
        religionFilter.value = "";
    }


    displayStudentDirectory(
        allStudents
    );

}


/* =========================================================
   TOAST MESSAGE
========================================================= */

function showAdminToast(message) {

    const toast =
        document.getElementById("adminToast");


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================================================
   LOAD STUDENTS FROM BACKEND
========================================================= */

async function loadLiveStudents() {

    const gridContainer =
        document.getElementById("studentGrid");


    try {

        const response =
            await fetch("/api/admin/students");


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Students loaded from database:",
            result
        );


        if (!result.success) {

            throw new Error(
                result.message ||
                "Failed to load student records."
            );

        }


        allStudents =
            result.students ||
            result.data ||
            [];


        if (!Array.isArray(allStudents)) {

            allStudents = [];

        }


        updateSummaryStatistics();

        populateFilters();

        displayStudentDirectory(
            allStudents
        );


    }

    catch (error) {

        console.error(
            "Student directory loading failed:",
            error
        );


        if (gridContainer) {

            gridContainer.innerHTML = `

                <div class="empty-state">

                    <strong>
                        Unable to load student records.
                    </strong>

                    Please check the backend connection
                    and try again.

                </div>

            `;

        }


        showAdminToast(
            "Unable to load student records."
        );

    }

}


/* =========================================================
   SUMMARY CARD FILTER ACTIONS
========================================================= */

function setupSummaryCards() {

    const totalCard =
        document.getElementById(
            "totalStudentsCard"
        );

    const regularCard =
        document.getElementById(
            "regularStudentsCard"
        );

    const irregularCard =
        document.getElementById(
            "irregularStudentsCard"
        );

    const fourthYearCard =
        document.getElementById(
            "fourthYearCard"
        );


    if (totalCard) {

        totalCard.addEventListener(
            "click",
            () => {

                clearFilters();

                document
                    .querySelector(".directory-card")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    }


    if (regularCard) {

        regularCard.addEventListener(
            "click",
            () => {

                clearFilters();

                const statusFilter =
                    document.getElementById(
                        "statusFilter"
                    );

                if (statusFilter) {

                    const option =
                        Array.from(
                            statusFilter.options
                        ).find(
                            option =>
                                normalizeValue(
                                    option.value
                                ) === "regular"
                        );


                    if (option) {

                        statusFilter.value =
                            option.value;

                        applyFilters();

                    }

                }


                document
                    .querySelector(".directory-card")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    }


    if (irregularCard) {

        irregularCard.addEventListener(
            "click",
            () => {

                clearFilters();

                const statusFilter =
                    document.getElementById(
                        "statusFilter"
                    );


                if (statusFilter) {

                    const option =
                        Array.from(
                            statusFilter.options
                        ).find(
                            option =>
                                normalizeValue(
                                    option.value
                                ) === "irregular"
                        );


                    if (option) {

                        statusFilter.value =
                            option.value;

                        applyFilters();

                    }

                }


                document
                    .querySelector(".directory-card")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    }


    if (fourthYearCard) {

        fourthYearCard.addEventListener(
            "click",
            () => {

                clearFilters();

                const yearFilter =
                    document.getElementById(
                        "yearFilter"
                    );


                if (yearFilter) {

                    const option =
                        Array.from(
                            yearFilter.options
                        ).find(
                            option =>
                                normalizeValue(
                                    option.value
                                ) === "4th year"
                        );


                    if (option) {

                        yearFilter.value =
                            option.value;

                        applyFilters();

                    }

                }


                document
                    .querySelector(".directory-card")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    }

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Load students */

        loadLiveStudents();


        /* Search */

        const searchInput =
            document.getElementById(
                "searchBox"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                function () {

                    applyFilters();

                }
            );

        }


        /* Year filter */

        const yearFilter =
            document.getElementById(
                "yearFilter"
            );


        if (yearFilter) {

            yearFilter.addEventListener(
                "change",
                function () {

                    applyFilters();

                }
            );

        }


        /* Status filter */

        const statusFilter =
            document.getElementById(
                "statusFilter"
            );


        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                function () {

                    applyFilters();

                }
            );

        }


        /* Gender filter */

        const genderFilter =
            document.getElementById(
                "genderFilter"
            );


        if (genderFilter) {

            genderFilter.addEventListener(
                "change",
                function () {

                    applyFilters();

                }
            );

        }


        /* Religion filter */

        const religionFilter =
            document.getElementById(
                "religionFilter"
            );


        if (religionFilter) {

            religionFilter.addEventListener(
                "change",
                function () {

                    applyFilters();

                }
            );

        }


        /* Clear filters */

        const clearButton =
            document.getElementById(
                "clearFilters"
            );


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                function () {

                    clearFilters();

                }
            );

        }


        /* Summary cards */

        setupSummaryCards();

    }
);