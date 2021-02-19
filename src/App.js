import React, { Component } from 'react';
import { Graph, Node, Edge, Shape } from '@antv/x6';
import { TreeNode, TreeEdge, registerTreeComponents } from './treeComp.js';
import { getData } from './treeData.js';
export default class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    this.drawX6();
  }
  showModal = () => {
    alert('click');
  };
  drawX6 = async () => {
    registerTreeComponents(Node, Edge);
    // 初始化画布
    const graph = new Graph({
      container: document.getElementById('x6'),
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
        anchor: 'orth',
        connector: 'rounded',
        connectionPoint: 'boundary',
        router: {
          name: 'er',
          args: {
            offset: 20,
            direction: 'H',
          },
        },
      },
    });

    graph.on('node:collapse', ({ node }) => {
      node.toggleCollapse();
      const collapsed = node.isCollapsed && node.isCollapsed();
      const run = (pre) => {
        const succ = graph.getSuccessors(pre, { distance: 1 });
        if (succ) {
          succ.forEach((node) => {
            node.toggleVisible(!collapsed);
            if (!(node.isCollapsed && node.isCollapsed())) {
              run(node);
            }
          });
        }
      };
      run(node);
    });
    const drawData = await getData();
    console.log('drawData', drawData);
    drawData.nodes.forEach((metadata) => {
      if (metadata.shape === 'react-shape') {
        graph.addNode(metadata);
      } else {
        const node = new TreeNode(metadata);
        if (metadata.leaf) {
          node.toggleButtonVisibility(metadata.leaf === false);
        }
        graph.addNode(node);
      }
    });
    drawData.edges.forEach((i) => graph.addEdge(i));
    graph.on('node:click', (args) => {
      // code here
      console.log('node:click', args);
      this.showModal();
    });
    const start = new Date().getTime();
    // const nodes = drawData.nodes.map(({ leaf, ...metadata }) => {
    //   if (metadata.shape === 'react-shape') {
    //     return metadata;
    //   }
    //   const node = new TreeNode(metadata);
    //   if (leaf) {
    //     node.toggleButtonVisibility(leaf === false);
    //   }
    //   return node;
    // });
    // const edges = drawData.edges.map(
    //   (edge) =>
    //     new TreeEdge({
    //       source: edge.source,
    //       target: edge.target,
    //     }),
    // );

    // graph.resetCells([...nodes, ...edges]);

    graph.unfreeze({
      progress({ done }) {
        if (done) {
          const time = new Date().getTime() - start;
          console.log(time);
          graph.unfreeze({
            batchSize: 50,
          });
          graph.zoomToFit({ padding: 24 });
        }
      },
    });
  };
  render() {
    return (
      <div
        id="x6"
        style={{
          height: 800,
          width: 1200,
          border: '1px solid #000',
        }}
      ></div>
    );
  }
}
