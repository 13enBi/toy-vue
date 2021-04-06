import { toRaw } from "../reactive/reactive";
import { entries, has, isArray, isEmptyObject, isObject, isString } from "../utils";
import { isEvent, patchEvent } from "./event";
import { setAttr } from "./host";
import { Props, Vnode } from "./vnode";

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
                        style[k] = "";
                    });
            }
        }
    } else {
        el.removeAttribute("style");
    }
};

type Klass = string | string[] | null | Record<string, boolean>;

const normalizaClass = (klass: Klass): string => {
    if (isString(klass)) {
        return klass;
    }

    if (isObject(klass)) {
        klass = Object.entries(klass)
            .filter(([_, v]) => v)
            .map(([k]) => k);
    }

    return klass!.map(normalizaClass).join(" ");
};

export const patchClass = (klass: Klass, el: HTMLElement) => {
    if (klass) {
        el.className = normalizaClass(klass);
    } else {
        el.removeAttribute("class");
    }
};

export const patchAttr = (key: string, next: any, el: HTMLElement) => {
    if (next) {
        setAttr(el, key, next);
    } else {
        el.removeAttribute(key);
    }
};

export const patchDomProp = (key: string, val: any, el: any) => {
    el[key] = val;
};

const patchProp = (key: string, prev: any, next: any, el: HTMLElement) => {
    if (key === "style") {
        patchStyle(prev, next, el);
    } else if (key === "class") {
        patchClass(next, el);
    } else if (isEvent(key)) {
        patchEvent(key, prev, next, el);
    } else if (has(el, key)) {
        patchDomProp(key, next, el);
    } else {
        patchAttr(key, next, el);
    }
};

export const patchComponentProps = (prev: Vnode, next: Vnode) => {
    const prevProps = toRaw(prev.props!);

    if (!prevProps) return;

    if (!next.props) {
        entries(prevProps, (k) => {
            delete prevProps![k];
        });
        return;
    }

    const nextProps = toRaw(next.props);

    entries(nextProps, (key, val) => {
        prevProps[key] = val;
    });

    entries(prevProps, (key) => {
        if (!has(nextProps, key)) {
            Reflect.deleteProperty(prevProps, key);
        }
    });

    next.props = prevProps;
};

export const patchProps = (prev: Props | null, next: Props | null, el: HTMLElement) => {
    if (prev === next) return;

    const isEmpty = isEmptyObject(prev);

    if (next) {
        entries(next, (key, val) => {
            patchProp(key, prev?.[key], val, el);
        });
    }
    if (!isEmpty) {
        entries(prev!, (key, val) => {
            !has(next, key) && patchProp(key, val, null, el);
        });
    }
};
