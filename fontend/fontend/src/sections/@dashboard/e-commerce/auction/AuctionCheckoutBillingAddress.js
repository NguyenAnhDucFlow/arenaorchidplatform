import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
// redux
import { createAuctionBilling, onAuctionBackStep, onAuctionNextStep } from '../../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../../redux/store';
// components
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
//
import useAuth from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';
import { CheckoutNewAddressForm } from '../checkout';
import CheckoutSummary from './AuctionCheckoutSummary';

// ----------------------------------------------------------------------

export default function AuctionCheckoutBillingAddress() {
  //
  const dispatch = useDispatch();
  const { auctionCheckout } = useSelector((state) => state.product);
  const { total } = auctionCheckout;
  //
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNextStep = () => {
    dispatch(onAuctionNextStep());
  };

  const handleBackStep = () => {
    dispatch(onAuctionBackStep());
  };

  const handleCreateBilling = (value) => {
    dispatch(createAuctionBilling(value));
  };

  const handelDeleteBilling = (id) => {
    console.log('handelDeleteBilling', id);
    axios.delete(`/shipment/${id}`).then((res) => {
      console.log('res', res);
    });
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {user.shipments
            .sort(
              (a) => (user.defaultShipmentId === a.id ? -1 : 0) // sort array
            )
            .map((address, index) => (
              <AddressItem
                key={index}
                address={address}
                onNextStep={handleNextStep}
                onCreateBilling={handleCreateBilling}
                onDeleteBilling={handelDeleteBilling}
              />
            ))}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              size="small"
              color="inherit"
              onClick={handleBackStep}
              startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
            >
              Back
            </Button>
            <Button size="small" onClick={handleClickOpen} startIcon={<Iconify icon={'eva:plus-fill'} />}>
              Add new address
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutSummary total={total} />
        </Grid>
      </Grid>

      <CheckoutNewAddressForm
        open={open}
        onClose={handleClose}
        onNextStep={handleNextStep}
        onCreateBilling={handleCreateBilling}
      />
    </>
  );
}

// ----------------------------------------------------------------------

AddressItem.propTypes = {
  address: PropTypes.object,
  onNextStep: PropTypes.func,
  onCreateBilling: PropTypes.func,
  onDeleteBilling: PropTypes.func,
};

function AddressItem({ address, onNextStep, onCreateBilling, onDeleteBilling }) {
  const { receiver, fullAddress, addressType, phone, id } = address;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { user } = useAuth();
  const isDefault = user.defaultShipmentId === id;

  const handleCreateBilling = () => {
    onCreateBilling(address);
    onNextStep();
  };

  const handelDeleteBilling = () => {
    handleClose();
    onDeleteBilling(id);
  };

  return (
    <Card sx={{ p: 3, mb: 3, position: 'relative' }}>
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1">{receiver}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({addressType})
        </Typography>
        {isDefault && (
          <Label color="info" sx={{ ml: 1 }}>
            Default
          </Label>
        )}
      </Box>
      <Typography variant="body2" gutterBottom>
        {fullAddress}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {phone}
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          position: { sm: 'absolute' },
          right: { sm: 24 },
          bottom: { sm: 24 },
        }}
      >
        {!isDefault && (
          <Button variant="outlined" size="small" color="inherit" onClick={handleClickOpen}>
            Delete
          </Button>
        )}
        <Box sx={{ mx: 0.5 }} />
        <Button variant="outlined" size="small" onClick={handleCreateBilling}>
          Deliver to this Address
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Delete'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you want to delete this Address?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handelDeleteBilling} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
