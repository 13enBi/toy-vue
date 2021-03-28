import { render } from './src/render/render';
import { h } from './src/render/vnode';

console.time('render');
render(
	h(
		'div',
		{
			class: 'a1 a2',
			style: { color: 'red' },
			'data-name': 'demo',
			onClick() {
				console.log(1);
			},
		},
		new Array(5).fill('').map((_, i) =>
			h(
				'div',
				{
					'data-id': i,
					onClick() {
						console.log(i);
					},
				},
				[i + '']
			)
		)
	),
	'#app'
);
console.timeEnd('render');

(window as any).a = () => {
	render(
		h(
			'div',
			{
				class: ['b1', 'b2'],
				style: { color: 'blue' },
				'data-id': '1',
				onmousedown() {
					console.log(2);
				},
			},
			['demo2']
		),
		'#app'
	);
};
