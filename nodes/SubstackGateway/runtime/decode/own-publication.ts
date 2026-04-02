import { Either, Match } from 'effect';
import type { OwnPublicationCommand } from '../../domain/command';

export const decodeOwnPublicationCommand = (
	operation: string,
): Either.Either<OwnPublicationCommand | undefined, never> =>
	Match.value(operation).pipe(
		Match.when('ownProfile', () => Either.right({ _tag: 'OwnProfile' } as const)),
		Match.when('ownNotes', () => Either.right({ _tag: 'OwnNotes' } as const)),
		Match.when('ownPosts', () => Either.right({ _tag: 'OwnPosts' } as const)),
		Match.when('ownFollowing', () => Either.right({ _tag: 'OwnFollowing' } as const)),
		Match.orElse(() => Either.right(undefined)),
	);
