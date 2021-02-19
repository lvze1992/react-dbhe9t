import Hierarchy from '@antv/hierarchy';
import '@antv/x6-react-shape';
import { MyComponent } from './treeComp.js';
async function getData() {
  let data = await import('./data.json');
  const result = Hierarchy.mindmap(data, {
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
  const drawData = { nodes: [], edges: [] };
  const traverse = (data) => {
    if (data) {
      if (data.data.type === 'tool') {
        drawData.nodes.push({
          id: `${data.id}`,
          x: data.x,
          y: data.y,
          width: 120,
          height: 26,
          shape: 'react-shape',
          component: <MyComponent text="Hello" />,
        });
      } else {
        const isLeaf = !data.children || data.children.length === 0;
        drawData.nodes.push({
          id: `${data.id}`,
          x: data.x,
          y: data.y,
          width: 120,
          height: 26,
          leaf: isLeaf,
          shape: 'tree-node',
          // shape: 'react-shape',
          // component: <MyComponent text="Hello" />,
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
    if (data.children) {
      data.children.forEach((item) => {
        if (item.data.type === 'tool') {
          drawData.edges.push({
            source: `${data.id}`,
            target: `${item.id}`,
            attrs: {
              line: {
                stroke: 'transparent',
              },
            },
          });
        } else {
          drawData.edges.push({
            source: `${data.id}`,
            target: `${item.id}`,
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
export { getData };
