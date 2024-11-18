import { useCallback, useEffect, useRef, useState } from "react";

type TCallback<Arg = any> = (arg: Arg) => void;
type TState = TCallback | any;
type TUpdateStateCallback<State extends TState> = (
  newState: TCallback<State> | State,
  cb?: TCallback
) => void;

export const useStateWithCallback = <State extends TState>(
  initialState: State
): [State, TUpdateStateCallback<State>] => {
  const [state, setState] = useState<State>(initialState);
  const cbRef = useRef<TCallback | null>(null);

  const updateState: TUpdateStateCallback<State> = useCallback(
    (newState: TState, cb) => {
      if (cb) cbRef.current = cb;

      setState((prev: State) =>
        typeof newState === "function" ? newState(prev) : newState
      );
    },
    []
  );

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, updateState];
};
