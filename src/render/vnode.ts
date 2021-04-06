import { isArray, isObject, isString } from "../utils";
import { Component, ComponentInstance } from "./component";
import { Host } from "./host";

const VNODE_KEY = Symbol();

export type Props = Record<string, any>;

export const COMMENT = Symbol();
export const TEXT = Symbol();
export const FRAGMENG = Symbol();

export type VnodeType = null | string | Component | typeof COMMENT | typeof TEXT | typeof FRAGMENG;
export type VnodeChild = string | number | Vnode | null | void;
export type VnodeChildren = VnodeChild[];

export const enum VnodeFlag {
    Element,
    Component,
    Text,
    Comment,
    Fragment,
}

export interface Vnode {
    [VNODE_KEY]: true;

    type: VnodeType;
    el: Host | Node | null;
    props: Props | null;
    flag: VnodeFlag;
    children?: VnodeChildren;

    componentInstance?: ComponentInstance | null;
}

export const isVnode = (vnode: any): vnode is Vnode => vnode?.[VNODE_KEY];

export const createVnode = (type: VnodeType, props: Props | null = null, children?: VnodeChildren): Vnode => {
    const flag = isString(type)
        ? VnodeFlag.Element
        : type === TEXT
        ? VnodeFlag.Text
        : type === COMMENT
        ? VnodeFlag.Comment
        : type === FRAGMENG
        ? VnodeFlag.Fragment
        : VnodeFlag.Component;

    return { [VNODE_KEY]: true, el: null, type, props, children, flag };
};

export const normalizaNode = (node: VnodeChild | VnodeChildren): Vnode => {
    if (isVnode(node)) {
        return node;
    } else if (node == null) {
        return createVnode(COMMENT, null, [""]);
    } else if (isArray(node)) {
        return h(FRAGMENG, null, node);
    } else {
        return createVnode(TEXT, null, [String(node)]);
    }
};

export const normalizaChildren = (children?: VnodeChild | VnodeChildren) => {
    if (children == undefined) return [];

    if (!isArray(children)) children = [children];

    children.forEach((child, i) => {
        (children as VnodeChildren)[i] = normalizaNode(child);
    });

    return children as Vnode[];
};

interface H {
    (type: Exclude<VnodeType, null>): Vnode;
    (type: VnodeType, child: VnodeChild): Vnode;
    (type: VnodeType, children: VnodeChildren): Vnode;
    (type: VnodeType, props: Props | null): Vnode;
    (type: VnodeType, props: Props | null, child: VnodeChild): Vnode;
    (type: VnodeType, props: Props | null, children: VnodeChildren): Vnode;
}

export const h: H = (...args: any[]) => {
    const l = args.length;

    let [type, b, c] = args;

    switch (l) {
        case 1: {
            return createVnode(type, null);
        }
        case 2: {
            if (isObject(b) && !isVnode(b)) {
                return createVnode(type, b);
            } else {
                return createVnode(type, null, normalizaChildren(b));
            }
        }
        case 3: {
            return createVnode(type, b, normalizaChildren(c));
        }
        default: {
            if (l > 3) {
                c = normalizaChildren(args.slice(2));
            }

            return createVnode(type, b, c);
        }
    }
};
