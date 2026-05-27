const express=require("express");
const app = express();
const { verifyEmail } =
    require("./src/emailVerifier");
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API running successfully");
});

app.get("/verify", async (req, res) => {

    try {

        const email = req.query.email;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email query parameter is required"
            });
        }

        
        const result =
            await verifyEmail(email);

        return res.json(result);

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});