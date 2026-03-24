const express = require("express");
const cors = require("cors");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// 🔹 Configuração Supabase
const SUPABASE_URL = "https://wtvitgtsrykgbqixrppv.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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
        // Verifica se já existe
        const { data: existe, error: findError } = await supabase
            .from("nick")        // nome da tabela
            .select("*")
            .eq("id", id)
            .single();

        if (findError && findError.code !== "PGRST116") throw findError; // ignora "não encontrado"
        if (existe) return res.status(400).send("ID já registrado");

        // Insere novo jogador
        const { error } = await supabase.from("nick").insert([{ nick, id }]);
        if (error) throw error;

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
        const { data, error } = await supabase.from("nick").select("*");
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("Erro ao listar jogadores:", err);
        res.status(500).send("Erro no servidor");
    }
});

// Deletar jogador pelo ID
app.post("/delete", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).send("ID inválido");

    try {
        const { error } = await supabase.from("nick").delete().eq("id", id);
        if (error) throw error;

        console.log("Jogador deletado:", id);
        res.send("deleted");
    } catch (err) {
        console.error("Erro ao deletar jogador:", err);
        res.status(500).send("Erro no servidor");
    }
});

// Inicia servidor
app.listen(PORT, () => console.log("Servidor da Copa Brawl online na porta", PORT));
