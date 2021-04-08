import { effect } from "../reactive/effect";
import { capitalize, entries, isArray, isFuction, isObject } from "../utils";
import { Host } from "./host";
import { patch } from "./render";
import { Props, Vnode } from "./vnode";

type Render = () => Vnode;
type Setup = (props: Props) => Render;

type PropsOptions = string[] | Record<string, any>;

type Emitter = (name: string, payload?: any) => void;

export interface Component {
    name?: string;
    props?: PropsOptions;
    setup: Setup;
}

export interface ComponentInstance {
    vnode: Vnode;
    tree: Vnode;
    component: Component;
    propsOptions?: PropsOptions;
    componentProps: Props;
    update: () => void;
    render: Render;
    isMounted: boolean;
}

export const defineComponent = <T extends Component>(opts: T | Setup): T & { new (): any } => {
    return isObject(opts) ? opts : ({ setup: opts } as any);
};

export const createComponentContext = () => {};

export const createEmitter = (instance: ComponentInstance): Emitter => {
    const props = instance.vnode.props;

    return (name: string, payload?: any) => {
        name = `on${capitalize(name)}`;

        const handler = props?.[name];

        if (isFuction(handler)) {
            handler(payload);
        }
    };
};

export const createSlots = (instance: ComponentInstance) => {
    return instance.vnode.children;
};

const normalizaPropsOptions = (props: PropsOptions): Record<string, any> => {
    if (isArray(props)) {
        return Object.fromEntries(props.map((k) => [k]));
    }

    return props;
};

export const getComponentProps = (vnode: Vnode, propsOptions?: PropsOptions) => {
    const props = vnode.props || (vnode.props = {});
    if (!propsOptions) return props;

    const opts = normalizaPropsOptions(propsOptions);

    const componentProps = {} as Props;
    entries(opts, (key, defaultVal) => {
        const propVal = props[key];
        const val = propVal !== void 0 ? propVal : defaultVal;
        val !== void 0 && (componentProps[key] = val);
    });

    return componentProps;
};

export const createComponentInstance = (vnode: Vnode, container: Host): ComponentInstance => {
    const component = vnode.type as Component;
    const { props: propsOptions } = component;

    const componentProps = getComponentProps(vnode, propsOptions);

    const render = component.setup(componentProps);

    const instance = {
        component,
        vnode,
        tree: {} as Vnode,
        update: null as any,
        render,
        propsOptions,
        componentProps,
        isMounted: false,
    };

    instance.update = createRenderEffect(instance, vnode, container);

    vnode.componentInstance = instance;

    return instance;
};

export const createRenderEffect = (instance: ComponentInstance, vnode: Vnode, container: Host) => {
    return effect(() => {
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
