import { defineConfig } from 'tsup';

export default defineConfig({
	tsconfig: 'tsconfig.tsup.json',
	entry: {
		'credentials/SubstackGatewayApi.credentials': 'credentials/SubstackGatewayApi.credentials.ts',
		'nodes/Gateway/Gateway.node': 'nodes/Gateway/Gateway.node.ts',
		'nodes/FollowingFeed/FollowingFeed.node': 'nodes/FollowingFeed/FollowingFeed.node.ts',
		'nodes/ProfileFeed/ProfileFeed.node': 'nodes/ProfileFeed/ProfileFeed.node.ts',
		'nodes/Randomizer/Randomizer.node': 'nodes/Randomizer/Randomizer.node.ts',
	},
	format: ['cjs'],
	target: 'es2019',
	outDir: 'dist',
	clean: true,
	dts: true,
	sourcemap: true,
	splitting: false,
	treeshake: true,
	bundle: true,
	external: ['n8n-workflow'],
});
