import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Link, Card, CardHeader, Typography, Stack } from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import Image from '../../../../components/Image';
import Scrollbar from '../../../../components/Scrollbar';
import axios from '../../../../utils/axios';

// ----------------------------------------------------------------------

export default function EcommerceLatestProducts() {

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
      <CardHeader title="Latest Products" />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {productArr.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

ProductItem.propTypes = {
  product: PropTypes.shape({
    colors: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    priceSale: PropTypes.number,
  }),
};

function ProductItem({ product }) {
  const { name, images, price, priceSale } = product;
  const hasSale = priceSale > 0;
  console.log("first", product)

  return (
    <Stack direction="row" spacing={2}>
      <Image alt={name} src={images} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />

      <Box sx={{ flexGrow: 1, minWidth: 200 }}>
        <Link component={RouterLink} to="#" sx={{ color: 'text.primary', typography: 'subtitle2' }}>
          {name}
        </Link>

        <Stack direction="row">
          {hasSale && (
            <Typography variant="body2" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
              {fCurrency(priceSale)}
            </Typography>
          )}
          &nbsp;
          <Typography variant="body2" sx={{ color: priceSale ? 'error.main' : 'text.secondary' }}>
            {fCurrency(price)}
          </Typography>
        </Stack>
      </Box>

    </Stack>
  );
}
