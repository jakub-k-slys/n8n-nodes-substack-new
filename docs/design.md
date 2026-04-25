# Architecture

## High-Level Structure

The package is organized around 4 n8n nodes:

- `Substack Gateway`
- `Substack Gateway Following Feed`
- `Substack Gateway Profile Feed`
- `Randomizer`

The Substack-specific runtime is still centered on the `Substack Gateway` action node and its shared resource-oriented runtime.

Key paths:

- [`nodes/Gateway/Gateway.node.ts`](/Users/jakubslys/n8n-nodes-substack-new/nodes/Gateway/Gateway.node.ts)
- [`nodes/FollowingFeed/FollowingFeed.node.ts`](/Users/jakubslys/n8n-nodes-substack-new/nodes/FollowingFeed/FollowingFeed.node.ts)
- [`nodes/ProfileFeed/ProfileFeed.node.ts`](/Users/jakubslys/n8n-nodes-substack-new/nodes/ProfileFeed/ProfileFeed.node.ts)
- [`nodes/Randomizer/Randomizer.node.ts`](/Users/jakubslys/n8n-nodes-substack-new/nodes/Randomizer/Randomizer.node.ts)
- [`nodes/SubstackGateway/runtime`](/Users/jakubslys/n8n-nodes-substack-new/nodes/SubstackGateway/runtime)
- [`nodes/SubstackGateway/domain`](/Users/jakubslys/n8n-nodes-substack-new/nodes/SubstackGateway/domain)
- [`nodes/SubstackGateway/schema`](/Users/jakubslys/n8n-nodes-substack-new/nodes/SubstackGateway/schema)

## Node Layer

`Gateway.node.ts` is the n8n-facing adapter:

- loads credentials
- validates `Gateway URL`
- runs the selected operation for each input item
- converts domain/runtime errors into n8n errors

`FollowingFeed.node.ts` and `ProfileFeed.node.ts` are polling triggers that reuse the gateway transport and shared Atom feed parsing/checkpointing helpers in [`nodes/shared/atom-feed`](/Users/jakubslys/n8n-nodes-substack-new/nodes/shared/atom-feed).

`Randomizer.node.ts` is an independent trigger that uses the shared scheduler logic in [`nodes/shared/randomizer`](/Users/jakubslys/n8n-nodes-substack-new/nodes/shared/randomizer).

## Runtime Layer

The runtime is split by resource under [`runtime/resources`](/Users/jakubslys/n8n-nodes-substack-new/nodes/SubstackGateway/runtime/resources):

- `own-publication`
- `note`
- `draft`
- `post`
- `profile`

Each resource owns its:

- input reader
- command decode
- request build
- response decode
- execute pipeline
- output DTO serialization

## Effect Integration

The runtime uses:

- `Effect` for orchestration
- `Effect.Schema` for input, response, and output DTO boundaries
- `@effect/platform` `HttpClient` as the transport abstraction

Host-specific adapters live under [`runtime/live`](/Users/jakubslys/n8n-nodes-substack-new/nodes/SubstackGateway/runtime/live).

## Build Output

The package compiles to `dist/`, and `package.json` points n8n to:

- `dist/credentials/SubstackGatewayApi.credentials.js`
- `dist/nodes/Gateway/Gateway.node.js`
- `dist/nodes/FollowingFeed/FollowingFeed.node.js`
- `dist/nodes/ProfileFeed/ProfileFeed.node.js`
- `dist/nodes/Randomizer/Randomizer.node.js`
