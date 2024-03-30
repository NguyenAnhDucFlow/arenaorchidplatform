import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
//
import ShopProductCard from './ShopProductCard';
import { AuctionCard } from '../auction';

// ----------------------------------------------------------------------

ShopProductList.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  isAuctions: PropTypes.bool
};

export default function ShopProductList({ products, loading, isAuctions }) {

  const aaaaa = (product) => {
    return isAuctions ? <AuctionCard key={product.id} auction={product} /> : <ShopProductCard key={product.id} product={product} />
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {(loading ? [...Array(12)] : products).map((product, index) =>
        product ? aaaaa(product) : <SkeletonProductItem key={index} />
      )}
    </Box>
  );
}
