const lista = document.getElementById("lista")
const contador = document.getElementById("contador")

let total = 0
const max = 64

let isAdmin = false

function enviar() {
    const nick = document.getElementById("nick").value.trim()
    const id = document.getElementById("id").value.trim()

    if (!nick || !id) return

    if (id === "admin123") {
        isAdmin = true
        alert("Modo admin ativado!")
        carregar()
        return
    }

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
            document.getElementById("nick").value = ""
            document.getElementById("id").value = ""
            carregar()
        }
    })
    .catch(() => {
        alert("Erro ao enviar")
    })
}

function carregar() {
    fetch("/list")
    .then(res => res.json())
    .then(data => {
        lista.innerHTML = ""

        total = data.length
        contador.innerText = `${total}/${max}`

        data.forEach(player => {
            const li = document.createElement("li")

            const span = document.createElement("span")
            span.innerText = `${player.nick} - ${player.id}`

            li.appendChild(span)

            if (isAdmin) {
                const btn = document.createElement("button")
                btn.innerText = "✖"
                btn.className = "delete-btn"
                btn.onclick = () => deletar(player.id)
                li.appendChild(btn)
            }

            lista.appendChild(li)
        })
    })
}

function deletar(id) {
    fetch("/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id,
            adminKey: "admin123"
        })
    })
    .then(() => carregar())
}

carregar()
