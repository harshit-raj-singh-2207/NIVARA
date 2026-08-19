import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * Global navigation helper.
 * This allows us to trigger navigation from outside of React components,
 * such as inside an Axios Interceptor when a token expires.
 */
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.warn(`[NavigationRef] Ignored navigate('${name}') because navigator is not ready yet.`);
  }
}
