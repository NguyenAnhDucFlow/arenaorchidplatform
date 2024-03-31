import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Button, CardContent, Typography } from '@mui/material';
import axios from '../../../../utils/axios';
// components
import Image from '../../../../components/Image';
import { CarouselDots } from '../../../../components/carousel';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

// ----------------------------------------------------------------------

export default function EcommerceNewProducts() {
  const theme = useTheme();

  const settings = {
    speed: 1000,
    dots: true,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselDots({ position: 'absolute', right: 24, bottom: 24 }),
  };

  const [productArr, setProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/product/findTop5NewProducts/');
        setProduct(response.data.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, [])

  return (
    <Card>
      <Slider {...settings}>
        {productArr.map((item) => (
          <CarouselItem key={item.name} item={item} />
        ))}
      </Slider>
    </Card>
  );
}

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
  }),
};

function CarouselItem({ item }) {
  const { cover, name } = item;

  console.log("item ", item);

  return (
    <Box sx={{ position: 'relative' }}>
      <CardContent
        sx={{
          left: 0,
          bottom: 0,
          zIndex: 9,
          maxWidth: '80%',
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <Typography variant="overline" sx={{ opacity: 0.48 }}>
          New
        </Typography>
        <Typography noWrap variant="h5" sx={{ mt: 1, mb: 3 }}>
          {name}
        </Typography>
        <Button to="#" variant="contained" component={RouterLink}>
          Buy Now
        </Button>
      </CardContent>
      <OverlayStyle />
      <Image alt={name} src={cover} sx={{ height: { xs: 280, xl: 320 } }} />
    </Box>
  );
}
