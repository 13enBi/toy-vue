import { effect } from "./src/reactive/effect";
import { reactive } from "./src/reactive/reactive";
import { defineComponent } from "./src/render/component";
import { createApp } from "./src/render/createApp";
import "./style.css";

const Child = defineComponent({
    props: {
        name: "wuhu",
        age: "100",
    },

    setup: (props) => {
        const state = reactive({ count: 1, showName: true, list: [1] });

        const toggle = () => {
            state.showName = !state.showName;
        };
        const add = () => state.count++;
        const sub = () => state.count--;

        effect(() => {
            state.list = new Array(state.count).fill(1).map((_, i) => i);
        });

        return () => (
            <>
                {null}
                <button onClick={add}>add</button>
                <button onClick={sub}>sub</button>
                <button onClick={toggle}>{state.showName}</button>
                <div>
                    {state.showName ? (
                        <div onClick={props.sayName}>{props.name}</div>
                    ) : (
                        <img src="/favicon.svg" style={{ width: "50px" }} />
                    )}
                </div>
                <div>
                    {state.list.map((i) => (
                        <div>{i}</div>
                    ))}
                </div>
            </>
        );
    },
});

const App = defineComponent(() => {
    const state = reactive({ name: "parent" });

    const handleInput = (e: InputEvent) => {
        state.name = (e.target as HTMLInputElement).value;
    };

    return () => (
        <>
            <input value={state.name} onInput={handleInput} />
            {state.name}
            <div>
                <Child
                    {...state}
                    sayName={() => {
                        console.log(state.name);
                    }}
                >
                    child
                </Child>
            </div>
        </>
    );
});

const app = createApp(App, "#app").mount();
