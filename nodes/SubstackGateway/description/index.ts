import type { INodeProperties } from 'n8n-workflow';

import { draftFields } from './fields-draft';
import { noteFields } from './fields-note';
import { operationProperty } from './operation-property';
import { postFields } from './fields-post';
import { profileFields } from './fields-profile';
import { resourceProperty } from './resource';

export const substackGatewayProperties: INodeProperties[] = [
	resourceProperty,
	operationProperty,
	...noteFields,
	...draftFields,
	...postFields,
	...profileFields,
];
