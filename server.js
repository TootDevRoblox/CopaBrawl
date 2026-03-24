const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// MongoDB Atlas
const MONGO_URI = "mongodb+srv://coconut4691_db_user:QZgqfGDuzdXTrTT6@data.nucbyqx.mongodb.net/brawl_inscricao?retryWrites=true&w=majority";
const DB_NAME = "brawl_inscricao";
let db;

// Conecta no MongoDB
MongoClient.connect(MONGO_URI)
  .then(client => {
      db = client.db(DB_NAME);
      console.log("Conectado ao MongoDB Atlas!");
  })
  .catch(err => console.error("Erro ao conectar no MongoDB:", err));

// Rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Adicionar jogador
app.post("/add", async (req, res) => {
    const { nick, id } = req.body;
    if (!nick || !id) return res.status(400).send("Dados inválidos");
    if (nick.length > 100 || id.length > 50) return res.status(400).send("Texto muito grande");

    try {
        const existe = await db.collection("players").findOne({ id });
        if (existe) return res.status(400).send("ID já registrado");

        await db.collection("players").insertOne({ nick, id });
        console.log("Novo jogador adicionado:", { nick, id });
        res.send("ok");
    } catch (err) {
        console.error("Erro ao adicionar jogador:", err);
        res.status(500).send("Erro no servidor");
    }
});

// Listar jogadores
app.get("/list", async (req, res) => {
    try {
        const players = await db.collection("players").find().toArray();
        res.json(players);
    } catch (err) {
        console.error("Erro ao listar jogadores:", err);
        res.status(500).send("Erro no servidor");
    }
});

// Deletar jogador
app.post("/delete", async (req, res) => {
    const { index } = req.body;

    try {
        const players = await db.collection("players").find().toArray();
        if (index < 0 || index >= players.length) return res.status(400).send("Índice inválido");

        await db.collection("players").deleteOne({ _id: ObjectId(players[index]._id) });
        console.log("Jogador deletado:", players[index]);
        res.send("deleted");
    } catch (err) {
        console.error("Erro ao deletar jogador:", err);
        res.status(500).send("Erro no servidor");
    }
});

// Inicia servidor
app.listen(PORT, () => console.log("Servidor da Copa Brawl online na porta", PORT));
