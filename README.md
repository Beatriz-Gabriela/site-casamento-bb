# Site de casamento — modelo personalizável

Um site de casamento responsivo, desenvolvido em HTML, CSS e JavaScript, pensado para reunir em um único endereço as informações do grande dia: história do casal, contagem regressiva, roteiro, dress code, lista de presentes, galeria, localização e confirmação de presença (RSVP).

Este repositório contém a implementação estática usada no site de Bárbara & Beatriz. A estrutura pode servir como ponto de partida para outros casais, desde que os dados, imagens, links de pagamento e integrações sejam substituídos antes da publicação.

> **Demonstração:** [abrir o repositório](https://github.com/Beatriz-Gabriela/site-casamento-bb) · **Publicação:** GitHub Pages

## Funcionalidades

- Layout responsivo para celular, tablet e computador.
- Capa com foto do casal e contagem regressiva.
- Seção de roteiro do dia e dress code.
- Lista de presentes dinâmica, alimentada por `presentes.js`, com links externos de pagamento.
- Galeria de fotos.
- Endereços e links para abrir os locais no mapa.
- Formulário de confirmação de presença integrado ao Google Sheets por Google Apps Script.
- Navegação por âncoras, menu mobile e animações de entrada.
- Preferência por movimento reduzido respeitada para acessibilidade.

## Tecnologias

- HTML5, CSS3 e JavaScript puro.
- [Tailwind CSS via CDN](https://tailwindcss.com/) para utilitários de layout.
- [Lucide](https://lucide.dev/) para ícones.
- [Google Fonts](https://fonts.google.com/) para tipografia.
- Google Sheets + Google Apps Script como serviço externo de recebimento do RSVP.
- GitHub Pages para hospedagem estática.

Como Tailwind, Lucide e as fontes são carregados por CDN, é necessária conexão com a internet para que todos os recursos externos sejam exibidos.

## Executar localmente

1. Faça o download ou clone este repositório.
2. Abra a pasta no Visual Studio Code.
3. Instale a extensão **Live Server**, se necessário.
4. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Não é necessário instalar dependências ou executar um servidor backend.

## Estrutura do projeto

```text
site-casamento-bb/
├── assets/          # Fotos, logotipo e imagens das seções
├── index.html       # Estrutura da página e estilos principais
├── presentes.js     # Cadastro dos presentes e links de pagamento
├── script.js        # Menu, contagem regressiva, RSVP e interações
└── README.md        # Documentação do projeto
```

## Personalizar para outro casal

Antes de publicar uma nova versão, revise os seguintes pontos:

| Arquivo / local | O que personalizar |
| --- | --- |
| `index.html` | Nomes, data, horários, textos, endereços, links de mapas, cores e metadados |
| `assets/hero-casal.jpg` | Foto principal do casal |
| `assets/logo.png` | Logotipo e ícone do site |
| `assets/roteiro-programacao.png` | Arte do roteiro, se utilizada |
| `assets/dress-code-1.jpg` a `dress-code-4.jpg` | Inspirações de traje |
| `assets/galeria-*.jpg` | Fotos da história do casal |
| `assets/presente-*.jpg` | Imagens opcionais dos presentes |
| `presentes.js` | Nome, descrição, valor, imagem e link de cada presente |
| `script.js` | Data/hora da contagem regressiva e configuração do RSVP |

Mantenha os nomes dos arquivos de imagem esperados ou atualize os respectivos caminhos no HTML e em `presentes.js`. Imagens opcionais ausentes podem deixar espaços vazios ou ser ocultadas conforme a lógica da página.

## Atualizar a lista de presentes

Edite o array `window.WEDDING_GIFTS` em `presentes.js`. Cada objeto representa um presente:

```js
{
  title: "Nome do presente",
  description: "Uma descrição curta",
  price: "R$ 100,00",
  button: "PRESENTEAR",
  url: "https://seu-link-de-pagamento.com/...",
  image: "assets/presente-01.jpg"
}
```

- Use um endereço completo iniciado por `https://`.
- Confira se o link corresponde ao valor exibido no card.
- Para deixar um presente temporariamente indisponível, mantenha `url: ""`; o botão não deverá encaminhar o visitante.
- Faça um teste real de cada link antes de divulgar o site.

**Atenção:** os links de pagamento são fornecidos pelo serviço escolhido e seguem as regras desse provedor. Este site não processa pagamentos nem confirma automaticamente a liquidação; a confirmação deve ser verificada na conta do provedor.

## Configurar o RSVP

O projeto é estático e registra as respostas em uma planilha do Google Sheets por meio de um Web App do Google Apps Script.

1. Abra o projeto do Google Apps Script associado à planilha de respostas.
2. Confira as permissões de acesso e publique o script como **Aplicativo da Web**, conforme o fluxo definido para o projeto.
3. Copie a URL de implantação terminada em `/exec`.
4. No arquivo `script.js`, atualize a constante `GOOGLE_APPS_SCRIPT_URL` com essa URL.
5. Faça uma confirmação de teste e verifique se os dados chegaram à planilha.

O código do frontend já envia o formulário para o endpoint configurado. A planilha, o Apps Script e suas permissões precisam permanecer ativos para o RSVP funcionar. Não publique senhas, tokens ou credenciais privadas no repositório; a URL do Web App fica visível no código do navegador e deve ser tratada como endpoint público.

## Publicar no GitHub Pages

1. Envie os arquivos para um repositório GitHub.
2. No repositório, acesse **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch principal e a pasta `/(root)`.
5. Salve e aguarde a publicação.
6. Abra o endereço informado pelo GitHub Pages e teste o site em celular e computador.

Sempre que atualizar os arquivos na branch publicada, o GitHub Pages fará uma nova publicação.

## Checklist antes de entregar um site

- [ ] Nomes, pronomes e textos revisados pelo casal.
- [ ] Data, fuso horário e contagem regressiva conferidos.
- [ ] Endereços, horários e links de mapas testados.
- [ ] Imagens autorizadas, otimizadas e corretamente nomeadas.
- [ ] Dress code e orientações aos convidados atualizados.
- [ ] Valores e links de todos os presentes conferidos.
- [ ] Formulário RSVP testado e notificações configuradas.
- [ ] Site revisado em telas pequenas e grandes.
- [ ] Nenhum dado pessoal, endpoint privado ou link de teste permaneceu publicado.

## Sobre transformar o projeto em um produto

A base técnica pode ser reaproveitada para criar sites para outros casais, mas cada entrega deve receber conteúdo, identidade visual, imagens, integrações e links de pagamento próprios. Antes de comercializar, defina um processo de onboarding, contrato/escopo, política de suporte e responsabilidade pela manutenção dos serviços externos. Verifique também as licenças e permissões de uso de fontes, imagens, ícones e demais recursos incluídos em cada projeto.

## Informações da versão de demonstração

- Casal: Bárbara & Beatriz.
- Data: 28 de dezembro de 2026.
- Cidade: Manaus — AM.
- Hospedagem prevista: GitHub Pages.

Os dados acima são específicos desta instância e devem ser substituídos ao adaptar o projeto para outro casal.
