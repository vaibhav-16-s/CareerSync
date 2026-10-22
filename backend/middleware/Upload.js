const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Make sure upload folders exist
const folders = ["uploads/resumes", "uploads/profiles"];
folders.forEach((folder) => {
    const fullPath = path.join(__dirname, "..", folder);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const field = file.fieldname.toLowerCase();

        if (field === "resume") {
            cb(null, "uploads/resumes");
        } else if (field === "profilepic") {
            cb(null, "uploads/profiles");
        } else {
            cb(null, "uploads");
        }
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
