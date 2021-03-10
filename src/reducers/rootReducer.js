import { combineReducers } from 'redux';
import demoReducer from './demoReducer';

// Combine all the sub reducers
const rootReducer = combineReducers({
  demo: demoReducer,
});

export default rootReducer;
