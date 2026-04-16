const lista = document.getElementById("lista")
const contador = document.getElementById("contador")

let total = 0
const max = 64

let isAdmin = false // 👈 controle global

function enviar() {
    const nick = document.getElementById("nick").value.trim()
    const id = document.getElementById("id").value.trim()

    if (!nick || !id) return

    if (total >= max) {
        alert("Lotado!")
        return
    }

    // 👑 ativa admin
    if (id === "admin123") {
        isAdmin = true
        alert("Modo admin ativado!")
    }

    const li = document.createElement("li")
    li.innerHTML = `${nick} ${isAdmin ? "🛡️" : ""}`

    // 👇 SÓ cria botão se for admin
    if (isAdmin) {
        const btn = document.createElement("button")
        btn.innerText = "X"
        btn.onclick = () => remover(btn)
        li.appendChild(btn)
    }

    lista.appendChild(li)

    total++
    atualizar()

    document.getElementById("nick").value = ""
    document.getElementById("id").value = ""
}

function remover(btn) {
    btn.parentElement.remove()
    total--
    atualizar()
}

function atualizar() {
    contador.innerText = `${total}/${max}`
}
