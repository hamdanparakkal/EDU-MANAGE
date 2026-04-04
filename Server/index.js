// console.log("hello world")
require('dotenv').config();
const express = require('express')
const bodyparser = require("body-parser")
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

const app = express()
app.use(bodyparser.json())
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// -------------------- Database Connection --------------------
const port = 5000

app.listen(port, () => {
    try {
        console.log(`Server is running ${port}`);
        mongoose.connect(
            process.env.MONGO_URL
        );
        console.log("db connection established");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
});

// -------------------- File Upload Setup --------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "./public/uploads";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

//--------------------- Schemas/models ----------------------
const adminSchema = new mongoose.Schema(
    {
        adminName: { type: String, required: true, trim: true },
        adminEmail: { type: String, required: true, trim: true },
        adminPassword: { type: String, required: true, trim: true }
    },
    { collection: "admins", timestamps: true }
);
const Admin = mongoose.model("Admin", adminSchema);

const teacherSchema = new mongoose.Schema(
    {
        teacherName: { type: String, required: true, trim: true },
        teacherEmail: { type: String, required: true, trim: true },
        teacherContact: { type: String, required: true, trim: true },
        teacherPhoto: { type: String, required: true, trim: true },
        teacherStatus: { type: Number, default: 0 },
        teacherDob: { type: Date, required: true },
        teacherPassword: { type: String, required: true, trim: true }
    },
    { collection: "teachers", timestamps: true }
);
const Teacher = mongoose.model("Teacher", teacherSchema);

const studentSchema = new mongoose.Schema(
    {
        studentName: { type: String, required: true, trim: true },
        studentEmail: { type: String, required: true, trim: true },
        studentAddress: { type: String, required: true, trim: true },
        studentRollno: { type: String, required: true, trim: true },
        studentPhoto: { type: String, trim: true },
        studentContact: { type: String, required: true, trim: true },
        studentPassword: { type: String, required: true, trim: true },
        studentStatus: { type: Number, default: 0 },
        studentDob: { type: Date, required: true },
        semId: { type: mongoose.Schema.Types.ObjectId, ref: "sems", required: false },
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "teachers", required: false },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: "Cf", required: false },
        yearId: { type: mongoose.Schema.Types.ObjectId, ref: "years", required: false }
    },
    { collection: "students", timestamps: true }
);
const Student = mongoose.model("Student", studentSchema);


const departmentSchema = new mongoose.Schema(
    {
        departmentName: { type: String, required: true, trim: true }
    },
    { collection: "departments", timestamps: true }
);
const Department = mongoose.model("Department", departmentSchema);

const courseSchema = new mongoose.Schema(
    {
        courseName: { type: String, required: true, trim: true },
        departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "departments", required: true }
    },
    { collection: "courses", timestamps: true }
);
const Course = mongoose.model("Course", courseSchema);


const subjectSchema = new mongoose.Schema(
    {
        subjectName: { type: String, required: true, trim: true },
        departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "departments", required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "courses", required: true },
        semId: { type: mongoose.Schema.Types.ObjectId, ref: "sems", required: true }
    },
    { collection: "subjects", timestamps: true }
);
const Subject = mongoose.model("Subject", subjectSchema);


const classSchema = new mongoose.Schema(
{
    className: { type: String, required: true, trim: true },

    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments",
        required: true
    },

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: true
    },

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teachers",
        required: true
    }
},
{ collection: "classes", timestamps: true }
);

const Cf = mongoose.model("Cf", classSchema);

const infoSchema = new mongoose.Schema(
    {
        infoFile: { type: String, required: true, trim: true },
        infoDetails: { type: String, required: true, trim: true },
        infoDate: { type: String, required: true, trim: true }
    },
    { collection: "info", timestamps: true }
);
const Info = mongoose.model("Info", infoSchema);


const yearSchema = new mongoose.Schema(
    {
        yearName: { type: String, required: true, trim: true }
    },
    { collection: "years", timestamps: true }
);
const Year = mongoose.model("Year", yearSchema);


const semSchema = new mongoose.Schema(
    {
        semName: { type: String, required: true, trim: true }
    },
    { collection: "sems", timestamps: true }
);
const Sem = mongoose.model("Sem", semSchema);


const attendanceSchema = new mongoose.Schema(
    {
        attendanceDate: { type: String, required: true, trim: true },
        attendanceHour: { type: String, required: true, trim: true },
        attendanceType: { type: String, required: true, trim: true },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "students", required: true },
        semId: { type: mongoose.Schema.Types.ObjectId, ref: "sems", required: false },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "subjects", required: true }
    },
    { collection: "attendances", timestamps: true }
);
const Attendance = mongoose.model("Attendance", attendanceSchema);


const notesSchema = new mongoose.Schema(
    {
        notesTitle: { type: String, required: true, trim: true },
        notesDetails: { type: String, required: true, trim: true },
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "teachers", required: true },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "subjects", required: true }
    },
    { collection: "notes", timestamps: true }
);
const Notes = mongoose.model("Notes", notesSchema);



const notefilesSchema = new mongoose.Schema(
    {
        notefilesFile: { type: String, required: true, trim: true },
        originalName: { type: String, required: true },
        noteId: { type: mongoose.Schema.Types.ObjectId, ref: "notes", required: true }
    },
    { collection: "notefiles", timestamps: true }
);
const NoteFiles = mongoose.model("NoteFiles", notefilesSchema);


const complaintSchema = new mongoose.Schema(
    {
        complaintTitle: { type: String, required: true, trim: true },
        complaintContent: { type: String, required: true, trim: true },
        complaintReply: { type: String, required: true, trim: true },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "students", required: true }
    },
    { collection: "complaints", timestamps: true }
);
const Complaint = mongoose.model("Complaint", complaintSchema);


const feedbackSchema = new mongoose.Schema(
    {
        feedbackContent: { type: String, required: true, trim: true },

        // ✅ MUST match mongoose.model("Teacher", ...)
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: false
        },

        // ✅ MUST match mongoose.model("Student", ...)
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: false
        }
    },
    { collection: "feedbacks", timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);


const internalmarkSchema = new mongoose.Schema(
    {
        internalmarkMark: { type: String, required: true, trim: true },
        internalmarkFull: { type: String, required: true, trim: true },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "subjects", required: true },
        semId: { type: mongoose.Schema.Types.ObjectId, ref: "sems", required: true },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "students", required: true }
    },
    { collection: "internalmarks", timestamps: true }
);
const Internalmark = mongoose.model("Internalmark", internalmarkSchema);

const condonationSchema = new mongoose.Schema(
    {
        condonationAmount: { type: String, required: true, trim: true },
        semId: { type: mongoose.Schema.Types.ObjectId, ref: "sems", required: false },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "students", required: true }
    },
    { collection: "Condonations", timestamps: true }
);
const Condonation = mongoose.model("Condonation", condonationSchema);

const LeaveSchema = new mongoose.Schema(
    {
        leaveFile: { type: String, required: true, trim: true },
        semId: { type: mongoose.Schema.Types.ObjectId, ref: "sems", required: true },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "students", required: true },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        }
    },
    { collection: "Leaves", timestamps: true }
);
const Leave = mongoose.model("Leave", LeaveSchema);


const chatSchema = new mongoose.Schema(
    {
        chatMessage: { type: String, required: true, trim: true },

        fromstudentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "students",
            default: null
        },

        tostudentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "students",
            default: null
        },

        fromteacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "teachers",
            default: null
        },

        toteacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "teachers",
            default: null
        },

        unreadForTeacher: {
            type: Boolean,
            default: false
        },

        unreadForStudent: {
            type: Boolean,
            default: false
        }

    },
    { collection: "Chats", timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

//-------------inserting--------------

app.post("/admin", async (req, res) => {
    try {
        const { adminName, adminEmail, adminPassword } = req.body;

        let admin = await Admin.findOne({ adminEmail });

        if (admin) {
            return res.json({ message: " already exists" });
        }

        admin = new Admin({
            adminName,
            adminEmail,
            adminPassword
        });

        await admin.save();

        res.json({ message: " inserted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/admin", async (req, res) => {
    try {
        const data = await Admin.aggregate([
            {
                $project: {
                    adminId: "$_id",
                    adminName: 1,
                    adminEmail: 1,
                    adminPassword: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    _id: 0
                }
            }
        ]);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get("/admin/complaint", async (req, res) => {
    try {
        const complaint = await Complaint.find()
            .populate({
                path: "studentId",
                model: "Student",
                select: "studentName studentRollno studentPhoto classId",
                populate: {
                    path: "classId",
                    model: "Cf",
                    select: "className courseId",
                    populate: {
                        path: "courseId",
                        model: "Course",
                        select: "departmentId",
                        populate: {
                            path: "departmentId",
                            model: "Department",
                            select: "departmentName",
                        },
                    },
                },
            })
            .sort({ createdAt: -1 });

        res.json({ data: complaint });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.get("/admin/feedback", async (req, res) => {
    try {
        const feedbacks = await Feedback.find()

            // ✅ FORCE correct model
            .populate({
                path: "teacherId",
                model: "Teacher",
                select: "teacherName teacherPhoto",
            })

            .populate({
                path: "studentId",
                model: "Student",
                select: "studentName studentRollno studentPhoto",
            })

            .sort({ createdAt: -1 });

        res.json({ data: feedbacks });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.get("/admin/teachers", async (req, res) => {

    try {

        const teachers = await Teacher.find();

        res.json({ data: teachers });

    } catch (err) {

        console.log(err);
        res.status(500).json({ message: "Server error" });

    }

});

app.get("/admin/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Admin.findById(id);

        res.json({ data });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


app.put("/admin/:id", async (req, res) => {
    try {
        const adminId = req.params.id;
        const { adminName } = req.body;
        const { adminEmail } = req.body;
        const { adminPassword } = req.body;

        let admin = await Admin.findByIdAndUpdate(adminId, { adminName, adminEmail, adminPassword }, { new: true });

        if (!admin) {
            return res.json({ message: "admin not found" });
        } else {
            res.json({ message: "admin updated", admin });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

app.put("/admin/change-password/:id", async (req, res) => {
    try {
        const adminId = req.params.id;
        const { newPassword } = req.body;

        let admin = await Admin.findByIdAndUpdate(adminId, { adminPassword: newPassword }, { new: true });

        if (!admin) {
            return res.json({ message: "admin password not found" });
        } else {
            res.json({ message: "admin password updated", admin });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

app.put("/admin/approve-teacher/:id", async (req, res) => {

    await Teacher.findByIdAndUpdate(req.params.id, {
        teacherStatus: 1
    });

    res.json({ message: "Teacher approved" });

});

app.put("/admin/reject-teacher/:id", async (req, res) => {

    await Teacher.findByIdAndUpdate(req.params.id, {
        teacherStatus: 2
    });

    res.json({ message: "Teacher rejected" });

});


app.delete("/admin/:id", async (req, res) => {
    try {
        const adminId = req.params.id;
        const deletedadmin = await Admin.findByIdAndDelete(adminId);

        if (!deletedadmin) {
            return res.json({ message: "Admin not found" });
        } else {
            res.json({ message: "Admin deleted successfully", deletedadmin });
        }
    } catch (err) {
        console.error("Error deleting Admin:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// -------------------- USER API --------------------
app.post("/teacher", upload.single("photo"), async (req, res) => {
    try {
        const { teacherName, teacherEmail, teacherContact, teacherDob, teacherPassword } = req.body;
        const teacherPhoto = req.file ? `/uploads/${req.file.filename}` : "";
        await Teacher.create({ teacherName, teacherEmail, teacherContact, teacherDob, teacherPassword, teacherPhoto });
        res.json({ message: "Teacher added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/teacher", async (req, res) => {
    try {
        const data = await Teacher.aggregate([
            {
                $project: {
                    teacherId: "$_id",
                    teacherName: 1,
                    teacherEmail: 1,
                    teacherContact: 1,
                    teacherDob: 1,
                    teacherPassword: 1,
                    teacherPhoto: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    _id: 0
                }
            }
        ]);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.get("/approvedteacher", async (req, res) => {
    try {
        const data = await Teacher.aggregate([
            {
                $match: {
                    teacherStatus: 1
                }
            },
            {
                $project: {
                    teacherId: "$_id",
                    teacherName: 1,
                    teacherEmail: 1,
                    teacherContact: 1,
                    teacherDob: 1,
                    teacherPassword: 1,
                    teacherPhoto: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    _id: 0
                }
            }
        ]);

        res.json({ data });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/teacher/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Teacher.findById(id);

        res.json({ data });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/teacher/students/:teacherId", async (req, res) => {
    try {
        const { teacherId } = req.params;

        const data = await Student.aggregate([
            {
                $match: {
                    teacherId: new mongoose.Types.ObjectId(teacherId)
                }
            },
            {
                $lookup: {
                    from: "classes",
                    localField: "classId",
                    foreignField: "_id",
                    as: "class"
                }
            },
            {
                $lookup: {
                    from: "years",
                    localField: "yearId",
                    foreignField: "_id",
                    as: "year"
                }
            },
            {
                $lookup: {
                    from: "sems",
                    localField: "semId",
                    foreignField: "_id",
                    as: "sem"
                }
            },
            { $unwind: { path: "$class", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$year", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$sem", preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    studentId: "$_id",
                    studentName: 1,
                    studentRollno: 1,
                    studentPhoto: 1,
                    studentContact: 1,
                    className: "$class.className",
                    yearName: "$year.yearName",
                    semName: "$sem.semName",
                    semId: "$sem._id",
                    _id: 0
                }
            }
        ]);

        res.json({ data });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get("/teacher/subjects/:teacherId", async (req, res) => {
    try {
        const { teacherId } = req.params;

        const data = await Subject.find({ teacherId }).select("_id subjectName");

        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/teacher/:id", upload.single("photo"), async (req, res) => {
    try {
        const { teacherName, teacherEmail, teacherContact } = req.body;

        const updateData = {
            teacherName,
            teacherEmail,
            teacherContact,
        };

        if (req.file) {
            updateData.teacherPhoto = `/uploads/${req.file.filename}`;
        }

        const teacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json({ message: "teacher updated", teacher });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

app.put("/teacher/change-password/:id", async (req, res) => {
    try {
        const teacherId = req.params.id;
        const { newPassword } = req.body;

        let teacher = await Teacher.findByIdAndUpdate(teacherId, { teacherPassword: newPassword }, { new: true });

        if (!teacher) {
            return res.json({ message: "teacher password not found" });
        } else {
            res.json({ message: "teacher password updated", teacher });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

app.post("/student", upload.single("photo"), async (req, res) => {
    try {
        const {
            studentName,
            studentEmail,
            studentAddress,
            classId,
            studentRollno,
            studentDob,
            yearId,
            semId,
            teacherId,
            studentContact,
            studentPassword
        } = req.body;

        const studentPhoto = req.file
            ? `/uploads/${req.file.filename}`
            : "";

        const newStudent = {
            studentName,
            studentEmail,
            studentAddress,
            studentRollno,
            studentDob,
            studentContact,
            studentPassword,
            studentPhoto
        };


        if (classId) newStudent.classId = classId;
        if (yearId) newStudent.yearId = yearId;
        if (semId) newStudent.semId = semId;
        if (teacherId) newStudent.teacherId = teacherId;

        console.log("DATA SENT TO DB:", newStudent);

        await Student.create(newStudent);

        res.json({ message: "student added successfully" });

    } catch (err) {
        console.log("ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


app.post("/students/bulk", upload.single("file"), async (req, res) => {

    try {

        const { teacherId, classId, yearId, semId } = req.body;

        const workbook = XLSX.readFile(req.file.path);

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const students = XLSX.utils.sheet_to_json(sheet);

        const formattedStudents = students.map(s => ({

            studentName: s.studentName,
            studentEmail: s.studentEmail,
            studentAddress: s.studentAddress,
            studentRollno: s.studentRollno,
            studentContact: s.studentContact,
            studentPassword: s.studentPassword,
            studentDob: s.studentDob,

            teacherId,
            classId,
            yearId,
            semId,

            studentPhoto: "/uploads/default.png"

        }));

        await Student.insertMany(formattedStudents);

        res.json({ message: "Bulk students added" });

    } catch (err) {

        console.log(err);
        res.status(500).json({ error: err.message });

    }

});

app.get("/student", async (req, res) => {
    try {
        const data = await Student.aggregate([
            {
                $project: {
                    studentId: "$_id",
                    studentName: 1,
                    studentEmail: 1,
                    studentAddress: 1,
                    studentRollno: 1,
                    studentDob: 1,
                    classId: 1,
                    semId: 1,
                    teacherId: 1,
                    yearId: 1,
                    studentContact: 1,
                    studentPassword: 1,
                    studentPhoto: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    _id: 0
                }
            }
        ]);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/student/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Student.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },

            {
                $lookup: {
                    from: "classes",
                    localField: "classId",
                    foreignField: "_id",
                    as: "class"
                }
            },
            { $unwind: { path: "$class", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "courses",
                    localField: "class.courseId",
                    foreignField: "_id",
                    as: "course"
                }
            },
            { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "departments",
                    localField: "course.departmentId",
                    foreignField: "_id",
                    as: "department"
                }
            },
            { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "years",
                    localField: "yearId",
                    foreignField: "_id",
                    as: "year"
                }
            },
            { $unwind: { path: "$year", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "sems",
                    localField: "semId",
                    foreignField: "_id",
                    as: "sem"
                }
            },
            { $unwind: { path: "$sem", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "teachers",
                    localField: "teacherId",
                    foreignField: "_id",
                    as: "teacher"
                }
            },
            { $unwind: { path: "$teacher", preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    studentId: "$_id",
                    teacherId: 1,
                    studentName: 1,
                    studentEmail: 1,
                    studentAddress: 1,
                    studentRollno: 1,
                    studentContact: 1,
                    studentPhoto: 1,
                    studentDob: 1,
                    className: "$class.className",
                    departmentName: "$department.departmentName",
                    academicYear: "$year.yearName",
                    semesterName: "$sem.semName",
                    classTeacher: "$teacher.teacherName",
                    _id: 0
                }
            }
        ]);

        res.json({ data: data[0] });

    } catch (err) {
        res.status(500).send("Server error");
    }
});



app.get("/subjects-by-student/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;

        // ⭐ get student with class populated
        const student = await Student.findById(studentId).populate("classId");

        if (!student || !student.classId) {
            return res.json({ data: [] });
        }

        const courseId = student.classId.courseId;
        const semId = student.semId;

        console.log("Auto Course:", courseId);
        console.log("Auto Semester:", semId);

        const subjects = await Subject.find({
            courseId: courseId,
            semId: semId
        });

        res.json({ data: subjects });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.get("/attendance-by-student/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;

        // first get student semester
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const currentSem = student.semId;

        // fetch attendance only for that semester
        const attendance = await Attendance.find({
            studentId: studentId,
            semId: currentSem
        })
            .populate({
                path: "subjectId",
                model: "Subject",
                select: "subjectName"
            })
            .populate({
                path: "semId",
                model: "Sem",
                select: "semName"
            })
            .populate({
                path: "studentId",
                model: "Student",
                select: "studentName"
            })
            .sort({ createdAt: -1 });

        res.json({ data: attendance });

    } catch (err) {
        console.error("Attendance fetch error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/internalmark-by-student/:studentId", async (req, res) => {
    try {

        const { studentId } = req.params;

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const currentSem = student.semId;

        const internalmarks = await Internalmark.find({
            studentId,
            semId: currentSem
        })
            .populate({
                path: "subjectId",
                model: "Subject",
                select: "subjectName"
            })
            .populate({
                path: "semId",
                model: "Sem",
                select: "semName"
            })
            .sort({ createdAt: -1 });

        res.json({ data: internalmarks });

    } catch (err) {
        console.error("Internalmark fetch error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/complaint-by-student/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;

        const complaints = await Complaint.find({ studentId }).sort({
            createdAt: -1,
        });

        res.json({ data: complaints });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.get("/payment-status/:studentId", async (req, res) => {
    try {

        const { studentId } = req.params;

        const student = await Student.findById(studentId);

        const payment = await Condonation.findOne({
            studentId,
            semId: student.semId
        });

        res.json({
            condonationPaid: !!payment
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/student/status/:id", async (req, res) => {

    const student = await Student.findById(req.params.id);

    res.json({
        studentStatus: student.studentStatus
    });

});

app.put("/student/:id", upload.single("photo"), async (req, res) => {
    try {
        const { studentName, studentEmail, studentContact, studentAddress, studentRollno } = req.body;

        const updateData = {
            studentName,
            studentEmail,
            studentContact,
            studentAddress,
            studentRollno
        };

        if (req.file) {
            updateData.studentPhoto = `/uploads/${req.file.filename}`;
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json({ message: "student updated", student });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

app.put("/student/change-password/:id", async (req, res) => {
    try {
        const studentId = req.params.id;
        const { newPassword } = req.body;

        let student = await Student.findByIdAndUpdate(studentId, { studentPassword: newPassword }, { new: true });

        if (!student) {
            return res.json({ message: "student password not found" });
        } else {
            res.json({ message: "student password updated", student });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

app.put("/students/update-sem", async (req, res) => {
    try {

        const { teacherId, semId } = req.body;

        await Student.updateMany(
            { teacherId: teacherId },
            { $set: { semId: semId } }
        );

        res.json({ message: "Semester updated for all students" });

    } catch (err) {

        console.log(err);
        res.status(500).json({ error: err.message });

    }
});

app.put("/students/finish", async (req, res) => {

    const { teacherId } = req.body;

    try {

        await Student.updateMany(
            { teacherId: teacherId },
            { $set: { studentStatus: 1 } }
        );

        res.json({
            message: "Students marked as completed"
        });

    } catch (err) {

        res.status(500).json({
            message: "Error updating student status"
        });

    }

});

app.put("/Paymentcomplete/:id", async (req, res) => {
    try {
        const studentId = req.params.id;

        const student = await Student.findByIdAndUpdate(
            studentId,
            { condonationPaid: true },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({
            message: "Payment completed successfully",
            data: student
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.post("/department", async (req, res) => {
    try {
        const { departmentName } = req.body;

        let department = await Department.findOne({ departmentName });

        if (department) {
            return res.json({ message: " already exists" });
        }

        department = new Department({
            departmentName
        });

        await department.save();

        res.json({ message: " inserted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/department", async (req, res) => {
    try {
        const data = await Department.find()
        res.json({ data });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.put("/department/:id", async (req, res) => {
    try {
        const departmentId = req.params.id;
        const { departmentName } = req.body;

        let department = await Department.findByIdAndUpdate(departmentId, { departmentName }, { new: true });

        if (!department) {
            return res.json({ message: "Department not found" });
        } else {
            res.json({ message: "Department updated", department });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

app.delete("/department/:id", async (req, res) => {
    try {
        const departmentId = req.params.id;
        const deleteddepartment = await Department.findByIdAndDelete(departmentId);

        if (!deleteddepartment) {
            return res.json({ message: "Department not found" });
        } else {
            res.json({ message: "Department deleted successfully", deleteddepartment });
        }
    } catch (err) {
        console.error("Error deleting Department:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/course", async (req, res) => {
    try {
        const { courseName, departmentId } = req.body;

        let course = await Course.findOne({ courseName });

        if (course) {
            return res.json({ message: " already exists" });
        }

        course = new Course({
            courseName,
            departmentId

        });

        await course.save();

        res.json({ message: " inserted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/course", async (req, res) => {
    try {
        const data = await Course.aggregate([
            {
                $project: {
                    courseId: "$_id",
                    courseName: 1,
                    departmentId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    _id: 0
                }
            }
        ]);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/course/:id", async (req, res) => {
    try {
        const courseId = req.params.id;
        const { courseName, departmentId } = req.body;


        let course = await Course.findByIdAndUpdate(courseId, { courseName, departmentId }, { new: true });

        if (!course) {
            return res.json({ message: "course not found" });
        } else {
            res.json({ message: "course updated", course });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});


app.delete("/course/:id", async (req, res) => {
    try {
        const courseId = req.params.id;
        const deletedcourse = await Course.findByIdAndDelete(courseId);

        if (!deletedcourse) {
            return res.json({ message: "Course not found" });
        } else {
            res.json({ message: "Course deleted successfully", deletedcourse });
        }
    } catch (err) {
        console.error("Error deleting Course:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/subject", async (req, res) => {
    try {
        const { subjectName, departmentId, courseId, semId } = req.body;


        let subject = await Subject.findOne({
            subjectName: subjectName,
            departmentId: departmentId,
            semId: semId
        });

        if (subject) {
            return res.json({ message: "Subject already exists in this department for the selected semester" });
        }

        subject = new Subject({
            subjectName,
            departmentId,
            courseId,
            semId
        });

        await subject.save();

        res.json({ message: "Subject inserted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/subject", async (req, res) => {
    try {
        const data = await Subject.aggregate([
            {
                $project: {
                    subjectId: "$_id",
                    subjectName: 1,
                    departmentId: 1,
                    courseId: 1,
                    semId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    // _id: 0
                }
            }
        ]);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/subject/:id", async (req, res) => {
    try {
        const subjectId = req.params.id;
        const { subjectName, departmentId, semId, courseId } = req.body;


        let subject = await Subject.findByIdAndUpdate(subjectId, { subjectName, departmentId, semId, courseId }, { new: true });

        if (!subject) {
            return res.json({ message: "subject not found" });
        } else {
            res.json({ message: "subject updated", subject });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});


app.delete("/subject/:id", async (req, res) => {
    try {
        const subjectId = req.params.id;
        const deletedsubject = await Subject.findByIdAndDelete(subjectId);

        if (!deletedsubject) {
            return res.json({ message: "subject not found" });
        } else {
            res.json({ message: "subject deleted successfully", deletedsubject });
        }
    } catch (err) {
        console.error("Error deleting subject:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.post("/class", async (req, res) => {
  try {

    const { className, departmentId, courseId, teacherId } = req.body;

    if (!className || !departmentId || !courseId || !teacherId) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    let cf = await Cf.findOne({ className });

    if (cf) {
      return res.json({ message: "already exists" });
    }

    cf = new Cf({
      className: className.trim(),
      departmentId,   // ✅ ADD THIS
      courseId,
      teacherId
    });

    await cf.save();

    res.json({ message: "inserted successfully" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/class", async (req, res) => {
    try {
        const data = await Cf.find();
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/class/:id", async (req, res) => {
    try {
        const classId = req.params.id;
        const { className, teacherId, courseId } = req.body;


        let cf = await Cf.findByIdAndUpdate(classId, { className, teacherId, courseId }, { new: true });

        if (!cf) {
            return res.json({ message: "class not found" });
        } else {
            res.json({ message: "class updated", cf });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});


app.delete("/class/:id", async (req, res) => {
    try {
        const classId = req.params.id;
        const deletedclass = await Cf.findByIdAndDelete(classId);

        if (!deletedclass) {
            return res.json({ message: "class not found" });
        } else {
            res.json({ message: "class deleted successfully", deletedclass });
        }
    } catch (err) {
        console.error("Error deleting class:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.post("/info", upload.single("infoFile"), async (req, res) => {
    try {
        const { infoDetails, infoDate } = req.body;

        // 🔑 THIS IS THE FIX
        const infoFile = req.file ? `/uploads/${req.file.filename}` : "";

        if (!infoFile || !infoDetails || !infoDate) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const info = new Info({
            infoFile,
            infoDetails,
            infoDate,
        });

        await info.save();

        res.json({ message: "inserted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/info", async (req, res) => {
    try {

        const info = await Info.find().sort({ createdAt: -1 });

        res.json({ data: info });

    } catch (err) {

        console.error(err);
        res.status(500).json({ message: "Server error" });

    }
});

app.post("/year", async (req, res) => {
    try {
        const { yearName } = req.body;

        let year = await Year.findOne({ yearName });

        if (year) {
            return res.json({ message: " already exists" });
        }

        year = new Year({
            yearName

        });

        await year.save();

        res.json({ message: " inserted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/year", async (req, res) => {
    try {
        const data = await Year.find()
        res.json({ data });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.put("/year/:id", async (req, res) => {
    try {
        const yearId = req.params.id;
        const { yearName } = req.body;

        let year = await Year.findByIdAndUpdate(yearId, { yearName }, { new: true });

        if (!year) {
            return res.json({ message: "year not found" });
        } else {
            res.json({ message: "year updated", year });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

app.delete("/year/:id", async (req, res) => {
    try {
        const yearId = req.params.id;
        const deletedyear = await Year.findByIdAndDelete(yearId);

        if (!deletedyear) {
            return res.json({ message: "year not found" });
        } else {
            res.json({ message: "year deleted successfully", deletedyear });
        }
    } catch (err) {
        console.error("Error deleting Department:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.post("/sem", async (req, res) => {
    try {
        const { semName } = req.body;

        let sem = await Sem.findOne({ semName });

        if (sem) {
            return res.json({ message: " already exists" });
        }

        sem = new Sem({
            semName

        });

        await sem.save();

        res.json({ message: " inserted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


app.get("/sem", async (req, res) => {
    try {
        const data = await Sem.find()
        res.json({ data });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.put("/sem/:id", async (req, res) => {
    try {
        const semId = req.params.id;
        const { semName } = req.body;

        let sem = await Sem.findByIdAndUpdate(semId, { semName }, { new: true });

        if (!sem) {
            return res.json({ message: "sem not found" });
        } else {
            res.json({ message: "sem updated", sem });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

app.delete("/sem/:id", async (req, res) => {
    try {
        const semId = req.params.id;
        const deletedsem = await Sem.findByIdAndDelete(semId);

        if (!deletedsem) {
            return res.json({ message: "sem not found" });
        } else {
            res.json({ message: "sem deleted successfully", deletedsem });
        }
    } catch (err) {
        console.error("Error deleting Department:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/attendance", async (req, res) => {
    try {
        const {
            attendanceDate,
            attendanceHour,
            attendanceType,
            studentId,
            subjectId
        } = req.body;

        const student = await Student.findById(studentId);

        const semId = student.semId;

        let attendance = await Attendance.findOne({
            attendanceDate,
            attendanceHour,
            semId,
            studentId
        });

        if (attendance) {
            return res.json({ message: "Attendance already marked" });
        }

        attendance = new Attendance({
            attendanceDate,
            attendanceHour,
            attendanceType,
            semId,
            studentId,
            subjectId
        });

        await attendance.save();

        res.json({ message: "Inserted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.put("/attendance/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const { attendanceType } = req.body;

        const updatedAttendance = await Attendance.findByIdAndUpdate(
            id,
            { attendanceType },
            { new: true }
        );

        if (!updatedAttendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }

        res.json({
            message: "Attendance updated successfully",
            data: updatedAttendance
        });

    } catch (err) {

        console.error(err);
        res.status(500).json({ message: "Server error" });

    }
});


app.post("/notes", async (req, res) => {
    try {
        console.log("REQ BODY:", req.body)
        const { notesTitle, notesDetails, teacherId, subjectId } = req.body;

        if (!notesTitle || !notesDetails || !teacherId || !subjectId) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (
            !mongoose.Types.ObjectId.isValid(teacherId) ||
            !mongoose.Types.ObjectId.isValid(subjectId)
        ) {
            return res.status(400).json({ message: "Invalid teacher or subject" });
        }

        // ✅ FIXED: Check for duplicate notesTitle within the SAME subject only
        const exists = await Notes.findOne({
            notesTitle: notesTitle,
            subjectId: subjectId  // Add subjectId to the check
        });

        if (exists) {
            return res.json({ message: "Notes already exists for this subject" });
        }

        const notes = new Notes({
            notesTitle,
            notesDetails,
            teacherId,
            subjectId,
        });

        await notes.save();
        res.json({ message: "Inserted successfully" });

    } catch (err) {
        console.error("NOTES ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/notes", async (req, res) => {
    try {
        const data = await Notes.aggregate([
            {
                $lookup: {
                    from: "teachers",
                    localField: "teacherId",
                    foreignField: "_id",
                    as: "teacher"
                }
            },
            { $unwind: "$teacher" },

            {
                $lookup: {
                    from: "subjects",
                    localField: "subjectId",
                    foreignField: "_id",
                    as: "subject"
                }
            },
            { $unwind: "$subject" },

            {
                $project: {
                    notesId: "$_id",
                    notesTitle: 1,
                    notesDetails: 1,
                    teacherId: 1,
                    subjectId: 1,
                    teacherName: "$teacher.teacherName",
                    subjectName: "$subject.subjectName",
                    _id: 0
                }
            }
        ]);

        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/notesfiles", upload.single("notefilesFile"), async (req, res) => {
    try {
        const savedFileName = req.file.filename;
        const originalName = req.file.originalname;
        const notesId = req.body.noteId;

        let notesfiles = new NoteFiles({
            notefilesFile: savedFileName,
            originalName: originalName,
            noteId: notesId
        });

        await notesfiles.save();

        res.json({ message: " inserted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/notesfiles/:noteId", async (req, res) => {
    try {
        const { noteId } = req.params;

        const data = await NoteFiles.aggregate([
            {
                $match: {
                    noteId: new mongoose.Types.ObjectId(noteId)
                }
            },
            {
                $lookup: {
                    from: "notes",
                    localField: "noteId",
                    foreignField: "_id",
                    as: "note"
                }
            },
            { $unwind: "$note" },
            {
                $project: {
                    notefileId: "$_id",
                    notefilesFile: 1,
                    originalName: 1,
                    noteId: "$note._id",
                    notesTitle: "$note.notesTitle",
                    notesDetails: "$note.notesDetails",
                    teacherId: "$note.teacherId",
                    subjectId: "$note.subjectId",
                    createdAt: 1,
                    _id: 0

                }
            }
        ]);

        res.json({ data });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});


app.post("/complaint", async (req, res) => {
    try {
        const { complaintTitle, complaintContent, complaintReply, studentId } = req.body;

        let complaint = await Complaint.findOne({ complaintTitle, complaintContent });

        if (complaint) {
            return res.json({ message: " already exists" });
        }

        complaint = new Complaint({
            complaintTitle,
            complaintContent,
            complaintReply,
            studentId
        });

        await complaint.save();

        res.json({ message: " inserted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.put("/complaint-reply/:id", async (req, res) => {
    try {
        const { complaintReply } = req.body;

        await Complaint.findByIdAndUpdate(req.params.id, {
            complaintReply,
        });

        res.json({ message: "Reply updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.delete("/complaint/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await Complaint.findByIdAndDelete(id);

        res.json({ message: "Complaint deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.post("/feedback", async (req, res) => {
    try {
        const { feedbackContent, teacherId, studentId } = req.body;

        let feedback = await Feedback.findOne({
            feedbackContent,
            teacherId,
            studentId,
        });

        if (feedback) {
            return res.json({ message: " already exists" });
        }

        feedback = new Feedback({
            feedbackContent,
            teacherId: teacherId || null,
            studentId: studentId || null,
        });

        await feedback.save();

        res.json({ message: " inserted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/feedback-by-student/:studentId", async (req, res) => {
    try {
        const data = await Feedback.find({
            studentId: req.params.studentId,
        }).sort({ createdAt: -1 });

        res.json({ data });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

app.get("/feedback-by-teacher/:teacherId", async (req, res) => {
    try {
        const data = await Feedback.find({
            teacherId: req.params.teacherId,
        }).sort({ createdAt: -1 });

        res.json({ data });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

app.post("/internalmark", async (req, res) => {
    try {

        const { internalmarkMark, internalmarkFull, studentId, subjectId } = req.body;

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const semId = student.semId;

        // prevent duplicate mark for same subject + semester
        let internalmark = await Internalmark.findOne({
            studentId,
            subjectId,
            semId
        });

        if (internalmark) {
            return res.json({ message: "Internal mark already added" });
        }

        internalmark = new Internalmark({
            internalmarkMark,
            internalmarkFull,
            studentId,
            subjectId,
            semId
        });

        await internalmark.save();

        res.json({ message: "Inserted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const admin = await Admin.findOne({ adminEmail: email, adminPassword: password });

    if (admin) {
        return res.send({
            role: "admin",
            id: admin._id,
            name: admin.adminName,
            message: "Login successful",
        });
    }

    const student = await Student.findOne({ studentEmail: email, studentPassword: password });

    if (student) {

        if (student.studentStatus == 1) {
            return res.status(403).json({
                message: "Your student ID has expired. Please contact administration."
            });
        }

        return res.send({
            role: "student",
            id: student._id,
            name: student.studentName,
            message: "Login successful",
        });
    }


    const teacher = await Teacher.findOne({
        teacherEmail: email,
        teacherPassword: password
    });

    if (teacher) {

        // ❌ Pending approval
        if (teacher.teacherStatus === 0) {
            return res.status(403).json({
                message: "Your account is waiting for admin approval."
            });
        }

        // ❌ Rejected
        if (teacher.teacherStatus === 2) {
            return res.status(403).json({
                message: "Your registration was rejected by admin."
            });
        }

        // ✅ Approved
        if (teacher.teacherStatus === 1) {
            return res.send({
                role: "teacher",
                id: teacher._id,
                name: teacher.teacherName,
                message: "Login successful",
            });
        }
    }

    return res.status(401).json({
        message: "Invalid email or password"
    });

});

app.post("/condonation", async (req, res) => {
    try {
        const { condonationAmount, studentId } = req.body;

        if (!studentId || !condonationAmount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // get student's current semester
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const semId = student.semId;

        // check if already paid for this semester
        const existing = await Condonation.findOne({
            studentId,
            semId
        });

        if (existing) {
            return res.json({ message: "Condonation already paid for this semester" });
        }

        const condonation = new Condonation({
            condonationAmount,
            studentId,
            semId
        });

        await condonation.save();

        res.json({
            message: "Condonation payment saved successfully",
            data: condonation
        });

    } catch (err) {
        console.error("Condonation error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/chat/send", async (req, res) => {

    try {

        const { chatMessage, fromstudentId, toteacherId, fromteacherId, tostudentId } = req.body;

        const chat = new Chat({
            chatMessage,
            fromstudentId: fromstudentId || null,
            toteacherId: toteacherId || null,
            fromteacherId: fromteacherId || null,
            tostudentId: tostudentId || null,
            unreadForTeacher: fromstudentId ? true : false,
            unreadForStudent: fromteacherId ? true : false
        });

        await chat.save();

        res.json({ success: true, data: chat });

    } catch (err) {

        console.log(err);
        res.status(500).json({ message: "Chat failed" });

    }

});

app.get("/chat/:studentId/:teacherId", async (req, res) => {

    try {

        const { studentId, teacherId } = req.params;

        const chats = await Chat.find({

            $or: [

                {
                    fromstudentId: studentId,
                    toteacherId: teacherId
                },

                {
                    fromteacherId: teacherId,
                    tostudentId: studentId
                }

            ]

        }).sort({ createdAt: 1 });

        res.json(chats);

    } catch (err) {

        console.log(err);
        res.status(500).json({ message: "Chat load failed" });

    }

});

app.get("/chat/teacher/notifications/:teacherId", async (req, res) => {

    const { teacherId } = req.params;

    const notifications = await Chat.aggregate([

        {
            $match: {
                toteacherId: new mongoose.Types.ObjectId(teacherId),
                unreadForTeacher: true
            }
        },

        {
            $group: {
                _id: "$fromstudentId",
                count: { $sum: 1 }
            }
        }

    ]);

    res.json(notifications);

});

app.put("/chat/teacher/read/:studentId/:teacherId", async (req, res) => {

    const { studentId, teacherId } = req.params;

    await Chat.updateMany(
        {
            fromstudentId: studentId,
            toteacherId: teacherId,
            unreadForTeacher: true
        },
        {
            $set: { unreadForTeacher: false }
        }
    );

    res.json({ success: true });

});

app.put("/chat/student/read/:teacherId/:studentId", async (req, res) => {

    const { teacherId, studentId } = req.params;

    await Chat.updateMany(
        {
            fromteacherId: teacherId,
            tostudentId: studentId,
            unreadForStudent: true
        },
        {
            $set: { unreadForStudent: false }
        }
    );

    res.json({ success: true });

});

app.post("/leave/upload", upload.single("leaveFile"), async (req, res) => {

    const { studentId, semId } = req.body;

    const leave = new Leave({
        leaveFile: req.file.filename,
        studentId,
        semId
    });

    await leave.save();

    res.json({ success: true });

});

app.get("/leave/bonus/:studentId/:semId", async (req, res) => {

    const { studentId, semId } = req.params;

    const approvedLeaves = await Leave.find({
        studentId,
        semId,
        status: "Approved"
    });

    let bonus = approvedLeaves.length * 10;

    res.json({ bonus });

});

app.get("/leave/student/:studentId/:semId", async (req, res) => {

    const { studentId, semId } = req.params;

    if (!semId) {
        return res.status(400).json({ message: "semId missing" });
    }

    const leaves = await Leave.find({
        studentId,
        semId
    });

    res.json({ data: leaves });

});

app.put("/leave/approve/:leaveId", async (req, res) => {

    const leave = await Leave.findById(req.params.leaveId);

    if (!leave) {
        return res.status(404).json({ message: "Leave not found" });
    }

    leave.status = "Approved";
    await leave.save();

    /* calculate attendance */

    const attendance = await Attendance.find({
        studentId: leave.studentId,
        semId: leave.semId
    });

    const total = attendance.length;

    const present = attendance.filter(
        a => a.attendanceType === "Present"
    ).length;

    let percent = 0;

    if (total > 0) {
        percent = (present / total) * 100;
    }

    /* add 10% */

    percent = percent + 10;

    if (percent > 100) {
        percent = 100;
    }

    res.json({
        success: true,
        bonusPercent: percent
    });

});

app.put("/leave/reject/:leaveId", async (req, res) => {

    await Leave.findByIdAndUpdate(req.params.leaveId, {
        status: "Rejected"
    });

    res.json({ success: true });

});