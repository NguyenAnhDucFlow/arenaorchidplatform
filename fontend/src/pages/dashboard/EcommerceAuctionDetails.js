import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { Box, Tab, Card, Grid, Divider, Container, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { addCart, onGotoStep, getProductById } from '../../redux/slices/product';
// routes
import { PATH_HOME } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Markdown from '../../components/Markdown';
import { SkeletonProduct } from '../../components/skeleton';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { ProductDetailsReview, ProductDetailsCarousel } from '../../sections/@dashboard/e-commerce/product-details';
import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';
import AuctionDetailsSummary from '../../sections/@dashboard/e-commerce/auction/AuctionDetailsSummary';

// ----------------------------------------------------------------------

export default function EcommerceAuctionDetails() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [tab, setTab] = useState('bid_rating');
  const { id = '' } = useParams();
  const { product, error, checkout } = useSelector((state) => state.product);

  useEffect(() => {
    // fetch product every 2 seconds
    const interval = setInterval(() => {
      dispatch(getProductById(id));
    }, 2000);

    return () => clearInterval(interval);
  }, [dispatch, id]);

  const handleAddCart = (product) => {
    dispatch(addCart(product));
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  return (
    <Page title="Product Details">
      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ paddingTop: 15, paddingBottom: 10 }}>
        <HeaderBreadcrumbs
          heading="Product Details"
          links={[
            { name: 'Home', href: PATH_HOME.root },
            {
              name: 'Auction',
              href: PATH_HOME.auction,
            },
            { id },
          ]}
        />

        <CartWidget />

        {product && (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <ProductDetailsCarousel product={product} />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <AuctionDetailsSummary product={product} />
                </Grid>
              </Grid>
            </Card>

            <Card sx={{ my: 8 }}>
              <TabContext value={tab}>
                <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
                  <TabList onChange={(e, value) => setTab(value)}>
                    <Tab disableRipple value="bid_rating" label="Bid rating" />
                    <Tab disableRipple value="description" label="Description" />
                    <Tab
                      disableRipple
                      value="review"
                      label={`Review (${product.reviews.length})`}
                      sx={{ '& .MuiTab-wrapper': { whiteSpace: 'nowrap' } }}
                    />
                  </TabList>
                </Box>

                <Divider />

                <TabPanel value="bid_rating">
                  <Box sx={{ p: 3 }}>
                    <Markdown children={product.description} />
                  </Box>
                </TabPanel>
                <TabPanel value="description">
                  <Box sx={{ p: 3 }}>
                    <Markdown children={product.description} />
                  </Box>
                </TabPanel>
                <TabPanel value="review">
                  <ProductDetailsReview product={product} />
                </TabPanel>
              </TabContext>
            </Card>
          </>
        )}

        {!product && <SkeletonProduct />}

        {error && <Typography variant="h6">404 Product not found</Typography>}
      </Container>
    </Page>
  );
}
