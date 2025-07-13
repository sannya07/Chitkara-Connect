const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const PORT = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let studentsCollection;
let teachersCollection;
let adminsCollection;
let noticesCollection;
let gatepassCollection;
let performanceCollection;
let attendanceCollection;
let queryCollection;
let supportCollection;

async function run() {
  try {
    await client.connect();
    const db = client.db('chitkaraconnect');
    studentsCollection = db.collection('students');
    teachersCollection = db.collection('teachers');
    adminsCollection = db.collection('admins');
    noticesCollection = db.collection('notices');  // Add notices collection
    gatepassCollection = db.collection('gatepass');
    performanceCollection = db.collection('performance');
    attendanceCollection = db.collection('attendance');
    queryCollection = db.collection('queries');
    supportCollection = db.collection(`support`);
    console.log("Connected to MongoDB and ready to handle requests!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.use(cors({ credentials: true, origin: ['https://chitkara-connect.onrender.com', 'https://chitkara-connect.vercel.app'] })); // Allow credentials for CORS
app.use(bodyParser.json());
app.use(cookieParser()); // Parse cookies

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    req.user = decoded; // Attach decoded JWT to request object
    next(); // Proceed to next middleware or route handler
  });
};

// Login API (POST request)
app.post('/api/login', async (req, res) => {
  const { userId, password } = req.body;
  console.log("Received login attempt with userId:", userId, "and password:", password);

  try {
    const userIdInt = parseInt(userId, 10);
    const passwordInt = parseInt(password, 10);

    if (isNaN(userIdInt) || isNaN(passwordInt)) {
      console.log("Invalid userId or password format");
      return res.status(400).json({ message: 'Invalid userId or password format' });
    }

    // Check student collection
    let user = await studentsCollection.findOne({ RollNo: userIdInt });
    if (user) {
      if (parseInt(user.password) !== passwordInt) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, role: 'student', RollNo: user.RollNo, name: user.name , email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: false, // Set to true for production with HTTPS
        maxAge: 3600000 // 1 hour
      });

      return res.json({ token, role: 'student' });
    }

    // Check teacher collection
    user = await teachersCollection.findOne({ teacherId: userIdInt });
    if (user) {
      if (parseInt(user.password) !== passwordInt) {
        return res.status(401).json({ message: 'Invalid credentials pass' });
      }

      const token = jwt.sign(
        { userId: user._id, role: 'teacher', teacherId: user.teacherId, name: user.name , email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: false, // Set to true for production with HTTPS
        maxAge: 3600000 // 1 hour
      });

      return res.json({ token, role: 'teacher' });
    }

    // Check admin collection
    user = await adminsCollection.findOne({ adminId: userIdInt });
    if (user) {
      if (parseInt(user.password) !== passwordInt) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, role: 'admin', adminId: user.adminId, name: user.name , email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: false, // Set to true for production with HTTPS
        maxAge: 3600000 // 1 hour
      });

      return res.json({ token, role: 'admin' });
    }

    // If no user is found in students, teachers, or admins collections
    return res.status(401).json({ message: 'User not found' });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// User Details API (GET request) - Protected Route
app.get('/api/user-details', authenticateJWT, async (req, res) => {
  console.log('Request received at /api/user-details');
  const { user } = req;  // The user data comes from the decoded JWT

  try {
    let dbUser;
    if (user.role === 'student') {
      dbUser = await studentsCollection.findOne({ _id: user.userId });
    } else if (user.role === 'teacher') {
      dbUser = await teachersCollection.findOne({ _id: user.userId });
    }

    if (!dbUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDetails = {
      name: dbUser.name,
      email: dbUser.email,
      RollNo: dbUser.RollNo || dbUser.teacherId, // Assuming RollNo for students, teacherId for teachers
    };

    res.json(userDetails); // Sends the details to the frontend
  } catch (error) {
    console.error('JWT Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});




app.get('/api/post-data-from-token/:token', (req, res) => {
  const { token } = req.params;
  const JWT_SECRET = process.env.JWT_SECRET; // Use the secret from the .env file

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      message: 'Token decoded successfully',
      decoded,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
});


// API to fetch student details by RollNo
app.get('/api/student-details/:rollNo', async (req, res) => {
  const { rollNo } = req.params; // Extract RollNo from the URL parameter

  if (!rollNo) {
    return res.status(400).json({ message: 'RollNo is required' });
  }

  try {
    // Fetch the student's details from the collection using the RollNo
    const studentData = await studentsCollection.findOne({ RollNo: parseInt(rollNo, 10) });

    if (!studentData) {
      return res.status(404).json({ message: `No student found with RollNo: ${rollNo}` });
    }

    // Return the student's details
    res.status(200).json(studentData);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Error fetching student details' });
  }
});


// API to fetch teacher details by teacherId
app.get('/api/teacher-details/:teacherId', async (req, res) => {
  const { teacherId } = req.params; // Extract teacherId from the URL parameter

  if (!teacherId) {
    return res.status(400).json({ message: 'TeacherId is required' });
  }

  try {
    // Fetch the teacher's details from the collection using the teacherId
    const teacherData = await teachersCollection.findOne({ teacherId: parseInt(teacherId, 10) });

    if (!teacherData) {
      return res.status(404).json({ message: `No teacher found with TeacherId: ${teacherId}` });
    }

    // Return the teacher's details
    res.status(200).json(teacherData);
  } catch (error) {
    console.error('Error fetching teacher details:', error);
    res.status(500).json({ message: 'Error fetching teacher details' });
  }
});




// Fetch Student Performance based on RollNo
// API to fetch performance data by RollNo
app.get('/api/performance/:rollNo', async (req, res) => {
  const { rollNo } = req.params; // Extract RollNo from the URL parameter

  if (!rollNo) {
    return res.status(400).json({ message: 'RollNo is required' });
  }

  try {
    // Query the performanceCollection using the RollNo
    const performanceData = await performanceCollection.find({ RollNo: parseInt(rollNo) }).toArray(); // Correcting the query and using `toArray()` for MongoDB

    // If no data is found, return a 404 response
    if (performanceData.length === 0) { // Checking the length of the result array
      return res.status(404).json({ message: `No performance data found for RollNo: ${rollNo}` });
    }

    // Return the performance data as JSON response
    res.json(performanceData);
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ message: 'Error fetching performance data' });
  }
});


// POST route to create a notice
app.post('/api/create-notice', async (req, res) => {
  // Extract the 'type' and 'data' from the request body
  const { type, data } = req.body;  // Expect 'type' (mentorNotice, eventNotice, generalNotice) and 'data' (form data)

  let tag = '';

  // Determine the tag based on the type of notice
  switch (type) {
    case 'mentorNotice':
      tag = 'mentornotice';
      break;
    case 'eventNotice':
      tag = 'event';
      break;
    case 'generalNotice':
      tag = 'notice';
      break;
    default:
      return res.status(400).json({ message: 'Invalid notice type' });
  }

  // Prepare the notice document to be inserted into the database
  const noticeData = { ...data, tag };

  try {
    // Insert the notice data into the 'notices' collection in MongoDB
    const result = await noticesCollection.insertOne(noticeData);
    
    // Return a response with the success message and the inserted notice ID
    res.status(201).json({ message: 'Notice created successfully', noticeId: result.insertedId });
  } catch (error) {
    // Log the error and return a 500 status if there was an issue inserting the notice
    console.error('Error creating notice:', error);
    res.status(500).json({ message: 'Error creating notice' });
  }
});



// API to fetch event notices (GET request)
app.get('/api/get-events', async (req, res) => {
  try {
    // Query the database to get notices with the tag 'event'
    const eventNotices = await noticesCollection.find({ tag: 'event' }).toArray();

    // Return the event notices as a JSON response
    res.json(eventNotices);
  } catch (error) {
    console.error('Error fetching event notices:', error);
    res.status(500).json({ message: 'Error fetching event notices' });
  }
});

app.get("/api/get-mentor-notices", async (req, res) => {
  try {
    const eventNotices = await noticesCollection.find({ tag: 'mentornotice' }).toArray();
    res.json(eventNotices);
     // Send mentor notices as JSON response
  } catch (error) {
    console.error("Error fetching mentor notices:", error);
    res.status(500).json({ message: "Error fetching mentor notices" });
  }
});

app.get("/api/get-notices", async (req, res) => {
  try {
    const eventNotices = await noticesCollection.find({ tag: 'notice' }).toArray();
    res.json(eventNotices);
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ message: "Error fetching notices" });
  }
});





// Logout API (Clear Cookie)
app.post('/api/logout', (req, res) => {
  res.clearCookie('authToken');
  return res.status(200).json({ message: 'Logged out successfully' });
});

// questions list
const questions = [
  {
    id: 1,
    question: "What is Chitkara Connect?",
    answer: "Chitkara Connect is a platform enabling students and teachers to interact and access information like notices, events, attendance, and more."
  },
  {
    id: 2,
    question: "Who is Chitkara's Chancellor?",
    answer: "Dr. Ashok Chitkara is the Chancellor of Chitkara University."
  },
  {
    id: 3,
    question: "Where is Chitkara University located?",
    answer: "Chitkara University is located on the Chandigarh-Patiala National Highway (NH-07) in Rajpura, Punjab. It is equidistant from major cities like Chandigarh, Mohali, and Patiala."
  },
  {
    id: 4,
    question: "What programs does Chitkara University offer?",
    answer: "Chitkara University offers programs in business management, engineering, computer science, nursing, hotel management, architecture, and more."
  },
  {
    id: 5,
    question: "When was Chitkara University established?",
    answer: "Chitkara University was established in 2010 under the Chitkara University Act by the Punjab State Legislature."
  },
  {
    id: 6,
    question: "What makes Chitkara University unique?",
    answer: "It is known for quality education, ethical practices, strong industry collaborations, and an emphasis on research and innovation."
  },
  {
    id: 7,
    question: "Does Chitkara University have international collaborations?",
    answer: "Yes, Chitkara University has partnerships with top international universities for student exchange programs, research collaborations, and dual degree programs."
  },
  {
    id: 8,
    question: "What extracurricular activities are available at Chitkara University?",
    answer: "Students can participate in cultural fests, sports events, technical competitions, and social outreach programs organized regularly on campus."
  },
  {
    id: 9,
    question: "What facilities are available at Chitkara University?",
    answer: "The campus has modern classrooms, laboratories, a library, hostels, sports complexes, and cafeterias, ensuring a holistic learning environment."
  },
  {
    id: 10,
    question: "What are the placement statistics for Chitkara University?",
    answer: "Chitkara University has a high placement record, with top recruiters from industries like IT, hospitality, healthcare, and management visiting the campus annually."
  },
  {
    id: 11,
    question: "Is Chitkara University accredited?",
    answer: "Yes, Chitkara University is accredited by NAAC and recognized by the UGC, ensuring high standards of education and infrastructure."
  },
  {
    id: 12,
    question: "How can students apply for admission to Chitkara University?",
    answer: "Students can apply through the university's online portal, submitting the required documents and passing eligibility criteria for their chosen program."
  },
  {
    id: 13,
    question: "What is the student-faculty ratio at Chitkara University?",
    answer: "Chitkara University maintains a balanced student-faculty ratio to ensure personalized attention and effective learning for students."
  },
  {
    id: 14,
    question: "Does Chitkara University offer scholarships?",
    answer: "Yes, the university provides merit-based scholarships to deserving students across various programs."
  },
  {
    id: 15,
    question: "What research opportunities are available at Chitkara University?",
    answer: "Chitkara University emphasizes research, offering students and faculty opportunities to work on funded projects, publish papers, and collaborate with industry experts."
  },
  {
    id: 16,
    question: "What is the eligibility for B.Tech at Chitkara University?",
    answer: "Applicants must have completed 10+2 with a minimum of 60% marks in Physics, Chemistry, and Mathematics."
  },
  {
    id: 17,
    question: "What MBA specializations does Chitkara University offer?",
    answer: "Specializations include Marketing, Finance, HR, Operations, and Business Analytics."
  },
  {
    id: 18,
    question: "What is the admission process for nursing programs?",
    answer: "Applicants must have completed 10+2 with Biology as a subject. Admissions are based on merit."
  },
  {
    id: 19,
    question: "What are the benefits of student exchange programs?",
    answer: "Student exchange programs provide global exposure, cultural exchange, and opportunities for advanced research and study."
  },
  {
    id: 20,
    question: "What support services does Chitkara University offer?",
    answer: "Support services include career counseling, on-campus healthcare, psychological support, and financial aid."
  },
  {
    id: 21,
    question: "What events are conducted at Chitkara University?",
    answer: "Events like Udaan, Tech Fest, and sports tournaments are held to enhance the overall student experience."
  },
  {
    id: 22,
    question: "What is the focus of the Engineering program?",
    answer: "Chitkara's Engineering program emphasizes innovation, problem-solving skills, and industry-relevant training."
  },
  {
    id: 23,
    question: "What sustainability initiatives are adopted by Chitkara University?",
    answer: "The university promotes green energy, waste management, and eco-friendly practices across the campus."
  },
  {
    id: 24,
    question: "What is the scope of online learning at Chitkara University?",
    answer: "The university integrates online learning for flexible education and offers industry-relevant certifications."
  },
  {
    id: 25,
    question: "What are the dining facilities at Chitkara University?",
    answer: "Chitkara's campus includes multiple food outlets offering diverse cuisines and ensuring hygienic standards."
  }
];

app.get('/questions', (req, res) => {
res.json(questions);
});

app.get('/api/manage-students', async (req, res) => {
  try {
    // Fetch all students from the database
    const students = await studentsCollection.find({}).toArray();

    // Return the list of students as JSON response
    res.json(students);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Error fetching student details' });
  }
});

app.get('/api/contact-teachers', async (req, res) => {
  try {
    // Fetch all students from the database
    const teachers = await teachersCollection.find({}).toArray();

    // Return the list of students as JSON response
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers details:', error);
    res.status(500).json({ message: 'Error fetching teachers details' });
  }
});


// POST route to submit a gate pass
app.post('/api/submit-gatepass', async (req, res) => {
  // Extract gate pass details from the request body
  const { name, rollNo, email, contact, date, time, reason, approvedStatus } = req.body;

  // Prepare the gate pass document to be inserted into the database
  const gatepassData = {
    name,
    rollNo,
    email,
    contact,
    date,
    time,
    reason,
    approvedStatus ,
    createdAt: new Date(),
  };

  try {
    // Insert the gate pass data into the 'gatepass' collection in MongoDB
    const result = await gatepassCollection.insertOne(gatepassData);

    // Return a response with the success message and the inserted gate pass ID
    res.status(201).json({ message: 'Gate pass submitted successfully', gatepassId: result.insertedId });
  } catch (error) {
    // Log the error and return a 500 status if there was an issue inserting the gate pass
    console.error('Error submitting gate pass:', error);
    res.status(500).json({ message: 'Error submitting gate pass' });
  }
});

// API to fetch approved gatepasses
// API to fetch approved gatepasses by rollNo
app.get('/api/gatepasses/approved/:rollNo', async (req, res) => {
  const { rollNo } = req.params; // Extract rollNo from the URL parameter

  if (!rollNo) {
    return res.status(400).json({ message: 'RollNo is required' });
  }

  try {
    // Query the gatepass collection for approved gatepasses for the specific rollNo
    const approvedGatepasses = await gatepassCollection.find({ rollNo: parseInt(rollNo), approvedStatus: 'approved' }).toArray();

    // Return the approved gatepasses as JSON response
    if (approvedGatepasses.length === 0) {
      return res.status(404).json({ message: `No approved gatepasses found for RollNo: ${rollNo}` });
    }

    res.json(approvedGatepasses);
  } catch (error) {
    console.error('Error fetching approved gatepasses:', error);
    res.status(500).json({ message: 'Error fetching approved gatepasses' });
  }
});


// API to fetch rejected gatepasses
// API to fetch rejected gatepasses by rollNo
app.get('/api/gatepasses/rejected/:rollNo', async (req, res) => {
  const { rollNo } = req.params; // Extract rollNo from the URL parameter

  if (!rollNo) {
    return res.status(400).json({ message: 'RollNo is required' });
  }

  try {
    // Query the gatepass collection for rejected gatepasses for the specific rollNo
    const rejectedGatepasses = await gatepassCollection.find({ rollNo: parseInt(rollNo), approvedStatus: 'rejected' }).toArray();

    // Return the rejected gatepasses as JSON response
    if (rejectedGatepasses.length === 0) {
      return res.status(404).json({ message: `No rejected gatepasses found for RollNo: ${rollNo}` });
    }

    res.json(rejectedGatepasses);
  } catch (error) {
    console.error('Error fetching rejected gatepasses:', error);
    res.status(500).json({ message: 'Error fetching rejected gatepasses' });
  }
});



// API to fetch pending gatepasses
// API to fetch pending gatepasses by rollNo
app.get('/api/gatepasses/pending/:rollNo', async (req, res) => {
  const { rollNo } = req.params; // Extract rollNo from the URL parameter

  if (!rollNo) {
    return res.status(400).json({ message: 'RollNo is required' });
  }

  try {
    // Query the gatepass collection for pending gatepasses for the specific rollNo
    const pendingGatepasses = await gatepassCollection.find({ rollNo: parseInt(rollNo), approvedStatus: 'pending' }).toArray();

    // Return the pending gatepasses as JSON response
    if (pendingGatepasses.length === 0) {
      return res.status(404).json({ message: `No pending gatepasses found for RollNo: ${rollNo}` });
    }

    res.json(pendingGatepasses);
  } catch (error) {
    console.error('Error fetching pending gatepasses:', error);
    res.status(500).json({ message: 'Error fetching pending gatepasses' });
  }
});

app.get('/api/gatepasses/pending', async (req, res) => {
  try {
    // Query the gatepass collection for pending gatepasses
    const pendingGatepasses = await gatepassCollection.find({ approvedStatus: 'pending' }).toArray();

    // Return the pending gatepasses as JSON response
    if (pendingGatepasses.length === 0) {
      return res.status(404).json({ message: 'No pending gatepasses found' });
    }

    res.json(pendingGatepasses);
  } catch (error) {
    console.error('Error fetching pending gatepasses:', error);
    res.status(500).json({ message: 'Error fetching pending gatepasses' });
  }
});



app.get('/api/gatepasses/approved', async (req, res) => {
  try {
    // Query the gatepass collection for approved gatepasses
    const approvedGatepasses = await gatepassCollection.find({ approvedStatus: 'approved' }).toArray();

    // Return the approved gatepasses as JSON response
    if (approvedGatepasses.length === 0) {
      return res.status(404).json({ message: 'No approved gatepasses found' });
    }

    res.json(approvedGatepasses);
  } catch (error) {
    console.error('Error fetching approved gatepasses:', error);
    res.status(500).json({ message: 'Error fetching approved gatepasses' });
  }
});


app.get('/api/gatepasses/rejected', async (req, res) => {
  try {
    // Query the gatepass collection for rejected gatepasses
    const rejectedGatepasses = await gatepassCollection.find({ approvedStatus: 'rejected' }).toArray();

    // Return the rejected gatepasses as JSON response
    if (rejectedGatepasses.length === 0) {
      return res.status(404).json({ message: 'No rejected gatepasses found' });
    }

    res.json(rejectedGatepasses);
  } catch (error) {
    console.error('Error fetching rejected gatepasses:', error);
    res.status(500).json({ message: 'Error fetching rejected gatepasses' });
  }
});


// API to update the approved status of a gate pass
app.put('/api/gatepasses/update-status', async (req, res) => {
  const { gatepassId, approvedStatus } = req.body; // Extract gatepassId and new approvedStatus from request body

  // Validate input
  if (!gatepassId || !approvedStatus) {
    return res.status(400).json({ message: 'gatepassId and approvedStatus are required' });
  }

  try {
    // Update the approvedStatus of the specified gate pass in the collection
    const result = await gatepassCollection.updateOne(
      { _id: new ObjectId(gatepassId) }, // Filter by gatepassId
      { $set: { approvedStatus } } // Update approvedStatus
    );

    // If no documents were modified, return a not found response
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: `No gate pass found with ID: ${gatepassId}` });
    }

    // Return success response
    res.json({ message: 'Gate pass status updated successfully' });
  } catch (error) {
    console.error('Error updating gate pass status:', error);
    res.status(500).json({ message: 'Error updating gate pass status' });
  }
});




app.post('/api/syllabus-add', async (req, res) => {
  const { courseName, topics, semester } = req.body;

  // Ensure topics is an array, even if a string is provided
  const topicList = Array.isArray(topics) ? topics : topics.split(',').map(topic => topic.trim());

  // Validate the required fields
  if (!courseName || !topicList.length || !semester) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Get the syllabus collection from your MongoDB
    const syllabusCollection = client.db('chitkaraconnect').collection('syllabus');

    // Insert the syllabus data directly into the collection
    const result = await syllabusCollection.insertOne({
      courseName,
      topics: topicList,
      semester,
      createdAt: new Date(),  // Optionally add a timestamp
    });

    // Return a success response with the inserted syllabus ID
    res.status(201).json({ message: 'Syllabus added successfully!', syllabusId: result.insertedId });
  } catch (error) {
    console.error('Error adding syllabus:', error);
    res.status(500).json({ message: 'Error adding syllabus', error: error.message });
  }
});

app.get('/api/syllabus', async (req, res) => {
  try {
    const syllabusCollection = client.db('chitkaraconnect').collection('syllabus');
    const syllabusData = await syllabusCollection.find({}).toArray(); // Fetch all syllabus documents
    res.status(200).json(syllabusData);
  } catch (error) {
    console.error('Error fetching syllabus:', error);
    res.status(500).json({ message: 'Error fetching syllabus', error: error.message });
  }
});


// POST route to add a support request
app.post('/api/support-add', async (req, res) => {
  const { name, email, role, queryType, message } = req.body;

  if (!name || !email || !role || !queryType || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Get the support collection from your MongoDB
    const supportCollection = client.db('chitkaraconnect').collection('support');

    // Prepare the support request document to be inserted
    const supportData = {
      name,
      email,
      role,
      queryType,
      message,
      createdAt: new Date(), // Add timestamp for when the request is created
    };

    // Insert the support data directly into the 'support' collection
    const result = await supportCollection.insertOne(supportData);

    // Respond back with success message and the inserted support request ID
    res.status(201).json({
      message: 'Thank you for your feedback! We\'ll get back to you shortly.',
      supportId: result.insertedId,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to add support request. Please try again.' });
  }
});


app.get('/api/students', async (req, res) => {
  try {
    // Fetch only `RollNo` and `name` fields from the database
    const students = await studentsCollection.find({}, { projection: { name: 1, RollNo: 1, group:1, _id: 0 } }).toArray();
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Corrected route definition
app.get('/api/attendance/:rollNo', async (req, res) => {
  const { rollNo } = req.params;  // Use rollNo here

  try {
    // Query attendance collection for records with the provided rollNo
    const attendanceRecords = await attendanceCollection
      .find({ studentId: rollNo }) // Change from studentId to rollNo
      .sort({ date: 1 }) // Sort by date if necessary
      .toArray();

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this student' });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});


// Mark attendance for a specific date
app.post('/api/mark-attendance', async (req, res) => {
  const { date, attendanceRecords } = req.body;

  // Validate input
  if (!date || !Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
    return res.status(400).json({ error: 'Invalid input format. "date" and "attendanceRecords" are required.' });
  }

  try {
    // Log the incoming request data for debugging purposes
    console.log('Received attendance data:', attendanceRecords);

    // Format the date to a consistent format (YYYY-MM-DD)
    const formattedDate = new Date(date).toISOString().split('T')[0];  // 'YYYY-MM-DD'
    
    // Ensure each record is valid
    const formattedRecords = attendanceRecords.map(record => {
      if (!record.studentId) {
        throw new Error('Each attendance record must have a valid studentId and status (present/absent)');
      }

      return {
        studentId: record.studentId,  // Ensure studentId is correct
        status: record.status,         // Ensure status is provided (Present/Absent)
        date: formattedDate,           // Attach the formatted date to each record
      };
    });

    // Create bulk operations to update or insert attendance records
    const bulkOperations = formattedRecords.map(record => ({
      updateOne: {
        filter: { studentId: record.studentId, date: record.date },
        update: { $set: { status: record.status } },
        upsert: true, // Create a new record if none exists
      },
    }));

    // Execute bulkWrite to update attendance in the database
    const result = await attendanceCollection.bulkWrite(bulkOperations);

    // Send a success response with the result of the bulk operation
    res.status(200).json({ message: 'Attendance marked successfully', result });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error marking attendance:', error);

    // Return a detailed error response
    res.status(500).json({ error: error.message || 'Failed to mark attendance' });
  }
});

// POST route to submit a support query into the queryCollection
app.post('/api/submit-query', async (req, res) => {
  const { name, rollNo, email, topic, tags, query, likes = 0, solution = null } = req.body;

  // Validate the required fields
  if (!name || !email || !rollNo || !topic || !query) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate the 'tags' field to ensure it's an array
  if (tags && !Array.isArray(tags)) {
    return res.status(400).json({ message: 'Tags must be an array' });
  }

  try {
    // Prepare the query data document to be inserted into the queryCollection
    const queryData = {
      name,
      rollNo,
      email,
      topic,
      tags: tags || [], // Set default empty array for tags if not provided
      description: query, // Assuming 'query' is the query message you want to save
      likes,
      solution,
      createdAt: new Date(), // Add timestamp for when the query is created
    };

    // Insert the query data into the 'queries' collection in MongoDB
    const result = await queryCollection.insertOne(queryData);

    // Respond back with a success message and the inserted query ID
    res.status(201).json({
      message: 'Your query has been submitted successfully! We will respond shortly.',
      queryId: result.insertedId,
    });
  } catch (error) {
    console.error('Error submitting query:', error);
    res.status(500).json({ message: 'Failed to submit query. Please try again later.' });
  }
});

app.get('/api/queries-without-solution', async (req, res) => {
  try {
    // Fetch all queries where solution is null
    const queries = await queryCollection.find({ solution: "null" }).toArray();

    if (queries.length === 0) {
      return res.status(404).json({ message: 'No queries without a solution found.' });
    }

    // Respond with the list of queries
    res.status(200).json({ queries });
  } catch (error) {
    console.error('Error fetching queries without solution:', error);
    res.status(500).json({ message: 'Failed to fetch queries. Please try again later.' });
  }
});

app.get('/api/queries-with-solution', async (req, res) => {
  try {
    // Fetch all queries where solution is not null
    const queries = await queryCollection.find({ solution: { $ne: "null" } }).toArray();

    if (queries.length === 0) {
      return res.status(404).json({ message: 'No queries with a solution found.' });
    }

    // Respond with the list of queries
    res.status(200).json({ queries });
  } catch (error) {
    console.error('Error fetching queries with solution:', error);
    res.status(500).json({ message: 'Failed to fetch queries. Please try again later.' });
  }
});


app.get('/api/queries-by-rollno/:rollNo', async (req, res) => {
  try {
    // Get rollNo from URL params
    const { rollNo } = req.params;

    if (!rollNo) {
      return res.status(400).json({ message: 'Roll number is required.' });
    }

    // Fetch all queries for the specific rollNo
    const queries = await queryCollection.find({ rollNo: parseInt(rollNo) }).toArray();

    if (queries.length === 0) {
      return res.status(404).json({ message: `No queries found for roll number: ${rollNo}` });
    }

    // Respond with the list of queries
    res.status(200).json({ queries });
  } catch (error) {
    console.error('Error fetching queries by roll number:', error);
    res.status(500).json({ message: 'Failed to fetch queries. Please try again later.' });
  }
});


app.put('/api/queries/update-solution', async (req, res) => {
  const { queryId, solution } = req.body;

  if (!queryId || typeof solution !== 'string') {
    return res.status(400).json({ message: 'Invalid input. queryId and solution are required.' });
  }

  try {
    // Update the solution for the given query ID
    const result = await queryCollection.updateOne(
      { _id: new ObjectId(queryId) }, // Ensure _id matches the queryId
      { $set: { solution: solution } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Query not found.' });
    }

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'Solution was not updated.' });
    }

    // Respond with success message
    res.status(200).json({ message: 'Solution updated successfully.' });
  } catch (error) {
    console.error('Error updating solution:', error);
    res.status(500).json({ message: 'Failed to update solution. Please try again later.' });
  }
});




app.get('/api/students-performance', async (req, res) => {
  try {
    // Fetch only `RollNo` and `name` fields from the database
    const performance = await performanceCollection.find({}).toArray();
    res.status(200).json(performance);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

//////// ADMIN PANEL ///////
app.get('/api/students/count', async (req, res) => {
  try {
    const studentCount = await studentsCollection.countDocuments();
    res.json({ count: studentCount });
  } catch (error) {
    console.error('Error fetching student count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/teachers/count', async (req, res) => {
  try {
    // Assuming `teachersCollection` is already initialized elsewhere in your code
    const teacherCount = await teachersCollection.countDocuments();
    res.json({ count: teacherCount });
  } catch (error) {
    console.error('Error fetching teacher count:', error); // Fixed the error message
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/notices/count', async (req, res) => {
  try {
    // Assuming `teachersCollection` is already initialized elsewhere in your code
    const noticeCount = await noticesCollection.countDocuments();
    res.json({ count: noticeCount });
  } catch (error) {
    console.error('Error fetching teacher count:', error); // Fixed the error message
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/queries/count', async (req, res) => {
  try {
    // Assuming `teachersCollection` is already initialized elsewhere in your code
    const queriesCount = await queryCollection.countDocuments();
    res.json({ count: queriesCount });
  } catch (error) {
    console.error('Error fetching teacher count:', error); // Fixed the error message
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/support/count', async (req, res) => {
  try {
    // Assuming `teachersCollection` is already initialized elsewhere in your code
    const supportCount = await supportCollection.countDocuments();
    res.json({ count: supportCount });
  } catch (error) {
    console.error('Error fetching teacher count:', error); // Fixed the error message
    res.status(500).json({ message: 'Server error' });
  }
});

/// MANAGE TEACHERS ///
app.get('/api/teachers', async (req, res) => {
  try {
    const teachers = await teachersCollection.find().toArray();
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/// MANAGE STUDENTS ///
app.get('/api/student', async (req, res) => {
  try {
    const student = await studentsCollection.find().toArray();
    res.json(student);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


/// MANAGE HELP/ SUPPORT ///
app.get('/api/supports', async (req, res) => {
  try {
    const support = await supportCollection.find().toArray();
    res.json(support);
  } catch (error) {
    console.error('Error fetching support:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/// MANAGE QUERIES ///
app.get('/api/queries', async (req, res) => {
  try {
    const queries = await queryCollection.find().toArray();
    res.json(queries);
  } catch (error) {
    console.error('Error fetching support:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
