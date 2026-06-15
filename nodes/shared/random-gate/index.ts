export type RandomNumberGenerator = () => number;

export const createMulberry32 = (seed: number): RandomNumberGenerator => {
	let state = (seed | 0) || 1;

	return () => {
		state = (state + 0x6d2b79f5) | 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

export const hashSeed = (input: string): number => {
	let hash = 2166136261;

	for (let index = 0; index < input.length; index += 1) {
		hash ^= input.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}

	return hash >>> 0;
};

export const resolveSeed = (raw: unknown): number | undefined => {
	if (raw === undefined || raw === null) {
		return undefined;
	}

	if (typeof raw === 'number' && Number.isFinite(raw)) {
		return raw | 0;
	}

	const text = String(raw).trim();

	if (text.length === 0) {
		return undefined;
	}

	const asNumber = Number(text);

	if (Number.isFinite(asNumber)) {
		return asNumber | 0;
	}

	return hashSeed(text);
};

export const normalizeThreshold = (raw: unknown): number => {
	const value = Number(raw);

	if (!Number.isFinite(value)) {
		return 0;
	}

	if (value <= 0) {
		return 0;
	}

	if (value >= 100) {
		return 100;
	}

	return value;
};

export const shouldPass = (
	thresholdPercent: number,
	rng: RandomNumberGenerator,
): boolean => {
	if (thresholdPercent <= 0) {
		return false;
	}

	if (thresholdPercent >= 100) {
		return true;
	}

	return rng() * 100 < thresholdPercent;
};
