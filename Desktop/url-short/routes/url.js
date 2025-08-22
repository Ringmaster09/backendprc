const express = require("express");
const { handleGenerateNewShortURL } = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL); // ✅ fixed typo

module.exports = router;
