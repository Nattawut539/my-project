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

//เพิมคิว
router.post('/',verifyAdmin,async(req,res) =>{
    const {appointment_id, queue_number, priority} = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO queue_tickets(appointment_id, queue_number,priority) VALUES($1,$2,$3) RETURNING *`,
            [appointment_id, queue_number,priority]
        );
        res.status(201).json(result.rows[0]);
    } catch(error){
        console.error(error.message)
    }
});

//ดูคิวทั้งหมด
router.get('/',verifyAdmin,async(req,res) =>{
    try{
        const result = await pool.query('SELECT * FROM queue_tickets ORDER BY queue_number ASC');
        res.json(result.rows);
    } catch(error){
        console.error(error.message);
    }
});

//ลบคิว
router.delete('/',verifyAdmin,async(req,res) =>{
    const {id} =req.params;
    try{
        await pool.query('DELETE FROM queue_tickets WHERE ticket_id=&1',[id]);
        res.json({message: "ลบคิวสำเร็จ"});
    }catch (error){
        console.error(error.message);
    }
});

module.exports = router;