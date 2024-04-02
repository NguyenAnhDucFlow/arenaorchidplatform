import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// guards
import GuestGuard from '../guards/GuestGuard';
import SellerGuard from '../guards/SellerGuard';
import AuthGuard from '../guards/AuthGuard';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import DashboardSeller from '../layouts/dashboardseller';

import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN, PATH_AFTER_LOGINSELLER } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <RoleBasedGuard accessibleRoles={['Admin', 'Staff', 'Manager']}>
          <DashboardLayout />
        </RoleBasedGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },
        { path: 'login', element: <Login /> },

        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
            { path: 'list', element: <EcommerceProductList /> },
            { path: 'auction', element: <EcommerceAuctionList /> },
            { path: 'product/new', element: <EcommerceProductCreate /> },
            { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfile /> },
            { path: 'cards', element: <UserCards /> },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':name/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> },
          ],
        },
      ],
    },

    // DashboardSeller

    {
      path: 'productowner',
      element: (
        <RoleBasedGuard accessibleRoles={['Customer', 'Product Owners']}>
          <DashboardSeller />
        </RoleBasedGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGINSELLER} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },
        { path: 'login', element: <Login /> },

        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/e-commerce/shop" replace />, index: true },
            { path: 'list', element: <EcommerceProductListProductOwner /> },
            { path: 'auction', element: <EcommerceAuctionList /> },
            { path: 'bid', element: <EcommerceBidList /> },
            { path: 'product/new', element: <EcommerceProductCreate /> },
            { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
            { path: 'order', element: <Order /> },
            { path: 'orderDetails/:id', element: <OrderDetails /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'pricing', element: <Pricing /> },
        { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        {
          path: 'seller/login',
          element: (
            <SellerGuard>
              <LoginSeller />
            </SellerGuard>
          ),
        },

        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'about-us', element: <About /> },
        { path: 'contact-us', element: <Contact /> },
        { path: 'faqs', element: <Faqs /> },
        { path: 'shop/:name', element: <EcommerceShop /> },
        { path: 'auction', element: <Auction /> },
        { path: 'product/:name', element: <EcommerceProductDetails /> },
        { path: 'auction/:productId/:auctionId', element: <EcommerceAuctionDetails /> },
        { path: 'bid', element: <EcommerceBidList /> },
        { path: 'order', element: <Order /> },
        { path: 'orderDetails/:id', element: <OrderDetails /> },
        {
          path: 'checkout',
          element: (
            <AuthGuard>
              <EcommerceCheckout />
            </AuthGuard>
          ),
        },
        {
          path: 'checkout/auction',
          element: (
            <AuthGuard>
              <AuctionCheckout />
            </AuthGuard>
          ),
        },
        { path: 'account', element: <UserAccount /> },
        { path: 'seller/account', element: <SellerAccount /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
    {
      path: 'buyer/login',
      element: (
        <GuestGuard>
          <LoginBuyer />
        </GuestGuard>
      ),
    },
    {
      path: 'buyer/signup', element:
        <GuestGuard>
          <SignUpBuyer />
        </GuestGuard>
    },
    { path: 'seller/signup', element: <SignUpSeller /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));
const LoginBuyer = Loadable(lazy(() => import('../pages/auth/LoginBuyer')));
const LoginSeller = Loadable(lazy(() => import('../pages/auth/LoginSeller')));
const SignUpBuyer = Loadable(lazy(() => import('../pages/auth/SignUpBuyer')));
const SignUpSeller = Loadable(lazy(() => import('../pages/auth/SignUpSeller')));

// DASHBOARD

// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));

// ECOMMERCE
const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
const Auction = Loadable(lazy(() => import('../pages/dashboard/Auction')));
const AuctionCheckout = Loadable(lazy(() => import('../pages/auction/AuctionCheckout')));
const EcommerceProductDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductDetails')));
const EcommerceAuctionDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceAuctionDetails')));
const EcommerceProductList = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductList')));
const EcommerceProductListProductOwner = Loadable(
  lazy(() => import('../pages/dashboard/EcommerceProductListProductOwner'))
);
const EcommerceAuctionList = Loadable(lazy(() => import('../pages/dashboard/EcommerceAuctionList')));
const EcommerceBidList = Loadable(lazy(() => import('../pages/dashboard/EcommerceBidList')));
const EcommerceProductCreate = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductCreate')));
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));
const Order = Loadable(lazy(() => import('../pages/dashboard/Order')));
const OrderDetails = Loadable(lazy(() => import('../pages/dashboard/OrderDetails')));

// USER
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));
const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));
const SellerAccount = Loadable(lazy(() => import('../pages/dashboard/SellerAccount')));

// MAIN
const HomePage = Loadable(lazy(() => import('../pages/Home')));
const About = Loadable(lazy(() => import('../pages/About')));
const Contact = Loadable(lazy(() => import('../pages/Contact')));
const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Pricing = Loadable(lazy(() => import('../pages/Pricing')));
const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
