import { Product } from "@/app/types";

export interface ProductsState {
  products: Product[];
  loading: boolean;
  selectedProduct: Product | null;
  quantity: number;
  isOrdering: boolean;
  showLoginModal: boolean;
  showConfirmModal: boolean;
  showSuccessModal: boolean;
  showErrorModal: boolean;
  successMessage: string;
  errorMessage: string;
}

export const initialState: ProductsState = {
  products: [],
  loading: true,
  selectedProduct: null,
  quantity: 1,
  isOrdering: false,
  showLoginModal: false,
  showConfirmModal: false,
  showSuccessModal: false,
  showErrorModal: false,
  successMessage: "",
  errorMessage: ""
};

type ProductsAction =
  | { type: 'FETCH_PRODUCTS_REQUEST' }
  | { type: 'FETCH_PRODUCTS_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_PRODUCTS_FAILURE'; payload: string }
  | { type: 'SELECT_PRODUCT'; payload: Product }
  | { type: 'SET_QUANTITY'; payload: number }
  | { type: 'ORDER_REQUEST' }
  | { type: 'ORDER_SUCCESS'; payload: string }
  | { type: 'ORDER_FAILURE'; payload: string }
  | { type: 'SHOW_LOGIN_MODAL' }
  | { type: 'HIDE_LOGIN_MODAL' }
  | { type: 'SHOW_CONFIRM_MODAL' }
  | { type: 'HIDE_CONFIRM_MODAL' }
  | { type: 'SHOW_SUCCESS_MODAL' }
  | { type: 'HIDE_SUCCESS_MODAL' }
  | { type: 'SHOW_ERROR_MODAL' }
  | { type: 'HIDE_ERROR_MODAL' }
  | { type: 'UPDATE_PRODUCT'; payload: Product };;

export function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'FETCH_PRODUCTS_REQUEST':
      return { ...state, loading: true, errorMessage: "" };
    
    case 'FETCH_PRODUCTS_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    
    case 'FETCH_PRODUCTS_FAILURE':
      return { ...state, loading: false, errorMessage: action.payload, showErrorModal: true };
    
    case 'SELECT_PRODUCT':
      return { ...state, selectedProduct: action.payload, quantity: 1 };
    
    case 'SET_QUANTITY':
      return { ...state, quantity: action.payload };
    
    case 'ORDER_REQUEST':
      return { ...state, isOrdering: true };
      case 'UPDATE_PRODUCT':
  return {
    ...state,
    products: state.products.map(p => 
      p._id === action.payload._id ? action.payload : p
    )
  };
    
    case 'ORDER_SUCCESS':
      return {
        ...state,
        isOrdering: false,
        showConfirmModal: false,
        selectedProduct: null,
        successMessage: action.payload,
        showSuccessModal: true
      };
    
    case 'ORDER_FAILURE':
      return {
        ...state,
        isOrdering: false,
        errorMessage: action.payload,
        showErrorModal: true
      };
    
    case 'SHOW_LOGIN_MODAL':
      return { ...state, showLoginModal: true };
    
    case 'HIDE_LOGIN_MODAL':
      return { ...state, showLoginModal: false };
    
    case 'SHOW_CONFIRM_MODAL':
      return { ...state, showConfirmModal: true };
    
    case 'HIDE_CONFIRM_MODAL':
      return { ...state, showConfirmModal: false };
    
    case 'SHOW_SUCCESS_MODAL':
      return { ...state, showSuccessModal: true };
    
    case 'HIDE_SUCCESS_MODAL':
      return { ...state, showSuccessModal: false };
    
    case 'SHOW_ERROR_MODAL':
      return { ...state, showErrorModal: true };
    
    case 'HIDE_ERROR_MODAL':
      return { ...state, showErrorModal: false };
    
    default:
      return state;
  }
}