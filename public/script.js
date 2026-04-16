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

    fetch("/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nick, id })
    })
    .then(res => res.text())
    .then(msg => {
        if (msg !== "ok") {
            alert(msg)
        } else {
            carregar()
        }
    })
    .catch(err => {
        console.error(err)
        alert("Erro ao enviar")
    })
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
