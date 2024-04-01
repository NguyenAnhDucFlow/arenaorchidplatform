import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Tab,
  Card,
  Grid,
  Divider,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { onGotoStep, getProductById, getAuction } from '../../redux/slices/product';
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
import Avatar from '../../components/Avatar';
import createAvatar from '../../utils/createAvatar';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function EcommerceAuctionDetails() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [tab, setTab] = useState('bid_rating');
  const { auctionId = '', productId = '' } = useParams();
  const { product, auction, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProductById(productId));

    // fetch auction details every 1 seconds
    const interval = setInterval(() => {
      dispatch(getAuction(auctionId));
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, auctionId, productId]);

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  return (
    <Page title="Auction Details">
      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ paddingTop: 15, paddingBottom: 10 }}>
        <HeaderBreadcrumbs
          heading="Auction Details"
          links={[
            { name: 'Home', href: PATH_HOME.root },
            {
              name: 'Auction',
              href: PATH_HOME.auction,
            },
            { name: auctionId },
          ]}
        />

        <CartWidget />

        {product && auction ? (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <ProductDetailsCarousel product={product} />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <AuctionDetailsSummary product={product} auction={auction} />
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
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>No.</TableCell>
                          <TableCell align="left">User</TableCell>
                          <TableCell align="center">Bid amount</TableCell>
                          <TableCell align="right">Updated at</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {auction.bids
                          .slice()
                          .sort((a, b) => {
                            console.log(a, b);
                            // sort by amount desc and updatedAt asc
                            if (a.amount > b.amount) return -1;
                            if (a.amount < b.amount) return 1;
                            return new Date(a.updatedAt).getTime() < new Date(b.updatedAt).getTime() ? -1 : 1;
                          })
                          .map((row, idx) => (
                            <TableRow key={row.id}>
                              <TableCell scope="row">
                                <Typography variant="subtitle1" color="black">
                                  {idx + 1}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Stack direction="row" gap={1} alignItems="center">
                                  <Avatar
                                    src={row.user.photoURL}
                                    alt={row.user.displayName}
                                    color={row.user.photoURL ? 'default' : createAvatar(row.user.displayName).color}
                                  >
                                    {createAvatar(row.user.displayName).name}
                                  </Avatar>
                                  <Typography variant="subtitle2">
                                    {row.user.displayName}{' '}
                                    {row.user.id === user?.id && <span style={{ color: 'red' }}>(you)</span>}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="center">
                                <Typography color="red" variant="subtitle2">
                                  ${row.amount}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">{new Date(row.createdAt).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
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
        ) : (
          <div>Loading...</div>
        )}

        {!product && <SkeletonProduct />}

        {error && <Typography variant="h6">404 Product not found</Typography>}
      </Container>
    </Page>
  );
}
