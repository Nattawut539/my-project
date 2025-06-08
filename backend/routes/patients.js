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
        next();
    });
};


// 📌 GET: ดึงข้อมูลผู้ป่วยทั้งหมด
router.get("/",verifyAdmin, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลทั้งหมด" });
    }
});

// 📌 GET: ดึงข้อมูลผู้ป่วยรายคน
router.get("/national/:national_id", async (req, res) => {
    const { national_id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM users WHERE national_id = $1", [national_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "ไม่พบผู้ป่วย" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
    }
});
// 📌 PUT: อัปเดตข้อมูลผู้ป่วย
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone, address, profile_image } = req.body;
    console.log("✅ Received Data:", req.body); // Debug log

    try {
        await pool.query(
            `UPDATE users 
                SET first_name = $1, last_name = $2, email = $3, 
                    phone = $4, address = $5, profile_image = $6 
                WHERE user_id = $7`,
            [first_name, last_name, email, phone, address, profile_image, id]
        );
        res.json({ message: "อัปเดตข้อมูลสำเร็จ" });
    } catch (err) {
        console.error("❌ ERROR:", err.message);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
});



module.exports = router;
