import { Vnode } from "./vnode";

export interface Host extends Element {
    _vnode?: Vnode;
}

export const querySelector = (sele: string) => document.querySelector(sele);

export const createElement = (type: string) => document.createElement(type);

export const createText = (text: string) => document.createTextNode(text);

export const insert = (parent: Element, child: Node, anchor = null) => parent.insertBefore(child, anchor);

export const remove = (node: Node) => node.parentNode?.removeChild(node);

export const setAttr = (el: Element, key: string, value: any) => el.setAttribute(key, value);
