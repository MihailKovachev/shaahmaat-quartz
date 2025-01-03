# ShaahMaat-Quartz

A [Quartz](https://quartz.jzhao.xyz/) plugin for rendering chess positions. This plugin is a direct port of the [ShaahMaat-md](https://github.com/MihailKovachev/shaahmaat-md) plugin for [Obsidian](https://obsidian.md/).

## Features
The plugin supports all features of [ShaahMaat-md](https://github.com/MihailKovachev/shaahmaat-md).

## Installation

1. Change into the `quartz` folder of your project.

```bash
cd quartz
```

2. Install [chess.js](https://github.com/jhlywa/chess.js) and [jsdom](https://github.com/jsdom/jsdom).

```bash
npm install chess.js
npm install --save jsdom
npm install --save @types/jsdom
```

3. Download the plugin archive from the latest release and extract it.

4. Move the `shaahmaat` folder to `quartz/quartz/plugins/transformers` and add `export { ShaahMaat } from "./shaahmaat/main"` on a new line in `index.ts`.

5. Move the `shaahmaat.css` file to `quartz/quartz/static`.

6. Enable the plugin by adding `Plugin.ShaahMaat()` under `transfomers` under `plugins` in your `quartz.config.ts` file.

## Usage

The plugin is used in exactly the same way as [ShaahMaat-md](https://github.com/MihailKovachev/shaahmaat-md).

## Customisation

By changing the settings of the plugin, you can customise the colours used for board squares, highlights and arrows. You can also select what chess set should be used for the pieces.

Adding custom chess sets is possible by modifying the `shaahmaat.css` file. You need to add each of the set's pieces in the following way:

```css
.shaahmaat-chess-piece.SETNAME-chess-set.PIECE.COLOR {background-image:url('data:image/svg+xml;base64,PIECEDATA')}
```

`SETNAME` should be the name of your chess set. `PIECE` is the name of the piece - one of `king`, `queen`, `bishop`, `knight`, `rook`, `pawn`. `COLOR` is the color of the piece - either `white` or `black`. `PIECEDATA` is the [base64](https://en.wikipedia.org/wiki/Base64)-encoded [SVG](https://en.wikipedia.org/wiki/SVG) image you want to use for your piece. Take a look at `styles.css` for a clearer example.

## Roadmap

- [ ] Customisable background image for chess boards.
- [ ] Customisable arrow size.
- [ ] Browsing through PGN move history.
- [ ] Display board coordinates.

# Support

If you encounter any bugs, open an issue on the [Github repository](https://github.com/MihailKovachev/shaahmaat-quartz). Other contributions are also welcome.

ShaahMaat-md would not be possible without [chessjs](https://github.com/jhlywa/chess.js), [jsdom](https://github.com/jsdom/jsdom) and [cburnett](https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces)'s chess pieces.