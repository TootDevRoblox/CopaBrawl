const express = require("express")
const cors = require("cors")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, "public")))

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.post("/add", async (req, res) => {
    let { nick, id } = req.body

    const { error } = await supabase
        .from("players")
        .insert([{ nick, id }])

    if (error) {
        return res.status(500).send(error.message)
    }

    res.send("ok")
})

app.get("/list", async (req, res) => {
    const { data, error } = await supabase
        .from("players")
        .select("*")

    if (error) {
        return res.status(500).send(error.message)
    }

    res.json(data)
})

app.post("/delete", async (req, res) => {
    const { id, adminKey } = req.body

    if (adminKey !== "admin123") {
        return res.status(403).send("Sem permissão")
    }

    const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", id)

    if (error) {
        return res.status(500).send(error.message)
    }

    res.send("deleted")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("🚀 Server rodando na porta " + PORT)
})
