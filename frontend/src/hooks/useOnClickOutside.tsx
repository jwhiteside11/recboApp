import { MutableRefObject, useEffect } from 'react';

const useOnClickOutside = (ref: MutableRefObject<HTMLElement | null>, handler: () => any, toggleOn: boolean, whitelist: Array<HTMLElement | null> = []) => {

  useEffect(() => {
    const listener = (event: { target: any; }) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // Whitelist for elements that otherwise handle the actions, and we don't want the handler to run
      for (let elem of whitelist) {
        if (elem && elem.contains(event.target)) return;
      }
      console.log("RUNNING")
      document.removeEventListener("mousedown", listener)
      handler();
    }

    if (toggleOn) {
      document.addEventListener("mousedown", listener);
    }
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler, toggleOn, whitelist])
}

export default useOnClickOutside;