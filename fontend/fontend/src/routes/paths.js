// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_HOME = '/';
const ROOTS_PRODUCTOWNER = '/productowner';

// ----------------------------------------------------------------------

export const PATH_PRODUCTOWNER = {
  root: ROOTS_PRODUCTOWNER,
  general: {
    ecommerce: path(ROOTS_PRODUCTOWNER, '/ecommerce'),
    analytics: path(ROOTS_PRODUCTOWNER, '/analytics'),
  },
  chat: {
    root: path(ROOTS_PRODUCTOWNER, '/chat'),
    new: path(ROOTS_PRODUCTOWNER, '/chat/new'),
    view: (name) => path(ROOTS_PRODUCTOWNER, `/chat/${name}`),
  },
  calendar: path(ROOTS_PRODUCTOWNER, '/calendar'),
  kanban: path(ROOTS_PRODUCTOWNER, '/kanban'),
  eCommerce: {
    root: path(ROOTS_PRODUCTOWNER, '/e-commerce'),
    list: path(ROOTS_PRODUCTOWNER, '/e-commerce/list'),
    bid: path(ROOTS_PRODUCTOWNER, '/e-commerce/bid'),
    order: path(ROOTS_PRODUCTOWNER, '/e-commerce/order'),
    orderDetails: (id) => path(ROOTS_PRODUCTOWNER, `/e-commerce/orderDetails/${id}`),
    checkout: path(ROOTS_PRODUCTOWNER, '/e-commerce/checkout'),
    new: path(ROOTS_PRODUCTOWNER, '/e-commerce/product/new'),
    view: (name) => path(ROOTS_PRODUCTOWNER, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_PRODUCTOWNER, `/e-commerce/product/${name}/edit`),
  },
  invoice: {
    root: path(ROOTS_PRODUCTOWNER, '/invoice'),
    list: path(ROOTS_PRODUCTOWNER, '/invoice/list'),
    new: path(ROOTS_PRODUCTOWNER, '/invoice/new'),
    view: (id) => path(ROOTS_PRODUCTOWNER, `/invoice/${id}`),
    edit: (id) => path(ROOTS_PRODUCTOWNER, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_PRODUCTOWNER, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_PRODUCTOWNER, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
};

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
};

export const PATH_HOME = {
  root: ROOTS_HOME,
  shop: path(ROOTS_HOME, 'shop'),
  auction: path(ROOTS_HOME, 'auction'),
  view: (name) => path(ROOTS_HOME, `product/${name}`),
  auctionView: (productId, id) => path(ROOTS_HOME, `auction/${productId}/${id}`),
  shopView: (name) => path(ROOTS_HOME, `shop/${name}`),
  checkout: path(ROOTS_HOME, 'checkout'),
  auctionCheckout: path(ROOTS_HOME, 'checkout/auction'),
  loginBuyer: path(ROOTS_HOME, 'buyer/login'),
  loginSeller: path(ROOTS_HOME, 'seller/login'),
  signupBuyer: path(ROOTS_HOME, 'buyer/signup'),
  signupSeller: path(ROOTS_HOME, 'seller/signup'),
  account: "/account",
  bid: path(ROOTS_HOME, 'bid'),
  order: path(ROOTS_HOME, 'order'),
  orderDetails: (id) => path(ROOTS_HOME, `order/${id}`),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
    auction: path(ROOTS_DASHBOARD, '/e-commerce/auction'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
