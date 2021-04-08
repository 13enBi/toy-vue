type Obj = Record<string, any>;

export const isString = (val: unknown): val is string => typeof val === "string";
export const isFuction = (val: unknown): val is (...args: any[]) => any => typeof val === "function";

export const isArray = Array.isArray;

export const isObject = (val: unknown): val is Obj => !!val && !isArray(val) && typeof val === "object";

export const isEmptyObject = (obj: unknown) => !isObject(obj) || Object.keys(obj).length === 0;

export const entries = (val: Obj, each: (key: string, val: any, index: number) => void) => {
    Object.entries(val).forEach(([k, v], i) => each(k, v, i));
};

export const has = (target: any, key: any) => !isEmptyObject(target) && Reflect.has(target, key);

export const capitalize = (str: string) => str.replace(/^\w/, (s) => s.toUpperCase());
