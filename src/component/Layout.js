import Hierarchy from '@antv/hierarchy';
import '@antv/x6-react-shape';
import * as _ from 'lodash';
import * as React from 'react';
import { ReactSearchNode } from './NodeEdge';

function getPage(list, pagination) {
  if (!pagination) {
    return list;
  }
  const { page, size, total } = pagination;
  return list.slice(page * size, (page + 1) * size);
}
function cutTree(nodeTree) {
  const searchToolNode = _.find(nodeTree, item => {
    return item.type === 'searchTool';
  });
  const { pagination } = searchToolNode || {};
  const pageNodes = getPage(nodeTree, pagination);
  return pageNodes.map(item => {
    if (!_.isEmpty(item.children)) {
      item.children = cutTree(item.children);
    }
    return item;
  });
}
function calcLayout(nodeTree) {
  const drawData = { nodes: [], edges: [] };
  if (_.isEmpty(nodeTree)) {
    return drawData;
  }
  // 分页减枝
  const cloneNodeTree = _.cloneDeep(nodeTree);
  const [subNodeTree] = cutTree([cloneNodeTree]);
  // 计算布局
  // dendrogram H
  const result = Hierarchy.compactBox(subNodeTree, {
    direction: 'H',
    getHeight() {
      return 26;
    },
    getWidth() {
      return 120;
    },
    getHGap() {
      return 50;
    },
    getVGap() {
      return 5;
    },
    getSide: () => {
      return 'right';
    },
  });
  const traverse = data => {
    if (data) {
      if (data.data.type === 'searchTool') {
        drawData.nodes.push({
          id: `${data.data.uid}`,
          x: data.x,
          y: data.y,
          width: 120,
          height: 26,
          shape: 'react-shape',
          component: <ReactSearchNode text="Hello" />,
        });
      } else {
        const isLeaf = !data.children || data.children.length === 0;
        drawData.nodes.push({
          id: `${data.data.uid}`,
          x: data.x,
          y: data.y,
          width: 120,
          height: 26,
          leaf: false,
          shape: 'tree-node',
          info: data.data,
          collapsed: true,
          //   parentId: data.id, // 后续受控，显示与否
          // shape: 'react-shape',
          // component: <ReactSearchNode text="Hello" />,
          attrs: {
            label: {
              textWrap: {
                text: data.id,
              },
            },
          },
        });
      }
    }
    // 遍历子元素
    if (data.children) {
      data.children.forEach(item => {
        if (item.data.type === 'searchTool') {
          drawData.edges.push({
            source: `${data.data.uid}`,
            target: `${item.data.uid}`,
            attrs: {
              line: {
                stroke: 'transparent',
              },
            },
          });
        } else {
          drawData.edges.push({
            source: `${data.data.uid}`,
            target: `${item.data.uid}`,
            shape: 'tree-edge',
          });
        }
        traverse(item);
      });
    }
  };
  traverse(result);
  return drawData;
}
export { calcLayout };
