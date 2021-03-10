/**
 * @file    组件 Graph
 * @author  释心
 */

import * as React from 'react';
import * as uuid from 'uuid';
// eslint-disable-next-line no-duplicate-imports
import { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { useFetch } from '../hooks/useFetch';
import request from '../utils/request';
import { divide } from 'lodash';
import GraphX6 from './GraphX6';

const NodesStore = {};
// function findTreeNode(nodeTree, uid) {
//   let findNode = null;
//   for (let idx = 0; idx < nodeTree.length; idx++) {
//     const node = nodeTree[idx];
//     if (node.uid === uid) {
//       findNode = node;
//       break;
//     } else if (node.children && node.children.length) {
//       findNode = findTreeNode(node.children, uid);
//     }
//   }
//   return findNode;
// }
function mergeTree(_nodeTree, uid, res) {
  let nodeTree = _nodeTree;
  let parentNode = null;
  const nodeList = _.get(res, 'data.nodes', []);
  if (_.isEmpty(nodeTree)) {
    parentNode = _.find(nodeList, ['id', uid]);
    parentNode.uid = uuid.v4();
    nodeTree = parentNode;
  } else {
    parentNode = NodesStore[uid];
    // findTreeNode([nodeTree], uid);
  }
  parentNode.children = nodeList
    .filter(node => node.id !== parentNode.id)
    .map(node => {
      const curUid = uuid.v4();
      node.uid = curUid;
      NodesStore[curUid] = node;
      return node;
    });
  parentNode.children = parentNode.children.concat({
    id: `search_${uuid.v4()}`,
    type: 'searchTool',
    pagination: {
      page: 0,
      size: 10,
      total: parentNode.children.length,
    },
  });
  return { ...nodeTree };
}
function useFetchNodeTree(url, id) {
  const [uid, setExpandUid] = useState(id);
  const [nodeTree, setNodeTree] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request(url, { data: { id } });
        setNodeTree(mergeTree(nodeTree, uid, res));
      } catch (e) {
        // 请求错误
      }
    };
    fetchData();
  }, [uid]);
  console.log('uid', uid);

  return {
    nodeTree,
    setExpandUid: node => {
      setExpandUid(x => node.uid);
    },
  };
}
function onNodeClick(node) {
  // 弹窗
}
export default props => {
  const { graphConfig, nodeConfig, indexConfig, originId } = props;
  const indexList = useFetch({ url: indexConfig.url });
  const { nodeTree, setExpandUid } = useFetchNodeTree(graphConfig.url, originId);
  return (
    <GraphX6
      indexList={indexList.data}
      nodeTree={nodeTree}
      onExpand={node => setExpandUid(node)}
      onNodeClick={onNodeClick}
    />
  );
};
