import type { IDataObject } from 'n8n-workflow';

export type GatewayResult =
	| { readonly _tag: 'Single'; readonly item: IDataObject }
	| { readonly _tag: 'Many'; readonly items: ReadonlyArray<IDataObject> };
