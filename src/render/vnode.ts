import { isArray, isObject, isString } from '../utils';
import { Component, ComponentInstance } from './component';
import { Host } from './host';

export type Props = Record<string, any>;

export type VnodeType = null | string | Component;

export type VnodeChild = string | number | Vnode | null | void;

export type VnodeChildren = VnodeChild[];

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

export const createVnode = (type: VnodeType, props: Props | null = null, children?: VnodeChildren): Vnode => {
	const flag = isString(type) ? VnodeFlag.Element : type === null ? VnodeFlag.Text : VnodeFlag.Component;

	return { __is_vnode: true, el: null, type, props, children, flag };
};

export const normalizaChildren = (children?: VnodeChild | VnodeChildren): Vnode[] => {
	if (children == undefined) return [];

	if (!isArray(children)) children = [children];

	children.forEach((child, i) => {
		if (!isVnode(child)) (children as VnodeChildren)[i] = createVnode(null, null, [child + '']);
	});

	return children as Vnode[];
};

function h(type: Exclude<VnodeType, null>): Vnode;
function h(type: VnodeType, child: VnodeChild): Vnode;
function h(type: VnodeType, children: VnodeChildren): Vnode;
function h(type: VnodeType, props: Props | null): Vnode;
function h(type: VnodeType, props: Props | null, child: VnodeChild): Vnode;
function h(type: VnodeType, props: Props | null, children: VnodeChildren): Vnode;
function h(type: VnodeType, b?: any, c?: any): Vnode {
	const l = arguments.length;

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
				c = normalizaChildren([...arguments].slice(2));
			}

			return createVnode(type, b, c);
		}
	}
}

export { h };
