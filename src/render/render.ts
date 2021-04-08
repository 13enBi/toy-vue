import { createComponentInstance } from "./component";
import { createComment, createElement, createText, Host, insert, remove, setText } from "./host";
import { patchComponentProps, patchProps } from "./props";
import { normalizaNode, Vnode, VnodeChildren, VnodeFlag } from "./vnode";

type PatchNode = Vnode | null;

export const unmount = (vnode: PatchNode) => {
    if (vnode && vnode.el) remove(vnode.el);
};

const mountChildren = (children: VnodeChildren | undefined, el: Host) => {
    children?.forEach((child, i) => {
        patch(null, (children[i] = normalizaNode(child)), el);
    });
};

const patchChildren = (prev: VnodeChildren | undefined, next: VnodeChildren | undefined, el: Host) => {
    if (!next) {
        prev?.forEach((child) => {
            unmount(child as Vnode);
        });
        return;
    }

    if (!prev) {
        next?.forEach((child) => {
            patch(null, child as Vnode, el);
        });
        return;
    }

    const prevLen = prev.length;
    const nextLen = next.length;

    for (let i = 0; i < Math.min(prevLen, nextLen); i++) {
        patch(prev[i] as Vnode, (next[i] = normalizaNode(next[i])), el);
    }

    if (nextLen > prevLen) {
        for (let i = prevLen; i < nextLen; i++) {
            patch(null, (next[i] = normalizaNode(next[i])), el);
        }
    } else if (prevLen > nextLen) {
        for (let i = nextLen; i < prevLen; i++) {
            unmount(prev[i] as Vnode);
        }
    }
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
        next.el = prev.el!;
        const prevText = prev.children![0] as string;
        prevText !== text && setText(next.el, text);
    } else {
        const el = (next.el = createText(text));

        insert(container, el);
    }
};

const mountComponent = (vnode: Vnode, container: Host) => {
    createComponentInstance(vnode, container);
};

const patchComponent = (prev: Vnode, next: Vnode) => {
    const instance = (next.componentInstance = prev.componentInstance)!;

    patchComponentProps(instance, next);

    instance.update();
};

const renderComponent = (prev: PatchNode, next: Vnode, container: Host) => {
    if (!prev) {
        mountComponent(next, container);
    } else {
        patchComponent(prev, next);
    }
};

const renderComment = (prev: PatchNode, next: Vnode, container: Host) => {
    const str = next.children![0] as string;

    if (prev) {
        (next.el = prev.el as Node).nodeValue = str;
    } else {
        const comment = createComment(str);
        next.el = comment;
        insert(container, comment);
    }
};

const renderFragment = (prev: PatchNode, next: Vnode, container: Host) => {
    if (prev) {
        next.el = prev.el;
        patchChildren(prev.children, next.children, container);
    } else {
        next.el = container;
        mountChildren(next.children, container);
    }
};

export const patch = (prev: PatchNode, next: Vnode, container: Host) => {
    if (prev?.type !== next.type) {
        unmount(prev);
        prev = null;
    }

    let doPatch;

    switch (next.flag) {
        case VnodeFlag.Element: {
            doPatch = renderElement;
            break;
        }
        case VnodeFlag.Text: {
            doPatch = renderText;
            break;
        }
        case VnodeFlag.Component: {
            doPatch = renderComponent;
            break;
        }

        case VnodeFlag.Comment: {
            doPatch = renderComment;
            break;
        }

        case VnodeFlag.Fragment: {
            doPatch = renderFragment;
            break;
        }

        default: {
            throw new Error("unknow vnode flag:" + next.flag);
        }
    }

    doPatch(prev, next, container);
};

export const render = (vnode: PatchNode, container: Host) => {
    const { vnode: _vnode } = container;

    if (vnode) {
        patch(_vnode || null, vnode, container);
    } else if (_vnode) {
        unmount(_vnode);
    }
};
