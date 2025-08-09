/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
	import { FC, SVGProps } from 'react';
	const content: FC<SVGProps<SVGSVGElement>>;
	export default content;
  }
  