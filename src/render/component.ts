import { effect } from '../reactive/effect';
import { isObject } from '../utils';
import { Host } from './host';
import { patch } from './render';
import { Props, Vnode } from './vnode';

type Render = () => Vnode;
type Setup = (props: Props) => Render;

export interface Component {
	name?: string;
	setup: Setup;
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

export const defineComponent = <T extends Component>(opts: T | Setup): T & { new (): any } => {
	return isObject(opts) ? opts : ({ setup: opts } as any);
};

export const createComponentInstance = (vnode: Vnode): ComponentInstance => {
	const component = vnode.type as Component;

	const render = component.setup(vnode.props || (vnode.props = {}));

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
