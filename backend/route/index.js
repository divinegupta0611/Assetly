import express from "express";
const router = express.Router();

// Example GET route
router.get("/hello", (req, res) => {
  res.json({ message: "Hello from the API route!" });
});

// Example POST route
router.post("/data", (req, res) => {
  const { name } = req.body;
  res.json({ message: `Hello, ${name}!` });
});

export default router;
