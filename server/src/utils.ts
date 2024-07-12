export function difference<T>(first: Set<T>, second: Set<T>): Set<T> {
    const result = new Set<T>();

    for (const item of first.values()) {
        if (!second.has(item)) {
            result.add(item);
        }
    }

    return result;
}