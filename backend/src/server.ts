import express from "express";
import cors from "cors";
import placeholder from "./routes/placeholder";

const app = express();
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

