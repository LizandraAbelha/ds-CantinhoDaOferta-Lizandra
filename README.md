## Cantinho da Oferta – Sistema de Alertas de Preço

Este projeto é uma aplicação web integrada à plataforma **OdinLine**, que permite aos usuários autenticados:

* Cadastrar alertas de preço para seus produtos
* Serem notificados ou realizarem compras automáticas
* Consultar alertas ativos e histórico de compras realizadas

### Funcionalidades

* **Autenticação via API OdinLine**
* **Cadastro de alertas** com ID do produto, valor desejado e ação (notificar ou comprar)
* **Monitoramento automático** de preços
* **Execução automática da ação** (notificação ou registro de compra)
* **Histórico de compras** exibido em tabela
* **Interface responsiva e estilizada** com Bootstrap e CSS personalizado

 Acesse o sistema online https://cantinhodoprecolizandra.netlify.app

 ---
### Como usar

1. Acesse o sistema através do `index.html`
2. Faça login com um usuário **já cadastrado** na plataforma OdinLine
3. No menu:

   * Vá em **Cadastrar Alerta** para criar um novo alerta
   * Acompanhe seus alertas em **Histórico de alertas**
   * Veja as compras em **Histórico de compras**

### Estrutura
```
.
├── index.html                # Tela de login
├── menu.html                 # Menu principal
├── alerta.html              # Cadastro de alerta
├── compras.html             # Histórico de alertas
├── historicocompras.html    # Histórico de compras
├── styles.css                # Estilos personalizados
├── alerta.js                # Lógica de cadastro e monitoramento
├── compras.js               # Exibição de alertas e compras
├── login.js                 # Autenticação
```
### Tecnologias usadas

* HTML5, CSS3, JavaScript
* Bootstrap 5
* jQuery & jQuery Validate
* Integração com API OdinLine

### Observações

* Todos os dados (alertas, compras) são armazenados **localmente no navegador (localStorage)**
* A autenticação e os produtos são obtidos **via API da OdinLine**

