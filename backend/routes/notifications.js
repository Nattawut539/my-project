const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // เชื่อมต่อฐานข้อมูล
const router = express.Router();

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

//เพิ่มการแจ้งเตือน
router.post('/',verifyAdmin,async(req,res) =>{
    const {user_id, message, sent_at} = req.body;
    try{
        const result = await pool.query(
            `INSERT INTO notifications (user_id, message,sent_at) VALUES($1, $2, $3) RETURNING *`,
            [user_id,message,sent_at]
        );
        res.status(201).json(result.rows[0]);
    } catch (error){
        console.error(error.message);
    }
});

//ดูการแจ้งเตือนทั้งหมด
router.get('/',verifyAdmin,async(req,res) =>{
    try {
        const result = await pool.query('SELECT * FROM notifications ORDER BY sent_at DESC');
        res.json(result.rows);
    } catch (error){
        console.error(error.message);
    }
});

//ลบการแจ้งเตือน
router.delete('/',verifyAdmin,async(req,res) =>{
    const {id} =req.params;
    try{
        await pool.query('DELETE FROM notifications WHERE notification_id=$1',[id]);
        res.json({message: "ลบการแจ้งเตือนสำเร็จ"});
    }catch(error){
        console.error(error.message);
    }
});

module.exports = router;