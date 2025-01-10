import { CSSProperties, useEffect, useRef, useState } from 'react';
import Loading from './Loading';
import styles from './styles.module.css'; // Import CSS module

export interface ViewerCanvasProps {
  prefixCls: string;
  imgSrc: string;
  visible: boolean;
  width: number;
  height: number;
  top: number;
  left: number;
  rotate: number;
  onChangeImgState: (width: number, height: number, top: number, left: number) => void;
  onResize: () => void;
  zIndex: number;
  scaleX: number;
  scaleY: number;
  loading: boolean;
  drag: boolean;
  onCanvasMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface ViewerCanvasState {
  isMouseDown?: boolean;
  mouseX?: number;
  mouseY?: number;
}

export default function ViewerCanvas(props: ViewerCanvasProps) {
  const isMouseDown = useRef(false);
  const isPinch = useRef(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  

  const prePosition = useRef({
    x: 0,
    y: 0,
  });
  const [ position, setPosition ] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    return () => {
      bindEvent(true);
      bindWindowResizeEvent(true);
    };
  }, []);

  useEffect(() => {
    bindWindowResizeEvent();

    return () => {
      bindWindowResizeEvent(true);
    };
  });

  useEffect(() => {
    if (props.visible && props.drag) {
      bindEvent();
    }
    if (!props.visible && props.drag) {
      handleMouseUp();
    }
    return () => {
      bindEvent(true);
    };
  }, [props.drag, props.visible]);

  useEffect(() => {
    const diffX = position.x - prePosition.current.x;
    const diffY = position.y - prePosition.current.y;
    prePosition.current = {
      x: position.x,
      y: position.y,
    };
    props.onChangeImgState(props.width, props.height, props.top + diffY, props.left + diffX);
  }, [position]);

  function handleResize() {
    props.onResize();
  }

  function handleCanvasMouseDown(e: any) {
    props.onCanvasMouseDown(e);
    handleMouseDown(e);
  }

  function handleMouseDown(e: any) {
    if (e.button !== 0) {
      return;
    }
    if (!props.visible || !props.drag) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    isMouseDown.current = true;
    prePosition.current = {
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY,
    };
  }


  const handleMouseMove = (e: any) => {
    if (isMouseDown.current) {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  function handleMouseUp() {
    isMouseDown.current = false;
  }

  const handleTouchStart = (e: any) => {
    if (!props.visible || !props.drag) {
      return;
    }
    e.preventDefault();
    if (e.touches.length === 1) {
      prePosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchMove = (e: any) => {
    if (!props.visible || !props.drag) {
      return;
    }
    if (e.touches.length === 1 && !isPinch.current) {
      setPosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    } else if (e.touches.length > 1 && !isPinch.current) {
      isPinch.current = true;
    }
  };

  const handleTouchEnd = (e: any) => {
    if (e.touches.length === 0) {
      isPinch.current = false;
    }
  }


  function bindWindowResizeEvent(remove?: boolean) {
    const funcName: 'addEventListener' | 'removeEventListener' = remove ? 'removeEventListener' : 'addEventListener';
    (window as Window & typeof globalThis)[funcName]('resize', handleResize, false);
  }
  

  function bindEvent(remove?: boolean) {
    const funcName: 'addEventListener' | 'removeEventListener' = remove ? 'removeEventListener' : 'addEventListener';
    
    const imgElement = imgRef.current; // Access the <img /> element via the ref

    if (imgElement) {
      imgElement[funcName]('click', handleMouseUp, false);
      imgElement[funcName]('mousemove', handleMouseMove, false);
      imgElement[funcName]('touchstart', handleTouchStart, { passive: false });
      imgElement[funcName]('touchmove', handleTouchMove, false);
      imgElement[funcName]('touchend', handleTouchEnd, false);
      imgElement[funcName]('touchcancel', handleTouchEnd, false);
    }
  }
  

  const imgStyle: CSSProperties = {
    width: `${props.width}px`,
    height: `${props.height}px`,
    transform: `
translateX(${props.left !== null ? props.left + 'px' : 'aoto'}) translateY(${props.top}px)
    rotate(${props.rotate}deg) scaleX(${props.scaleX}) scaleY(${props.scaleY})`,
  };

  const imgClass = `${styles[`${props.prefixCls}-image`]}`
  + (props.drag ? ` ${styles["drag"]}` : '')
  + (!isMouseDown.current ? ` ${styles[`${props.prefixCls}-image-transition`]}` : '');

  const style = {
    zIndex: props.zIndex,
  };

  let imgNode;
  if (props.imgSrc !== '') {
    imgNode = <img
    className={imgClass}
    src={props.imgSrc}
    style={imgStyle}
    onMouseDown={handleMouseDown}
    />;
  }
  if (props.loading) {
    imgNode = (
      <div
        style={{
          display: 'flex',
          height: `${window.innerHeight - 84}px`,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loading/>
      </div>
    );
  }

  return (
    <div
    className={`${styles[`${props.prefixCls}-canvas`]}`}
    onMouseDown={handleCanvasMouseDown}
    style={style}
    ref={imgRef}
    >
      {imgNode}
    </div>
  );
}
