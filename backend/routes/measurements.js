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

//เพิ่มข้อมูลวัดผล
router.post('/',verifyAdmin,async(req,res) =>{
    const {user_id, weight, height, bmi,created_at } = req.body;
    try{
        const result = await pool.query(
            `INSERT INTO measurement(user_id, weight, height, bmi, created_at) VALUES ($1, $2, $3, $4, $5,) RETURNING *`,
            [user_id, weight, height, bmi, created_at]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error.message)
    }
});

//ดูข้อมูลการวัดผล
router.get('/',verifyAdmin,async(req,res) => {
    try{
        const result = await pool.query('SELECT * FROM measurements ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (erroe){
        console.error(erroe.message);
    }
});

router.delete('/' ,async(req,res) =>{
    const {id} = req.params;
    try{
        await pool.query('DELETE FROM measurements WHER measurements_id =$1',[id]);
    } catch (error){
        console.error(error.message);
    }
});

module.exports = router;