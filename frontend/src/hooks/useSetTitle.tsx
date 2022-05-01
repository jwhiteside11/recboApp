import { useEffect } from 'react';

const useSetTitle: (title: string) => void = (title) => {
  useEffect(() => {
    document.title = title
    console.log('title set')
  }, [title])
}

export default useSetTitle;