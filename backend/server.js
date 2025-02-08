const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Configure Multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/detect_emotion", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const formData = new FormData();
        formData.append("file", req.file.buffer, {
            filename: "snapshot.jpg",
            contentType: "image/jpeg"
        });

        const response = await axios.post(
            "http://127.0.0.1:8000/detect_emotion/", // Ensure FastAPI is running
            formData,
            { headers: { ...formData.getHeaders() } }
        );

        res.json(response.data); // Send FastAPI response back to frontend
    } catch (error) {
        console.error("Error detecting emotion:", error);
        res.status(500).json({ error: "Emotion detection failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Node.js server running at http://localhost:${PORT}`);
});
