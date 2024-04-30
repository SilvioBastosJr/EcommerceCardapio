const menu = document.querySelector("#menu");
const cartBtn = document.querySelector("#cart-btn");
const modalCarrinho = document.querySelector("#modal-carrinho");
const containerCartItens = document.querySelector("#itens-carrinho");
const totalCarrinho = document.querySelector("#total-carrinho");
const checkoutBtn = document.querySelector("#checkout-btn");
const btnFecharModal = document.querySelector("#btn-fechar-modal");
const quantidadeCarrinho = document.querySelector("#cart-count");
const enderecoInput = document.querySelector("#endereco");
const enderecoErrado = document.querySelector("#endereco-errado");
const addCarrinho = document.querySelector(".add-carrinho");

let carrinho = [];

cartBtn.addEventListener("click", function() {
    atualizarModalCarrinho()
    modalCarrinho.style.display = "flex";
});

modalCarrinho.addEventListener("click", function(event) {
    if (event.target === modalCarrinho) {
        modalCarrinho.style.display = "none";
    }
});

btnFecharModal.addEventListener("click", function() {
    modalCarrinho.style.display = "none";
});

menu.addEventListener("click", function(event) {
    
let parentButton = event.target.closest(".add-carrinho");

if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    adicionarAoCarrinho(name, price);
}
});

function adicionarAoCarrinho(name, price) {
    const jaExiste = carrinho.find(item => item.name === name);

    if (jaExiste) {
        jaExiste.quantity += 1;
    } else {
        carrinho.push({
            name,
            price,
            quantity: 1,
        })
    }

    atualizarModalCarrinho();
}

function atualizarModalCarrinho() {
    containerCartItens.innerHTML = "";
    let total = 0;

    carrinho.forEach(item => {
        const elementoCarrinho = document.createElement("div");
        elementoCarrinho.classList.add("boxItensModal");

        elementoCarrinho.innerHTML = `
          <div class = "itens">
            <div>
              <p>${item.name}</p>
              <p>Quantidade: ${item.quantity}</p>
              <p class = "precoItem">R$ ${item.price.toFixed(2)}</p>
            </div>

              <button class = "removerItemCarrinho" data-name= "${item.name}">
                Remover
              </button>
          </div>
        `

        containerCartItens.appendChild(elementoCarrinho);

        total += item.price * item.quantity;
    });

    totalCarrinho.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    quantidadeCarrinho.innerHTML = carrinho.length;
}

containerCartItens.addEventListener("click", function(event) {
    
    if (event.target.classList.contains("removerItemCarrinho")) {
        const name = event.target.getAttribute("data-name");

        removerItemcarrinho(name);
    }
});

function removerItemcarrinho(name) {
    const index = carrinho.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = carrinho[index];
        
        if (item.quantity > 1) {
            item.quantity -= 1;
            atualizarModalCarrinho();
            return;
        }

        carrinho.splice(index, 1);
        atualizarModalCarrinho();
    }
}

enderecoInput.addEventListener("input", function(event) {
    let valorInput = event.target.value;

    if (valorInput !== "") {
        enderecoInput.classList.remove("endereco");
        enderecoErrado.style.display = "none";
    }

})

checkoutBtn.addEventListener("click", function() {
    const estaAberto = checarRestauranteAberto();

    if (!estaAberto) {
        Toastify({
            text: "OPS! O RESTAURANTE ESTÁ FECHADO",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast();

        return;
    }
    
    if (carrinho.length === 0) return;

    if (enderecoInput.value === "") {
        enderecoErrado.style.display = "block";
        enderecoInput.classList.add("endereco");
        return;
    }

    const itensCarrinho = carrinho.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} | `
        )
    }).join("")

    const mensagem = encodeURIComponent(itensCarrinho);
    const telefone = "75981086743"

    console.log(itensCarrinho);

    window.open(`https://wa.me/${telefone}?text=${mensagem} Endereço: ${enderecoInput.value}`, "_blank")

    carrinho = [];
    atualizarModalCarrinho();
})

function checarRestauranteAberto() {
    const data = new Date();
    const hora = data.getHours();

    return hora >= 17 && hora < 23;
}

const dataSpan = document.querySelector("#dataSpan");
const estaAberto = checarRestauranteAberto();

if (estaAberto) {
    dataSpan.classList.remove("estabelecimentoFechado");
    dataSpan.classList.add("estabelecimentoAberto");
} else {
    dataSpan.classList.remove("estabelecimentoAberto");
    dataSpan.classList.add("estabelecimentoFechado");
}