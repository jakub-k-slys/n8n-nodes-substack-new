import type { INodeProperties } from 'n8n-workflow';
import { createOperationProperty } from './operation-property';

export const postOperationProperty: INodeProperties = createOperationProperty('post');
