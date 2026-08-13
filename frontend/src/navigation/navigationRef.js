/**
 * Navigation Reference Utilities for NIVARA.
 * Enables top-level navigation actions outside of React components (e.g. API interceptors, stores, notification handlers).
 */

import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * Navigates to a target route name with optional params.
 * @param {string} name - Route name
 * @param {object} [params] - Route parameters
 */
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

/**
 * Resets navigation stack and navigates to a root target route.
 * @param {string} name - Target route name
 * @param {object} [params] - Route parameters
 */
export function resetAndNavigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name, params }],
      })
    );
  }
}

/**
 * Resets navigation state to a root route.
 * @param {string} routeName - Name of root target route
 */
export function resetToRoute(routeName) {
  resetAndNavigate(routeName);
}

/**
 * Returns to previous screen if stack can go back.
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export default {
  navigationRef,
  navigate,
  resetAndNavigate,
  resetToRoute,
  goBack,
};
