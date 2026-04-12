const API_VERSION_PATH = '/api/v1';

export const toGatewayApiBaseUrl = (gatewayUrl: string): string =>
	`${gatewayUrl.replace(/\/+$/, '').replace(/\/api\/v1$/i, '')}${API_VERSION_PATH}`;
