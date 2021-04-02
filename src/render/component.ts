import { effect } from "../reactive/effect";
import { Host } from "./host";
import { patch } from "./render";
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
    isMounted: boolean;
}

export const createComponentInstance = (vnode: Vnode): ComponentInstance => {
    const component = vnode.type as Component;

    const render = component.setup(vnode.props || {});

    const instance = {
        component,
        vnode,
        next: null,
        tree: {} as Vnode,
        update: null!,
        render,
        isMounted: false,
    };

    vnode.component = instance;

    return instance;
};

export const createRenderEffect = (instance: ComponentInstance, vnode: Vnode, container: Host) => {
    instance.update = effect(() => {
        if (instance.isMounted) {
            const nextTree = instance.render();
            const prevTree = instance.tree;
            instance.tree = nextTree;

            patch(prevTree, nextTree, container);
        } else {
            const tree = (instance.tree = instance.render());

            patch(null, tree, container);

            vnode.el = tree.el;

            instance.isMounted = true;
        }
    });
};
