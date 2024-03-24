import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  isLastPage: false,
  error: null,
  products: [],
  auctions: [],
  bidList: {
    bids: [],
    highestBids: [],
  },
  product: null,
  auction: null,
  sortBy: null,
  filters: {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: '',
  },
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
  },
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    startLoadingPageable(state, action) {
      state.isLoading = true;
      state.isLastPage = false;
      if (action.payload === 0) {
        state.products = [];
      }
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    endLoading(state) {
      state.isLoading = false;
    },
    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },

    getProductsPageableSuccess(state, action) {
      state.isLoading = false;
      state.products = [...state.products, ...action.payload.contents];
      if (action.payload.totalElements === state.products.length) {
        state.isLastPage = true;
      }
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    // GET AUCTIONS
    getAuctionsSuccess(state, action) {
      state.isLoading = false;
      state.auctions = action.payload;
    },

    // GET AUCTION
    getAuctionSuccess(state, action) {
      state.isLoading = false;
      state.auction = action.payload;
    },

    // GET BIDS
    getBidsSuccess(state, action) {
      state.isLoading = false;
      state.bidList.bids = action.payload.bids;
      state.bidList.highestBids = action.payload.highestBids.filter((bid) => bid);
    },

    putBidsSuccess(state) {
      state.isLoading = false;
    },

    // POST AUCTION
    postAuctionSuccess(state) {
      state.isLoading = false;
      state.auctions = [];
    },

    //  SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    },

    filterProducts(state, action) {
      state.filters.gender = action.payload.gender;
      state.filters.category = action.payload.category;
      state.filters.colors = action.payload.colors;
      state.filters.priceRange = action.payload.priceRange;
      state.filters.rating = action.payload.rating;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const subtotal = sum(cart.map((cartItem) => cartItem.price * cartItem.quantity));
      const discount = cart.length === 0 ? 0 : state.checkout.discount;
      const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
      const billing = cart.length === 0 ? null : state.checkout.billing;

      state.checkout.cart = cart;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.billing = billing;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - discount;
    },

    addCart(state, action) {
      const product = action.payload;
      const isEmptyCart = state.checkout.cart.length === 0;

      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, product];
      } else {
        state.checkout.cart = state.checkout.cart.map((_product) => {
          const isExisted = _product.id === product.id;
          if (isExisted) {
            return {
              ..._product,
              quantity: _product.quantity + 1,
            };
          }
          return _product;
        });
      }
      state.checkout.cart = uniqBy([...state.checkout.cart, product], 'id');
    },

    deleteCart(state, action) {
      const updateCart = state.checkout.cart.filter((item) => item.id !== action.payload);

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.billing = null;
    },

    onBackStep(state) {
      state.checkout.activeStep -= 1;
    },

    onNextStep(state) {
      state.checkout.activeStep += 1;
    },

    onGotoStep(state, action) {
      const goToStep = action.payload;
      state.checkout.activeStep = goToStep;
    },

    increaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  sortByProducts,
  filterProducts,
} = slice.actions;

// ----------------------------------------------------------------------
export function getProductByOwnerId(ownerId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/product/owner/${ownerId}`);
      console.log(response.data.data);
      dispatch(slice.actions.getProductsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProducts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/product');
      console.log(response.data.data);
      dispatch(slice.actions.getProductsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProductsPageable(page = 0, size = 8) {
  return async () => {
    dispatch(slice.actions.startLoadingPageable(page));
    try {
      const response = await axios.get('/product/pageable', {
        params: { currentPage: page, size },
      });
      console.log(response.data.data);
      dispatch(slice.actions.getProductsPageableSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProduct(name) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(name);
      const response = await axios.get('/product/name', {
        params: { name },
      });
      console.log(response.data.data);
      dispatch(slice.actions.getProductSuccess(response.data.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProductById(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/product/${id}`);
      console.log('product', response.data.data);
      dispatch(slice.actions.getProductSuccess(response.data.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAuctions() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/auction');
      console.log('auctions', response.data.data);
      dispatch(slice.actions.getAuctionsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAuctionsTable(keyword, currentPage, size, sortedField) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/auction/search', {
        params: { currentPage, size, sortedField, keyword },
      });
      console.log('auctions', response.data.data);
      dispatch(slice.actions.getAuctionsSuccess(response.data.data.contents));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAuction(id) {
  return async () => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/auction/${id}`);
      console.log('auction', response.data.data);
      dispatch(slice.actions.getAuctionSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createAuction(newAuction) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/auction', newAuction);
      dispatch(slice.actions.postAuctionSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateAuction(id, newAuction) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put(`/auction/${id}`, newAuction);
      dispatch(slice.actions.postAuctionSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteAuction(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/auction/${id}`);
      dispatch(slice.actions.postAuctionSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteAuctions(ids) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete('/auction', {
        data: { ids },
      });
      dispatch(slice.actions.postAuctionSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createBid(newBid) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/bid', newBid);
      dispatch(slice.actions.endLoading());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function endAuction(auctionId, bidData) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put(`/auction/end/${auctionId}`, bidData);
      dispatch(slice.actions.postAuctionSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function cancelBid(bidId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put(`/bid/${bidId}`);
      dispatch(slice.actions.putBidsSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getBidsByUserId(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/bid/user/${id}`);
      console.log('bids', response.data.data);
      dispatch(slice.actions.getBidsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
