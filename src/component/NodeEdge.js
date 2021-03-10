import { Node, Shape } from '@antv/x6';
import * as React from 'react';
// 定义节点
class ReactSearchNode extends React.Component {
  shouldComponentUpdate() {
    const node = this.props.node;
    if (node) {
      if (node.hasChanged('data')) {
        return true;
      }
    }

    return false;
  }

  render() {
    return (
      <div
        onClick={() => {
          //   console.log('4444', this.props);
        }}
      >
        {this.props.text} React
      </div>
    );
  }
}
class TreeNode extends Node {
  collapsed = false;

  postprocess() {
    // 节点初始化后会被调用
    this.toggleCollapse(true);
  }

  isCollapsed() {
    return this.collapsed;
  }

  toggleButtonVisibility(visible) {
    this.attr('buttonGroup', {
      display: visible ? 'block' : 'none',
    });
  }

  toggleCollapse(collapsed) {
    const target = collapsed == null ? !this.collapsed : collapsed;
    if (!target) {
      this.attr('buttonSign', {
        d: 'M 1 5 9 5 M 5 1 5 9',
        strokeWidth: 1.6,
      });
    } else {
      this.attr('buttonSign', {
        d: 'M 2 5 8 5',
        strokeWidth: 1.8,
      });
    }
    this.collapsed = target;
  }
}
TreeNode.config({
  zIndex: 2,
  markup: [
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            'pointer-events': 'visiblePainted',
          },
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
          attrs: {
            fill: 'none',
            'pointer-events': 'none',
          },
        },
      ],
    },
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      fill: '#fff',
      stroke: '#a0a0a0',
      event: 'node:click',
    },
    label: {
      textWrap: {
        ellipsis: true,
        width: -10,
      },
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 12,
    },
    buttonGroup: {
      refX: '100%',
      refY: '50%',
    },
    button: {
      fill: '#4C65DD',
      stroke: 'none',
      x: -10,
      y: -10,
      height: 20,
      width: 30,
      rx: 10,
      ry: 10,
      cursor: 'pointer',
      event: 'node:collapse',
    },
    buttonSign: {
      refX: 5,
      refY: -5,
      stroke: '#FFFFFF',
      strokeWidth: 1.6,
    },
  },
});

// 定义边
class TreeEdge extends Shape.Edge {
  isHidden() {
    const node = this.getTargetNode();
    return !node || !node.isVisible();
  }
}

TreeEdge.config({
  zIndex: 1,
  attrs: {
    line: {
      stroke: '#a0a0a0',
      strokeWidth: 1,
      targetMarker: {
        args: {
          offset: -75,
          open: true,
          height: 9,
          width: 0,
        },
        name: 'block',
      },
    },
  },
});
const registerTreeComponents = (NodeInstance, EdgeInstance) => {
  // 注册
  NodeInstance.registry.register('tree-node', TreeNode, true);
  EdgeInstance.registry.register('tree-edge', TreeEdge, true);
};
export { TreeNode, ReactSearchNode, TreeEdge, registerTreeComponents };
