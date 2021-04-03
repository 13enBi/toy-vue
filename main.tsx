import { reactive } from './src/reactive/reactive';
import { defineComponent } from './src/render/component';
import { createApp } from './src/render/createApp';

const Child = defineComponent((props) => {
	const state = reactive({ count: 1, showName: false });

	const toggle = () => {
		state.showName = !state.showName;
	};

	return () => (
		<div>
			<button onClick={toggle}>{state.showName}</button>
			<div>{state.showName ? <div onClick={props.sayName}>{props.name}</div> : <p>{state.count}</p>}</div>
		</div>
	);
});

const App = defineComponent(() => {
	const state = reactive({ name: 'parent' });

	return () => (
		<div>
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

createApp(App, '#app').mount();
