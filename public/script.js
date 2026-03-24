let isAdmin = false
https://github.com/TootDevRoblox/CopaBrawl/blob/main/public/script.js
function enviar() {
    let nick = document.getElementById("nick").value
    let id = document.getElementById("id").value

    if (nick === "C#Lipeh777") {
        isAdmin = true
        alert("Você é admin!")
    }

    fetch("/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nick, id })
    })
    .then(res => res.text())
    .then(() => carregar())
}

function carregar() {
    fetch("/list")
    .then(res => res.json())
    .then(data => {
        let lista = document.getElementById("lista")
        lista.innerHTML = ""
        data.forEach((player, index) => {
            let li = document.createElement("li")
            li.innerText = player.nick + " - " + player.id

            if (isAdmin) {
                let btn = document.createElement("button")
                btn.innerText = "Deletar"
                btn.onclick = () => deletar(index)
                li.appendChild(btn)
            }

            lista.appendChild(li)
        })
    })
}

function deletar(index) {
    fetch("/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index })
    })
    .then(() => carregar())
}

carregar()
