import { effect } from './src/reactive/effect';
import { reactive } from './src/reactive/reactive';
import { defineComponent } from './src/render/component';
import { createApp } from './src/render/createApp';
import './style.css';

const Child = defineComponent({
	props: {
		name: 'wuhu',
		age: '100',
	},

	setup: (props, { slots, emit }) => {
		const state = reactive({ count: 1, showName: true, list: [1] });

		const toggle = () => {
			state.showName = !state.showName;
		};
		const add = () => state.count++;
		const sub = () => state.count--;

		effect(() => {
			state.list = new Array(Math.max(0, state.count)).fill(1).map((_, i) => i);
		});

		return () => (
			<>
				<div>slot:{slots}</div>
				<button onClick={add}>add</button>
				<button onClick={sub}>sub</button>
				<button onClick={toggle}>{state.showName}</button>
				<button onClick={() => emit('say', 'wuhu')}>say</button>
				<div>
					{state.showName ? (
						<div onClick={props.sayName}>{props.name}</div>
					) : (
						<img src="/favicon.svg" style={{ width: '50px' }} />
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
	const state = reactive({ name: 'parent' });

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
					onSay={(name: string) => {
						console.log(name);
					}}
				>
					<div>slot1</div>
					<div>slot2</div>
					<div>slot3</div>
				</Child>
			</div>
		</>
	);
});

const app = createApp(App, '#app').mount();
