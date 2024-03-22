import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { m } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';

// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Card, Typography, Container, Grid, Button } from '@mui/material';
// components
import { useEffect, useRef } from 'react';
import Page from '../components/Page';
// sections
import { HomeHero } from '../sections/home';
import { CarouselArrows } from '../components/carousel';
import { MotionViewport, varFade } from '../components/animate';
import Image from '../components/Image';
import SocialsButton from '../components/SocialsButton';
import { ShopProductCard } from '../sections/@dashboard/e-commerce/shop';
import { getAuctions, getProductsPageable } from '../redux/slices/product';
import { AuctionCard } from '../sections/@dashboard/e-commerce/auction';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function HomePage() {
  const theme = useTheme();
  const products = useSelector((state) => state.product.products);
  const auctions = useSelector((state) => state.product.auctions);
  const isLastPage = useSelector((state) => state.product.isLastPage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductsPageable());
    dispatch(getAuctions());
  }, [dispatch]);

  console.log('products', products);
  console.log('auctions', auctions);

  const settings = {
    arrows: false,
    slidesToShow: 4,
    centerMode: true,
    centerPadding: '0px',
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: 1279,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 959,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const carouselRef2 = useRef(null);

  const handlePrevious2 = () => {
    carouselRef2.current?.slickPrev();
  };

  const handleNext2 = () => {
    carouselRef2.current?.slickNext();
  };

  const handleClickGetMore = () => {
    dispatch(getProductsPageable(products.length / 4));
  };

  return (
    <Page title="OrchidArena">
      <RootStyle>
        <HomeHero />
        <ContentStyle>
          <Container component={MotionViewport} sx={{ pb: 10, textAlign: 'center', marginTop: '30px' }}>
            <m.div variants={varFade().inUp}>
              <Typography variant="h3" sx={{ mb: 3 }}>
                Latest Auctions
              </Typography>
            </m.div>

            {auctions && auctions.length > 0 ? (
              <Box maxWidth="lg" position="relative" m="auto">
                <CarouselArrows filled onNext={handleNext2} onPrevious={handlePrevious2}>
                  <Slider ref={carouselRef2} {...settings}>
                    {auctions.map((auction) => (
                      <Box key={auction.id} sx={{ px: 1.5 }}>
                        <AuctionCard key={auction.id} auction={auction} />
                      </Box>
                    ))}
                  </Slider>
                </CarouselArrows>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ mb: 3 }}>
                No auctions available
              </Typography>
            )}

            <m.div variants={varFade().inUp}>
              <Typography variant="h4" sx={{ mb: 3, textAlign: 'start', mt: 10 }}>
                Discover our latest blossoms
              </Typography>
            </m.div>

            <Box maxWidth="lg" position="relative" m="auto">
              <Grid container spacing={2}>
                {(products || []).map((product) => (
                  <Grid item xs={6} md={3} key={product.id} sx={{ px: 1.5, py: 1 }}>
                    <ShopProductCard key={product.id} product={product} />
                  </Grid>
                ))}
              </Grid>
              {!isLastPage ? (
                <Button
                  color="inherit"
                  variant="outlined"
                  sx={{ margin: 'auto', marginTop: 3, display: 'block' }}
                  onClick={handleClickGetMore}
                >
                  Get more
                </Button>
              ) : (
                <Typography variant="caption" color="gray" sx={{ mb: 3 }}>
                  No more available
                </Typography>
              )}
            </Box>
          </Container>
        </ContentStyle>
      </RootStyle>
    </Page>
  );
}

MemberCard.propTypes = {
  member: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
  }),
};

function MemberCard({ member }) {
  const { name, role, avatar } = member;

  return (
    <Card key={name} sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 0.5 }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        {role}
      </Typography>
      <Image alt={name} src={avatar} ratio="1/1" sx={{ borderRadius: 1.5 }} />
      <Stack alignItems="center" sx={{ mt: 2, mb: 1 }}>
        <SocialsButton sx={{ color: 'action.active' }} />
      </Stack>
    </Card>
  );
}
