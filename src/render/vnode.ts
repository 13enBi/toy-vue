import { isString } from "../utils";
import { Component, ComponentInstance } from "./component";
import { Host } from "./host";

export type Props = Record<string, any>;

export type VnodeType = null | string | Component;

export type VnodeChildren = (string | number | Vnode)[];

export const enum VnodeFlag {
    Element,
    Component,
    Text,
}

export interface Vnode {
    __is_vnode: true;

    type: VnodeType;
    el: Host | Node | null;
    props: Props | null;
    flag: VnodeFlag;
    children?: VnodeChildren;

    component?: ComponentInstance | null;
}

export const isVnode = (vnode: any): vnode is Vnode => vnode?.__is_vnode;

export const h = (type: VnodeType, props: Props | null = null, children?: VnodeChildren): Vnode => {
    const flag = isString(type) ? VnodeFlag.Element : type === null ? VnodeFlag.Text : VnodeFlag.Component;

    return { __is_vnode: true, el: null, type, props, children, flag };
};
