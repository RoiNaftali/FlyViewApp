import Order from '../../models/order';
import baseUrl from "../../baseUrl";
import { useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

// const userId = useSelector(state => state.userId);
// const screenId = useSelector(state => state.screenId);
// const items = useSelector(state => state.items)
// const totalAmount = useSelector(state => state.totalAmount)

const flightservicesBaseUrl = baseUrl.localBaseUrl + "flight/";
const getAllProductsRequest = new Request(`${flightservicesBaseUrl}orders`, {
  method: 'GET', headers: {

  }
});

const userId = SecureStore.getItemAsync("userId");
const screenId = SecureStore.getItemAsync("screenId");

export const fetchOrders = () => {
  return async dispatch => {
    try {
      const response = await fetch(
       getAllProductsRequest 

      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const loadedOrders = [];

      for (const key in resData) {
        loadedOrders.push(
          new Order(
            resData[key]._id,
            resData[key].products,
            resData[key].userId,
            resData[key].screenId,
            new Date(resData[key].timeStamp)
          )
        );
      }
      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (err) {
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount, userId, screenId) => {
  console.log("cart items: " + cartItems)


  return async dispatch => {
    // console.log("userid from orders1 " + userId1);
    // console.log("screenid from orders1 " + screenId1);
    const date = new Date();
    const response = await fetch(
      new Request(`${flightservicesBaseUrl}orders`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            screenId: screenId,
            products: cartItems
          })
        })
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date: date
      }
    });
  };
};
