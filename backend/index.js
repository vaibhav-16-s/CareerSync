const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/Db");

const AdminRoutes = require("./routes/AdminRoutes");
const HomeRoutes = require("./routes/HomeRoutes");
const EmployerRoutes = require("./routes/EmployerRoutes");
const JobSeekerRoutes = require("./routes/JobSeekerRoutes");
const ApplicationRoutes = require("./routes/AplicationRoutes");
const ProfileRoutes = require("./routes/ProfileRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.send("Welcome to Careerdart");
});

app.use("/api/home", HomeRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/employer", EmployerRoutes);
app.use("/api/jobseeker", JobSeekerRoutes);
app.use("/api/application", ApplicationRoutes);
app.use("/api/profile", ProfileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server connected successfully on port " + PORT);
});
