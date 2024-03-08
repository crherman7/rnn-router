import {createContext, createElement, useContext, useState} from 'react';

export type URLContext = {
  /**
   * A key-value pair that represents a parameter in a path, with the key being
   * the parameter name and the value being its corresponding value
   */
  pathParams: Object;

  /**
   * Parsed search params in the form of an object
   */
  queryParams: Object;

  /**
   * The URL passed from the router.
   */
  url: string;
};

/**
 * Creates a state context with the given default initial value.
 * @template T
 * @param {T} defaultInitialValue - The default initial value for the state context.
 * @returns {[function(): [T, React.Dispatch<React.SetStateAction<T>>], React.FC<{children?: React.ReactNode; initialValue?: T;}>, React.Context<[T, React.Dispatch<React.SetStateAction<T>>] | undefined>]} An array containing the state hook, state provider component, and the context object.
 */
export const createStateContext = <T>(defaultInitialValue: T) => {
  // Create a context object for state management
  const context = createContext<
    [T, React.Dispatch<React.SetStateAction<T>>] | undefined
  >(undefined);

  // Factory function to create provider components
  const providerFactory = (props: any, children: React.ReactNode) =>
    createElement(context.Provider, props, children);

  // StateProvider component to provide state to components
  const StateProvider = ({
    children,
    initialValue,
  }: {
    children?: React.ReactNode;
    initialValue?: T;
  }) => {
    // Initialize state using useState hook with the provided initial value or the default initial value
    const state = useState<T>(
      initialValue !== undefined ? initialValue : defaultInitialValue,
    );
    // Return the provider component with state value as value prop
    return providerFactory({value: state}, children);
  };

  // Hook to access state from context
  const useStateContext = () => {
    const state = useContext(context);
    if (state == null) {
      throw new Error('useStateContext must be used inside a StateProvider.');
    }
    return state;
  };

  // Return an array containing the useStateContext hook, StateProvider component, and the context object
  return [useStateContext, StateProvider, context] as const;
};

/**
 * Hook to access the component ID state from the context.
 * @returns {[string, React.Dispatch<React.SetStateAction<string>>]} An array containing the component ID state and its setter function.
 */
export const [useComponentId, ComponentIdProvider] = createStateContext('');

/**
 * A hook and provider for managing URL context.
 * @type {[function(): URLContext | undefined, React.FC<{ children?: React.ReactNode; value?: URLContext | undefined; }>]}
 */
export const [useURL, URLProvider] = createStateContext<URLContext | undefined>(
  undefined,
);
