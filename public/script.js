let isAdmin = false;

function enviar() {
    const nick = document.getElementById("nick").value.trim();
    const id = document.getElementById("id").value.trim();

    if (!nick || !id) {
        alert("Preencha os dois campos!");
        return;
    }

    if (nick === "C#Lipeh777") {
        isAdmin = true;
        alert("Você é admin!");
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
        console.error("Erro ao enviar:", err);
        alert("Não foi possível enviar os dados");
    });
}

function carregar() {
    fetch("https://copabrawl.onrender.com/list")
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        data.forEach((player, index) => {
            const li = document.createElement("li");
            li.innerText = player.nick + " - " + player.id;

            if (isAdmin) {
                const btn = document.createElement("button");
                btn.innerText = "Deletar";
                btn.onclick = () => deletar(index);
                li.appendChild(btn);
            }

            lista.appendChild(li);
        });
    })
    .catch(err => console.error("Erro ao carregar lista:", err));
}

function deletar(index) {
    fetch("https://copabrawl.onrender.com/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index })
    })
    .then(res => res.text())
    .then(() => carregar())
    .catch(err => console.error("Erro ao deletar:", err));
}

// Carrega a lista ao abrir a página
carregar();
