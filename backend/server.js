const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

//ใส่ตรงนี้
const patientsRoutes = require("./routes/patients");
const appointmentsRoutes = require("./routes/appointments");
const measurementsRoutes = require("./routes/measurements");
const medical_recordsRoutes = require("./routes/medical_records");
const notificationsRoutes = require("./routes/notifications");
const queueRoutes = require("./routes/queue");
const adminsRoutes = require("./routes/admins");
const usersRoutes = require("./routes/users")


app.use(cors());
app.use(express.json())

//app ใส่ตรงนี้
app.use("/api/patients", patientsRoutes);
app.use("/api/appointments",appointmentsRoutes);
app.use("/api/measurements",measurementsRoutes);
app.use("/api/medical_records",medical_recordsRoutes);
app.use("/api/notifications",notificationsRoutes);
app.use("/api/queue",queueRoutes);
app.use("/api/admins",adminsRoutes);
app.use("/api/users",usersRoutes); 


app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});