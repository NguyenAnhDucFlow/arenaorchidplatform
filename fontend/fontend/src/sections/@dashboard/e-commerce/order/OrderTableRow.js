import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, DialogContentText
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { styled } from '@mui/system';
// utils
import { fDate } from '../../../../utils/formatTime';

// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import axios from '../../../../utils/axios'
import useAuth from '../../../../hooks/useAuth';
import { PATH_PRODUCTOWNER, PATH_HOME } from '../../../../routes/paths';

// ----------------------------------------------------------------------

OrderTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onUpdateRow: PropTypes.func,
};

const StyledSelect = styled(Select)({
  color: 'white',
  backgroundColor: 'blue',
  '&:hover': {
    backgroundColor: 'darkblue',
  },
  '& .MuiSelect-icon': {
    color: 'white',
  },
});

export default function OrderTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onUpdateRow }) {

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const theme = useTheme();

  const { user } = useAuth();

  const userRole = user.role.name;

  const { id, customer, total, createdAt, paymentOption, status } = row;

  const name = customer?.displayName;
  const avatar = customer?.photoURL;

  console.log("row order", row)

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(status);

  const handleOpenEditDialog = () => {
    setNewStatus(status);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleSaveEditDialog = () => {
    axios.put('/order/', { id, status: newStatus, staff: { id: user.id }, customer })
      .then((response) => {
        enqueueSnackbar('Order status updated successfully', { variant: 'success' });
        setEditDialogOpen(false);
        onUpdateRow(id, { status: newStatus }); // Cập nhật row
      })
      .catch((error) => {
        enqueueSnackbar('Failed to update order status', { variant: 'error' });
        setEditDialogOpen(false);
      });

  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">#{id}</TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={avatar} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell>{createdAt}</TableCell>

      <TableCell align="center">
        {paymentOption === 'Cash on CheckoutDelivery' ? 'CheckoutDelivery' : 'Paypal'}
      </TableCell>


      <TableCell align="center">{total}</TableCell>



      <TableCell align="left">
        <StatusLabel status={status} />
      </TableCell>


      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              {userRole !== 'Customer' && (
                <MenuItem
                  onClick={() => {
                    onDeleteRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:trash-2-outline'} />
                  Delete
                </MenuItem>
              )}
              {userRole !== 'Customer' && (
                <MenuItem onClick={() => {
                  handleOpenEditDialog();
                  handleCloseMenu();
                }}>
                  <Iconify icon={'eva:edit-fill'} />
                  Edit
                </MenuItem>
              )}

              <MenuItem
                onClick={() => {
                  const detailPath = userRole === 'Customer' ? PATH_HOME.orderDetails(id) : PATH_PRODUCTOWNER.eCommerce.orderDetails(id);
                  navigate(detailPath);
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:eye-outline'} />
                Details
              </MenuItem>

            </>
          }
        />
      </TableCell>
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        PaperProps={{
          style: { borderRadius: 8 }
        }}
      >
        <DialogTitle>{"Edit Status"}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update the status of the order.
          </DialogContentText>
          <StyledSelect
            value={newStatus}
            onChange={(event) => setNewStatus(event.target.value)}
            displayEmpty
            fullWidth
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="CONFIRMED">Confirmed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
            <MenuItem value="DELIVERED">Delivered</MenuItem>
          </StyledSelect>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEditDialog} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </TableRow>
  );
}


function StatusLabel({ status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'DELIVERED':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Label color={getStatusColor(status)} sx={{ textTransform: 'capitalize' }}>
      {status.toLowerCase()}
    </Label>
  );
}
