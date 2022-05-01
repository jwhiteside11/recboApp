import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectView, setViewElemHeight } from '../redux/layout/layoutSlice';

const useSetViewElemHeight: (view: 'details' | 'instructions' | 'ingredients', ref: React.MutableRefObject<HTMLDivElement | null>) => void = (view, ref) => {
  const dispatch = useAppDispatch()
  const activeView = useAppSelector(selectView)

  useEffect(() => {
    if (view === activeView) {
      if (ref?.current) {
        dispatch(setViewElemHeight(ref.current.scrollHeight))
      }
    }
  }, [activeView, view, ref, dispatch])
}

export default useSetViewElemHeight;