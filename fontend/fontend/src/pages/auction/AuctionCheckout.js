import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Grid, Step, Stepper, Container, StepLabel, StepConnector } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAuctionCart, createAuctionBilling } from '../../redux/slices/product';
// routes
import { PATH_HOME } from '../../routes/paths';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { CheckoutOrderComplete } from '../../sections/@dashboard/e-commerce/checkout';
import AuctionCheckoutBillingAddress from '../../sections/@dashboard/e-commerce/auction/AuctionCheckoutBillingAddress';
import AuctionCheckoutPayment from '../../sections/@dashboard/e-commerce/auction/AuctionCheckoutPayment';

// ----------------------------------------------------------------------

const STEPS = ['Billing & address', 'Payment'];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

function QontoStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'text.disabled',
      }}
    >
      {completed ? (
        <Iconify icon={'eva:checkmark-fill'} sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          }}
        />
      )}
    </Box>
  );
}

export default function AuctionCheckout() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const { auctionCheckout } = useSelector((state) => state.product);
  const { product, billing, activeStep } = auctionCheckout;
  const isComplete = activeStep === STEPS.length;

  console.log('isComplete', activeStep);
  useEffect(() => {
    if (isMountedRef.current) {
      dispatch(getAuctionCart(product));
    }
  }, [dispatch, isMountedRef, product]);

  useEffect(() => {
    if (activeStep === 0) {
      dispatch(createAuctionBilling(null));
    }
  }, [dispatch, activeStep]);

  return (
    <Page title="Checkout">
      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ paddingTop: 15, paddingBottom: 10 }}>
        <HeaderBreadcrumbs
          heading="Checkout"
          links={[
            { name: 'Home', href: PATH_HOME.root },
            {
              name: 'Shop',
              href: PATH_HOME.auction,
            },
            { name: 'Checkout' },
          ]}
        />

        <Grid container justifyContent={isComplete ? 'center' : 'flex-start'}>
          <Grid item xs={12} md={8} sx={{ mb: 5 }}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        typography: 'subtitle2',
                        color: 'text.disabled',
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>

        {!isComplete ? (
          <>
            {activeStep === 0 && <AuctionCheckoutBillingAddress />}
            {activeStep === 1 && billing && <AuctionCheckoutPayment />}
          </>
        ) : (
          <CheckoutOrderComplete open={isComplete} isAuctionCheckout />
        )}
      </Container>
    </Page>
  );
}
