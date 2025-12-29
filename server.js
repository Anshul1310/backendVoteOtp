const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ==========================================
// CONFIGURATION (TEXT BEE)
// ==========================================
const TEXTBEE_API_KEY = "YOUR_TEXTBEE_API_KEY";
const TEXTBEE_DEVICE_ID = "YOUR_TEXTBEE_DEVICE_ID"; 

// 77 Students Phone Directory
const phoneDirectory = {
    "1": "+91 8922 0280 85", // Important: TextBee needs Country Code (+91)
    "2": "+919988776655",
    // ... add all 77 ...
};

// ==========================================
// ENDPOINT: SEND OTP
// ==========================================
app.post('/send-otp', async (req, res) => {
    const rollNumber = req.body.rollNumber;
    const otp = req.body.otp;

        const userPhone = req.body.phoneNumber;

        if (!userPhone) {
            console.log("❌ Error: Roll number not found in Database.");
            return res.status(404).json({ success: false, message: "Roll number not found in Admin Database." });
        }

    if (!userPhone) {
        return res.status(404).json({ success: false, message: "Roll number not found." });
    }

    console.log(`Sending OTP to Roll ${rollNumber} (${userPhone})...`);

    try {
        // --- CALL TEXT BEE API ---
        const response = await axios.post(
            `https://api.textbee.dev/api/v1/gateway/devices/69529e1b8a8761ab1a3ba7fb/send-sms`,
            {
                recipients: [ userPhone ],
                message: `Your Voting OTP is: ${otp}.`
            },
            {
                headers: {
                    'x-api-key': "c9f987e7-3144-45d6-a87b-0d91bee96ba0"
                }
            }
        );

        console.log("✅ SMS Sent via TextBee!", response.data);
        res.json({ success: true, message: "OTP Sent Successfully" });

    } catch (error) {
        // --- FALLBACK: CONSOLE LOG (If phone is offline/error) ---
        console.error("⚠️ TextBee Error (Phone offline?):", error.message);
        
        console.log("\n========================================");
        console.log(" 🔥 BACKUP MODE: MANUAL OTP ENTRY 🔥");
        console.log(` TO:   ${userPhone}`);
        console.log(` OTP:  ${otp}`);
        console.log("========================================\n");

        // Tell frontend it was success so the user can enter the OTP
        res.json({ success: true, message: "OTP Sent (Backup Mode)" });
    }
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});