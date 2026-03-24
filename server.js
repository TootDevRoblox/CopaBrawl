let isAdmin = false;

// Função para enviar o jogador
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

    // Substitua pelo URL do seu servidor no Render, se estiver online
    const url = "/add"; // ou "https://seu-app.onrender.com/add"

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nick, id })
    })
    .then(res => res.text())
    .then(data => {
        console.log("Resposta do servidor:", data);
        if (data !== "ok") {
            alert("Erro: " + data);
        }
        carregar();
    })
    .catch(err => {
        console.error("Erro ao enviar:", err);
        alert("Não foi possível enviar os dados. Veja o console.");
    });
}

// Função para carregar a lista de jogadores
function carregar() {
    const url = "/list"; // ou "https://seu-app.onrender.com/list"
    fetch(url)
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
    .catch(err => {
        console.error("Erro ao carregar lista:", err);
    });
}

// Função para deletar um jogador (apenas admin)
function deletar(index) {
    const url = "/delete"; // ou "https://seu-app.onrender.com/delete"
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index })
    })
    .then(res => res.text())
    .then(data => {
        console.log("Delete:", data);
        carregar();
    })
    .catch(err => {
        console.error("Erro ao deletar:", err);
    });
}

// Carrega a lista ao abrir a página
carregar();
