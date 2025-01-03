import { Code } from "mdast";
import { Element, ElementContent } from "hast"

import { fromHtml } from 'hast-util-from-html'

import { ShaahMaatParser } from './ShaahMaatParser';
import { DEFAULT_SETTINGS, ShaahMaatSettings } from './ShaahMaatSettings';
import ShaahMaatRenderer from './ShaahMaat';

import { QuartzTransformerPlugin } from '../../types';
import { visit } from 'unist-util-visit';
import { ShaahMaatBoardInfo } from "./ShaahMaatBoardInfo";

let boards = new Array<ShaahMaatBoardInfo>();

export const ShaahMaat: QuartzTransformerPlugin<ShaahMaatSettings> = (opts?: ShaahMaatSettings) => {

	if (opts === undefined) {
		opts = DEFAULT_SETTINGS;
	}

	if (opts.arrowColor === undefined) {
		opts.arrowColor = DEFAULT_SETTINGS.arrowColor;
	}
	if (opts.chessSet === undefined) {
		opts.chessSet = DEFAULT_SETTINGS.chessSet;
	}
	if (opts.darkSquareColor === undefined) {
		opts.darkSquareColor = DEFAULT_SETTINGS.darkSquareColor;
	}
	if (opts.lightSquareColor === undefined) {
		opts.lightSquareColor = DEFAULT_SETTINGS.lightSquareColor;
	}
	if (opts.highlightedSquareColor === undefined) {
		opts.highlightedSquareColor = DEFAULT_SETTINGS.highlightedSquareColor;
	}

	return {
		name: "ShaahMaat",
		markdownPlugins(ctx) {
			return [
				() => {
					return (tree, file) => {
						visit(tree, "code", (node: Code, index, parent: Node) => {
							if (node.lang?.valueOf() === "shaahmaat") {
								node.lang = `shaahmaat-chessboard-${boards.length}`;
								boards.push(ShaahMaatParser.parseShaahMaat(node.value));
							}
						});
					}
				}
			];
		},
		htmlPlugins(ctx) {
			return [() => {
				return (tree, file) => {
					visit(tree, "element", (node: Element, _index, _parent: Element) => {
						if (node.tagName === "code") {
							let language = node.properties?.dataLanguage as string;

							if (language !== undefined && language.startsWith("shaahmaat-chessboard")) {
								let boardIndex = parseInt(language.substring(language.lastIndexOf('-') + 1));
								
								let boardHtmlEl = ShaahMaatRenderer.createChessBoardElement(boards[boardIndex], opts);
								boardHtmlEl.setAttribute("id", `shaahmaat-chessboard-${boardIndex}`);

								let boardHtmlNode = fromHtml(boardHtmlEl.outerHTML, {fragment: true});
								node.tagName = "div";
								
								_parent.children = new Array<ElementContent>();
								_parent.children.push(boardHtmlNode.children[0] as ElementContent);
							}
						}

					});
				}
			}
			];
		},
		externalResources() {
			return {
				css: [{content: "static/shaahmaat.css"}],
				js: [],
			}
		}
	}
}
