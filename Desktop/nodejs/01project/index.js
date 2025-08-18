const express = require("express");
const users = require("./MOCK_DATA.json");
const app = express();
const mongoose = require("mongoose");
const PORT = 8000;

//connection
mongoose.connect('mongodb://127.0.0.1:27017/backend-practice')
.then(()=>console.log("Mongodb connected"))
.catch((err)=>console.log("Mongo error",err));
//schema
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,

    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    jobTitle:{
        type:String,
    },
    gender:{
        type:String,
    },
});
const User=mongoose.model("user",userSchema);

// ====== GLOBAL MIDDLEWARES ======
app.use(express.json());
app.use((req, res, next) => {
    console.log(`⚡ [${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ====== HELPER FUNCTIONS ======
function paginate(array, page = 1, limit = 10) {
    page = parseInt(page);
    limit = parseInt(limit);
    const start = (page - 1) * limit;
    return {
        page,
        limit,
        total: array.length,
        results: array.slice(start, start + limit)
    };
}

function renderLayout(title, content) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <title>${title}</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background:#0d0d0d; color:#eee; margin:0; padding:20px; }
            header { text-align:center; padding:20px; background:#111; }
            header h1 { color:#0f0; text-shadow:2px 2px 5px #000; }
            a { color:cyan; text-decoration:none; font-weight:bold; }
            a:hover { color:yellow; }
            table { width:100%; border-collapse:collapse; margin-top:20px; }
            th, td { padding:12px; border:1px solid #333; }
            th { background:#1a1a1a; color:#0ff; }
            tr:nth-child(even) { background:#1a1a1a; }
            tr:hover { background:#262626; transition:0.2s; }
            input { padding:8px; border-radius:5px; border:none; width:250px; margin-bottom:20px; }
            footer { margin-top:40px; text-align:center; color:#888; font-size:0.9em; }
            .card { background:#1a1a1a; padding:20px; border-radius:10px; max-width:400px; margin:20px auto; }
            .card h2 { color:#0ff; }
        </style>
    </head>
    <body>
        <header><h1>👑 ${title}</h1></header>
        ${content}
        <footer>⚡ God-Tier API v1.0</footer>
    </body>
    </html>
    `;
}

// ====== API ROUTES ======
app.get("/api/users", (req, res) => {
    const { page, limit } = req.query;
    const data = paginate(users, page, limit);
    res.json({
        status: "success",
        total: data.total,
        page: data.page,
        limit: data.limit,
        results: data.results.length,
        data: data.results
    });
});

app.get("/api/users/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    res.json({ status: "success", data: user });
});

// ====== WEB ROUTES ======
app.get("/", (req, res) => {
    res.send(renderLayout("God-Tier API", `
        <p>Available routes:</p>
        <ul>
            <li><a href="/users">/users</a> → Table of users</li>
            <li><a href="/api/users">/api/users</a> → JSON API</li>
        </ul>
    `));
});

app.get("/users", (req, res) => {
    const rows = users.map(u => `
        <tr>
            <td>${u.id}</td>
            <td><a href="/users/${u.id}">${u.first_name} ${u.last_name}</a></td>
            <td>${u.email}</td>
            <td>${u.gender}</td>
        </tr>
    `).join("");

    res.send(renderLayout("Users Table 👑", `
        <input type="text" id="search" placeholder="Search users..."/>
        <table>
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Gender</th></tr></thead>
            <tbody id="userTable">${rows}</tbody>
        </table>
        <script>
            const search = document.getElementById("search");
            const rows = document.querySelectorAll("#userTable tr");
            search.addEventListener("keyup", () => {
                const term = search.value.toLowerCase();
                rows.forEach(r => {
                    r.style.display = r.innerText.toLowerCase().includes(term) ? "" : "none";
                });
            });
        </script>
    `));
});

app.get("/users/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).send(renderLayout("Not Found", `<p>User not found</p>`));
    }
    res.send(renderLayout(`Profile: ${user.first_name}`, `
        <div class="card">
            <h2>${user.first_name} ${user.last_name}</h2>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Gender:</strong> ${user.gender}</p>
            <a href="/users">⬅ Back</a>
        </div>
    `));
});

// ====== 404 HANDLER ======
app.use((req, res) => {
    res.status(404).send(`
        <h1 style="color:red;">👑 404 - God says: this route does not exist</h1>
        <p>Route <code>${req.url}</code> vanished into the void.</p>
        <p><a href="/">⬅ Back Home</a></p>
    `);
});

// ====== START SERVER ======
app.listen(PORT, () => {
    console.log(`👑 GOD-TIER SERVER running at http://localhost:${PORT}`);
});
