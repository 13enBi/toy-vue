import { reactive } from "./src/reactive/reactive";
import { render } from "./src/render/render";
import { h } from "./src/render/vnode";

const comp = {
    setup() {
        const target = reactive({ count: 1 });

        console.log(target);

        setTimeout(() => {
            target.count = 123123;
        }, 1000);

        return () => h("div", null, [target.count === 1 ? h("div", null, ["wuhu"]) : h("p", null, ["qifei"])]);
    },
};

render(h(comp), "#app");
