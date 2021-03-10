/**
 * @file    组件 GraphX6
 * @author  释心
 */

import { Edge, Graph, Node } from '@antv/x6';
import * as _ from 'lodash';
import * as React from 'react';
// eslint-disable-next-line no-duplicate-imports
import { useEffect } from 'react';
import { calcLayout } from './Layout';
import { registerTreeComponents, TreeNode } from './NodeEdge';

let graph = null;
function initGraph() {
  const graph = new Graph({
    container: document.getElementById('oneDFD-graph-x6'),
    grid: 1,
    async: true,
    frozen: true,
    scroller: true,
    interacting: false,
    sorting: 'approx',
    background: {
      color: '#f5f5f5',
    },
    connecting: {
      anchor: 'center',
      connector: 'rounded',
      connectionPoint: 'boundary',
      router: {
        name: 'er',
        args: {
          offset: 'center',
          direction: 'L',
        },
      },
    },
  });
  return graph;
}
function registerEvent(graph, { onExpand }) {
  graph.on('node:collapse', (args) => {
    const { node } = args;
    node.toggleCollapse();
    const collapsed = node.isCollapsed && node.isCollapsed();
    const run = (pre) => {
      const successors = graph.getSuccessors(pre, { distance: 1 });
      console.log('node:collapse', node, successors, collapsed);
      if (!_.isEmpty(successors)) {
        successors.forEach((nodeItem) => {
          nodeItem.toggleVisible(!collapsed);
          if (!(nodeItem.isCollapsed && nodeItem.isCollapsed())) {
            run(nodeItem);
          }
        });
      } else {
        const uid = _.get(node, 'store.data.info.uid');
        onExpand({ uid });
      }
    };
    run(node);
  });
  graph.on('node:click', (args) => {
    // code here
    console.log('node:click', args);
    // this.showModal();
  });
}
function paintGraph(graph, nodeLayoutTree) {
  nodeLayoutTree.nodes.forEach((item) => {
    if (item.shape === 'react-shape') {
      graph.addNode(item);
    } else {
      const node = new TreeNode(item);
      if (item.leaf) {
        node.toggleButtonVisibility(item.leaf === false);
      }
      node.toggleCollapse(!!item.collapsed);
      graph.addNode(node);
    }
  });
  nodeLayoutTree.edges.forEach((i) => graph.addEdge(i));
}
function unfreezeGraph(graph) {
  graph.unfreeze({
    progress({ done }) {
      if (done) {
        graph.unfreeze({
          // batchSize: 50,
        });
        // graph.zoomToFit({ padding: 24 });
      }
    },
  });
}
function drawGraphX6(nodeTree, { onExpand }) {
  console.log('nodeTree', nodeTree);
  if (!graph) {
    // 注册节点、边的定义实现
    registerTreeComponents(Node, Edge);
    // 初始化画布
    graph = initGraph();
    // 注册图的事件
    registerEvent(graph, { onExpand });
  }
  // 计算布局 {id,children:[]} => {nodes:[], edges:[]}
  const nodeLayoutTree = calcLayout(nodeTree);
  // 绘制节点和边
  paintGraph(graph, nodeLayoutTree);
  // 解冻 展现结果
  unfreezeGraph(graph);
}
export default (props) => {
  const { nodeTree, onExpand } = props;
  useEffect(() => {
    drawGraphX6(nodeTree, { onExpand });
  }, [nodeTree]);
  return (
    <div
      id="oneDFD-graph-x6"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '1000px',
        border: '1px solid #000',
      }}
    />
  );
};
