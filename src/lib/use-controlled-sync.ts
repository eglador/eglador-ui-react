import * as React from "react";

/**
 * Keeps the internal (uncontrolled) state of a component in sync with its
 * controlled prop.
 *
 * Components here derive `isControlled` from `prop !== undefined` on every
 * render, so a consumer holding the value in state (`value={state}`) flips the
 * component between controlled and uncontrolled whenever that state becomes
 * `undefined` — e.g. after clearing a selection. If the internal state is only
 * written while uncontrolled it goes stale, and the fallback render after such
 * a flip shows an old value. Mirroring every controlled update into the
 * internal state keeps the fallback correct.
 *
 * `apply` is invoked with the controlled value whenever it changes; the latest
 * closure is always used, so it does not need to be memoised.
 */
export function useControlledSync<T>(
  controlled: T | undefined,
  apply: (value: T) => void,
) {
  const applyRef = React.useRef(apply);
  applyRef.current = apply;

  React.useEffect(() => {
    if (controlled === undefined) return;
    applyRef.current(controlled);
  }, [controlled]);
}

/** Shallow, order-sensitive comparison used to avoid needless re-renders. */
export function sameList<T>(a: readonly T[], b: readonly T[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/** Set comparison used to avoid needless re-renders. */
export function sameSet<T>(a: ReadonlySet<T>, b: readonly T[]) {
  return a.size === b.length && b.every((v) => a.has(v));
}

/** Date comparison used to avoid needless re-renders. */
export function sameDate(a: Date | undefined, b: Date | undefined) {
  return a?.getTime() === b?.getTime();
}

/** Date list comparison used to avoid needless re-renders. */
export function sameDateList(a: readonly Date[], b: readonly Date[]) {
  return a.length === b.length && a.every((d, i) => sameDate(d, b[i]));
}
