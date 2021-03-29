import { isString } from "../utils";
import { Component } from "./component";
import { Host } from "./host";

export type Props = Record<string, any>;

export type VnodeType = null | string | Component;

export type VnodeChildren = (string | Vnode)[];

export const enum VnodeFlag {
    Element,
    Component,
    Text,
}

export interface Vnode {
    type: VnodeType;
    el: Host | Node | null;
    props: Props | null;
    flag: VnodeFlag;
    children?: VnodeChildren;
}

export const h = (type: VnodeType, props: Props | null = null, children?: VnodeChildren): Vnode => {
    const flag = isString(type) ? VnodeFlag.Element : type === null ? VnodeFlag.Text : VnodeFlag.Component;

    return { el: null, type, props, children, flag };
};
