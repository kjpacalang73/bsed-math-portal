require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Connect to your free Supabase database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const upload = multer({ storage: multer.memoryStorage() });

// 1. Announcements Route
app.get('/announcements', async (req, res) => {
    try {
        const { data: announcements, error } = await supabase
            .from('Announcements')
            .select('*');

        if (error) throw error;

        let announcementCards = '';
        if (announcements.length === 0) {
            announcementCards = `<p style="text-align:center; color:#666;">No recent announcements available.</p>`;
        } else {
            announcements.forEach(item => {
                announcementCards += `
                    <div class="card">
                        <div class="card-date">Posted on ${new Date(item.created_at).toLocaleDateString()}</div>
                        <h2 class="card-title">${item.title}</h2>
                        <p class="card-content">${item.content}</p>
                    </div>
                `;
            });
        }

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BSED Mathematics Department Portal</title>
                <style>
                    :root {
                        --act-blue: #002244;    
                        --act-gold: #ffcc00;    
                        --act-card-blue: rgba(0, 45, 90, 0.85);
                        --bg-color: #f4f6f9;    
                    }
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        background-color: var(--bg-color);
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }
                    header {
                        position: relative;
                        background-image: linear-gradient(rgba(0, 34, 68, 0.85), rgba(0, 34, 68, 0.85)), 
                                          url('https://lh3.googleusercontent.com/d/1mE3LrHYGmFZ0jgP9k4giyPypXAKnMjLl');
                        background-size: cover;
                        background-position: center;
                        color: white;
                        padding: 2rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 5px solid var(--act-gold);
                    }
                    .header-left {
                        display: flex;
                        align-items: center;
                        gap: 1.2rem;
                    }
                    .logo-circle {
                        width: 75px;
                        height: 75px;
                        background-color: #fff;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 2px solid var(--act-gold);
                        overflow: hidden;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    .logo-circle img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    .title-area h1 {
                        font-family: 'Georgia', serif;
                        margin: 0;
                        font-size: 1.7rem;
                        font-weight: normal;
                        letter-spacing: 0.5px;
                        text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
                    }
                    .title-area .sub-1 {
                        margin: 2px 0 0 0;
                        font-size: 0.85rem;
                        color: #ddd;
                        font-style: italic;
                    }
                    .title-area .sub-2 {
                        margin: 4px 0 0 0;
                        font-size: 0.8rem;
                        color: var(--act-gold);
                        font-weight: bold;
                        letter-spacing: 0.5px;
                    }
                    .header-right {
                        text-align: right;
                        font-size: 0.78rem;
                        color: #eee;
                        line-height: 1.6;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                    }
                    main {
                        max-width: 900px;
                        margin: 3rem auto;
                        padding: 0 1.5rem;
                        min-height: 40vh;
                    }
                    .section-title {
                        font-size: 1.4rem;
                        color: var(--act-blue);
                        font-weight: bold;
                        border-bottom: 2px solid #ddd;
                        padding-bottom: 0.5rem;
                        margin-bottom: 2rem;
                        text-transform: uppercase;
                    }
                    .card {
                        background: white;
                        border-radius: 6px;
                        padding: 1.8rem;
                        margin-bottom: 1.5rem;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                        border-left: 5px solid var(--act-blue);
                    }
                    .card-date {
                        font-size: 0.8rem;
                        color: #777;
                        margin-bottom: 0.5rem;
                    }
                    .card-title {
                        margin: 0 0 0.8rem 0;
                        color: var(--act-blue);
                        font-size: 1.3rem;
                    }
                    .card-content {
                        margin: 0;
                        color: #444;
                        font-size: 1rem;
                    }
                    footer {
                        position: relative;
                        background-image: linear-gradient(rgba(0, 34, 68, 0.9), rgba(0, 34, 68, 0.9)), 
                                          url('https://lh3.googleusercontent.com/d/1g9ZQn60WdVOU6TyallLidFy7iKqsX0bu');
                        background-size: cover;
                        background-position: center;
                        color: white;
                        padding: 3rem 2rem 2rem 2rem;
                        margin-top: 5rem;
                        text-align: center;
                    }
                    .pillars-container {
                        max-width: 1100px;
                        margin: 0 auto 2.5rem auto;
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 1rem;
                        position: relative;
                        z-index: 2;
                    }
                    .pillar-box {
                        background-color: var(--act-card-blue);
                        border: 1px solid rgba(255,255,255,0.1);
                        border-radius: 6px;
                        padding: 1.2rem;
                        text-align: center;
                        backdrop-filter: blur(3px);
                    }
                    .pillar-title {
                        color: var(--act-gold);
                        font-weight: bold;
                        font-size: 0.95rem;
                        margin-bottom: 0.5rem;
                        text-transform: uppercase;
                    }
                    .pillar-text {
                        font-size: 0.78rem;
                        color: #e0e8f0;
                        line-height: 1.4;
                        margin: 0;
                    }
                    .motto {
                        font-family: 'Georgia', serif;
                        font-style: italic;
                        color: var(--act-gold);
                        font-size: 1.4rem;
                        margin-top: 1rem;
                        position: relative;
                        z-index: 2;
                    }
                </style>
            </head>
            <body>
                <header>
                    <div class="header-left">
                        <div class="logo-circle">
                            <img src="https://lh3.googleusercontent.com/d/1s1s802Y7n5PgAX4dLZ6cZzRhYhN_ofTA" alt="ACTI Logo" onerror="this.src='https://placehold.co/100?text=ACT+Logo'">
                        </div>
                        <div class="title-area">
                            <h1>Adventist College of Technology, Inc.</h1>
                            <div class="sub-1">(Formerly: Matutum View Christian College)</div>
                            <div class="sub-2">An Institution of Faith and Skills Development</div>
                        </div>
                    </div>
                    <div class="header-right">
                        <div>📍 Prk. 4, Brgy. Acmonan, Tupi, South Cotabato</div>
                        <div>🌐 acti-edu.ph</div>
                        <div>👥 Adventist College of Technology, Inc. - ACTI Community</div>
                    </div>
                </header>

                <main>
                    <div class="section-title">BSED Mathematics Department Updates</div>
                    ${announcementCards}
                </main>

                <footer>
                    <div class="pillars-container">
                        <div class="pillar-box">
                            <div class="pillar-title">Vision</div>
                            <p class="pillar-text">Producing competent graduates in service to God and humanity.</p>
                        </div>
                        <div class="pillar-box">
                            <div class="pillar-title">Mission</div>
                            <p class="pillar-text">Providing Christ-Centered, holistic Adventist Education.</p>
                        </div>
                        <div class="pillar-box">
                            <div class="pillar-title">Philosophy</div>
                            <p class="pillar-text">God is the true source of Adventist Education for life and eternity.</p>
                        </div>
                        <div class="pillar-box">
                            <div class="pillar-title">Goal</div>
                            <p class="pillar-text">Ensuring quality teacher training and skills development.</p>
                        </div>
                    </div>
                    <div class="motto">To God be all the Glory!</div>
                </footer>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Database Error:', error.message);
        res.status(500).send('<h2>Internal Server Error</h2><p>Failed to load portal contents.</p>');
    }
});

// 2. REGISTRATION ENDPOINT (Handles Photo Upload + Profile Database Entry)
app.post('/api/register', upload.single('photo'), async (req, res) => {
    try {
        const studentData = JSON.parse(req.body.data);
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'Photo upload is required.' });
        }

        // Upload 1x1 Photo to Supabase Storage
        const fileExtension = file.originalname.split('.').pop();
        const filePath = `${studentData.id_number}_${Date.now()}.${fileExtension}`;

        const { data: storageData, error: storageError } = await supabase.storage
            .from('student-photos')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (storageError) throw storageError;

        // Get the Public URL of the uploaded image
        const { data: urlData } = supabase.storage
            .from('student-photos')
            .getPublicUrl(filePath);

        const photoUrl = urlData.publicUrl;

        // Insert Student Information into your "Students" Table (Perfectly Aligned Columns)
        const { data: dbData, error: dbError } = await supabase
            .from('Students')
            .insert([{
                student_id: studentData.id_number,
                password: studentData.password,
                email: studentData.email,
                name: studentData.name, 
                year_level: studentData.year,
                academic_status: studentData.status,
                gender: studentData.gender,
                date_of_birth: studentData.dob,
                place_of_birth: studentData.pob,
                present_address: studentData.address,
                religion: studentData.religion,
                mobile_number: studentData.mobile,
                ethnicity: studentData.ethnicity,
                father_name: studentData.father,
                father_religion: studentData.father_rel,
                mother_maiden: studentData.mother,
                mother_religion: studentData.mother_rel,
                guardian_name: studentData.guardian,
                guardian_contact: studentData.guardian_contact,
                photo_url: photoUrl
            }]);

        if (dbError) throw dbError;

        res.status(200).json({ success: true, message: 'Registration successful!' });

    } catch (error) {
        console.error('Registration Failure Details:', error);
        res.status(500).json({ success: false, message: error.message || 'Server processed database insertion error.' });
    }
});

// 3. PROFILE RETRIEVAL ENDPOINT (Fetches data for a specific student ID)
app.get('/api/profile/:id', async (req, res) => {
    try {
        const studentId = req.params.id;

        const { data: profiles, error } = await supabase
            .from('Students')
            .select('*')
            .eq('student_id', studentId); // Removed .single() to prevent crashing if empty

        if (error) throw error;

        // Check if we actually found a student
        if (!profiles || profiles.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: `No student found with ID: "${studentId}". Make sure it matches exactly what is in your database column.` 
            });
        }

        // Return the first match found
        res.status(200).json({ success: true, profile: profiles[0] });

    } catch (error) {
        console.error('Fetch Profile Failure:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// 4. LOGIN ENDPOINT (Verifies credentials and determines user role)
app.post('/api/login', async (req, res) => {
    try {
        const { student_id, password } = req.body;

        if (!student_id || !password) {
            return res.status(400).json({ success: false, message: 'Please enter both ID and password.' });
        }

        // Search for the entry matching the given student ID
        const { data: records, error } = await supabase
            .from('Students')
            .select('student_id, password, is_admin')
            .eq('student_id', student_id);

        if (error) throw error;

        // If no match is found
        if (!records || records.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid Student ID.' });
        }

        const user = records[0];

        // Check if the plain-text password matches what is stored
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: 'Incorrect PIN or Password.' });
        }

        // Success! Return information indicating whether they are an administrator
        res.status(200).json({
            success: true,
            message: 'Authentication successful!',
            student_id: user.student_id,
            isAdmin: user.is_admin || false
        });

    } catch (error) {
        console.error('Login Endpoint Error:', error.message);
        res.status(500).json({ success: false, message: 'An internal error occurred during login.' });
    }
});

// 5. ADMIN GET ALL STUDENTS ENDPOINT (Filters out admins)
app.get('/api/admin/students', async (req, res) => {
    try {
        const { data: students, error } = await supabase
            .from('Students')
            .select('name, student_id, year_level, academic_status, photo_url, is_admin')
            .eq('is_admin', false); // 🌟 FIX: Only fetch rows where is_admin is false

        if (error) throw error;

        console.log("fetched student sample:", students[0]);

        res.status(200).json({ success: true, students: students });

    } catch (error) {
        console.error('Fetch Directory Failure:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Fetch both the full curriculum and the student's specific saved grades
app.get('/api/get-curriculum-with-grades/:student_id', async (req, res) => {
    const { student_id } = req.params;

    try {
        // 1. Fetch the full curriculum list
        const { data: curriculum, error: currError } = await supabase
            .from('curriculum')
            .select('*')
            .order('year_level', { ascending: true })
            .order('semester', { ascending: true });

        if (currError) throw currError;

        // 2. Fetch the student's existing grades
        const { data: savedGrades, error: gradesError } = await supabase
            .from('Academic_Records')
            .select('course_code, grade')
            .eq('student_id', student_id);

        if (gradesError) throw gradesError;

        // 3. Combine them: Attach grades to curriculum items
        const combinedData = curriculum.map(subject => {
            const gradeEntry = savedGrades.find(g => g.course_code === subject.course_code);
            return {
                ...subject,
                grade: gradeEntry ? gradeEntry.grade : '' // If no grade exists, send empty string
            };
        });

        res.json({ success: true, data: combinedData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add this route to your server.js
app.post('/api/save-grades', async (req, res) => {
    console.log("DEBUG: Save request received!"); // This will show in terminal
    console.log("DEBUG: Data payload:", req.body); // This will show what is being sent

    const { records } = req.body;

    try {
        const { data, error } = await supabase
            .from('Academic_Records')
            .upsert(records, { onConflict: 'student_id, course_code' });

        if (error) throw error;

        res.json({ success: true, message: 'Grades saved successfully!' });
    } catch (error) {
        console.error("Save error details:", error); // This will show in terminal
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is operating on http://localhost:${PORT}`);
});