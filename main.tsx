import { reactive } from './src/reactive/reactive';
import { defineComponent } from './src/render/component';
import { createApp } from './src/render/createApp';

const Child = defineComponent((props) => {
	const state = reactive({ count: 1, showName: true });

	const toggle = () => {
		state.showName = !state.showName;
	};

	return () => {
		return (
			<div>
				<button onClick={toggle}>{state.showName}</button>
				<div>{state.showName ? <div onClick={props.sayName}>{props.name}</div> : <p>{state.count}</p>}</div>
			</div>
		);
	};
});

const App = defineComponent(() => {
	const state = reactive({ name: 'parent' });

	const handleInput = (e: InputEvent) => {
		state.name = (e.target as HTMLInputElement).value;
	};

	return () => (
		<div>
			<input value={state.name} onInput={handleInput} />
			{state.name}
			<Child
				{...state}
				sayName={() => {
					console.log(state.name);
				}}
			></Child>
		</div>
	);
});

const app = createApp(App, '#app').mount();
