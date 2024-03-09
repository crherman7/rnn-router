/**
 * Custom hook to access browser navigator object.
 * @returns {Object} The navigator object.
 */
export {useNavigator} from './lib';

/**
 * Custom hook to generate a unique component ID.
 * @returns {string} Unique component ID.
 */
export {useComponentId} from './lib';

/**
 * Custom hook to access the current URL.
 * @returns {URLContext} The current URL.
 */
export {useURL} from './lib';

/**
 * Function to create a modal component.
 * @param {React.Component<any>} Component - Modal to register.
 * @param {object} options - Options for the modal component.
 * @returns {Component} Modal component.
 */
export {makeModal} from './lib';

/**
 * Function to create a screen component.
 * @param {React.Component<any>} Component - Component to register.
 * @param {object} options - Options for the screen component.
 * @returns {Component} Screen component.
 */
export {makeScreen} from './lib';

/**
 * Function to create a tab component.
 * @param {React.Component<any>} Component - Component to register.
 * @param {object} options - Options for the tab component.
 * @returns {Component} Tab component.
 */
export {makeTab} from './lib';
