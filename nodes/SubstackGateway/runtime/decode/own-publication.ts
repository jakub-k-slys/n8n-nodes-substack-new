import type { OwnPublicationCommand } from '../../domain/command';

export const decodeOwnPublicationCommand = (
	operation: string,
): OwnPublicationCommand | undefined => {
	switch (operation) {
		case 'ownProfile':
			return { _tag: 'OwnProfile' };
		case 'ownNotes':
			return { _tag: 'OwnNotes' };
		case 'ownPosts':
			return { _tag: 'OwnPosts' };
		case 'ownFollowing':
			return { _tag: 'OwnFollowing' };
		default:
			return undefined;
	}
};
