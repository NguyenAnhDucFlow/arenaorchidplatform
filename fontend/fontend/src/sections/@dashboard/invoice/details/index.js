import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';

const OrderDetails = ({ order }) => {
  const theme = useTheme();

  const {
    customer,
    orderDetails,
    shipment,
    deliveryOption,
    paymentOption,
    status,
    total,
    date,
  } = order;

  return (
    <Box p={3} component={Paper} elevation={3}>
      <Grid container spacing={3}>
        {/* Left Column for Product Details and History */}
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Order Details</Typography>
              {orderDetails.map((detail, index) => (
                <Box key={index} mb={2}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Avatar src={detail.product.cover} variant="square" sx={{ width: 56, height: 56 }} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle1">{detail.product.name}</Typography>
                      <Typography variant="body2">Quantity: {detail.quantity}</Typography>
                      <Typography variant="body2">Price: ${detail.price.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                        ${(detail.price * detail.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                  {index < orderDetails.length - 1 && <Divider />}
                </Box>
              ))}
              <Box mt={2} display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Subtotal</Typography>
                <Typography variant="subtitle1">${total.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Shipping</Typography>
                <Typography variant="subtitle1">{shipment.cost >= 0 ? `+${shipment.cost.toFixed(2)}` : `-${Math.abs(shipment.cost).toFixed(2)}`}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Discount</Typography>
                <Typography variant="subtitle1">-$10.00</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Taxes</Typography>
                <Typography variant="subtitle1">$10.00</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${total.toFixed(2)}</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>History</Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Delivery successful" secondary="31 Mar 2024 4:31 PM" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocalShippingIcon />
                  </ListItemIcon>
                  <ListItemText primary="Transporting" secondary="30 Mar 2024 3:31 PM" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column for Customer Info, Delivery, Shipping, Payment */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Customer Info</Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar src={customer.photoURL} sx={{ width: 56, height: 56, mr: 2 }} />
                <Typography variant="subtitle1">{customer.displayName}</Typography>
              </Box>
              <Typography variant="body2">{customer.email}</Typography>
              <Button variant="contained" color="error" size="small" sx={{ my: 2 }}>
                Add to Blacklist
              </Button>

              <Typography variant="h6" gutterBottom>Delivery</Typography>
              <Chip label={deliveryOption} icon={<LocalShippingIcon />} color="primary" sx={{ mb: 2 }} />
              <Typography variant="body2">Ship by: DHL</Typography>
              <Typography variant="body2">Tracking No.: SPX037739199373</Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Shipping</Typography>
              <Typography variant="body2">{shipment.address}</Typography>
              <Typography variant="body2">{shipment.city}, {shipment.state} {shipment.zipcode}</Typography>
              <Typography variant="body2">{shipment.country}</Typography>
              <Typography variant="body2">Phone number: {shipment.phone}</Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Payment</Typography>
              <Typography variant="body2">Payment method: {paymentOption}</Typography>
              <Chip label="Paid" icon={<PaymentIcon />} color="success" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails;
