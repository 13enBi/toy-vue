import { track, trigger } from './effect';

const RAW = '__raw';

const handler: ProxyHandler<any> = {
	get(target, key) {
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
	result[RAW] = source;

	return result;
};

export const toRaw = <T extends object>(target: T): T => (target as any)[RAW] || target;
