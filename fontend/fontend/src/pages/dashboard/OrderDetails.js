import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_PRODUCTOWNER } from '../../routes/paths';
// _mock_
import { _invoices } from '../../_mock';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import OrderDetail from '../../sections/@dashboard/invoice/details';
import axios from '../../utils/axios';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function OrderDetails() {
  const { themeStretch } = useSettings();

  const { id } = useParams();

  const invoice = _invoices.find((invoice) => invoice.id === id);

  const [orderArr, setOrder] = useState();

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/order/${id}`);
        console.log("orderrrsssssssssssr", response.data.data);
        setOrder(response.data.data)
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }
    fetchData();
  }, [])

  return (
    <Page title="Order details">
      <Container maxWidth={themeStretch ? false : 'lg'}
        sx={{ ...(user.role.name === 'Customer' ? { marginBlockStart: 15 } : {}) }}
      >
        <HeaderBreadcrumbs
          heading="Invoice Details"
          links={[
            { name: 'Home', href: '/' },
            {
              name: 'Order',
              href: '/order'
            },
            { name: 'Order Details' },
          ]}
        />
        {
          orderArr && <OrderDetail order={orderArr} />
        }

      </Container>
    </Page>
  );
}
