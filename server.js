const express = require("express")
const fs = require("fs")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())

const DB_FILE = "database.json"
const MAX_PLAYERS = 64

function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, "[]")
    }
    return JSON.parse(fs.readFileSync(DB_FILE))
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

// rota principal (pra não dar erro)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

// adicionar player
app.post("/add", (req, res) => {
    let { nick, id } = req.body

    if (!nick || !id) {
        return res.status(400).send("Dados inválidos")
    }

    if (nick.length > 100 || id.length > 50) {
        return res.status(400).send("Texto muito grande")
    }

    let db = readDB()

    if (db.length >= MAX_PLAYERS) {
        return res.status(400).send("Limite de 64 jogadores atingido")
    }

    let existe = db.find(p => p.id === id)
    if (existe) {
        return res.status(400).send("Esse ID já foi registrado")
    }

    db.push({ nick, id })
    writeDB(db)

    res.send("ok")
})

// listar players
app.get("/list", (req, res) => {
    res.json(readDB())
})

// deletar player
app.post("/delete", (req, res) => {
    let db = readDB()
    let { index } = req.body

    if (index < 0 || index >= db.length) {
        return res.status(400).send("Índice inválido")
    }

    db.splice(index, 1)
    writeDB(db)

    res.send("deleted")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Server rodando na porta " + PORT)
})
