const express = require("express");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

// API route (returns JSON response)
app.get("/api/users", (req, res) => {
    res.json(users);
});

// HTML route (renders list of users)
app.get("/users", (req, res) => {
    const html = `
        <h1>Users List</h1>
        <ul>
            ${users.map(user => `<li>${user.first_name} ${user.last_name}</li>`).join("")}
        </ul>
    `;
    res.send(html);
});

// Root route
app.get("/", (req, res) => {
    res.send(`
        <h2>Welcome to the API</h2>
        <p>Available routes:</p>
        <ul>
            <li><a href="/users">/users</a> → HTML list of users</li>
            <li><a href="/api/users">/api/users</a> → JSON data</li>
        </ul>
    `);
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
