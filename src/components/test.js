import {store} from '../index';
import { addEmployee } from '../reducers';

const testStore = () => {
    console.log("testStore is called!")
    console.log(store.getState());
    store.dispatch(addEmployee({name:'sdfdsf'}));
}

export {
    testStore
}