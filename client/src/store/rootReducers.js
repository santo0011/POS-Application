import authReducer from "./Reducers/authReducer";
import cartReducer from "./Reducers/cartReducer";
import categoryReducer from "./Reducers/categoryReducer";
import invoiceReducer from "./Reducers/invoiceReducer";
import productAddReducer from "./Reducers/productAddReducer";


const rootReducer = {
      auth: authReducer,
      category: categoryReducer,
      product: productAddReducer,
      cart: cartReducer,
      invoice: invoiceReducer
};

export default rootReducer;