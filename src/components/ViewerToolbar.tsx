import Icon, { ActionType } from "./Icon";
import { ToolbarConfig } from "./ViewerProps";
import styles from "./styles.module.css";

export interface ViewerToolbarProps {
  prefixCls: string;
  onAction: (config: ToolbarConfig) => void;
  zoomable: boolean;
  rotatable: boolean;
  scalable: boolean;
  changeable: boolean;
  downloadable: boolean;
  toolbars: ToolbarConfig[];
}

export const defaultToolbars: ToolbarConfig[] = [
  {
    key: "zoomIn",
    actionType: ActionType.zoomIn,
  },
  {
    key: "zoomOut",
    actionType: ActionType.zoomOut,
  },
  {
    key: "reset",
    actionType: ActionType.reset,
  },
  {
    key: "prev",
    actionType: ActionType.prev,
  },
  {
    key: "next",
    actionType: ActionType.next,
  },
  {
    key: "rotateLeft",
    actionType: ActionType.rotateLeft,
  },
  {
    key: "rotateRight",
    actionType: ActionType.rotateRight,
  },
  {
    key: "scaleX",
    actionType: ActionType.scaleX,
  },
  {
    key: "scaleY",
    actionType: ActionType.scaleY,
  },
  {
    key: "download",
    actionType: ActionType.download,
  },
];

function deleteToolbarFromKey(toolbars: ToolbarConfig[], keys: string[]) {
  const targetToolbar = toolbars.filter((item) => keys.indexOf(item.key) < 0);

  return targetToolbar;
}

export default function ViewerToolbar(props: ViewerToolbarProps) {
  function handleAction(config: ToolbarConfig) {
    props.onAction(config);
  }

  function renderAction(config: ToolbarConfig) {
    let content;
    // default toolbar
    if (config.actionType !== undefined && config.actionType in ActionType) {
      content = <Icon type={config.actionType} />;
    }
    // extra toolbar
    if (config.render) {
      content = config.render;
    }

    return (
      <li
        key={config.key}
        className={`${styles[`${props.prefixCls}-btn`]}`}
        onClick={() => {
          handleAction(config);
        }}
        data-key={config.key}
      >
        {content}
      </li>
    );
  }

  let toolbars = props.toolbars;
  if (!props.zoomable) {
    toolbars = deleteToolbarFromKey(toolbars, ["zoomIn", "zoomOut"]);
  }
  if (!props.changeable) {
    toolbars = deleteToolbarFromKey(toolbars, ["prev", "next"]);
  }
  if (!props.rotatable) {
    toolbars = deleteToolbarFromKey(toolbars, ["rotateLeft", "rotateRight"]);
  }
  if (!props.scalable) {
    toolbars = deleteToolbarFromKey(toolbars, ["scaleX", "scaleY"]);
  }
  if (!props.downloadable) {
    toolbars = deleteToolbarFromKey(toolbars, ["download"]);
  }
  return (
    <ul className={`${styles[`${props.prefixCls}-toolbar`]}`}>
      {toolbars.map((item) => {
        return renderAction(item);
      })}
    </ul>
  );
}
