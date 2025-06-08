const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // เชื่อมต่อฐานข้อมูล
const { default: next } = require("next");
const router = express.Router();

//ตรวจสอบว่าเป็น Admin บ่?
function verifyAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // <<< ตรวจตรงนี้ว่า split สำเร็จ
  if (!token) return res.status(403).json({ error: "Invalid token format" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ error: "Token verification failed" });

    req.admin = decoded; // ใช้ .admin_id ได้
    next();
  });
}

//ดูนัดม่งนัดหมายทั้งหมด
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM appointments ORDER BY appointment_date ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM appointments WHERE user_id = $1 ORDER BY appointment_date DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลนัดหมายของผู้ใช้ได้" });
  }
});


// อัปเดตเฉพาะ status
router.put("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query(
      `UPDATE appointments SET status = $1, action_taken = true WHERE appointment_id = $2`,
      [status, id]
    );
    res.json({ message: "อัปเดตสถานะสำเร็จ" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดต" });
  }
});



//ลบนัดม่งนัดหมายจ้าา
router.delete("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM appointments WHERE appointment_id = $1`, [
      id,
    ]);
    res.json({ message: "ลบนัดหมายถาวรแล้ว" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบ" });
  }
});



router.post("/", async (req, res) => {
  const { user_id, appointment_date, service_type } = req.body;

  
  if (!user_id || !appointment_date || !service_type) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO appointments (user_id, appointment_date, service_type, status, action_taken, created_at)
      VALUES ($1, $2, $3, 'pending', false, NOW())
      RETURNING *`,
      [user_id, appointment_date, service_type]
    );

    res.status(201).json({ message: "จองนัดสำเร็จ", appointment: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการจองนัด" });
  }
});


//เฉพาะนัดหมายและยกเลิก
router.get("/approved-or-cancelled", verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.appointment_id,
        a.user_id,
        u.first_name,
        u.last_name,
        a.appointment_date,
        a.service_type,
        a.status,
        a.created_at
      FROM appointments a
      JOIN users u ON a.user_id = u.user_id
      WHERE a.action_taken = true AND a.status IN ('approved', 'cancelled')
      ORDER BY a.appointment_date ASC;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลนัดหมายได้" });
  }
});

module.exports = router;
