import { useState } from "react";

export function useLocalState<T>({ name, initialValue }: {
  name: string,
  initialValue?: T
}) : [T, (val: T) => void] {
  const [state, setState] = useState<T>(() => {
    if (localStorage.getItem(name) === null) {
      localStorage.setItem(name, JSON.stringify(initialValue));
      return initialValue!;
    }
    return JSON.parse(localStorage.getItem(name)!) as T;
  });
  const setInLocalStore = (val: T) => {
    localStorage.setItem(name, JSON.stringify(val));
    setState(val);
  }
  return [state, setInLocalStore];
}