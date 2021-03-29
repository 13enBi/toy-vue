import { entries, has, isEmptyObject, isObject, isString } from "../utils";
import { setAttr } from "./host";
import { Props } from "./vnode";

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

type Klass = string | string[] | null;

export const patchClass = (val: Klass, el: HTMLElement) => {
    if (val) {
        el.className = isString(val) ? val : val.join(" ");
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

export const isEvent = (key: string) => key.length > 2 && key.startsWith("on");

interface EventHandler extends EventListener {
    origin: EventListener | null;
}
type HandlerMap = Record<string, EventHandler | null>;
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
    key = key.slice(2).toLowerCase(); //onClick -> click;
    const map = el.handlerMap || (el.handlerMap = {});
    const hit = map[key];

    if (next) {
        if (hit) {
            hit.origin = next;
        } else {
            const handler = (map[key] = createHandler(next));
            el.addEventListener(key, handler);
        }
    } else if (hit) {
        el.removeEventListener(key, hit);
        hit.origin = null;
    }
};

const patchProp = (key: string, prev: any, next: any, el: HTMLElement) => {
    if (key === "style") {
        patchStyle(prev, next, el);
    } else if (key === "class") {
        patchClass(next, el);
    } else if (isEvent(key)) {
        patchEvent(key, prev, next, el);
    } else {
        patchAttr(key, next, el);
    }
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
