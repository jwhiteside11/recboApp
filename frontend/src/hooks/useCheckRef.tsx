import React, { useCallback } from 'react';

const useCheckRef: () => ((ref: React.MutableRefObject<any>) => boolean) = () => {
  return useCallback((ref: React.MutableRefObject<any>) => {
    if (ref && ref.current) {
      return true
    }
    return false;
  }, [])
}
  
export default useCheckRef;