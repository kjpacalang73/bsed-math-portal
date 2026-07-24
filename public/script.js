// 1. SAFELY ATTACH LOGIN SUBMISSION
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const student_id = document.getElementById('login_student_id').value.trim();
        const password = document.getElementById('login_password').value.trim();

        if (!student_id || !password) {
            alert('Please fill in both fields.');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ student_id, password })
            });

            const result = await response.json();

            if (result.success) {
                sessionStorage.setItem('student_id', result.student_id);
                sessionStorage.setItem('isAdmin', result.isAdmin);

                if (result.isAdmin) {
                    alert('Welcome back, Admin!');
                    window.location.href = '/admin.html'; 
                } else {
                    alert('Login successful!');
                    window.location.href = '/profile.html'; 
                }
            } else {
                alert("❌ Login failed: " + result.message);
            }
        } catch (error) {
            console.error('Login system communication error:', error);
            alert('❌ Something went wrong connecting to the server.');
        }
    });
}

// 2. SAFELY ATTACH REGISTRATION SUBMISSION (Using Secure Backend API Route)
document.addEventListener('DOMContentLoaded', function () {
    const regForm = document.getElementById('registration-form');

    if (regForm) {
        regForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Password Verification Validation
            const password = document.getElementById('reg_password').value;
            const confirmPassword = document.getElementById('reg_confirm_password').value;

            if (password !== confirmPassword) {
                alert("❌ Passwords do not match! Please verify your password entry again.");
                return;
            }

            // Grab Form Values
            const email = document.getElementById('reg_email').value;
            const studentIdVal = document.getElementById('reg_id_number').value;
            const fullName = document.getElementById('reg_name').value;
            const yearLevel = document.getElementById('reg_year').value;
            const academicStatus = document.getElementById('reg_status').value;
            const gender = document.getElementById('reg_gender').value;
            const dob = document.getElementById('reg_dob').value;
            const pob = document.getElementById('reg_pob').value;
            const address = document.getElementById('reg_address').value;
            const religion = document.getElementById('reg_religion').value;
            const mobile = document.getElementById('reg_mobile').value;
            const ethnicity = document.getElementById('reg_ethnicity').value;
            const father = document.getElementById('reg_father').value;
            const fatherRel = document.getElementById('reg_father_rel').value;
            const mother = document.getElementById('reg_mother').value;
            const motherRel = document.getElementById('reg_mother_rel').value;
            const guardian = document.getElementById('reg_guardian').value;
            const guardianContact = document.getElementById('reg_guardian_contact').value;
            const photoFile = document.getElementById('reg_photo').files[0];

            if (!photoFile) {
                alert("❌ Please upload a 1x1 formal photo ID to complete registration.");
                return;
            }

            const studentFields = {
                email: email,
                id_number: studentIdVal,
                name: fullName,
                year: yearLevel,
                status: academicStatus,
                gender: gender,
                dob: dob,
                pob: pob,
                address: address,
                religion: religion,
                mobile: mobile,
                ethnicity: ethnicity,
                father: father,
                father_rel: fatherRel,
                mother: mother,
                mother_rel: motherRel,
                guardian: guardian,
                guardian_contact: guardianContact,
                password: password
            };

            const formData = new FormData();
            formData.append('photo', photoFile);
            formData.append('data', JSON.stringify(studentFields));

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Success! Redirect directly to the profile page
                    alert('✨ Account successfully created!');
                    window.location.href = 'profile.html';
                } else {
                    alert('Registration Error: ' + result.message);
                }

            } catch (error) {
                alert('Registration Error: ' + error.message);
                console.error(error);
            }
        });
    }
});