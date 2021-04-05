import { track, trigger } from './effect';

const RAW = Symbol();

const handler: ProxyHandler<any> = {
	get(target, key) {
		if (key === RAW) return target;

		track(target, key);

		return Reflect.get(target, key);
	},

	set(target, key, value) {
		const res = Reflect.set(target, key, value);

		trigger(target, key);

		return res;
	},
};

export const reactive = <T extends object>(source: T): T => {
	const result = new Proxy(source, handler);

	return result;
};

export const toRaw = <T>(source: T): T => {
	return (source && (source as any)[RAW]) || source;
};
