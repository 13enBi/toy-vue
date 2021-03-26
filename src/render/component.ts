import { Props, Vnode } from "./vnode";

type Render = () => Vnode;

export interface Component {
    name?: string;
    setup(props: Props): Render;
}

export interface ComponentInstance {
    vnode: Vnode;
    next: Vnode | null;
    tree: Vnode;
    component: Component;

    update: () => void | null;
    render: Render;
}

export const createComponentInstance = (vnode: Vnode): ComponentInstance => {
    const component = vnode.type as Component;

    const render = component.setup(vnode.props || {});

    return {
        component,
        vnode,
        next: null,
        tree: {} as Vnode,
        update: null!,
        render,
    };
};
