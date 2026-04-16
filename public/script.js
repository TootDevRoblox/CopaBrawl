const lista = document.getElementById("lista")
const contador = document.getElementById("contador")

let total = 0
const max = 64

function enviar() {
    const nick = document.getElementById("nick").value.trim()
    const id = document.getElementById("id").value.trim()

    if (!nick || !id) return

    if (total >= max) {
        alert("Lotado!")
        return
    }

    const isAdmin = id === "admin123"

    const li = document.createElement("li")

    li.innerHTML = `
        ${nick} ${isAdmin ? "🛡️" : ""}
        <button onclick="remover(this)">X</button>
    `

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
