const URL_API = "https://api-odinline.odiloncorrea.com/produto/${usuario.chave}/usuario"; 

document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos(); 
  carregarAlertas();  

  document.getElementById("formAlerta").addEventListener("submit", (event) => {
    event.preventDefault();
    cadastrarAlerta();
  });

  document.getElementById("btnVerificarAlertas").addEventListener("click", () => {
    verificarAlertas();
  });
});

async function carregarProdutos() {
  try {
    const resposta = await fetch(URL_API);
    const produtos = await resposta.json();

    const select = document.getElementById("idProduto");
    produtos.forEach(prod => {
      const option = document.createElement("option");
      option.value = prod.id;
      option.textContent = prod.nome;
      select.appendChild(option);
    });
  } catch (erro) {
    console.error("Erro ao carregar produtos da API:", erro);
  }
}

function carregarAlertas() {
  const lista = document.getElementById("listaAlertas");
  lista.innerHTML = "";

  const alertas = JSON.parse(localStorage.getItem("alertas")) || [];

  alertas.forEach(alerta => {
    const item = document.createElement("li");
    item.textContent = `Produto ${alerta.idProduto} | Desejado: R$${alerta.valorDesejado} | Ação: ${alerta.acao}`;
    lista.appendChild(item);
  });
}

function cadastrarAlerta() {
  const idProduto = document.getElementById("idProduto").value;
  const valorDesejado = parseFloat(document.getElementById("valorDesejado").value);
  const acao = document.querySelector('input[name="acao"]:checked').value;

  const novoAlerta = {
    idProduto,
    valorDesejado,
    acao,
    dataCadastro: Date.now()
  };

  const alertas = JSON.parse(localStorage.getItem("alertas")) || [];
  alertas.push(novoAlerta);
  localStorage.setItem("alertas", JSON.stringify(alertas));

  carregarAlertas();
  document.getElementById("formAlerta").reset();
  alert("Alerta cadastrado!");
}

async function verificarAlertas() {
  let alertas = JSON.parse(localStorage.getItem("alertas")) || [];
  let compras = JSON.parse(localStorage.getItem("compras")) || [];

  const novosAlertas = [];

  for (const alerta of alertas) {
    try {
      const resposta = await fetch(`${URL_API}/${alerta.idProduto}`);
      if (!resposta.ok) throw new Error("Produto não encontrado");
      const produto = await resposta.json();

      const precoAtual = produto.preco;

      if (precoAtual <= alerta.valorDesejado && alerta.acao === "comprar") {
        compras.push({
          idProduto: alerta.idProduto,
          precoPago: precoAtual,
          dataCompra: Date.now()
        });
      } else {
        novosAlertas.push(alerta);
      }

    } catch (erro) {
      console.error(`Erro ao verificar o alerta do produto ${alerta.idProduto}:`, erro);
      novosAlertas.push(alerta); 
    }
  }

  localStorage.setItem("alertas", JSON.stringify(novosAlertas));
  localStorage.setItem("compras", JSON.stringify(compras));
  carregarAlertas();
  alert("Verificação concluída!");

  const listaCompras = document.getElementById("lista-compras");

window.onload = () => {
    const compras = JSON.parse(localStorage.getItem("compras")) || [];
    if (compras.length === 0) {
        listaCompras.innerHTML = "<p>Nenhuma compra registrada.</p>";
        return;
    }

    compras.forEach(compra => {
        const item = document.createElement("li");
        item.textContent = `${compra.descricao} - R$${parseFloat(compra.valor).toFixed(2)}`;
        listaCompras.appendChild(item);
    });
};
}
