import PropTypes from 'prop-types';
import { Navigate, useNavigate } from 'react-router-dom';
import Countdown from 'react-countdown';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Button, Rating, Divider, IconButton, Typography, Card } from '@mui/material';
// routes
import { PATH_HOME, PATH_PAGE } from '../../../../routes/paths';
// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider } from '../../../../components/hook-form';
import { useDispatch } from '../../../../redux/store';
import { AUCTION_CHECKOUT_INFO, addAuctionCart, createBid, onAuctionGotoStep } from '../../../../redux/slices/product';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

// ----------------------------------------------------------------------

AuctionDetailsSummary.propTypes = {
  product: PropTypes.shape({
    available: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string),
    cover: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    inventoryType: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.string,
    priceSale: PropTypes.number,
    sizes: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
    totalRating: PropTypes.number,
    totalReview: PropTypes.number,
    auction: PropTypes.object,
  }),
  auction: PropTypes.shape({
    id: PropTypes.number,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    startPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stepPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currentPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bids: PropTypes.arrayOf(PropTypes.object),
    status: PropTypes.string,
  }),
};

export default function AuctionDetailsSummary({ product, auction, ...other }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const { name, price, totalRating, totalReview } = product;

  const defaultValues = {
    amount: Number(auction.startPrice),
  };

  const methods = useForm({
    defaultValues,
  });

  const { watch, setValue, handleSubmit } = methods;

  const values = watch();

  if (!product.auction) {
    return <Navigate to={PATH_PAGE.page404} />;
  }

  const isStarted = new Date() > new Date(auction.startDate);
  const isEnded = new Date() > new Date(auction.endDate) || auction.status === 'CLOSED';

  const currentUserBids = auction.bids.filter((bid) => bid.user.id === user?.id);
  const highestBid = currentUserBids.length > 0 ? currentUserBids.sort((a, b) => b.amount - a.amount)[0].amount : 0;

  const onSubmitBid = async (data) => {
    if (loading) return;
    if (isEnded) {
      enqueueSnackbar('Auction is over', { variant: 'error' });
      return;
    }
    if (!user) {
      enqueueSnackbar('Please login to bid', { variant: 'error' });
      return;
    }
    if (data.amount <= auction.currentPrice) {
      enqueueSnackbar('Your bid must be higher than the current highest bid', { variant: 'error' });
      return;
    }

    setLoading(true);

    if (data.amount >= product.price) {
      if (
        // eslint-disable-next-line no-alert
        window.confirm('Your bid is higher than the Buyout price. Do you want to buyout now?')
      ) {
        setLoading(false);
        await dispatch(addAuctionCart(product));
        await dispatch(onAuctionGotoStep(0));

        localStorage.setItem(
          AUCTION_CHECKOUT_INFO,
          JSON.stringify({
            auctionId: auction.id,
            amount: data.amount,
            userId: user.id,
            auctionEndDate: new Date().toISOString(),
          })
        );

        navigate(PATH_HOME.auctionCheckout);

        // dispatch(
        //   endAuction(auction.id, {
        //     amount: data.amount,
        //     userId: user.id,
        //     auctionId: auction.id,
        //     auctionEndDate: new Date().toISOString(),
        //   })
        // );
        // enqueueSnackbar('Payout success!', { variant: 'success' });
      }
      setLoading(false);
    } else {
      await dispatch(
        createBid({
          amount: data.amount,
          userId: user.id,
          auctionId: auction.id,
        })
      );
      enqueueSnackbar('Bid success!');
      setLoading(false);
    }
  };

  const handlePayout = async () => {
    if (isEnded) {
      enqueueSnackbar('Auction is over', { variant: 'error' });
      return;
    }
    if (!user) {
      enqueueSnackbar('Please login to buy now', { variant: 'error' });
      return;
    }
    // eslint-disable-next-line no-alert
    if (!window.confirm('Do you want to buyout now?')) {
      console.log('cancel');
      return;
    }
    console.log('buyout');

    await dispatch(addAuctionCart(product));
    await dispatch(onAuctionGotoStep(0));

    localStorage.setItem(
      AUCTION_CHECKOUT_INFO,
      JSON.stringify({
        auctionId: auction.id,
        amount: product.price,
        userId: user.id,
        auctionEndDate: new Date().toISOString(),
      })
    );

    navigate(PATH_HOME.auctionCheckout);

    // dispatch(
    //   endAuction(auction.id, {
    //     amount: product.price,
    //     userId: user.id,
    //     auctionId: auction.id,
    //     auctionEndDate: new Date().toISOString(),
    //   })
    // );
    // enqueueSnackbar('Payout success!', { variant: 'success' });
  };

  return (
    <RootStyle {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitBid)}>
        <Typography variant="h5" paragraph>
          {name}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Rating value={totalRating} precision={0.1} readOnly />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ({fShortenNumber(totalReview)} reviews)
          </Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="body1" sx={{ my: 3 }}>
            Current highest bid:
          </Typography>
          <Typography variant="h6" sx={{ my: 3 }} color="red">
            {fCurrency(auction.currentPrice)}
          </Typography>
        </Stack>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            Time left:
          </Typography>

          {isStarted ? (
            <Countdown
              date={new Date(auction.endDate).getTime()}
              intervalDelay={0}
              precision={3}
              renderer={CountdownRenderer}
            />
          ) : (
            <Card sx={{ paddingInline: '15px', boxShadow: 3 }}>
              <Typography variant="body2" sx={{ textAlign: 'center', marginBlock: '23px' }}>
                Not started yet
              </Typography>
            </Card>
          )}
          <Typography variant="caption" sx={{ mt: 0.5 }} color="gray">
            Auction end: {new Date(auction.endDate).toLocaleString()}
          </Typography>
        </Box>

        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="body1" sx={{ mb: 3 }}>
            Minimum bid for this auction is
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {fCurrency(auction.startPrice)}
          </Typography>
        </Stack>

        {highestBid > 0 && (
          <Stack direction="row" gap={1} alignItems="center">
            <Typography variant="body1" sx={{ mb: 3 }}>
              Your current bid:
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {fCurrency(highestBid)}
            </Typography>
          </Stack>
        )}

        {!isEnded && (
          <Stack direction="row" gap={3} alignItems="center" sx={{ mb: 3 }}>
            <div>
              <Typography variant="body1" component="div" sx={{ textAlign: 'right' }}>
                Place your bid:
              </Typography>
              <Typography variant="caption" sx={{ mt: 0.5 }} color="gray">
                Step price: {fCurrency(auction.stepPrice)}
              </Typography>
            </div>
            <Stack direction="row" gap={1} alignItems="center">
              <Incrementer
                name="amount"
                amount={values.amount}
                startPrice={auction.startPrice}
                onIncrementQuantity={() => setValue('amount', values.amount + (Number(auction.stepPrice) || 1))}
                onDecrementQuantity={() => setValue('amount', values.amount - (Number(auction.stepPrice) || 1))}
              />
              <Button size="small" type="submit" variant="contained" sx={{ fontSize: '14px' }} disabled={loading}>
                <Iconify icon={'mingcute:auction-line'} />
                &nbsp;&nbsp;Bid
              </Button>
            </Stack>
          </Stack>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {!isEnded && (
          <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
            <Button fullWidth size="large" type="button" variant="outlined" onClick={handlePayout} disabled={loading}>
              Buy Now for {fCurrency(price)}
            </Button>
          </Stack>
        )}
      </FormProvider>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  amount: PropTypes.number,
  startPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onIncrementQuantity: PropTypes.func,
  onDecrementQuantity: PropTypes.func,
};

function Incrementer({ startPrice, amount, onIncrementQuantity, onDecrementQuantity }) {
  return (
    <Box
      sx={{
        py: 0.5,
        px: 0.75,
        border: 1,
        lineHeight: 0,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        borderColor: 'grey.50032',
      }}
    >
      <IconButton size="small" color="inherit" disabled={amount <= startPrice} onClick={onDecrementQuantity}>
        <Iconify icon={'eva:minus-fill'} width={14} height={14} />
      </IconButton>

      <Typography variant="body2" component="span" sx={{ width: 'fit-content', textAlign: 'center' }}>
        $ {amount}
      </Typography>

      <IconButton size="small" color="inherit" onClick={onIncrementQuantity}>
        <Iconify icon={'eva:plus-fill'} width={14} height={14} />
      </IconButton>
    </Box>
  );
}

const CountdownStyle = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});
const SeparatorStyle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 1),
}));

const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return (
      <Card sx={{ paddingInline: '15px', boxShadow: 3 }}>
        <Typography variant="body2" sx={{ textAlign: 'center', marginBlock: '23px' }}>
          Auction is over
        </Typography>
      </Card>
    );
  }
  return (
    <Card sx={{ paddingInline: '15px', paddingBlock: '10px', boxShadow: 3 }}>
      <CountdownStyle>
        <div>
          <Typography variant="subtitle1" textAlign="center">
            {days}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Days
          </Typography>
        </div>

        <SeparatorStyle variant="subtitle1">:</SeparatorStyle>

        <div>
          <Typography variant="subtitle1" textAlign="center">
            {hours}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Hours
          </Typography>
        </div>

        <SeparatorStyle variant="subtitle1">:</SeparatorStyle>

        <div>
          <Typography variant="subtitle1" textAlign="center">
            {minutes}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Minutes
          </Typography>
        </div>

        <SeparatorStyle variant="subtitle1">:</SeparatorStyle>

        <div>
          <Typography variant="subtitle1" textAlign="center">
            {seconds}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Seconds
          </Typography>
        </div>
      </CountdownStyle>
    </Card>
  );
};
