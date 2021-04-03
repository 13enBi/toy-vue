interface EventHandler extends EventListener {
	origin: EventListener | null;
}
type HandlerMap = Record<string, EventHandler | null>;

export const isEvent = (key: string) => key.length > 2 && key.startsWith('on');

const parseName = (key: string, lower = true) => {
	//onClick -> click;
	key = key.slice(2);

	return lower ? key.toLowerCase() : key;
};

const createHandler = (listener: EventListener) => {
	const handler: EventHandler = function (e: Event) {
		handler.origin!(e);
	};

	handler.origin = listener;

	return handler;
};

export const patchEvent = (
	key: string,
	prev: EventListener | null,
	next: EventListener | null,
	el: HTMLElement & { handlerMap?: HandlerMap }
) => {
	if (prev === next) return;

	const name = parseName(key);
	const map = el.handlerMap || (el.handlerMap = {});
	const hit = map[name];

	if (next) {
		if (hit) {
			hit.origin = next;
		} else {
			const handler = (map[name] = createHandler(next));
			el.addEventListener(name, handler);
		}
	} else if (hit) {
		el.removeEventListener(name, hit);

		map[name] = null;
	}
};
