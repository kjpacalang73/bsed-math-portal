// ============================================================
// 1. SAFELY ATTACH LOGIN SUBMISSION
// ============================================================

const loginForm = document.getElementById('login-form');

if (loginForm) {

    loginForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const student_id =
            document.getElementById('login_student_id').value.trim();

        const password =
            document.getElementById('login_password').value.trim();

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

                body: JSON.stringify({
                    student_id,
                    password
                })

            });

            const result = await response.json();

            if (result.success) {

                sessionStorage.setItem(
                    'student_id',
                    result.student_id
                );

                sessionStorage.setItem(
                    'isAdmin',
                    result.isAdmin
                );


                // ====================================================
                // ADMIN LOGIN
                // ====================================================

                if (result.isAdmin) {

                    alert('Welcome back, Admin!');

                    window.location.href = '/admin.html';

                }

                // ====================================================
                // STUDENT LOGIN
                // ====================================================

                else {

                    showNotification(
                        "Login Successful",
                        "Welcome back! Redirecting to your student portal.",
                        "success"
                    );

                    setTimeout(() => {

                        window.location.href = '/profile.html';

                    }, 1500);

                }

            }

            else {

                showNotification(
                    "Login Failed",
                    result.message ||
                    "The Student ID or password you entered is incorrect.",
                    "error"
                );

            }

        }

        catch (error) {

            console.error(
                'Login system communication error:',
                error
            );

            alert(
                '❌ Something went wrong connecting to the server.'
            );

        }

    });

}



// ============================================================
// 2. SAFELY ATTACH REGISTRATION SUBMISSION
//    Uses Secure Backend API Route
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    const regForm =
        document.getElementById('registration-form');


    if (regForm) {

        regForm.addEventListener(
            'submit',
            async function (e) {

                e.preventDefault();


                // ====================================================
                // PASSWORD VERIFICATION
                // ====================================================

                const password =
                    document.getElementById('reg_password').value;

                const confirmPassword =
                    document.getElementById(
                        'reg_confirm_password'
                    ).value;


                if (password !== confirmPassword) {

                    showNotification(
                        "Password Mismatch",
                        "The passwords you entered do not match. Please verify your password.",
                        "error"
                    );

                    return;
                }



                // ====================================================
                // GRAB FORM VALUES
                // ====================================================

                const email =
                    document.getElementById('reg_email').value;

                const studentIdVal =
                    document.getElementById('reg_id_number').value;

                const fullName =
                    document.getElementById('reg_name').value;

                const yearLevel =
                    document.getElementById('reg_year').value;

                const academicStatus =
                    document.getElementById('reg_status').value;

                const gender =
                    document.getElementById('reg_gender').value;

                const dob =
                    document.getElementById('reg_dob').value;

                const pob =
                    document.getElementById('reg_pob').value;

                const address =
                    document.getElementById('reg_address').value;

                const religion =
                    document.getElementById('reg_religion').value;

                const mobile =
                    document.getElementById('reg_mobile').value;

                const ethnicity =
                    document.getElementById('reg_ethnicity').value;

                const father =
                    document.getElementById('reg_father').value;

                const fatherRel =
                    document.getElementById('reg_father_rel').value;

                const mother =
                    document.getElementById('reg_mother').value;

                const motherRel =
                    document.getElementById('reg_mother_rel').value;

                const guardian =
                    document.getElementById('reg_guardian').value;

                const guardianContact =
                    document.getElementById(
                        'reg_guardian_contact'
                    ).value;

                const photoFile =
                    document.getElementById(
                        'reg_photo'
                    ).files[0];



                // ====================================================
                // PHOTO VALIDATION
                // ====================================================

                if (!photoFile) {

                    showNotification(
                        "Photo Required",
                        "Please upload a 1×1 formal photo ID to complete your registration.",
                        "error"
                    );

                    return;
                }



                // ====================================================
                // STUDENT DATA OBJECT
                // ====================================================

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



                // ====================================================
                // CREATE FORM DATA
                // ====================================================

                const formData = new FormData();

                formData.append(
                    'photo',
                    photoFile
                );

                formData.append(
                    'data',
                    JSON.stringify(studentFields)
                );



                // ====================================================
                // SEND REGISTRATION TO SERVER
                // ====================================================

                try {

                    const response =
                        await fetch('/api/register', {

                            method: 'POST',

                            body: formData

                        });


                    const result =
                        await response.json();



                    // =================================================
                    // REGISTRATION SUCCESS
                    // =================================================

                    if (result.success) {

                        const registrationForm =
                            document.getElementById(
                                'registration-form'
                            );

                        const successMessage =
                            document.getElementById(
                                'registration-success'
                            );


                        if (
                            registrationForm &&
                            successMessage
                        ) {

                            // Hide the registration form
                            registrationForm.style.display =
                                'none';


                            // Show the professional
                            // registration success screen
                            successMessage.style.display =
                                'block';


                            // Smoothly move the screen
                            // to the success message
                            successMessage.scrollIntoView({

                                behavior: 'smooth',

                                block: 'center'

                            });

                        }

                        else {

                            // Fallback notification
                            // in case the success section
                            // is unavailable

                            showNotification(
                                "Account Created Successfully",
                                "Welcome to the BSED Mathematics Program!",
                                "success"
                            );

                        }

                    }


                    // =================================================
                    // REGISTRATION ERROR
                    // =================================================

                    else {

                        showNotification(
                            "Registration Error",
                            result.message ||
                            "We were unable to create your account.",
                            "error"
                        );

                    }

                }


                // ====================================================
                // SERVER / CONNECTION ERROR
                // ====================================================

                catch (error) {

                    console.error(
                        'Registration Error:',
                        error
                    );

                    showNotification(
                        "Registration Error",
                        error.message ||
                        "Something went wrong while creating your account.",
                        "error"
                    );

                }

            }

        );

    }

});



// ============================================================
// 3. CUSTOM NOTIFICATION
// ============================================================

function showNotification(
    title,
    message,
    type = "success"
) {

    // Remove any existing notification

    const existing =
        document.querySelector(
            ".custom-notification"
        );

    if (existing) {

        existing.remove();

    }



    // Create notification container

    const notification =
        document.createElement("div");


    notification.className =
        `custom-notification ${type}`;



    // Choose icon

    const icon =
        type === "error"
            ? "fa-circle-exclamation"
            : "fa-check";



    // Notification content

    notification.innerHTML = `

        <div class="notification-icon">

            <i class="fa-solid ${icon}"></i>

        </div>


        <div class="notification-content">

            <div class="notification-title">
                ${title}
            </div>

            <div class="notification-message">
                ${message}
            </div>

        </div>


        <button
            class="notification-close"
            aria-label="Close"
            type="button"
        >

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;



    // Add notification to page

    document.body.appendChild(
        notification
    );



    // =========================================================
    // CLOSE BUTTON
    // =========================================================

    notification
        .querySelector(
            ".notification-close"
        )
        .addEventListener(
            "click",
            () => {

                notification.classList.remove(
                    "show"
                );


                setTimeout(() => {

                    if (
                        notification.isConnected
                    ) {

                        notification.remove();

                    }

                }, 300);

            }
        );



    // =========================================================
    // SHOW NOTIFICATION
    // =========================================================

    requestAnimationFrame(() => {

        notification.classList.add(
            "show"
        );

    });



    // =========================================================
    // AUTOMATICALLY CLOSE AFTER 3 SECONDS
    // =========================================================

    setTimeout(() => {

        if (
            !notification.isConnected
        ) {

            return;

        }


        notification.classList.remove(
            "show"
        );


        setTimeout(() => {

            if (
                notification.isConnected
            ) {

                notification.remove();

            }

        }, 300);

    }, 3000);

}

sessionStorage.removeItem('profile_from_admin');
sessionStorage.setItem('student_id', result.student_id);
sessionStorage.setItem('isAdmin', result.isAdmin);