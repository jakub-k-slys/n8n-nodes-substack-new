import { Match } from 'effect';
import type { IDataObject } from 'n8n-workflow';

import type { GatewayResult } from '../domain/result';
import { draftResultToJson } from './resources/draft/to-json';
import { noteResultToJson } from './resources/note/to-json';
import { ownPublicationResultToJson } from './resources/own-publication/to-json';
import { postResultToJson } from './resources/post/to-json';
import { profileResultToJson } from './resources/profile/to-json';

export const gatewayResultToJsonItems = (result: GatewayResult): ReadonlyArray<IDataObject> =>
	Match.value(result).pipe(
		Match.when({ _tag: 'OwnPublication' }, ownPublicationResultToJson),
		Match.when({ _tag: 'Note' }, noteResultToJson),
		Match.when({ _tag: 'Draft' }, draftResultToJson),
		Match.when({ _tag: 'Post' }, postResultToJson),
		Match.when({ _tag: 'Profile' }, profileResultToJson),
		Match.exhaustive,
	);
