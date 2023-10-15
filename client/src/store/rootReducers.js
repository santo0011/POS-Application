import authReducer from "./Reducers/authReducer";
import categoryReducer from "./Reducers/categoryReducer";
import productAddReducer from "./Reducers/productAddReducer";


const rootReducer = {
      auth: authReducer,
      category: categoryReducer,
      product: productAddReducer
};

export default rootReducer;