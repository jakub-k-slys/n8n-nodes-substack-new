import * as Schema from 'effect/Schema';

export const GatewayModuleSchema = Schema.Struct({
	name: Schema.String,
	version: Schema.String,
	features: Schema.Array(Schema.String),
});
export type GatewayModule = Schema.Schema.Type<typeof GatewayModuleSchema>;

export const GatewayCapabilitiesSchema = Schema.Struct({
	application: Schema.String,
	modules: Schema.Array(GatewayModuleSchema),
});
export type GatewayCapabilities = Schema.Schema.Type<typeof GatewayCapabilitiesSchema>;

export const getGatewayFeatures = (capabilities: GatewayCapabilities): string[] =>
	capabilities.modules.flatMap((module) => [...module.features]);

export const describeGatewayModules = (capabilities: GatewayCapabilities): string =>
	capabilities.modules.map((module) => `${module.name}@${module.version}`).join(', ');
