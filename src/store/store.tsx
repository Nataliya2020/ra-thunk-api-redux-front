import {createStore, combineReducers} from 'redux';
import serviceListReducer from './serviceListReducer';
import serviceUpdateReducer from "./serviceUpdateReducer";

const rootReducer = combineReducers(
  {
    items: serviceListReducer,
    itemUpdate: serviceUpdateReducer
  }
)

const store = createStore(rootReducer);

export default store;
export type RootState = ReturnType<typeof rootReducer>;
