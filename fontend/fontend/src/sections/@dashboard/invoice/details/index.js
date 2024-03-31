import React from 'react';
import { 
  Card, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider, 
  Box 
} from '@mui/material';

const OrderDetails = () => {
  // Giả định rằng bạn đã có dữ liệu này từ API hoặc state management
  const orderDetails = {
    product: {
      name: 'Nike Air Force 1 NDESTRUKT',
      sku: '16HU9R0',
      quantity: 1,
      price: '83.74',
      imageUrl: '/path/to/image.jpg', // Đường dẫn tới ảnh sản phẩm
    },
    customer: {
      name: 'Lucian Obrien',
      email: 'ashlynn_ohara62@gmail.com',
      ip: '192.158.1.38',
    },
    delivery: {
      shipBy: 'DHL',
      speed: 'Standard',
      trackingNo: 'SPX037739199373',
    },
    shipping: {
      address: '19034 Verna Unions Apt. 164 - Honolulu, RI / 87535',
      phone: '365-374-4961',
    },
    payment: {
      method: 'Credit Card',
      lastFourDigits: '5678',
    },
    history: [
      { status: 'Delivery successful', date: '30 Mar 2024 10:50 AM' },
      // ... các bước khác của lịch sử
    ],
  };

  return (
    <Box display="flex" justifyContent="space-between" p={3}>
      {/* Details */}
      <Card sx={{ maxWidth: 345 }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar alt={orderDetails.product.name} src={orderDetails.product.imageUrl} />
          </ListItemAvatar>
          <ListItemText 
            primary={orderDetails.product.name} 
            secondary={`SKU: ${orderDetails.product.sku}`} 
          />
          <Typography variant="subtitle1">{`x${orderDetails.product.quantity}`}</Typography>
          <Typography variant="subtitle1">{`$${orderDetails.product.price}`}</Typography>
        </ListItem>
        {/* Thêm các chi tiết về giá ở đây */}
      </Card>

      {/* Customer Info */}
      <Card>
        <List>
          <ListItem>
            <ListItemText primary="Customer Info" secondary={orderDetails.customer.name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" secondary={orderDetails.customer.email} />
          </ListItem>
          <ListItem>
            <ListItemText primary="IP Address" secondary={orderDetails.customer.ip} />
          </ListItem>
          {/* Thêm nút "Add to Blacklist" nếu cần */}
        </List>
      </Card>

      {/* History */}
      <Card>
        <List>
          <ListItem>
            <ListItemText primary="History" />
          </ListItem>
          {orderDetails.history.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={item.status} secondary={item.date} />
              </ListItem>
              {index < orderDetails.history.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Card>

      {/* Thêm các phần khác như Delivery, Shipping và Payment tương tự */}
    </Box>
  );
};

export default OrderDetails;
