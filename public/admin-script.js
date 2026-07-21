// 🌟 FIX 1: Define the global storage array at the top so typing filters can read it later
let allStudents = [];

// Function that builds the visual layout cards exactly like before
function displayStudentDirectory(students) { 
    const gridContainer = document.getElementById('studentGrid');
    const searchInput = document.getElementById('searchBox');

    // 🌟 FIX 2: If the search box is completely empty, wipe the screen and stop immediately!
    if (!searchInput || searchInput.value.trim() === "") {
        gridContainer.innerHTML = "";
        return;
    }

    gridContainer.innerHTML = "";
    gridContainer.style.display = "flex";
    gridContainer.style.flexDirection = "column";
    gridContainer.style.gap = "1.5rem";

    if (!students || students.length === 0) { 
        gridContainer.innerHTML = `<p style="color: white; text-align: center; font-style: italic; opacity: 0.8;">No registered students found.</p>`;
        return;
    }

    students.forEach(student => {
        const card = document.createElement('div');
        
        card.style.backgroundColor = "white";
        card.style.borderRadius = "12px";
        card.style.padding = "2rem";
        card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
        card.style.display = "flex";
        card.style.alignItems = "center";
        card.style.gap = "2rem";
        card.style.cursor = "pointer";
        card.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
        card.style.border = "1px solid rgba(0, 0, 0, 0.05)";

        card.onmouseenter = () => {
            card.style.transform = "translateY(-2px)";
            card.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
        };
        card.onmouseleave = () => {
            card.style.transform = "translateY(0)";
            card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
        };

        card.onclick = () => {
    // This now navigates to the edit page and sends the student's ID along
        window.location.href = `edit-grades.html?id=${student.student_id}`;
        };

        const name = student.name || 'UNKNOWN';
        const id = student.student_id || 'NOT SET';
        const year = student.year_level || 'NOT SET';
        const status = student.academic_status || 'NOT SET';
        const photo = student.photo_url || '';

        const statusColor = status === 'REGULAR' ? '#2e7d32' : '#d84315';
        const statusBg = status === 'REGULAR' ? '#e8f5e9' : '#fbe9e7';

        card.innerHTML = `
            <div style="width: 110px; height: 110px; min-width: 110px; border-radius: 8px; overflow: hidden; border: 3px solid #334e68; background: #fafafa; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                <img src="${photo}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://placehold.co/110x110?text=No+Photo'">
            </div>

            <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 0.35rem; font-family: 'Segoe UI', Arial, sans-serif;">
                <div style="font-size: 1.35rem; font-weight: 800; color: #002244; letter-spacing: 0.5px; text-transform: uppercase;">
                    ${name}
                </div>
                
                <div style="font-size: 0.9rem; color: #444; font-weight: 500;">
                    Student ID: <span style="font-weight: 700; color: #111;">${id}</span>
                </div>
                
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.4rem;">
                    <span style="font-size: 0.75rem; color: #1e3a8a; background: #eff6ff; border: 1px solid #bfdbfe; padding: 4px 10px; border-radius: 9999px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${year}
                    </span>
                    <span style="font-size: 0.75rem; color: ${statusColor}; background: ${statusBg}; border: 1px solid rgba(0,0,0,0.05); padding: 4px 10px; border-radius: 9999px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${status}
                    </span>
                </div>
            </div>
        `;

        gridContainer.appendChild(card);
    });
}

// Fetch active database data directly from your backend route
async function loadLiveStudents() {
    try {
        const response = await fetch('http://localhost:3000/api/admin/students');
        const result = await response.json();

        console.log("Students loaded from database:", result);

        if (result.success) {
            // 🌟 FIX 3: Store data in our global array variables without triggering the card builder layout yet!
            allStudents = result.students || result.data || [];
            document.getElementById('studentGrid').innerHTML = ""; 
        } else {
            document.getElementById('studentGrid').innerHTML = `
                <p style="color: #ffcc00; text-align: center; font-weight: bold;">❌ Failed to load directory: ${result.message}</p>
            `;
        }
    } catch (error) {
        console.error("Fetch process failed:", error);
        document.getElementById('studentGrid').innerHTML = `
            <p style="color: #ffcc00; text-align: center; font-weight: bold;">❌ Connection error with backend server.</p>
        `;
    }
}

// Fire the database load event and wire up the elastic layout transitions
document.addEventListener("DOMContentLoaded", () => {
    loadLiveStudents();

    const searchInput = document.getElementById('searchBox');
    const searchContainer = document.getElementById('searchContainer');
    const welcomeBlock = document.getElementById('welcomeBlock');
    const gridContainer = document.getElementById('studentGrid');

    if (searchInput) {
        
        // 🌟 ACTION 1: Move to the top when the user clicks inside the search field
        searchInput.addEventListener('focus', () => {
            searchContainer.style.minHeight = "0vh"; 
            searchContainer.style.paddingTop = "2rem";
            searchContainer.style.paddingBottom = "1rem";
        });

        // 🌟 ACTION 2: Return to center if user clicks away AND the search box is empty
        searchInput.addEventListener('blur', () => {
            if (searchInput.value.trim() === "") {
                // 🌟 FIX 4: Changes back to 80vh so it returns to the true center layout matching your HTML
                searchContainer.style.minHeight = "80vh";
                searchContainer.style.paddingTop = "2rem";
                searchContainer.style.paddingBottom = "2rem";
                gridContainer.innerHTML = ""; 
            }
        });

        // 🌟 ACTION 3: Handle dynamic typing filters
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === "") {
                gridContainer.innerHTML = "";
                return;
            }

            const filteredStudents = allStudents.filter(student => {
                const nameMatch = (student.name || '').toLowerCase().includes(searchTerm);
                const idMatch = (student.student_id || '').toLowerCase().includes(searchTerm);
                return nameMatch || idMatch;
            });
            
            displayStudentDirectory(filteredStudents);
        });
    }
});