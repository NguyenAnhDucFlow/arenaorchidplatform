import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Typography,
  useTheme,
  styled,
  alpha,
  ListItemIcon,
} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import UpdateIcon from '@mui/icons-material/Update';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const getStatusIcon = (status) => {
  switch (status) {
    case 'CONFIRMED':
      return <CheckCircleOutlineIcon style={{ color: 'green' }} />;
    case 'CANCELLED':
      return <HighlightOffIcon style={{ color: 'red' }} />;
    case 'DELIVERED':
      return <LocalShippingIcon style={{ color: 'blue' }} />;
    case 'PENDING':
    default:
      return <HourglassEmptyIcon style={{ color: 'orange' }} />;
  }
};

const getStatusText = (status) => {
  if (typeof status !== 'string') {
    return ''; // or any default value you prefer
  }
  return (
    <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}>
      {status}
    </Typography>
  );
};



const SimpleHistoryItem = ({ status, date }) => (
  <ListItem>
    <ListItemIcon>
      {getStatusIcon(status)}
    </ListItemIcon>
    <ListItemText
      primary={<><span>Status Updated - </span>{getStatusText(status)}</>}
      secondary={new Date(date).toLocaleString()}
    />
  </ListItem>
);

// Enhanced SectionBox with a subtle background gradient
const SectionBox = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  boxShadow: theme.shadows[1],
  borderRadius: theme.shape.borderRadius,
  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.85)}, ${alpha(theme.palette.background.default, 0.9)})`,
  borderLeft: `6px solid ${theme.palette.primary.main}`,
}));

// Customizing the OrderItem to include interactive effects
const OrderItem = ({ detail }) => {
  const theme = useTheme();
  return (
    <SectionBox>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Avatar
            src={detail.product.cover}
            variant="rounded"
            sx={{
              width: 56,
              height: 56,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
            {detail.product.name}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: theme.palette.success.main }}>
            <Box component="span" sx={{ display: 'inline-flex', mr: 1 }}>
              <CreditCardIcon fontSize="small" />
            </Box>
            Quantity: {detail.quantity}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: theme.palette.error.main }}>
            <Box component="span" sx={{ display: 'inline-flex', mr: 1 }}>
              <PaymentIcon fontSize="small" />
            </Box>
            Price: ${detail.price.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </SectionBox>
  );
};

// Integrating icons in CustomerInfo for better visual engagement
const CustomerInfo = ({ customer }) => (
  <SectionBox>
    <Typography variant="h6" gutterBottom>
      Customer Info
    </Typography>
    <Box display="flex" alignItems="center">
      <Avatar src={customer.photoURL} sx={{ width: 56, height: 56, mr: 2 }} />
      <Box>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 1 }} fontSize="small" />
          {customer.displayName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
          <EmailIcon sx={{ mr: 1 }} fontSize="small" />
          {customer.email}
        </Typography>
      </Box>
    </Box>
  </SectionBox>
);

// Refining ShippingInfo with icons and layout adjustments
const ShippingInfo = ({ shipment }) => (
  <SectionBox>
    <Typography variant="h6" gutterBottom>
      Shipping
    </Typography>
    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
      <HomeIcon sx={{ mr: 1 }} fontSize="small" />
      Address: {shipment.address}
    </Typography>
    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
      <PhoneIcon sx={{ mr: 1 }} fontSize="small" />
      Phone number: {shipment.phone}
    </Typography>
  </SectionBox>
);

// Enhancing PaymentInfo with an icon and better alignment
const PaymentInfo = ({ paymentOption }) => (
  <SectionBox>
    <Typography variant="h6" gutterBottom>
      Payment
    </Typography>
    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
      <CreditCardIcon sx={{ mr: 1 }} fontSize="small" />
      Payment method: {paymentOption}
    </Typography>
  </SectionBox>
);

const SimpleHistory = ({ createdAt, updatedAt, status }) => {
  const statusIcon = getStatusIcon(status);
  return (
    <SectionBox>
      <Typography variant="h6" gutterBottom>
        Order History
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <AssignmentTurnedInIcon />
          </ListItemIcon>
          <ListItemText
            primary="Order Created"
            secondary={new Date(createdAt).toLocaleString()}
          />
        </ListItem>
        {(updatedAt && updatedAt !== createdAt) && (
          <SimpleHistoryItem status={status} date={updatedAt} />
        )}
      </List>
    </SectionBox>
  );
};


// Main OrderDetails component with updated children components
const OrderDetails = ({ order }) => {
  const navigate = useNavigate();
  const { customer, orderDetails, shipment, deliveryOption, paymentOption, total, subtotal, shipping } = order;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box p={3} component={Paper} elevation={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              {orderDetails.map((detail, index) => (
                <OrderItem key={index} detail={detail} />
              ))}
              <SectionBox>
                <Typography variant="h6" gutterBottom textAlign="right">
                  Summary
                </Typography>
                <Typography variant="subtitle1" textAlign="right">
                  Subtotal: ${subtotal.toFixed(2)}
                </Typography>
                <Typography variant="subtitle1" textAlign="right">
                  Shipping: {shipping.toFixed(2)}
                </Typography>
                <Typography variant="h6" textAlign="right" color="error">
                  Total: ${total.toFixed(2)}
                </Typography>
              </SectionBox>
              <SimpleHistory
                createdAt={order.createdAt}
                updatedAt={order.updatedAt}
                status={order.status}
              />
              <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
                Back
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <CustomerInfo customer={customer} />
              <SectionBox>
                <Typography variant="h6" gutterBottom>Delivery</Typography>
                <Chip label={deliveryOption} icon={<LocalShippingIcon />} color="primary" />
              </SectionBox>
              <ShippingInfo shipment={shipment} />
              <PaymentInfo paymentOption={paymentOption} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails;
