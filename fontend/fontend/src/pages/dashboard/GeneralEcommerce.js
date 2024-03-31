// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
import { Navigate } from 'react-router';

// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import {
  EcommerceWelcome,
  EcommerceNewProducts,
  EcommerceBestSalesman,
  EcommerceLatestProducts,
} from '../../sections/@dashboard/general/e-commerce';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function GeneralEcommerce() {

  const { user } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();
  
  if ( user.role.name === 'Customer') {
    return <Navigate  to={"/seller/account"} />
  }

  return (
    <Page title="General: E-commerce">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <EcommerceWelcome />
          </Grid>

          <Grid item xs={12} md={4}>
            <EcommerceNewProducts />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <EcommerceBestSalesman />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <EcommerceLatestProducts />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
