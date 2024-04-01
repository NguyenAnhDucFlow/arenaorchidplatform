import PropTypes from 'prop-types';
// @mui
import { Box, Card, Button, Typography, Stack, Paper } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

AccountBillingAddressBook.propTypes = {
  addressBook: PropTypes.array,
};

export default function AccountBillingAddressBook({ addressBook }) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3} alignItems="flex-start">
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Billing Info
        </Typography>

        {addressBook.map((address) => (
          <Paper
            key={address.id}
            sx={{
              p: 3,
              width: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              {address.receiver}
            </Typography>

            <Typography variant="body2" gutterBottom>
              <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                Phone: 
              </Typography>
              {address.phone}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Card>
  );
}
