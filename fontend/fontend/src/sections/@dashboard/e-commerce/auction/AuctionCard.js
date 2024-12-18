import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import Countdown from 'react-countdown';
// @mui
import { Box, Card, Link, Typography, Stack, styled } from '@mui/material';
// routes
import { PATH_HOME } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';

// ----------------------------------------------------------------------

AuctionCard.propTypes = {
  auction: PropTypes.object,
};

const CountdownStyle = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});

const SeparatorStyle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 1),
}));

export default function AuctionCard({ auction }) {
  const { startDate, endDate, currentPrice, product } = auction;

  if (!product) return null;

  const { name, cover, status } = product;

  const linkTo = PATH_HOME.auctionView(product.id, auction.id);

  const isStarted = new Date() > new Date(startDate);

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}
        <Image alt={name} src={cover} ratio="1/1" />
        {isStarted ? (
          <Countdown date={new Date(endDate).getTime()} intervalDelay={0} precision={3} renderer={CountdownRenderer} />
        ) : (
          <Card sx={{ position: 'absolute', bottom: 10, left: 15, right: 15, paddingInline: '15px', boxShadow: 3 }}>
            <Typography variant="body2" sx={{ textAlign: 'center', marginBlock: '23px' }}>
              Not started yet
            </Typography>
          </Card>
        )}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap sx={{
            textAlign: 'center'
          }}>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="center">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="subtitle1">Current bid: </Typography>
            <Typography color="red">{fCurrency(currentPrice)}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return (
      <Card sx={{ position: 'absolute', bottom: 10, left: 15, right: 15, paddingInline: '15px', boxShadow: 3 }}>
        <Typography variant="body2" sx={{ textAlign: 'center', marginBlock: '23px' }}>
          Auction is over
        </Typography>
      </Card>
    );
  }
  return (
    <Card sx={{ position: 'absolute', bottom: 10, left: 15, right: 15, paddingInline: '15px', boxShadow: 3 }}>
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        Time left:
      </Typography>
      <CountdownStyle>
        <div>
          <Typography variant="subtitle2">{days}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Days
          </Typography>
        </div>

        <SeparatorStyle variant="subtitle2">:</SeparatorStyle>

        <div>
          <Typography variant="subtitle2">{hours}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Hours
          </Typography>
        </div>

        <SeparatorStyle variant="subtitle2">:</SeparatorStyle>

        <div>
          <Typography variant="subtitle2">{minutes}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Minutes
          </Typography>
        </div>

        <SeparatorStyle variant="subtitle2">:</SeparatorStyle>

        <div>
          <Typography variant="subtitle2">{seconds}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Seconds
          </Typography>
        </div>
      </CountdownStyle>
    </Card>
  );
};
