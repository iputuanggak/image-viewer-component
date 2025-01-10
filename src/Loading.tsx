import styles from './styles.module.css';

export interface LoadingProps {
  style?: React.CSSProperties;
}

export default function Loading(props: LoadingProps) {

  return (
    <div className={styles["loading-wrap"]} style={props.style}>
      <div className={styles["circle-loading"]}>
      </div>
    </div>
  );
}
