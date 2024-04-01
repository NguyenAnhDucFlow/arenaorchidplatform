import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, Typography, MenuItem, Link } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { PATH_HOME } from '../../../../routes/paths';
//

// ----------------------------------------------------------------------

BidTableRow.propTypes = {
  row: PropTypes.object,
  winningBid: PropTypes.object || null,
  onCheckoutRow: PropTypes.func,
  onCancelRow: PropTypes.func,
};

export default function BidTableRow({ row, onCheckoutRow, onCancelRow, winningBid }) {
  const theme = useTheme();

  const { amount, updatedAt, status, auction } = row;
  const { product, endDate } = auction;
  const { name, cover } = product;
  const { user } = winningBid;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleCancelBid = () => {
    onCancelRow();
    handleCloseMenu();
  };

  const handleCheckout = () => {
    onCheckoutRow();
    handleCloseMenu();
  };

  const linkTo = PATH_HOME.auctionView(product.id, auction.id);
  const isEnded = new Date() > new Date(endDate) || auction.status === 'CLOSED';
  const isWinner = winningBid?.user.id === row.user.id;

  return (
    <TableRow hover>
      <TableCell align="center">
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {auction.id}
          </Typography>
        </Link>
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Image disabledEffect alt={name} src={cover} sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell>{fDate(updatedAt)}</TableCell>

      <TableCell align="center">{fCurrency(amount)}</TableCell>
      <TableCell align="center">{user.displayName}</TableCell>

      {status === 'CANCELLED' ? (
        <TableCell align="center">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={'error'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status ? sentenceCase(status) : ''}
          </Label>
        </TableCell>
      ) : (
        <>
          {isEnded && !isWinner && (
            <TableCell align="center">
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color="error"
                sx={{ textTransform: 'capitalize' }}
              >
                Lost bid
              </Label>
            </TableCell>
          )}

          {isEnded && isWinner && (
            <TableCell align="center">
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color="success"
                sx={{ textTransform: 'capitalize' }}
              >
                Won bid
              </Label>
            </TableCell>
          )}

          {!isEnded && (
            <TableCell align="center">
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={(status === 'CANCELLED' && 'error') || (status === 'PENDING' && 'warning') || 'success'}
                sx={{ textTransform: 'capitalize' }}
              >
                {status ? sentenceCase(status) : ''}
              </Label>
            </TableCell>
          )}
        </>
      )}

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={(() => {
            if (isEnded && isWinner && status !== 'CANCELLED') {
              if (status === 'DONE') return <MenuItem disabled>Already paid</MenuItem>;
              return (
                <>
                  <MenuItem onClick={handleCheckout}>
                    <Iconify icon={'eva:edit-fill'} />
                    Checkout
                  </MenuItem>
                  <MenuItem onClick={handleCancelBid} sx={{ color: 'error.main' }}>
                    <Iconify icon={'eva:trash-2-outline'} />
                    Cancel
                  </MenuItem>
                </>
              );
            }
            return <MenuItem disabled>No action</MenuItem>;
          })()}
        />
      </TableCell>
    </TableRow>
  );
}
