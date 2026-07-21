// 1. SAFELY ATTACH LOGIN SUBMISSION
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Updated this line to match your exact HTML ID: "login_student_id"
        const student_id = document.getElementById('login_student_id').value.trim();
        const password = document.getElementById('login_password').value.trim();

        if (!student_id || !password) {
            alert('Please fill in both fields.');
            return;
        }

        try {
            // Send the login data to our Node.js server endpoint
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ student_id, password })
            });

            const result = await response.json();

            if (result.success) {
                // Store the logged-in user details in sessionStorage
                sessionStorage.setItem('student_id', result.student_id);
                sessionStorage.setItem('isAdmin', result.isAdmin);

                // Smart Redirect depending on database privilege status
                if (result.isAdmin) {
                    alert('Welcome back, Admin!');
                    window.location.href = '/admin.html'; 
                } else {
                    alert('Login successful!');
                    window.location.href = '/profile.html'; 
                }
            } else {
                // Show custom validation or database mismatches
                alert("❌ Login failed: " + result.message);
            }
        } catch (error) {
            console.error('Login system communication error:', error);
            alert('❌ Something went wrong connecting to the server.');
        }
    });
}

// 2. SAFELY ATTACH REGISTRATION SUBMISSION
const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Password Verification Validation
        const password = document.getElementById('reg_password').value;
        const confirmPassword = document.getElementById('reg_confirm_password').value;

        if (password !== confirmPassword) {
            alert("❌ Passwords do not match! Please verify your password entry again.");
            return;
        }

        // Gather form values
        const studentFields = {
            email: document.getElementById('reg_email').value,
            id_number: document.getElementById('reg_id_number').value,
            name: document.getElementById('reg_name').value,
            year: document.getElementById('reg_year').value,
            status: document.getElementById('reg_status').value,
            gender: document.getElementById('reg_gender').value,
            dob: document.getElementById('reg_dob').value,
            pob: document.getElementById('reg_pob').value,
            address: document.getElementById('reg_address').value,
            religion: document.getElementById('reg_religion').value,
            mobile: document.getElementById('reg_mobile').value,
            ethnicity: document.getElementById('reg_ethnicity').value,
            father: document.getElementById('reg_father').value,
            father_rel: document.getElementById('reg_father_rel').value,
            mother: document.getElementById('reg_mother').value,
            mother_rel: document.getElementById('reg_mother_rel').value,
            guardian: document.getElementById('reg_guardian').value,
            guardian_contact: document.getElementById('reg_guardian_contact').value,
            password: password
        };

        // Prepare Form Data for File Upload
        const formData = new FormData();
        const photoFile = document.getElementById('reg_photo').files[0];
        
        if (!photoFile) {
            alert("❌ Please upload a 1x1 formal photo ID to complete registration.");
            return;
        }

        formData.append('photo', photoFile);
        formData.append('data', JSON.stringify(studentFields));

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert("✨ Registration successful!");
                window.location.href = "/"; // Send them back to the login page
            } else {
                alert("❌ Registration failed: " + result.message);
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("❌ Something went wrong connecting to the server.");
        }
    });
}