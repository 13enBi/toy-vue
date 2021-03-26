import { isString } from "../utils";
import { Component } from "./component";

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
    el: Element | null;
    props: Props | null;
    flag: VnodeFlag;
    children?: VnodeChildren;
}

export const h = (type: VnodeType, props: Props | null = null, children?: VnodeChildren): Vnode => {
    const flag = isString(type) ? VnodeFlag.Element : type === null ? VnodeFlag.Text : VnodeFlag.Component;

    if (flag == VnodeFlag.Text) {
        (children || (children = [""])).map(String);
    }

    return { el: null, type, props, children, flag };
};
