const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ⚡ Serve a pasta public
app.use(express.static(path.join(__dirname, "public")));

// Caminho absoluto para o arquivo de database
const DB_FILE = path.join(__dirname, "database.json");
const MAX_PLAYERS = 64;

// Função para ler o database
function readDB() {
    if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "[]");
    try {
        const data = fs.readFileSync(DB_FILE, "utf8");
        return JSON.parse(data);
    } catch (e) {
        console.error("Erro ao ler database.json:", e);
        return [];
    }
}

// Função para escrever no database
function writeDB(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
        console.log("Database atualizado:", data);
    } catch (e) {
        console.error("Erro ao escrever database.json:", e);
    }
}

// rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// adicionar player
app.post("/add", (req, res) => {
    const { nick, id } = req.body;
    if (!nick || !id) return res.status(400).send("Dados inválidos");
    if (nick.length > 100 || id.length > 50) return res.status(400).send("Texto muito grande");

    let db = readDB();
    if (db.length >= MAX_PLAYERS) return res.status(400).send("Limite de 64 jogadores atingido");

    const existe = db.find(p => p.id === id);
    if (existe) return res.status(400).send("Esse ID já foi registrado");

    db.push({ nick, id });
    writeDB(db);

    console.log(`Novo jogador adicionado: ${nick} (${id})`);
    res.send("ok");
});

// listar players
app.get("/list", (req, res) => {
    res.json(readDB());
});

// deletar player
app.post("/delete", (req, res) => {
    const { index } = req.body;
    let db = readDB();

    if (index < 0 || index >= db.length) return res.status(400).send("Índice inválido");

    const removido = db.splice(index, 1);
    writeDB(db);

    console.log(`Jogador deletado:`, removido[0]);
    res.send("deleted");
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor da Copa Brawl está online! Porta:", PORT));
