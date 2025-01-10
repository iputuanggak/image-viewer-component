
import { useEffect, useRef, useState } from 'react';
import ViewerCore from './ViewerCore';
import ViewerProps from './ViewerProps';
import { createPortal } from 'react-dom';

export default function Viewer (props: ViewerProps)  {
  const defaultContainer = useRef(typeof document !== 'undefined' ? document.createElement('div') : null);
  const [ container, setContainer ] = useState(props.container);
  const [ init, setInit ] = useState(false);

  useEffect(() => {
    document.body.appendChild(defaultContainer.current!);
    // return ()=>{document.body.removeChild(defaultContainer.current!);} //
  }, []);

  useEffect(() => {
    if (props.visible && !init) {
      setInit(true);
    }
  }, [props.visible, init]);

  useEffect(() => {
    if (props.container) {
      setContainer(props.container);
    } else {
      setContainer(defaultContainer.current!);
    }
  }, [props.container]);

  if (!init) {
    return null;
  }
  return createPortal((
    <ViewerCore
      {...props}
    />
  ), container!);
};
