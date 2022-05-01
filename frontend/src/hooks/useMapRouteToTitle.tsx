import React, { useCallback } from 'react';
import { mapRouteToTitle } from '../globals';

const useMapRouteToTitle: () => ((route: string, username: string | null) => string) = () => {
  return useCallback((route, username) => username === null ? mapRouteToTitle(route): mapRouteToTitle(route, username), [])
}
  
export default useMapRouteToTitle;