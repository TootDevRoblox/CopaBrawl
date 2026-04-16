const lista = document.getElementById("lista")
const contador = document.getElementById("contador")

let total = 0
const max = 64

let isAdmin = false

// ➕ ENVIAR PRO BACKEND
function enviar() {
    const nick = document.getElementById("nick").value.trim()
    const id = document.getElementById("id").value.trim()

    if (!nick || !id) return

    // 👑 admin simples
    if (id === "admin123") {
        isAdmin = true
        alert("Modo admin ativado!")
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
            carregar()
        }
    })
    .catch(err => {
        console.error(err)
        alert("Erro ao enviar")
    })
}

// 📋 CARREGAR DO BANCO
function carregar() {
    fetch("/list")
    .then(res => res.json())
    .then(data => {
        lista.innerHTML = ""

        total = data.length
        contador.innerText = `${total}/${max}`

        data.forEach(player => {
            const li = document.createElement("li")
            li.innerText = `${player.nick} - ${player.id}`

            // 👑 botão só pra admin
            if (isAdmin) {
                const btn = document.createElement("button")
                btn.innerText = "X"
                btn.onclick = () => deletar(player.id)
                li.appendChild(btn)
            }

            lista.appendChild(li)
        })
    })
}

// 🗑️ DELETAR NO BACKEND
function deletar(id) {
    fetch("/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    })
    .then(() => carregar())
}

// 🚀 CARREGAR AO ABRIR
carregar()
