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

app.post("/add", (req, res) => {
    let { nick, id } = req.body

    // validação básica
    if (!nick || !id) {
        return res.status(400).send("Dados inválidos")
    }

    if (nick.length > 20 || id.length > 20) {
        return res.status(400).send("Texto muito grande")
    }

    let db = readDB()

    // limite de players
    if (db.length >= MAX_PLAYERS) {
        return res.status(400).send("Limite de 64 jogadores atingido")
    }

    // evitar duplicados (mesmo ID)
    let existe = db.find(p => p.id === id)
    if (existe) {
        return res.status(400).send("Esse ID já foi registrado")
    }

    db.push({ nick, id })
    writeDB(db)

    res.send("ok")
})

app.get("/list", (req, res) => {
    res.json(readDB())
})

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

app.listen(3000, () => console.log("Server rodando na porta 3000"))