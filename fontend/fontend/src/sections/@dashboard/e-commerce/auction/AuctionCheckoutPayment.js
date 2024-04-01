import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';

// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Grid } from '@mui/material';
// redux
import {
  AUCTION_CHECKOUT_INFO,
  applyAuctionShipping,
  endAuction,
  goAuctionCheckoutSuccess,
  onAuctionBackStep,
  onAuctionGotoStep,
  onAuctionNextStep,
} from '../../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../../redux/store';

import axios from '../../../../utils/axios';

// components
import Iconify from '../../../../components/Iconify';
import { FormProvider } from '../../../../components/hook-form';
//
import { HOST_URL } from '../../../../config';
import useAuth from '../../../../hooks/useAuth';
import CheckoutDelivery from '../checkout/CheckoutDelivery';
import CheckoutPaymentMethods from '../checkout/CheckoutPaymentMethods';
import AuctionCheckoutBillingInfo from './AuctionCheckoutBillingInfo';
import AuctionCheckoutSummary from './AuctionCheckoutSummary';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    value: 0,
    title: 'Standard delivery (Free)',
    description: 'Delivered on Monday, August 12',
  },
  // {
  //   value: 2,
  //   title: 'Fast delivery ($2,00)',
  //   description: 'Delivered on Monday, August 5',
  // },
];

const PAYMENT_OPTIONS = [
  {
    value: 'paypal',
    title: 'Pay with Paypal',
    description: 'You will be redirected to PayPal website to complete your purchase securely.',
    icons: ['https://minimal-assets-api.vercel.app/assets/icons/ic_paypal.svg'],
  },
  // {
  //   value: 'credit_card',
  //   title: 'Credit / Debit Card',
  //   description: 'We support Mastercard, Visa, Discover and Stripe.',
  //   icons: [
  //     'https://minimal-assets-api.vercel.app/assets/icons/ic_mastercard.svg',
  //     'https://minimal-assets-api.vercel.app/assets/icons/ic_visa.svg',
  //   ],
  // },
  // {
  //   value: 'cash',
  //   title: 'Cash on CheckoutDelivery',
  //   description: 'Pay with cash when your order is delivered.',
  //   icons: [],
  // },
];

const CARDS_OPTIONS = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

const ORDER_CHECKOUT_PENDING = 'auction-order-checkout-pending';

export default function AuctionCheckoutPayment() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const location = useLocation();

  const { user } = useAuth();

  const { auctionCheckout } = useSelector((state) => state.product);

  const { total, shipping } = auctionCheckout;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get('paymentId');
    const PayerID = queryParams.get('PayerID');

    const verifyPayment = async () => {
      try {
        console.log('PaymentId: ', paymentId);
        setLoading(true);
        const response = await axios.get('/paypal/execute', {
          params: {
            paymentId,
            PayerID,
            userId: user?.id,
          },
        });

        console.log('Payment: ', response.data);

        // Save the order to the database and end the auction
        const order = JSON.parse(localStorage.getItem(ORDER_CHECKOUT_PENDING));
        const auctionData = JSON.parse(localStorage.getItem(AUCTION_CHECKOUT_INFO));

        await dispatch(endAuction(auctionData.auctionId, auctionData));
        await axios.post('/order/', order);

        localStorage.removeItem(ORDER_CHECKOUT_PENDING);
        localStorage.removeItem(AUCTION_CHECKOUT_INFO);

        dispatch(goAuctionCheckoutSuccess(response.data));
      } catch (error) {
        console.log('err', error);
      }
      setLoading(false);
    };

    if (paymentId && PayerID && user) {
      verifyPayment();
    }
  }, [user, location.search, dispatch]);

  const handleNextStep = () => {
    dispatch(onAuctionNextStep());
  };

  const handleBackStep = () => {
    dispatch(onAuctionBackStep());
  };

  const handleGotoStep = (step) => {
    dispatch(onAuctionGotoStep(step));
  };

  const handleApplyShipping = (value) => {
    dispatch(applyAuctionShipping(value));
  };

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required!'),
  });

  const defaultValues = {
    delivery: shipping,
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const deliveryOption = DELIVERY_OPTIONS.find((option) => option.value === data.delivery);
      const paymentOption = PAYMENT_OPTIONS.find((option) => option.value === data.payment);

      // Construct the order object
      const order = {
        total,
        customer: { id: auctionCheckout.billing.user.id },
        shipment: { id: auctionCheckout.billing.id },
        orderDetails: [
          {
            product: { id: auctionCheckout.product.id },
            price: parseInt(auctionCheckout.product.price, 10),
            quantity: auctionCheckout.product.quantity,
          },
        ],
        deliveryOption: deliveryOption.title,
        paymentOption: paymentOption.title,
      };

      // Check if PayPal is selected
      if (data.payment === 'paypal') {
        // Prepare the data for PayPal payment
        const paymentData = {
          total: total.toString(), // Ensure this matches your backend's expected format
          currency: 'USD', // Change as needed
          method: 'paypal',
          intent: 'sale',
          description: 'Order description here', // Customize this
          cancelUrl: `${HOST_URL}/checkout/auction?cancel`, // URL for canceling payment
          successUrl: `${HOST_URL}/checkout/auction?success`, // URL for successful payment
        };

        console.log('order:', order);

        // Save the order to the localStorage to be used later when the payment is successful
        localStorage.setItem(ORDER_CHECKOUT_PENDING, JSON.stringify(order));

        // Call your backend to create a PayPal payment
        const paymentResponse = await axios.post('/paypal/pay', paymentData);

        if (paymentResponse.status === 200 && paymentResponse.data) {
          // Redirect user to PayPal for payment approval
          window.location.href = paymentResponse.data.data;
          return; // Prevent further execution
        }
        console.error('Error initiating PayPal payment');
      } // End of PayPal payment check
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutDelivery onApplyShipping={handleApplyShipping} deliveryOptions={DELIVERY_OPTIONS} />
          <CheckoutPaymentMethods cardOptions={CARDS_OPTIONS} paymentOptions={PAYMENT_OPTIONS} />
          <Button
            size="small"
            color="inherit"
            onClick={handleBackStep}
            startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
          >
            Back
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <AuctionCheckoutBillingInfo onBackStep={handleBackStep} />

          <AuctionCheckoutSummary enableEdit total={total} shipping={shipping} onEdit={() => handleGotoStep(0)} />
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting || loading}>
            Complete Order
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
