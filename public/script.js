const lista = document.getElementById("lista")
const contador = document.getElementById("contador")

let players = []
let total = 0
const max = 64

let isAdmin = false

function enviar() {
    const nick = document.getElementById("nick").value.trim()
    const id = document.getElementById("id").value.trim()

    if (!nick || !id) return

    if (total >= max) {
        alert("Lotado!")
        return
    }

    // 👑 ativar admin
    if (id === "admin123") {
        isAdmin = true
        alert("Modo admin ativado!")
    }

    // 💾 salva os DOIS agora
    players.push({ nick, id })

    total++
    atualizar()
    renderizar()

    document.getElementById("nick").value = ""
    document.getElementById("id").value = ""
}

function renderizar() {
    lista.innerHTML = ""

    players.forEach((player, index) => {
        const li = document.createElement("li")

        // 👇 agora mostra certo
        li.innerText = `${player.nick} - ${player.id}`

        // 👑 botão só admin
        if (isAdmin) {
            const btn = document.createElement("button")
            btn.innerText = "X"
            btn.onclick = () => remover(index)
            li.appendChild(btn)
        }

        lista.appendChild(li)
    })
}

function remover(index) {
    players.splice(index, 1)
    total--
    atualizar()
    renderizar()
}

function atualizar() {
    contador.innerText = `${total}/${max}`
}
