import type { INodeProperties } from 'n8n-workflow';

import { draftFields } from './fields-draft';
import { noteFields } from './fields-note';
import { postFields } from './fields-post';
import { profileFields } from './fields-profile';
import { draftOperationProperty } from './operations-draft';
import { noteOperationProperty } from './operations-note';
import { ownPublicationOperationProperty } from './operations-own-publication';
import { postOperationProperty } from './operations-post';
import { profileOperationProperty } from './operations-profile';
import { resourceProperty } from './resource';

export const substackGatewayProperties: INodeProperties[] = [
	resourceProperty,
	ownPublicationOperationProperty,
	noteOperationProperty,
	draftOperationProperty,
	postOperationProperty,
	profileOperationProperty,
	...noteFields,
	...draftFields,
	...postFields,
	...profileFields,
];
