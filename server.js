const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const MAX_PLAYERS = 64;
const DATA_FILE = path.join(__dirname, "database.json");

// Função pra ler o JSON
function lerDatabase() {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE);
    try {
        return JSON.parse(data);
    } catch (err) {
        console.error("Erro ao ler database.json:", err);
        return [];
    }
}

// Função pra salvar no JSON
function salvarDatabase(players) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2));
}

// Rota principal (index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Adicionar player
app.post("/add", (req, res) => {
    const { nick, id } = req.body;

    if (!nick || !id) return res.status(400).send("Dados inválidos");
    if (nick.length > 100 || id.length > 50) return res.status(400).send("Texto muito grande");

    const players = lerDatabase();

    if (players.length >= MAX_PLAYERS) return res.status(400).send("Limite de 64 jogadores atingido");
    if (players.find(p => p.id === id)) return res.status(400).send("Esse ID já foi registrado");

    players.push({ nick, id, data: new Date() });
    salvarDatabase(players);

    res.send("ok");
});

// Listar players
app.get("/list", (req, res) => {
    const players = lerDatabase();
    res.json(players);
});

// Deletar player pelo ID
app.post("/delete", (req, res) => {
    const { id } = req.body;
    let players = lerDatabase();

    const lengthAntes = players.length;
    players = players.filter(p => p.id !== id);

    if (players.length === lengthAntes) return res.status(400).send("ID inválido");

    salvarDatabase(players);
    res.send("deleted");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
