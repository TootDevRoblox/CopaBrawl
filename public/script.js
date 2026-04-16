// CONFIG
const LIMITE = 64
const CODIGO_ADM = "admin123" // 👈 muda isso depois

// ELEMENTOS
const lista = document.getElementById("lista")
const contador = document.getElementById("contador")

// ESTADO
let players = JSON.parse(localStorage.getItem("players")) || []
let isADM = false

// INIT
render()

// FUNÇÃO PRINCIPAL
function enviar() {
    const nickInput = document.getElementById("nick")
    const idInput = document.getElementById("id")

    const nick = nickInput.value.trim()
    const id = idInput.value.trim()

    if (!nick || !id) return

    // 🔐 Ativar ADM
    if (id === CODIGO_ADM) {
        isADM = true
        alert("Modo ADM ativado")
        idInput.value = ""
        return
    }

    // 🚫 limite
    if (players.length >= LIMITE) {
        alert("Lista cheia!")
        return
    }

    // 🚫 duplicado
    const existe = players.some(p => p.nick === nick || p.id === id)
    if (existe) {
        alert("Jogador já existe!")
        return
    }

    // ADD
    players.push({ nick, id })

    salvar()
    render()

    // limpar input
    nickInput.value = ""
    idInput.value = ""
}

// RENDER
function render() {
    lista.innerHTML = ""

    players.forEach((p, index) => {
        const li = document.createElement("li")

        li.innerHTML = `
            ${p.nick} (${p.id})
            ${isADM ? `<button onclick="remover(${index})">X</button>` : ""}
        `

        lista.appendChild(li)
    })

    atualizarContador()
}

// REMOVER (ADM)
function remover(index) {
    if (!isADM) return

    players.splice(index, 1)

    salvar()
    render()
}

// CONTADOR
function atualizarContador() {
    if (contador) {
        contador.textContent = `${players.length}/${LIMITE}`
    }
}

// SALVAR
function salvar() {
    localStorage.setItem("players", JSON.stringify(players))
}
