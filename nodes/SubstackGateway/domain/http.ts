import type { IDataObject } from 'n8n-workflow';

export type GatewayResponseMode = 'single' | 'items' | 'empty';

export type GatewayHttpRequest = {
	readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	readonly url: string;
	readonly qs?: IDataObject;
	readonly body?: IDataObject;
	readonly responseMode: GatewayResponseMode;
	readonly emptyResponseBody?: IDataObject;
};
