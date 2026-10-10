# Site de casamento — Bárbara & Beatriz

Projeto estático para abrir no VS Code com Live Server e publicar no GitHub Pages. O layout base foi reconstruído a partir do HTML mais recente compartilhado do Canva; os recursos exclusivos do Canva foram removidos para que o site rode fora da plataforma.

## Prévia no computador
1. Extraia a pasta do ZIP.
2. Abra a pasta no VS Code.
3. Instale a extensão **Live Server** (Ritwick Dey), se ainda não tiver.
4. Clique com o botão direito em `index.html` → **Open with Live Server**.

O layout usa Google Fonts e Tailwind CDN; mantenha a conexão com a internet ao testar a primeira vez.

## Adicionar as imagens
Coloque as imagens na pasta `assets/` usando estes nomes (ou altere os caminhos correspondentes no `index.html` / `presentes.js`):

- `hero-casal.jpg` — imagem principal/capa
- `roteiro-programacao.png` — arte pronta da seção Roteiro, caso prefira substituir a ilustração vetorial por uma imagem exportada do Canva
- `dress-code-1.jpg` até `dress-code-4.jpg` — inspirações de traje
- `galeria-01.jpg` até `galeria-08.jpg` — fotos da galeria
- `presente-01.jpg` até `presente-12.jpg` — imagens dos presentes (opcionais)

Se alguma imagem ainda não existir, o site oculta o espaço da imagem para não exibir ícone quebrado. A ilustração de trajeto em SVG fica disponível como alternativa se a imagem do roteiro não estiver na pasta.

## Atualizar os links de pagamento dos presentes
Abra **`presentes.js`**. Cada presente tem campos `title`, `description`, `price`, `button`, `url` e `image`. Para trocar um link, altere apenas `url` no presente correspondente, por exemplo:

```js
url: "https://seu-link-de-pagamento.com/..."
```

Use um endereço completo que comece com `https://`. Enquanto `url` estiver vazio, o botão informa que o link ainda será cadastrado e não leva a lugar nenhum. Você pode editar nome, texto, preço e imagem no mesmo arquivo, sem alterar HTML ou CSS.

## Ativar as confirmações de presença (RSVP)
O projeto é estático; ele não salva respostas sozinho. Para receber as confirmações, crie um formulário no Formspree e copie o endpoint no início da seção RSVP de `script.js`, substituindo:

```js
const FORMSPREE_ENDPOINT = 'COLE_AQUI_SEU_ENDPOINT_FORMSPREE';
```

por algo no formato `https://formspree.io/f/SEU_ID`. Teste o formulário depois de publicar. O envio precisa de conexão com a internet.

## Publicar no GitHub Pages
Envie todos os arquivos da pasta para um repositório GitHub. Em **Settings → Pages**, escolha a branch principal e a pasta `/ (root)`. O GitHub Pages não processa serviços de backend; o RSVP usa Formspree.

## Observações
- Data da cerimônia: 28/12/2026, 15h30 (fuso de Manaus, UTC−4).
- Locais: Cartório Manauara e Amazing Festas, conforme os dados compartilhados.
- O link de edição do Canva não transfere automaticamente mudanças futuras para esta pasta. Se o design mudar no Canva, será necessário exportar/compartilhar o novo HTML ou atualizar os arquivos locais.


## Correção de cores e cards invisíveis

As cores de Presentes e Confirmar presença agora estão definidas por seção no CSS do `index.html`, para impedir que a cor de uma seção seja herdada por outra. Os cards criados por `presentes.js` são exibidos imediatamente, mesmo sem fotos: imagens ausentes são ocultadas, mas nome, descrição, valor e botão permanecem visíveis.


### Imagens adicionadas para esta atualização
- `assets/logo.png`: logotipo usado no cabeçalho e como favicon.
- `assets/galeria-09.jpg` e `assets/galeria-10.jpg`: duas novas fotos verticais, inseridas após `galeria-07`. Adicione seus arquivos com esses nomes.
