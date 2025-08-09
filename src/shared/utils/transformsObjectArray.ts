type BooleanMap = Record<string, boolean>;

type BooleanArray = string[];

export function objectToArray(obj: BooleanMap): BooleanArray {
	return Object.entries(obj)
		.filter(([_, value]) => value)
		.map(([key]) => key);
}

export function arrayToObject(keys: BooleanArray): BooleanMap {
	return Object.fromEntries(keys.map((key) => [key, true]));
}