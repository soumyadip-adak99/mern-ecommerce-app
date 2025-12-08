import dotenv from "dotenv";
import { app, BASE_API } from "./app.js";

dotenv.config({
    path: "./env",
});

const PORT = process.env.PORT;

app.listen(PORT || 8080, () => {
    console.log(`Server running on: http://localhost:${PORT || 8081}${BASE_API}`);
});
