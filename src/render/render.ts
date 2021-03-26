import { isString } from "../utils";
import { createComponentInstance } from "./component";
import { createElement, createText, insert, querySelector, setAttr } from "./host";
import { h, Vnode, VnodeChildren, VnodeFlag } from "./vnode";

const renderChildren = (children: VnodeChildren | undefined, container: Element) => {
    children?.forEach((child) => {
        if (typeof child === "string") child = h(null, null, [child]);

        render(child, container);
    });
};

const renderElement = (vnode: Vnode, container: Element) => {
    const tag = vnode.type as string;

    const el = (vnode.el = createElement(tag));

    renderChildren(vnode.children, el);

    const propsEntries = vnode.props && Object.entries(vnode.props);

    if (propsEntries) {
        propsEntries.forEach((kv) => {
            setAttr(el, ...kv);
        });
    }

    insert(container, el);
};

const renderText = (vnode: Vnode, container: Element) => {
    const text = vnode.children![0] as string;

    insert(container, createText(text));
};

const renderComponent = (vnode: Vnode, container: Element) => {
    const instance = createComponentInstance(vnode);

    //effect
    instance.tree = instance.render!();

    render(instance.tree, container);
};

export const render = (vnode: Vnode, container: Element | string) => {
    isString(container) && (container = querySelector(container)!);

    switch (vnode.flag) {
        case VnodeFlag.Element: {
            renderElement(vnode, container);
            break;
        }
        case VnodeFlag.Text: {
            renderText(vnode, container);
            break;
        }
        case VnodeFlag.Component: {
            renderComponent(vnode, container);
            break;
        }

        default: {
            throw new Error("unknow vnode flag");
        }
    }
};
