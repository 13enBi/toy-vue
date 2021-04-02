interface Effect {
    (): void;
    deps: Set<Deps>;
}

type Deps = Set<Effect>;
type KeyMap = Map<any, Deps>;

const targetMap = new WeakMap<any, KeyMap>();
let currentEffect: Effect;
const effectStack: Effect[] = [];
const last = () => effectStack[effectStack.length - 1];

export const effect = <T>(fn: () => T) => {
    const _effect: Effect = () => {
        if (effectStack.includes(_effect)) return;
        cleanup(_effect);
        try {
            currentEffect = _effect;
            effectStack.push(_effect);

            return fn();
        } finally {
            effectStack.pop();
            currentEffect = last();
        }
    };
    _effect.deps = new Set();

    _effect();

    return _effect;
};

export const cleanup = (effect: Effect) => {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
};

export const track = (target: object, key: any) => {
    if (!currentEffect) return;

    let depMap = targetMap.get(target);
    if (!depMap) {
        depMap = new Map();
        targetMap.set(target, depMap);
    }

    let deps = depMap.get(key);
    if (!deps) {
        deps = new Set();
        depMap.set(key, deps);
    }

    if (deps.has(currentEffect)) return;

    deps.add(currentEffect);
    currentEffect.deps.add(deps);
};

export const trigger = (target: object, key: any) => {
    const depMap = targetMap.get(target);
    if (!depMap) return;

    const deps = depMap.get(key);

    deps &&
        [...deps].forEach((effect) => {
            effect();
        });
};
