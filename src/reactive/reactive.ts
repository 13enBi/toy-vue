import { track, trigger } from "./effect";

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
    return new Proxy(source, handler);
};
