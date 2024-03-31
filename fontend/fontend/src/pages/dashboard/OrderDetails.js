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

// ----------------------------------------------------------------------

export default function OrderDetails() {
  const { themeStretch } = useSettings();

  const { id } = useParams();

  const invoice = _invoices.find((invoice) => invoice.id === id);

  const [orderArr, setOrder] = useState();

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
    <Page title="Invoice: View">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Invoice Details"
          links={[
            { name: 'Dashboard', href: PATH_PRODUCTOWNER.root },
            {
              name: 'Order',
              href: PATH_PRODUCTOWNER.eCommerce.order,
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
