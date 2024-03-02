import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { m } from 'framer-motion';
import { useSelector } from 'react-redux';

// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Card, Typography, Container } from '@mui/material';
// components
import { useRef } from 'react';
import Page from '../components/Page';
// sections
import { HomeHero, HomeColorPresets } from '../sections/home';
import { CarouselArrows } from '../components/carousel';
import { _carouselsProducts } from '../_mock';
import { MotionViewport, varFade } from '../components/animate';
import Image from '../components/Image';
import SocialsButton from '../components/SocialsButton';
import { ShopProductCard } from '../sections/@dashboard/e-commerce/shop';

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
  const carouselRef = useRef(null);
  const theme = useTheme();
  const products = useSelector((state) => state.product.products);

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

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };
  return (
    <Page title="OrchidArena">
      <RootStyle>
        <HomeHero />
        <ContentStyle>
          <Container component={MotionViewport} sx={{ pb: 10, textAlign: 'center', marginTop: '30px' }}>

            <m.div variants={varFade().inUp}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                Discover our latest blossoms
              </Typography>
            </m.div>

            <Box maxWidth="lg" position="relative" m="auto">
              <CarouselArrows filled onNext={handleNext} onPrevious={handlePrevious}>
                <Slider ref={carouselRef} {...settings}>
                  {products.map((product) => ( // Sử dụng dữ liệu từ Redux
                    <Box key={product.id} component={m.div} variants={varFade().in} sx={{ px: 1.5, py: 10 }}>
                      <ShopProductCard key={product.id} product={product} />
                    </Box>
                  ))}
                </Slider>
              </CarouselArrows>
            </Box>

          </Container>
          <HomeColorPresets />
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
