import { Component } from "./src/render/component";
import { render } from "./src/render/render";
import { h } from "./src/render/vnode";

const component: Component = {
    setup(props) {
        return () =>
            h("div", { class: "comp" }, [h("div", { class: "c1" }, [props.title]), h("img", { src: "./favicon.svg" })]);
    },
};

const html = h("div", { id: "demo" }, [h("p", null, ["p2"]), h(component, { title: "title" }), h("p", null, ["p3"])]);

render(html, "#app");
