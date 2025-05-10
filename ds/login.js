$(document).ready(function () {

  $("#loginForm").validate({
    rules: {
      login: "required",
      senha: "required"
    },
    messages: {
      login: "Por favor, informe o login.",
      senha: "Por favor, informe a senha."
    },
    submitHandler: async function (form) {
      const erroElemento = $("#mensagemErro").addClass("d-none");

      const login = $("#login").val().trim();
      const senha = $("#senha").val().trim();

      const url = `https://api-odinline.odiloncorrea.com/usuario/${login}/${senha}/autenticar`;
      console.log("Autenticando:", url);

      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Usuário ou senha inválidos.");

        const user = await resp.json();
        console.log("Usuário autenticado:", user);

        localStorage.setItem("usuario", JSON.stringify({
          nome: user.nome,
          chave: user.chave
        }));

        window.location.href = "menu.html";
      } catch (err) {
        console.error("Erro na autenticação:", err);
        erroElemento.removeClass("d-none");
      }
    }
  });
});
