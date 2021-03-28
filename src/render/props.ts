import { entries, isObject, isString } from '../utils';
import { setAttr } from './host';
import { Props } from './vnode';

type Style = string | Record<string, string> | null;

export const patchStyle = (prev: Style, next: Style, el: HTMLElement) => {
	const { style } = el;

	if (next) {
		if (isString(next)) {
			style.cssText = next;
		} else {
			entries(next, (key: any, val) => {
				style[key] = val;
			});

			if (isObject(prev)) {
				Object.keys(prev)
					.filter((k) => !next[k])
					.forEach((k: any) => {
						style[k] = '';
					});
			}
		}
	} else {
		el.removeAttribute('style');
	}
};

type Klass = string | string[] | null;

export const patchClass = (val: Klass, el: HTMLElement) => {
	if (val) {
		el.className = isString(val) ? val : val.join(' ');
	} else {
		el.removeAttribute('class');
	}
};

export const patchAttr = (key: string, next: any, el: HTMLElement) => {
	if (next) {
		setAttr(el, key, next);
	} else {
		el.removeAttribute(key);
	}
};

export const isEvent = (key: string) => key.length > 2 && key.startsWith('on');

export const patchEvent = (key: string, prev: EventListener | null, next: EventListener | null, el: HTMLElement) => {
	key = key.slice(2).toLowerCase(); //onClick -> click;

	prev && el.removeEventListener(key, prev);
	if (next) {
		el.addEventListener(key, next);
	}
};

const patchProp = (key: string, prev: any, next: any, el: HTMLElement) => {
	if (key === 'style') {
		patchStyle(prev, next, el);
	} else if (key === 'class') {
		patchClass(next, el);
	} else if (isEvent(key)) {
		patchEvent(key, prev, next, el);
	} else {
		patchAttr(key, next, el);
	}
};

export const patchProps = (prev: Props | null, next: Props | null, el: HTMLElement) => {
	if (prev === next) return;

	if (next) {
		entries(next, (key, val) => {
			patchProp(key, prev?.[key], val, el);
		});
	} else {
		next = {};
	}

	if (prev) {
		entries(prev, (key, val) => {
			patchProp(key, val, next![key], el);
		});
	}
};
