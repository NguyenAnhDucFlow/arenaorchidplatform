import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { Box, Grid, Card, Button, Typography, Stack } from '@mui/material';
//
import AccountBillingAddressBook from './AccountBillingAddressBook';
import AccountBillingPaymentMethod from './AccountBillingPaymentMethod';
import AccountBillingInvoiceHistory from './AccountBillingInvoiceHistory';
// axios
import axios from '../../../../utils/axios';

// ----------------------------------------------------------------------

AccountBilling.propTypes = {
  cards: PropTypes.array,
  invoices: PropTypes.array,
};

export default function AccountBilling({ cards, invoices }) {
  const [open, setOpen] = useState(false);
  const [addressBook, setAddressBook] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.post('http://localhost:8080/shipment/search', {
        keyword: "",
        currentPage: 0,
        size: 20,
        sortedField: ""
      });

      setAddressBook(result.data.data.contents);
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <AccountBillingAddressBook addressBook={addressBook} />
        </Stack>
      </Grid>
    </Grid>
  );
}
