import { Either } from 'effect';
import type { OwnPublicationCommand } from '../../domain/command';

export const decodeOwnPublicationCommand = (
	operation: string,
): Either.Either<OwnPublicationCommand | undefined, never> => {
	switch (operation) {
		case 'ownProfile':
			return Either.right({ _tag: 'OwnProfile' });
		case 'ownNotes':
			return Either.right({ _tag: 'OwnNotes' });
		case 'ownPosts':
			return Either.right({ _tag: 'OwnPosts' });
		case 'ownFollowing':
			return Either.right({ _tag: 'OwnFollowing' });
		default:
			return Either.right(undefined);
	}
};
