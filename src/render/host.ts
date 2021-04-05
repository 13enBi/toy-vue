import { Vnode } from './vnode';

export interface Host extends HTMLElement {
	[key: string]: any;
	vnode?: Vnode;
}

export const querySelector = (sele: string) => document.querySelector(sele);

export const createElement = (type: string) => document.createElement(type);

export const createText = (text: string) => document.createTextNode(text);

export const createComment = (comment: string) => document.createComment(comment);

export const insert = (parent: Element, child: Node, anchor = null) => parent.insertBefore(child, anchor);

export const remove = (node: Node) => node.parentNode?.removeChild(node);

export const setAttr = (el: Element, key: string, value: any) => el.setAttribute(key, value);

export const setText = (node: Node, val: any) => (node.nodeValue = val);
