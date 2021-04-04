import { isString } from '../utils';
import { Component } from './component';
import { Host, querySelector } from './host';
import { render, unmount } from './render';
import { h, Vnode } from './vnode';

export const createApp = (component: Component, container: Element | string) => {
	let app: Vnode;

	return {
		mount() {
			isString(container) && (container = querySelector(container) as Host);

			render((app = h(component)), container as Host);

			return this;
		},
		unmount() {
			app && unmount(app);

			return this;
		},
	};
};
