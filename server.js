const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors({
    origin: "*",  
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"] 
}));


const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error(err.message);
        console.log("Erro ao se conectar ao Banco de dados", err.message);
    } else {
        console.log("Conectado ao SQLite.");
        return;
    }
});


db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
)`);



// Rota para listar usuários
app.get("/usuarios", (req, res) => {
    db.all("SELECT * FROM usuarios", [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Rota para adicionar usuário
app.post("/usuarios", (req, res) => {
    const { name, email,password } = req.body;
    db.run("INSERT INTO usuarios (name, email,password) VALUES (?, ?,?)", [name, email, password], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, name, email, password });
    });
});

// Rota para deletar usuário

app.delete("/usuarios/:id", (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM usuarios WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ message: "Erro ao deletar usuario", error: err.message});
            return;
        }
        res.json({ message: "Usuário deletado com sucesso!", id });
    });
});

// Rota para deletar todos os usuarios
app.delete("/usuarios", (req, res) => {
    db.run("DELETE FROM usuarios", function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Todos os usuários deletados com sucesso!" });
    });
});

// Rota para atualizar usuário
app.put("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const { name , email, password } = req.body;

    db.run("UPDATE usuarios SET  name = ?, email = ?, password = ? WHERE id = ?", [ name,email, password, id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "Usuário atualizado com sucesso!", id });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});