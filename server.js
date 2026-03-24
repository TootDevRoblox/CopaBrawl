const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === MongoDB URI ===
const uri = "mongodb+srv://coconut4691_db_user:QZgqfGDuzdXTrTT6@data.nucbyqx.mongodb.net/brawl_inscricao?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let db;

// Conectando ao MongoDB
async function connectDB() {
    try {
        await client.connect();
        db = client.db("brawl_inscricao"); // nome do banco
        console.log("Conectado ao MongoDB!");
    } catch (err) {
        console.error("Erro ao conectar:", err);
    }
}
connectDB();

// === Endpoints ===

// Salvar inscrição
app.post("/inscricao", async (req, res) => {
    try {
        const { nome, idade, brawler } = req.body;
        const collection = db.collection("inscricoes");
        await collection.insertOne({
            nome,
            idade,
            brawler,
            data: new Date() // adicionando a data automaticamente
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Listar todas as inscrições
app.get("/inscricoes", async (req, res) => {
    try {
        const collection = db.collection("inscricoes");
        const inscricoes = await collection.find().toArray();
        res.json(inscricoes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Servir arquivos do front-end
app.use(express.static("public"));

// Rodar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
