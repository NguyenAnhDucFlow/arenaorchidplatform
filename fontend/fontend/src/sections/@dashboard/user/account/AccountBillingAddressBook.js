import PropTypes from 'prop-types';
// @mui
import { Box, Card, Button, Typography, Stack, Divider } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

AccountBillingAddressBook.propTypes = {
  addressBook: PropTypes.array.isRequired,
};

export default function AccountBillingAddressBook({ addressBook }) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3} alignItems="flex-start">
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Address
        </Typography>

        {addressBook.map((address) => (
          <Box
            key={address.id}
            sx={{
              p: 3,
              width: 1,
              bgcolor: 'background.neutral',
              borderRadius: 1,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">
                {address.receiver} ({address.addressType})
              </Typography>
              {address.isDefault && (
                <Button variant="contained" size="small">
                  Default
                </Button>
              )}
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" gutterBottom>
              {address.address}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {address.city}, {address.state} {address.zipcode}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {address.country}
            </Typography>
            <Typography variant="body2">
              <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                Phone:
              </Typography>
              {address.phone}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
