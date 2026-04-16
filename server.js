const express = require("express")
const cors = require("cors")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

const app = express()

app.use(express.json())
app.use(cors())

// 🌐 SERVIR FRONTEND (IMPORTANTE)
app.use(express.static(path.join(__dirname, "public")))

// 🔐 ENV VARIABLES
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ ENV do Supabase não carregadas!")
}

// 🔗 CONEXÃO
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 🏠 ROTA PRINCIPAL (abre o site)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

// ➕ ADICIONAR PLAYER
app.post("/add", async (req, res) => {
    let { nick, id } = req.body

    console.log("Recebido:", nick, id)

    const { data, error } = await supabase
        .from("players")
        .insert([{ nick, id }])

    if (error) {
        console.error("SUPABASE ERROR:", error)
        return res.status(500).send(error.message)
    }

    res.send("ok")
})
// 📋 LISTAR PLAYERS
app.get("/list", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("players")
            .select("*")

        if (error) {
            return res.status(500).send(error.message)
        }

        res.json(data)
    } catch (err) {
        res.status(500).send("Erro ao buscar")
    }
})

// 🗑️ DELETAR PLAYER
app.post("/delete", async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).send("ID inválido")
    }

    try {
        const { error } = await supabase
            .from("players")
            .delete()
            .eq("id", id)

        if (error) {
            return res.status(500).send(error.message)
        }

        res.send("deleted")
    } catch (err) {
        res.status(500).send("Erro ao deletar")
    }
})

// 🚀 START
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("🚀 Server rodando na porta " + PORT)
})
