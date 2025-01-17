import mongoose from "mongoose";
import { createApp } from "./createApp.mjs";

// import "./strategies/google-strategy.mjs";

mongoose
  .connect("mongodb://localhost/express_js")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const app = createApp();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
