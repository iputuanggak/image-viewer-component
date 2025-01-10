
import { ImageDecorator } from './ViewerProps';
import styles from './styles.module.css';

export interface ViewerNavProps {
  prefixCls: string;
  images: ImageDecorator[];
  activeIndex: number;
  onChangeImg: (index: number) => void;
}

export default function ViewerNav(props: ViewerNavProps) {
  const { activeIndex = 0 } = props;

  function handleChangeImg(newIndex:any) {
    if (activeIndex === newIndex) {
      return;
    }
    props.onChangeImg(newIndex);
  }

  const marginLeft = `calc(50% - ${activeIndex + 1} * 31px)`;
  const listStyle = {
    marginLeft: marginLeft,
  };

  return (
    <div className={`${styles[`${props.prefixCls}-navbar`]}`}>
      <ul className={`${styles[`${props.prefixCls}-list`]} ${styles[`${props.prefixCls}-list-transition`]}`} style={listStyle}>
        {props.images.map((item, index) =>
          <li
          key={index}
          className={index === activeIndex ? `${styles['active']}` : ''}
          onClick={() => { handleChangeImg(index); }}
          >
            <img src={item.src} alt={item.alt} />
          </li>,
          )
        }
      </ul>
    </div>
  );
}
