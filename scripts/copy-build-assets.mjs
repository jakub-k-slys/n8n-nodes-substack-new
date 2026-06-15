import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();

const filesToCopy = [
	'package.json',
	'nodes/Gateway/Gateway.node.json',
	'nodes/FollowingFeed/FollowingFeed.node.json',
	'nodes/ProfileFeed/ProfileFeed.node.json',
	'nodes/BatchFeed/BatchFeed.node.json',
	'nodes/Randomizer/Randomizer.node.json',
	'nodes/RandomGate/RandomGate.node.json',
	'nodes/SubstackGateway/substackGateway.svg',
	'nodes/SubstackGateway/substackGateway.dark.svg',
];

for (const relativePath of filesToCopy) {
	const sourcePath = path.join(projectRoot, relativePath);
	const destinationPath = path.join(projectRoot, 'dist', relativePath);

	await fs.mkdir(path.dirname(destinationPath), { recursive: true });

	if (relativePath === 'package.json') {
		const pkg = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
		delete pkg.pnpm;
		await fs.writeFile(destinationPath, JSON.stringify(pkg, null, '\t') + '\n');
		continue;
	}

	await fs.copyFile(sourcePath, destinationPath);
}
