import baseUrl from "./../../baseUrl";



// const users = {};
// const chatBaseUrl = baseUrl.chatBaseUrl;
// const socket = io(chatBaseUrl);
// const socketIOMiddleware = createSocketIoMiddleware(socket, "server/");

export default chat1 = (state = { conversations: {} }, action) => {
  switch (action.type) {
    case "server/join":
      console.log("Got join event", action.data);
      users[socket.id].username = action.data;
      users[socket.id].avatar = createUserAvatarUrl();
      io.emit("action", {
        type: "users_online",
        data: createUsersOnline()
      });
      socket.emit("action", { type: "self_user", data: users[socket.id] });
      break;
    case "users_online":
      const conversations = { ...state.conversations };
      const usersOnline = action.data;
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
      console.log("action.data.screenId-chat1 " + action.data.screenId);
      return { ...state, screenId: action.data.screenId };
    case "user_id":
      console.log("action.data.userId-chat1 " + action.data.userId);
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