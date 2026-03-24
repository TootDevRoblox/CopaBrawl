let isAdmin = false

const API = "https://copabrawl.onrender.com"

function enviar() {
    let nick = document.getElementById("nick").value
    let id = document.getElementById("id").value

    if (!nick || !id) {
        alert("Preenche tudo")
        return
    }

    if (nick === "C#Lipeh777") {
        isAdmin = true
        alert("Você é admin!")
    }

    fetch(API + "/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nick, id })
    })
    .then(res => {
        if (!res.ok) {
            return res.text().then(msg => { throw new Error(msg) })
        }
        return res.text()
    })
    .then(() => {
        carregar()
    })
    .catch(err => {
        alert(err.message)
    })
}

function carregar() {
    fetch(API + "/list")
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
    fetch(API + "/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ index })
    })
    .then(() => carregar())
}

carregar()
