import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducer'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
//import {
    //sayHiOnDispatch,
    //includeMeaningOfLife
//} from './exampleAddons/enhancers'
//import { 
    //print1, 
    //print2, 
    //print3, 
    //loggerMiddleware,
    //delayedMessageMiddleware,
    //delayAll,
    //alwaysReturnHi
//} from './exampleAddons/middleware'

const middlewareEnhancer = composeWithDevTools(
    applyMiddleware(thunkMiddleware)
)
const store = createStore(rootReducer, middlewareEnhancer)

//const composedEnhancer = compose(sayHiOnDispatch, includeMeaningOfLife)
//const store = createStore(rootReducer, composedEnhancer)

export default store
