import { isString } from "../utils";
import { createComponentInstance } from "./component";
import { createElement, createText, Host, insert, querySelector, remove, setText } from "./host";
import { patchProps } from "./props";
import { h, Vnode, VnodeChildren, VnodeFlag } from "./vnode";

type PatchNode = Vnode | null;

const unmount = (vnode: Vnode | null) => {
    if (vnode && vnode.el) remove(vnode.el);
};

const mountChildren = (children: VnodeChildren | undefined, el: Host) => {
    children?.forEach((child, i) => {
        if (isString(child)) child = children[i] = h(null, null, [child]);

        patch(null, child, el);
    });
};

const patchChildren = (prev: VnodeChildren | undefined, next: VnodeChildren | undefined, el: Host) => {
    prev?.forEach((child) => {
        unmount(child as Vnode);
    });

    mountChildren(next, el);
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
    //normalizeChildren(next);

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

const renderComponent = (vnode: Vnode, container: Host) => {
    const instance = createComponentInstance(vnode);

    //effect
    instance.tree = instance.render!();

    render(instance.tree, container);
};

const patch = (prev: PatchNode, next: Vnode, container: Host) => {
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
            renderComponent(next, container);
            break;
        }

        default: {
            throw new Error("unknow vnode flag");
        }
    }
};

export const render = (vnode: PatchNode, container: Host | string) => {
    isString(container) && (container = querySelector(container) as HTMLElement);

    const { vnode: _vnode } = container;

    if (vnode) {
        patch(_vnode || null, vnode, container);
    } else if (_vnode) {
        unmount(_vnode);
    }
};
