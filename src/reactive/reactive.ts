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

const REF = Symbol();

export type Ref<T> = { value: T };

export const ref = <T>(raw: T): Ref<T> => {
	return {
		[REF]: true,
		[RAW]: raw,
		_value: raw,

		get value() {
			track(this, '_value');

			return this._value;
		},
		set value(val) {
			this._value = val;
			trigger(this, '_value');
		},
	} as any;
};

export const isRef = (val: any): val is Ref<any> => val && val[REF];

export const unRef = <T>(val: T): T extends Ref<infer R> ? R : T => (isRef(val) ? val.value : val);
