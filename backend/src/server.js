require('dotenv').config();
const { app } = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("ERRR: ", error);
            throw error;
        });

        app.listen(PORT, () => {
            console.log(`⚙️ Server is running at port : ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });
