import React, { Component } from 'react';
import Graph from './component/Graph';
export default class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <Graph
        originId={12}
        graphConfig={{ url: 'https://rap2api.alibaba-inc.com/app/mock/5979/getNodes' }}
        nodeConfig={{ url: 'https://rap2api.alibaba-inc.com/app/mock/5979/getNodeInfo' }}
        indexConfig={{ url: 'https://rap2api.alibaba-inc.com/app/mock/5979/getNodeIndex' }}
      />
    );
  }
}
