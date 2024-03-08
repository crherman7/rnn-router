import type {Options, OptionsBottomTab} from 'react-native-navigation';

/**
 * Creates a screen component with specified options.
 * @param {React.ComponentType<any>} Component - The component to be used as the screen.
 * @param {Options} options - The options for configuring the screen.
 */
export function makeScreen(
  Component: React.ComponentType<any>,
  options: Options | ((props: any) => Options) = {},
) {
  // @ts-ignore settings static options for react-native-navigation
  Component.options = options;

  // @ts-ignore
  Component.$$RNNRType = 'Screen';

  return Component;
}

/**
 * Creates a tab component with specified options.
 * @param {React.ComponentType<any>} Component - The component to be used as the tab.
 * @param {Options} options - The options for configuring the tab.
 * @param {OptionsBottomTab} optionsBottomTab - The options specific to bottom tab configuration.
 */
export function makeTab(
  Component: React.ComponentType<any>,
  options:
    | Omit<Options, 'bottomTab'>
    | ((props: any) => Omit<Options, 'bottomTab'>),
  optionsBottomTab: OptionsBottomTab,
  tabIndex: number,
) {
  // @ts-ignore settings static options for react-native-navigation
  Component.options = options;

  // @ts-ignore set react-native-navigation-router type
  Component.$$RNNRType = 'Tab';

  // @ts-ignore set react-native-navigation-router type options
  Component.$$RNNRTypeOptions = optionsBottomTab;

  // @ts-ignore set react-native-navigation-router tab index
  Component.$$RNNRTypeIndex = tabIndex;

  return Component;
}

/**
 * Creates a modal component with specified options.
 * @param {React.ComponentType<any>} Component - The component to be used as the modal.
 * @param {Options} options - The options for configuring the modal.
 */
export function makeModal(
  Component: React.ComponentType<any>,
  options: Options | ((props: any) => Options),
) {
  // @ts-ignore settings static options for react-native-navigation
  Component.options = options;

  // @ts-ignore set react-native-navigation-router type
  Component.$$RNNRType = 'Modal';

  // Implementation logic to create a modal component with provided options
}
