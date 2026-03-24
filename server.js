const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());
app.use(cors());

const MAX_PLAYERS = 64;

// Substitua pela sua string do MongoDB
const MONGO_URI = "mongodb+srv://coconut4691_db_user:QZgqfGDuzdXTrTT6@data.nucbyqx.mongodb.net/";
const client = new MongoClient(MONGO_URI);

let db, playersCollection;

// Conectar ao MongoDB
async function connectDB() {
    await client.connect();
    db = client.db("copaBrawlDB"); // nome do banco
    playersCollection = db.collection("players"); // coleção
    console.log("Conectado ao MongoDB");
}

connectDB().catch(console.error);

// Rota principal (index.html)
const path = require("path");
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Adicionar player
app.post("/add", async (req, res) => {
    let { nick, id } = req.body;

    if (!nick || !id) return res.status(400).send("Dados inválidos");
    if (nick.length > 100 || id.length > 50) return res.status(400).send("Texto muito grande");

    const total = await playersCollection.countDocuments();
    if (total >= MAX_PLAYERS) return res.status(400).send("Limite de 64 jogadores atingido");

    const existe = await playersCollection.findOne({ id });
    if (existe) return res.status(400).send("Esse ID já foi registrado");

    await playersCollection.insertOne({ nick, id });
    res.send("ok");
});

// Listar players
app.get("/list", async (req, res) => {
    const players = await playersCollection.find({}).toArray();
    res.json(players);
});

// Deletar player pelo ID
app.post("/delete", async (req, res) => {
    const { id } = req.body;
    const result = await playersCollection.deleteOne({ id });

    if (result.deletedCount === 0) return res.status(400).send("ID inválido");
    res.send("deleted");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server rodando na porta " + PORT));
