const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // เชื่อมต่อฐานข้อมูล
const router = express.Router();
require("dotenv").config();

//ตรวจสอบว่าแม่น Admin บ่
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ error: "Token not provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err || user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
        }

        req.admin = user; 
        next();
    });
};


router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM admins WHERE username = $1", [username]);
        if (result.rows.length === 0) {
        return res.status(401).json({ message: "ไม่พบผู้ใช้" });
        }

        const admin = result.rows[0];
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
        return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
        }

        const token = jwt.sign({ admin_id: admin.admin_id,role:admin.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        delete admin.password;
        res.json({ token, admin });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
});



//เพิ่มผู้ดูแล
router.post('/',verifyAdmin,async(req,res) =>{
    const {username, password, role, created_at} =req.body;
    try {
        const result = await pool.query(`INSERT INTO admins(username,password,role,created_at)VALUES($1,$2,$3,$4) RETURNING*`,
            [username,password,role,created_at]
        );
        res.status(201).json(result.rows[0]);
    } catch (erroe){
        console.error(erroe.message);
    }
});


//ดูผู้ดูแลทั้งหมด
router.get('/',verifyAdmin,async (req,res) =>{
    try {
        const result = await pool.query('SELECT * FROM admins');
        res.json(result.rows);
    } catch (error){
        console.error(error.message);
    }
});

// ข้อมูลผู้ดูแลที่ล็อกอินอยู่
router.get('/me', verifyAdmin, async (req, res) => {
    try {
        const { admin_id } = req.admin; // มาจาก JWT token
        const result = await pool.query("SELECT admin_id, username, first_name, last_name, profile_image FROM admins WHERE admin_id = $1", [admin_id]);

        if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Admin not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});



//แก้ไข
router.put('/:id',verifyAdmin,async(req,res) =>{
    const {id} =req.params;
    const {username, password} = req.body;
    try {
        await pool.query(
            `UPDATE admins SET username=$1,password=$2 WHERE admin_id=$3 `,
            [username,password, id]
        );
        res.json({message: "อัปเดตแอดมินสำเร็จ"});
    }catch (error){
        console.error(error.message);
    }
});

//ลบแอดมิน
router.delete('/:id',verifyAdmin,async(req,res) =>{
    const {id} =req.params;
    try{
        await pool.query('DELETE FROM admins WHERE admin_id=$1',[id]);
        res.json({message: "ลบแอดมินสำเร็จ"});
    }catch (error){
        console.error(error.message);
    }
});





module.exports = router;