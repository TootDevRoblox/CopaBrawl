let isAdmin = localStorage.getItem("admin") === "true";

// 👑 LOGIN / ENVIO
function enviar() {
    const nick = document.getElementById("nick").value.trim();
    const id = document.getElementById("id").value.trim();

    if (!nick || !id) {
        alert("Preencha tudo!");
        return;
    }

    // 👑 admin
    if (nick === "C#Lipeh777") {
        isAdmin = true;
        localStorage.setItem("admin", "true");
        alert("Modo admin ativado!");
    }

    fetch("https://copabrawl.onrender.com/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nick, id })
    })
    .then(res => res.text().then(msg => ({ ok: res.ok, msg })))
    .then(res => {
        if (!res.ok) {
            alert("Erro: " + res.msg);
        } else {
            alert("Inscrição feita!");
        }

        carregar();
    })
    .catch(err => {
        console.error("Erro:", err);
        alert("Erro ao enviar");
    });
}

// 📋 CARREGAR LISTA
function carregar() {
    fetch("https://copabrawl.onrender.com/list")
    .then(res => res.json())
    .then(data => {

        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        const contador = document.getElementById("contador");
        const max = 64;

        // ✔ NÃO CRASHA MAIS
        if (contador) {
            contador.innerText = `${data.length}/${max}`;
        }

        data.forEach((player) => {
            const li = document.createElement("li");
            li.innerText = player.nick + " - " + player.id;

            if (isAdmin) {
                const btn = document.createElement("button");
                btn.innerText = "Deletar";
                btn.onclick = () => deletar(player.id);
                li.appendChild(btn);
            }

            lista.appendChild(li);
        });
    })
    .catch(err => {
        console.error("Erro ao carregar:", err);
    });
}

// 🗑️ DELETAR
function deletar(id) {
    fetch("https://copabrawl.onrender.com/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    })
    .then(res => res.text().then(msg => ({ ok: res.ok, msg })))
    .then(res => {
        if (!res.ok) {
            alert("Erro ao deletar: " + res.msg);
        }
        carregar();
    })
    .catch(err => console.error("Erro ao deletar:", err));
}

// 🚪 LOGOUT ADMIN
function logout() {
    isAdmin = false;
    localStorage.removeItem("admin");
    alert("Saiu do modo admin");
    carregar();
}

// 🚀 carregar ao abrir
carregar();
