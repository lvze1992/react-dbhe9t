const initState = {
  counter: 5,
  nodeList: {
    data: [],
    isLoading: true,
    message: '',
    code: 0,
    hasError: false,
  },
};

const demoReducer = (state = initState, action) => {
  switch (action.type) {
    case 'INCREMENT_COUNT':
      return {
        ...state,
        counter: state.counter + 1,
      };
    case 'GET_NODE_LIST':
      return {
        ...state,
        nodeList: action.payload,
      };
    default:
      return state;
  }
};

export default demoReducer;
