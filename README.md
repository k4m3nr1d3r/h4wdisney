# h4wnee — Portfolio 2026 / Vercel

Versão preparada para hospedagem estática no Vercel.

## Estrutura

```text
h4wnee/
├── index.html
├── script.js
├── style.css
├── package.json
├── vercel.json
├── gallery-index.json
├── gallery-data.js
├── scripts/
│   └── generate-gallery.mjs
├── assets/
│   ├── logo.png
│   └── background.jpg
├── Vernissages/
│   ├── utopias_piratas_2021/
│   ├── hyperlinks, distorção e mormaço/
│   └── RAW 2025 (HOA+FDAG)/
└── Obras/
```

## Deploy no Vercel

Basta enviar esta pasta para um repositório GitHub e importar o repositório no Vercel. O projeto já possui `package.json` + `vercel.json`.

O Vercel executará automaticamente:

```text
npm run build
```

Durante o build, `scripts/generate-gallery.mjs` procura as imagens dentro de `Vernissages` e `Obras` e gera automaticamente:

- `gallery-index.json`
- `gallery-data.js`

Depois disso o `index.html` abre o catálogo já preenchido. Você não precisa clicar em “atualizar”, selecionar a pasta ou executar Python.

## Como adicionar novas obras

Coloque o arquivo de imagem na pasta correta e faça um novo deploy.

Exemplo:

```text
Obras/minha_nova_obra.jpg
```

ou:

```text
Vernissages/RAW 2025 (HOA+FDAG)/minha_obra.jpg
```

O nome da miniatura será criado automaticamente a partir do nome real do arquivo.

## Navegação

A janela `works` usa uma navegação própria por pasta:

- `←` Voltar: retorna pelo histórico real da navegação.
- `↑` Acima: sobe uma pasta.
- Breadcrumb: permite voltar diretamente a qualquer nível.

As miniaturas usam carregamento `lazy`, portanto o site não tenta carregar todas as imagens antes de abrir a interface.

As dimensões completas da imagem só são calculadas quando a obra é aberta.

## Janelas

`X` fecha, `_` minimiza, `□` maximiza/restaura e `Esc` fecha a janela ativa. As janelas de obras continuam arrastáveis e redimensionáveis.

## Importante

O ZIP recebido originalmente não continha `assets/logo.png`, `assets/background.jpg` nem as imagens das obras. Mantenha seus arquivos reais nessas pastas no projeto antes de fazer o deploy.
