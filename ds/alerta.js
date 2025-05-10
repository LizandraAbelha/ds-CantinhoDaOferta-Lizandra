class AlertaAcao {
  constructor(usuario, idProduto, descricao, valorAntigo, valorDesejado, acao) {
    this.usuario = usuario;
    this.idProduto = idProduto;
    this.descricao = descricao;
    this.valorAntigo = valorAntigo;
    this.valorDesejado = valorDesejado;
    this.acao = acao;
    this.dataCadastro = new Date().toISOString();
  }
}

async function iniciar() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario || !usuario.chave) {
    alert("Usuário não autenticado. Faça login novamente.");
    window.location.href = "index.html";
    return;
  }

  const elementos = {
    formAlerta: $("#formAlerta"),
    selectProduto: $("#produtos"),
    inputId: $("#idProduto"),
    inputValor: $("#valorProduto"),
    inputValorDesejado: $("#valorDesejado"),
    selectAcao: $("#acao"),
    feedback: $("#feedback"),
    listaProdutos: $("#listaProdutos"),
    listaAlertas: $("#listaAlertas")
  };

  let alertas = JSON.parse(localStorage.getItem("alertas")) || [];
  let compras = JSON.parse(localStorage.getItem("compras")) || [];

  await carregarProdutos();
  carregarAlertas();
  configurarEventos();
  iniciarMonitoramento();

  async function carregarProdutos() {
    try {
      const resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${usuario.chave}/usuario`);
      const produtos = await resposta.json();
      elementos.selectProduto.empty().append('<option value="">Selecione um produto</option>');
      produtos.forEach(p => {
        elementos.selectProduto.append(`<option value="${p.id}" data-valor="${p.valor}">${p.descricao}</option>`);
      });
      elementos.listaProdutos.html(produtos.map(p => `
        <tr>
          <td>${p.id}</td>
          <td>${p.descricao}</td>
          <td>R$ ${parseFloat(p.valor).toFixed(2)}</td>
        </tr>
      `).join(''));
    } catch (erro) {
      alert("Erro ao carregar produtos");
    }
  }

  function configurarEventos() {
    elementos.selectProduto.change(function () {
      const valor = $(this).find("option:selected").data("valor");
      elementos.inputValor.val(valor?.toFixed(2) || '');
      elementos.inputId.val($(this).val());
    });

    elementos.formAlerta.submit(function (e) {
      e.preventDefault();
      cadastrarAlerta();
    });

    $("#btnVerificarAlertas").click(() => verificarAlertas());
  }

  function cadastrarAlerta() {
    const idProduto = elementos.inputId.val();
    const descricao = elementos.selectProduto.find("option:selected").text();
    const valorAntigo = parseFloat(elementos.inputValor.val());
    const valorDesejado = parseFloat(elementos.inputValorDesejado.val());
    const acao = elementos.selectAcao.val();

    if (alertas.some(a => a.idProduto === idProduto)) {
      alert("Já existe um alerta para este produto!");
      return;
    }

    const novo = new AlertaAcao(usuario.login, idProduto, descricao, valorAntigo, valorDesejado, acao);
    alertas.push(novo);
    localStorage.setItem("alertas", JSON.stringify(alertas));
    elementos.formAlerta.trigger("reset");
    carregarAlertas();
    alert("Alerta cadastrado com sucesso!");
  }

  function carregarAlertas() {
    const ul = elementos.listaAlertas;
    ul.empty();
    alertas.forEach(alerta => {
      ul.append(`<li>${alerta.descricao} | R$${alerta.valorDesejado} | ${alerta.acao}</li>`);
    });
  }

  async function verificarAlertas() {
    const novosAlertas = [];
    for (const alerta of alertas) {
      try {
        const res = await fetch(`https://api-odinline.odiloncorrea.com/produto/${alerta.idProduto}`);
        const produto = await res.json();
        const precoAtual = parseFloat(produto.valor);
        if (precoAtual <= alerta.valorDesejado) {
          if (alerta.acao === "notificar") {
            alert(`Produto ${alerta.descricao} atingiu o valor desejado!`);
          } else if (alerta.acao === "comprar") {
            compras.push({
              idProduto: alerta.idProduto,
              descricao: alerta.descricao,
              valorCompra: precoAtual,
              dataCompra: new Date().toISOString()
            });
            localStorage.setItem("compras", JSON.stringify(compras));
            alert(`Compra registrada: ${alerta.descricao} por R$${precoAtual}`);
          }
        } else {
          novosAlertas.push(alerta); 
        }
      } catch (erro) {
        console.error(`Erro ao verificar alerta do produto ${alerta.idProduto}:`, erro);
        novosAlertas.push(alerta);
      }
    }
    alertas = novosAlertas;
    localStorage.setItem("alertas", JSON.stringify(alertas));
    carregarAlertas();
  }

  function iniciarMonitoramento() {
    setInterval(verificarAlertas, 5000); 
  }
}

$(function () {
  iniciar();
});
