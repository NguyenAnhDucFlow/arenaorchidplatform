import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Box,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const OrderDetails = ({ order }) => {

  console.log("ssssss", order)
  const { customer } = order

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Details Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Details"
            />
            <CardContent>
              {/* Product Details, History, etc. would go here */}
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Info, Delivery, Shipping, Payment */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Customer Info"

            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={customer.photoURL}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={customer.displayName}
                    secondary={customer.email}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText
                    primary="Phone Number"
                    secondary={customer.phoneNumber}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Address"
                    secondary={`${customer.address}, ${customer.city}, ${customer.state}, ${customer.country}, ZIP: ${customer.zipCode}`}
                  />
                </ListItem>
                {/* Add more customer details if needed */}
              </List>
            </CardContent>
          </Card>
          <Box mt={3}>
            <Card>
              <CardHeader
                title="Delivery"

              />
              <CardContent>
                {/* Delivery fields */}
              </CardContent>
            </Card>
          </Box>
          <Box mt={3}>
            <Card>
              <CardHeader
                title="Shipping"

              />
              <CardContent>
                {/* Shipping fields */}
              </CardContent>
            </Card>
          </Box>
          <Box mt={3}>
            <Card>
              <CardHeader
                title="Payment"

              />
              <CardContent>
                {/* Payment fields */}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails;
