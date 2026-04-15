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
    .then(res => res.text())
    .then(msg => {
        if (msg !== "ok") {
            alert(msg); // erro do servidor
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
        contador.innerText = `${data.length}/${max}`;

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
    });
}

// 🗑️ DELETAR
function deletar(id) {
    fetch("https://copabrawl.onrender.com/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    })
    .then(res => res.text())
    .then(() => carregar())
    .catch(err => console.error("Erro ao deletar:", err));
}

// 🚪 LOGOUT ADMIN (opcional)
function logout() {
    isAdmin = false;
    localStorage.removeItem("admin");
    alert("Saiu do modo admin");
    carregar();
}

// carregar ao abrir
carregar();
