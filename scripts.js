// Número do WhatsApp da lanchonete (55 + DDD + número, só dígitos)
const NUMERO_WHATSAPP = "5554999999999";

// ---------- Aberto ou fechado ----------
const agora = new Date();
const hora = agora.getHours();
const min = agora.getMinutes();
const dia = agora.getDay(); // 0 = domingo, 1 = segunda, ...
const minDoDia = hora * 60 + min;
const selo = document.querySelector("#status");

// Aberto de terça a domingo, das 18h (1080 min) às 23h30 (1410 min)
if (minDoDia >= 1080 && minDoDia < 1410 && dia !== 1) {
    selo.textContent = "Aberto agora";
    selo.classList.add("aberto");
} else {
    selo.textContent = "Fechado agora";
    selo.classList.add("fechado");
}

// ---------- Filtros ----------
const botoes = document.querySelectorAll(".filtros button");
const produtos = document.querySelectorAll(".produto");

for (const botao of botoes) {
    botao.addEventListener("click", function () {
        const filtro = botao.dataset.filtro;

        // Tira o destaque de todos os botões e coloca só no clicado
        for (const outro of botoes) {
            outro.classList.remove("ativo");
        }
        botao.classList.add("ativo");

        for (const produto of produtos) {
            if (filtro === "todos" || produto.dataset.categoria === filtro) {
                produto.classList.remove("escondido");
            } else {
                produto.classList.add("escondido");
            }
        }
    });
}

// ---------- Carrinho ----------
const carrinho = [];
const botoesAdicionar = document.querySelectorAll(".adicionar");
const listaCarrinho = document.querySelector("#lista-carrinho");
const textoTotal = document.querySelector("#total");
const avisoVazio = document.querySelector("#carrinho-vazio");
const botaoEnviar = document.querySelector("#enviar-pedido");

// Transforma 20 em "R$ 20,00"
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

for (const botao of botoesAdicionar) {
    botao.addEventListener("click", function () {
        const item = {
            nome: botao.dataset.nome,
            preco: Number(botao.dataset.preco) // dataset é texto: converte pra número
        };
        carrinho.push(item);
        mostrarCarrinho();
    });
}

function mostrarCarrinho() {
    // Carrinho vazio: mostra o aviso e esconde total e botão
    if (carrinho.length === 0) {
        avisoVazio.classList.remove("escondido");
        botaoEnviar.classList.add("escondido");
        textoTotal.textContent = "";
        listaCarrinho.innerHTML = "";
        return;
    }

    avisoVazio.classList.add("escondido");
    botaoEnviar.classList.remove("escondido");

    // Redesenha a lista inteira a partir do array
    listaCarrinho.innerHTML = "";
    let total = 0;

    // for com índice (i): precisamos saber a POSIÇÃO de cada item pra poder remover
    for (let i = 0; i < carrinho.length; i++) {
        const item = carrinho[i];

        // Cria o <li> e o texto dele
        const li = document.createElement("li");
        const texto = document.createElement("span");
        texto.textContent = item.nome + " - " + formatarPreco(item.preco);

        // Cria o botão de remover deste item
        const botaoRemover = document.createElement("button");
        botaoRemover.textContent = "Remover";
        botaoRemover.classList.add("remover");
        botaoRemover.setAttribute("aria-label", "Remover " + item.nome);
        botaoRemover.addEventListener("click", function () {
            carrinho.splice(i, 1); // tira 1 item do array, na posição i
            mostrarCarrinho();     // redesenha a lista sem ele
        });

        // Monta: texto e botão dentro do <li>, e o <li> dentro da lista
        li.appendChild(texto);
        li.appendChild(botaoRemover);
        listaCarrinho.appendChild(li);

        total += item.preco;
    }

    textoTotal.textContent = "Total: " + formatarPreco(total);
}

// ---------- Enviar pelo WhatsApp ----------
botaoEnviar.addEventListener("click", function () {
    let mensagem = "Olá! Quero fazer um pedido:\n\n";
    let total = 0;

    for (const item of carrinho) {
        mensagem += "- " + item.nome + " (" + formatarPreco(item.preco) + ")\n";
        total += item.preco;
    }

    mensagem += "\nTotal: " + formatarPreco(total);

    // encodeURIComponent troca espaços, acentos e quebras de linha por códigos que cabem num link
    const link = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(mensagem);
    window.open(link, "_blank");
});