import { createComponentInstance, createRenderEffect } from './component';
import { createElement, createText, Host, insert, remove, setText } from './host';
import { patchComponentProps, patchProps } from './props';
import { normalizaChildren, Vnode, VnodeChildren, VnodeFlag } from './vnode';

type PatchNode = Vnode | null;

export const unmount = (vnode: PatchNode) => {
	if (vnode && vnode.el) remove(vnode.el);
};

const mountChildren = (children: VnodeChildren | undefined, el: Host) => {
	normalizaChildren(children).forEach((child) => {
		patch(null, child, el);
	});
};

const patchChildren = (prev: VnodeChildren | undefined, next: VnodeChildren | undefined, el: Host) => {
	if (!next) {
		prev?.forEach((child) => {
			unmount(child as Vnode);
		});
		return;
	}

	next = normalizaChildren(next);

	prev?.forEach((child: any, index) => {
		const nextChild = (next as Vnode[])[index];

		patch(child, nextChild, el);
	});
};

const mountElement = (vnode: Vnode, container: Host) => {
	const el = (vnode.el = createElement(vnode.type as string));

	mountChildren(vnode.children, el);
	patchProps(null, vnode.props, el);

	container.vnode = vnode;

	insert(container, el);
};

const patchElement = (prev: Vnode, next: Vnode, container: Host) => {
	const el = (next.el = prev.el!) as Host;

	patchProps(prev.props, next.props, el);
	patchChildren(prev.children, next.children, el);

	container.vnode = next;
};

const renderElement = (prev: PatchNode, next: Vnode, container: Host) => {
	if (prev) {
		patchElement(prev, next, container);
	} else {
		mountElement(next, container);
	}
};

const renderText = (prev: PatchNode, next: Vnode, container: Host) => {
	const text = next.children![0] as string;

	if (prev) {
		setText((next.el = prev.el)!, text);
	} else {
		const el = (next.el = createText(text));

		insert(container, el);
	}
};

const mountComponent = (vnode: Vnode, container: Host) => {
	const instance = createComponentInstance(vnode);

	createRenderEffect(instance, vnode, container);
};

const patchComponent = (prev: Vnode, next: Vnode) => {
	const instance = (next.component = prev.component)!;

	patchComponentProps(prev, next);

	instance.update();
};

const renderComponent = (prev: PatchNode, next: Vnode, container: Host) => {
	if (!prev) {
		mountComponent(next, container);
	} else {
		patchComponent(prev, next);
	}
};

export const patch = (prev: PatchNode, next: Vnode, container: Host) => {
	if (prev?.type !== next.type) {
		unmount(prev);
		prev = null;
	}

	switch (next.flag) {
		case VnodeFlag.Element: {
			renderElement(prev, next, container);
			break;
		}
		case VnodeFlag.Text: {
			renderText(prev, next, container);
			break;
		}
		case VnodeFlag.Component: {
			renderComponent(prev, next, container);
			break;
		}

		default: {
			throw new Error('unknow vnode flag:' + next.flag);
		}
	}
};

export const render = (vnode: PatchNode, container: Host) => {
	const { vnode: _vnode } = container;

	if (vnode) {
		patch(_vnode || null, vnode, container);
	} else if (_vnode) {
		unmount(_vnode);
	}
};
