const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // เชื่อมต่อฐานข้อมูล
const router = express.Router();

require("dotenv").config();

function verifyToken (req,res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({message :" Unauthorized"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message : "Token ไม่ถูกต้อง"})
    }
}

/*
// GET: รายชื่อผู้ใช้ทั้งหมด (ใช้เพื่อทดสอบหรือ admin เท่านั้น)
router.get("/", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM users ORDER BY user_id");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
    }
});*/


//ลงทะเบียน
router.post("/register", async (req, res) => {
    const {
        national_id, password, first_name, last_name, dob, phone, email, address, profile_image,
        title, age, gender, nationality, religion, race, blood_type, marital_status, occupation,
        allergy, congenital_disease, patient_type, treatment_level,
        admit_date, father_name, father_phone, mother_name, mother_phone,
        emergency_phone, emergency_email, emergency_line
    } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(`
            INSERT INTO users (
                national_id, password, first_name, last_name, dob, phone, email, address, profile_image,
                title, age, gender, nationality, religion, race, blood_type, marital_status, occupation,
                allergy, congenital_disease, patient_type, treatment_level,
                admit_date, father_name, father_phone, mother_name, mother_phone,
                emergency_phone, emergency_email, emergency_line
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9,
                $10, $11, $12, $13, $14, $15, $16, $17, $18,
                $19, $20, $21, $22,
                $23, $24, $25, $26, $27,
                $28, $29, $30
            )`, [
            national_id, hashedPassword, first_name, last_name, dob, phone, email, address, profile_image,
            title, age, gender, nationality, religion, race, blood_type, marital_status, occupation,
            allergy, congenital_disease, patient_type, treatment_level,
            admit_date, father_name, father_phone, mother_name, mother_phone,
            emergency_phone, emergency_email, emergency_line
        ]);
        res.status(201).json({ message: "ลงทะเบียนสำเร็จ" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
    }
});


//เข้าสู่ระบบ
router.post("/login", async (req, res) => {
    const { national_id, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE national_id = $1", [national_id]);
        if (result.rows.length === 0)
            return res.status(401).json({ message: "ไม่พบผู้ใช้" });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });

        delete user.password;
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
    }
});

//ดูข้อมูลของตน
router.get("/me/:id", verifyToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [req.user.user_id]);
        delete result.rows[0]?.password;
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "เกิดข้อผิดพลาด" });
    }
});


//แก้ไข้โปรไฟล์
router.put("/me", verifyToken, async (req, res) => {
    const {
        first_name, last_name, dob, phone, email, address, profile_image,
        title, age, gender, nationality, religion, race, blood_type, marital_status, occupation,
        allergy, congenital_disease, patient_type, treatment_level,
        admit_date, father_name, father_phone, mother_name, mother_phone,
        emergency_phone, emergency_email, emergency_line
    } = req.body;

    try {
        await pool.query(`
            UPDATE users SET 
                first_name = $1, last_name = $2, dob = $3, phone = $4, email = $5, address = $6, profile_image = $7,
                title = $8, age = $9, gender = $10, nationality = $11, religion = $12, race = $13, blood_type = $14, marital_status = $15, occupation = $16,
                allergy = $17, congenital_disease = $18, patient_type = $19, treatment_level = $20,
                admit_date = $21, father_name = $22, father_phone = $23, mother_name = $24, mother_phone = $25,
                emergency_phone = $26, emergency_email = $27, emergency_line = $28
            WHERE user_id = $29
        `, [
            first_name, last_name, dob, phone, email, address, profile_image,
            title, age, gender, nationality, religion, race, blood_type, marital_status, occupation,
            allergy, congenital_disease, patient_type, treatment_level,
            admit_date, father_name, father_phone, mother_name, mother_phone,
            emergency_phone, emergency_email, emergency_line,
            req.user.user_id
        ]);
        res.json({ message: "อัปเดตโปรไฟล์เรียบร้อย" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ไม่สามารถอัปเดตโปรไฟล์ได้" });
    }
});



//การจองคิวใหม่
router.post("/appointments", verifyToken, async (req, res) => {
    const { appointment_date, service_type } = req.body;

    if (!appointment_date || !service_type) {
        return res.status(400).json({ message: "กรุณากรอกวันที่และประเภทบริการให้ครบถ้วน" });
    }

    try {
        const conflict = await pool.query(
        `SELECT * FROM appointments WHERE appointment_date = $1`,
        [appointment_date]
        );

        if (conflict.rows.length > 0) {
        return res.status(400).json({ message: "วัน/เวลานี้มีผู้จองแล้ว" });
        }

        await pool.query(
        `INSERT INTO appointments(user_id, appointment_date, service_type, status) VALUES($1, $2, $3, 'pending')`,
        [req.user.user_id, appointment_date, service_type]
        );

        res.status(201).json({ message: "จองคิวสำเร็จ" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ไม่สามารถจองคิวได้" });
    }
});




//ดูติวของตนเอง
router.get("/appointments",verifyToken,async(req,res) =>{
    try{
        const result = await pool.query("SELECT * FROM appointments WHERE user_id = $1 ORDER BY appointment_date",
            [req.user.user_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message : "ไม่สามารถดึงข้อมูลนัดหมายได้"});
    }
});

//แก้ไขนัดหมาย
router.put("/appointments/:id",verifyToken,async(req,res) =>{
    const {id} =req.params;
    const {appointment_date, service_type} =req.body;

    try{
        const result = await pool.query("SELECT * FROM appointments WHERE appointment_id=$1",[id]);
        const appointment = result.rows[0];
        if(!appointment)
            return res.status(404).json({message : "ไม่พบคิวนัดหมาย"});

        if(appointment.user_id !== req.user.user_id)
            return res.status(403).json({message : "ไม่มีสิทธิ์แก้ไข"});

        if(appointment.status === 'confirmed')
            return res.status(403).json({message : "ไม่สามารถแก้ไขได้คิวที่ได้รับการยืนยันแล้ว"});

        await pool.query(
            `UPDATE appointments SET appointment_date =$1, service_type=$2 WHERE appointment_id =$3`,
            [appointment_date,service_type, id]
        );
        res.json({message : "แก้ไขสำเร็จ"});
    } catch (err){
        res.status(500).json({message: "ไม่สามารถแก้ไขคิวได้"})
    }
});

//ยกเลิกนัด
router.delete("/appointments/:id",verifyToken,async(req,res) =>{
    const {id} =req.params;

    try{
        const result = await pool.query("SELECT * FROM appointmests WHERE appointment_id=$1",{id});
        const appointment = result.rows[0];

        if(!appointment)
            return res.status(404).json({message: "ไม่พบคิวนัดหมาย"});

        if(appointment.user_id !== req.user.user_id)
            return res.status(403).json({message: "ไม่มีสิทธิ์ยกเลิก"});

        if(appointment.status === 'confirmed')
            return res.status(403).json({message : "ไม่สามารถยกเลิกคิวที่ได้รับการยืนยันแล้ว"});

        await pool.query("DELETE FROM appointments WHERE appointment_id = $1",[id]);
        res.json({message : "ยกเลิกคิวสำเร็จ"});
    } catch (err){
        res.status(500).json({ message : "ไม่สามารถยกเลิกคิวได้"});
    }
});

//ดูเวชระเบียน
router.get("/records",verifyToken,async(req,res) =>{
    try {
        const result =await pool.query(
            "SELECT * FROM medical_records WHERE user_id =$1 ORDER BY created_at DESC",
            [req.user.user_id]
        );
        res.json(result.rows);
    } catch (err){
        res.status(500).json({message : "ไม่สามารถดึงเวชระเบียนได้"});
    }
});

//การแจ้งเตือน
router.get("/notifications",verifyToken,async(req,res) =>{
    try{
        const result = await pool.query(
            "SELECT * FROM notifications WHERE user_id = $1 ORDER BY sent_at DESC",
            [req.user.user_id]
        );
        res.json(result.rows);
    } catch (err){
        res.status(500).json({message : "ไม่สามารถดึงการแจ้งเตือนได้"});
    }
});

module.exports = router;