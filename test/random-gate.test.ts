import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	createMulberry32,
	hashSeed,
	normalizeThreshold,
	resolveSeed,
	shouldPass,
} from '../nodes/shared/random-gate/index.ts';

describe('shouldPass', () => {
	it('always drops when threshold is 0 even with rng returning 0', () => {
		assert.equal(shouldPass(0, () => 0), false);
	});

	it('always passes when threshold is 100 even with rng returning 0.9999', () => {
		assert.equal(shouldPass(100, () => 0.9999), true);
	});

	it('passes when rng roll is below threshold', () => {
		assert.equal(shouldPass(50, () => 0.49), true);
	});

	it('drops when rng roll is at or above threshold', () => {
		assert.equal(shouldPass(50, () => 0.5), false);
	});
});

describe('normalizeThreshold', () => {
	it('clamps below 0 to 0', () => {
		assert.equal(normalizeThreshold(-10), 0);
	});

	it('clamps above 100 to 100', () => {
		assert.equal(normalizeThreshold(250), 100);
	});

	it('returns 0 for non-numeric input', () => {
		assert.equal(normalizeThreshold('not-a-number'), 0);
	});

	it('preserves valid values', () => {
		assert.equal(normalizeThreshold(42.5), 42.5);
	});
});

describe('resolveSeed', () => {
	it('returns undefined for empty input', () => {
		assert.equal(resolveSeed(''), undefined);
		assert.equal(resolveSeed(undefined), undefined);
		assert.equal(resolveSeed(null), undefined);
	});

	it('uses numeric strings as integers', () => {
		assert.equal(resolveSeed('42'), 42);
	});

	it('hashes non-numeric strings deterministically', () => {
		assert.equal(resolveSeed('substack'), hashSeed('substack'));
	});
});

describe('createMulberry32', () => {
	it('produces identical sequences for the same seed', () => {
		const a = createMulberry32(12345);
		const b = createMulberry32(12345);
		const aValues = Array.from({ length: 8 }, () => a());
		const bValues = Array.from({ length: 8 }, () => b());

		assert.deepEqual(aValues, bValues);
	});

	it('produces different sequences for different seeds', () => {
		const a = createMulberry32(1);
		const b = createMulberry32(2);

		assert.notEqual(a(), b());
	});

	it('returns values in [0, 1)', () => {
		const rng = createMulberry32(7);

		for (let index = 0; index < 100; index += 1) {
			const value = rng();
			assert.ok(value >= 0 && value < 1, `value out of range: ${value}`);
		}
	});
});

describe('gate distribution with seeded rng', () => {
	it('approximates the threshold over many trials', () => {
		const rng = createMulberry32(42);
		const trials = 10000;
		let passes = 0;

		for (let index = 0; index < trials; index += 1) {
			if (shouldPass(30, rng)) {
				passes += 1;
			}
		}

		const ratio = passes / trials;
		assert.ok(Math.abs(ratio - 0.3) < 0.02, `expected ratio near 0.30, got ${ratio}`);
	});

	it('seeded gating is reproducible across runs', () => {
		const run = () => {
			const rng = createMulberry32(99);
			return Array.from({ length: 20 }, () => shouldPass(50, rng));
		};

		assert.deepEqual(run(), run());
	});
});
