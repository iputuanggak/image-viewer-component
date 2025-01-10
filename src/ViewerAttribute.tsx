import styles from "./styles.module.css"

type ViewerAttributeProps = {
  attribute: boolean;
  prefixCls: string;
  noImgDimension: boolean;
  showTotal: boolean;
  width: number;
  height: number;
  activeIndex: number;
  totalName: string;
  count: number;
};

export default function ViewerAttribute(props: ViewerAttributeProps) {
  return props.attribute ? (
    <div className={`${styles[`${props.prefixCls}-attribute`]}`}>
      {props.noImgDimension || (
        <span>{`(${props.width} x ${props.height}) `}</span>
      )}
      {props.showTotal && (
        <span>{`${props.activeIndex + 1} ${props.totalName} ${props.count}`}</span>
      )}
    </div>
  ) : null;
}
