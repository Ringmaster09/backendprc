const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;

    // validate if url is provided
    if (!body.url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // generate unique short ID
    const shortID = nanoid(8);

    // save to DB
    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitedHistory: [], // initialize empty visits history
    });

    // send response
    return res.status(201).json({ shortId: shortID });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { handleGenerateNewShortURL };
