import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk';

//import * as ScreenOrientation from 'expo-screen-orientation';

import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import ordersReducer from './store/reducers/orders';
import chatReducer from './store/reducers/chat1';
import ShopNavigator from './navigation/ShopNavigator';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import baseUrl from "./baseUrl";


const chatBaseUrl = baseUrl.chatBaseUrl;
const socket = io(chatBaseUrl);
const socketIOMiddleware = createSocketIoMiddleware(socket, "server/");

function reducer(state = { conversations: {} }, action) {
  switch (action.type) {
    case "users_online":
      const conversations = { ...state.conversations };
      const usersOnline = action.data;
      console.log("users data:" + usersOnline)
      for (let i = 0; i < usersOnline.length; i++) {
        const userId = usersOnline[i].userId;
        if (conversations[userId] === undefined) {
          conversations[userId] = {
            messages: [],
            username: usersOnline[i].username
          };
        }
      }
      return { ...state, usersOnline, conversations };
    case "private_message":
      const conversationId = action.data.conversationId;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...state.conversations[conversationId],
            messages: [
              action.data.message,
              ...state.conversations[conversationId].messages
            ]
          }
        }
      };
    case "screen_id":
      console.log("action.data.screenId " + action.data.screenId);
      return { ...state, screenId: action.data.screenId };
    case "user_id":
      console.log("action.data.userId " + action.data.userId);
      return { ...state, userId: action.data.userId };

    case "cart":
      //cartReducer
      return { ...state, cart: action.data };
    case "self_user":
      return { ...state, selfUser: action.data };

    default:
      return state;

  }
}


const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  chat: chatReducer
});



/* chat only */
// const store = applyMiddleware(socketIOMiddleware)(createStore)(reducer);

/* store only */
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


// const loggerMiddleware = createLogger("");
// let store = createStore(rootReducer, applyMiddleware(ReduxThunk, loggerMiddleware, socketIoMiddleware));


store.subscribe(() => {
  console.log("new state", store.getState());
});


// shopStore.subscribe(() => {
//   console.log("new state", shopStore.getState());
// });

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    'Oswald-Bold': require('./assets/fonts/Oswald-Bold.ttf'),
    'Oswald-SemiBold': require('./assets/fonts/Oswald-SemiBold.ttf'),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
        onError={console.warn}
      />
    );
  }

  return (
     <Provider store={store} >
       <ShopNavigator />
    </Provider>
  );

}
