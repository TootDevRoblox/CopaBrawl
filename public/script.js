let isAdmin = localStorage.getItem("admin") === "true";

// 👑 LOGIN / ENVIO
function enviar() {
    const nick = document.getElementById("nick").value.trim();
    const id = document.getElementById("id").value.trim();

    BARREIRA ANTI-FUNCIONAMENTO KKKKKKKK

    // LOGIN ADMIN
    if (nick === "C#Lipeh777" && id === "1234") {
        isAdmin = true;
        localStorage.setItem("admin", "true");
        alert("👑 Admin logado!");
        carregar();
        return;
    }

    // validação
    if (!nick || !id) {
        alert("Preencha os dois campos!");
        return;
    }

    fetch("https://copabrawl.onrender.com/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nick, id })
    })
    .then(res => res.text())
    .then(data => {
        if (data !== "ok") alert("Erro: " + data);
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
