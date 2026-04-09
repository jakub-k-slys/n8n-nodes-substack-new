import { configWithoutCloudSupport } from '@n8n/node-cli/eslint';

const sanitizedBaseConfig = configWithoutCloudSupport.map((entry) => {
	if (entry == null || typeof entry !== 'object' || !('rules' in entry) || entry.rules == null) {
		return entry;
	}

	const { ['preserve-caught-error']: _removedRule, ...rules } = entry.rules;

	return {
		...entry,
		rules,
	};
});

export default [
	...sanitizedBaseConfig,
	{
		ignores: ['.old/**'],
	},
	{
		files: ['test/package/*.test.ts'],
		rules: {
			'import-x/no-unresolved': 'off',
		},
	},
	{
		files: [
			'nodes/SubstackGateway/Gateway.node.ts',
			'nodes/SubstackGateway/FollowingFeed.node.ts',
			'nodes/SubstackGateway/ProfileFeed.node.ts',
		],
		rules: {
			'n8n-nodes-base/node-dirname-against-convention': 'off',
			'n8n-nodes-base/node-filename-against-convention': 'off',
		},
	},
];
