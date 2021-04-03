import { isString } from '../utils';
import { Component } from './component';
import { Host, querySelector } from './host';
import { render } from './render';
import { h } from './vnode';

export const createApp = (component: Component, container: Element | string) => {
	return {
		mount() {
			isString(container) && (container = querySelector(container) as Host);

			render(h(component), container as Host);
		},
	};
};
