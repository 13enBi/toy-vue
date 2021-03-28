type Obj = Record<string, any>;

export const isString = (val: unknown): val is string => typeof val === 'string';

export const isArray = Array.isArray;

export const isObject = (val: unknown): val is Obj => !!val && !isArray(val) && typeof val === 'object';

export const isEmptyObject = (obj: Obj) => isObject(obj) && !!Object.keys(obj).length;

export const entries = (val: Obj, each: (key: string, val: any, index: number) => void) => {
	Object.entries(val).forEach(([k, v], i) => each(k, v, i));
};
