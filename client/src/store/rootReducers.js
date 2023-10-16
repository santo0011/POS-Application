import authReducer from "./Reducers/authReducer";
import cartReducer from "./Reducers/cartReducer";
import categoryReducer from "./Reducers/categoryReducer";
import productAddReducer from "./Reducers/productAddReducer";


const rootReducer = {
      auth: authReducer,
      category: categoryReducer,
      product: productAddReducer,
      cart: cartReducer
};

export default rootReducer;