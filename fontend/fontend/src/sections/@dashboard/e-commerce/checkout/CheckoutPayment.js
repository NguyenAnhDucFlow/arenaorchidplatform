import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation } from 'react-router';

// @mui
import { Grid, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import {
  onGotoStep,
  onBackStep,
  onNextStep,
  applyShipping,
  goCheckoutSuccess,
  resetCart,
} from '../../../../redux/slices/product';

import axios from '../../../../utils/axios';

// components
import Iconify from '../../../../components/Iconify';
import { FormProvider } from '../../../../components/hook-form';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutDelivery from './CheckoutDelivery';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import useAuth from '../../../../hooks/useAuth';
import { HOST_URL } from '../../../../config';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    value: 0,
    title: 'Standard delivery (Free)',
    description: 'Delivered on Monday, August 12',
  },
  {
    value: 2,
    title: 'Fast delivery ($2,00)',
    description: 'Delivered on Monday, August 5',
  },
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
  {
    value: 'cash',
    title: 'Cash on CheckoutDelivery',
    description: 'Pay with cash when your order is delivered.',
    icons: [],
  },
];

const CARDS_OPTIONS = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

const ORDER_CHECKOUT_PENDING = 'order-checkout-pending';

export default function CheckoutPayment() {
  const dispatch = useDispatch();

  const location = useLocation();

  const { user } = useAuth();

  const { checkout } = useSelector((state) => state.product);

  const { total, discount, subtotal, shipping } = checkout;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get('paymentId');
    const PayerID = queryParams.get('PayerID');

    const verifyPayment = async () => {
      try {
        // const response = await fetch(
        //   `http://localhost:8080/paypal/execute?paymentId=${paymentId}&PayerID=${PayerID}&userId=${user?.id}`
        // )

        const response = await axios.get('/paypal/execute', {
          params: {
            paymentId,
            PayerID,
            userId: user?.id,
          },
        });

        console.log('Payment: ', response.data);

        // Save the order to the database
        const order = JSON.parse(localStorage.getItem(ORDER_CHECKOUT_PENDING));
        await axios.post('/order/', order);

        localStorage.removeItem(ORDER_CHECKOUT_PENDING);

        dispatch(goCheckoutSuccess(response.data));
      } catch (error) {
        console.log('err', error);
      }
    };

    if (paymentId && PayerID && user) {
      verifyPayment();
    }
  }, [user, location.search, dispatch]);

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  const handleApplyShipping = (value) => {
    dispatch(applyShipping(value));
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
        customer: { id: checkout.billing.user.id },
        shipment: { id: checkout.billing.id },
        orderDetails: checkout.cart.map((item) => ({
          product: { id: item.id },
          price: parseInt(item.price, 10),
          quantity: item.quantity,
        })),
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
          cancelUrl: `${HOST_URL}/checkout?cancel`, // URL for canceling payment
          successUrl: `${HOST_URL}/checkout?success`, // URL for successful payment
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
          <CheckoutBillingInfo onBackStep={handleBackStep} />

          <CheckoutSummary
            enableEdit
            total={total}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            onEdit={() => handleGotoStep(0)}
          />
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Complete Order
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
