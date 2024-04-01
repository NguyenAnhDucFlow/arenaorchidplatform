import { useState, useEffect } from 'react';
// @mui
import {
  Box,
  Card,
  Table,
  Switch,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMatch, useNavigate } from 'react-router';

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { AUCTION_CHECKOUT_INFO, addAuctionCart, cancelBid, getBidsByUserId, onAuctionGotoStep } from '../../redux/slices/product';
// routes
import { PATH_HOME, PATH_PRODUCTOWNER } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom } from '../../components/table';
// sections
import { ProductTableToolbar } from '../../sections/@dashboard/e-commerce/product-list';
import useAuth from '../../hooks/useAuth';
import BidTableRow from '../../sections/@dashboard/e-commerce/auction/BidTableRow';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Auction Id', align: 'center' },
  { id: 'name', label: 'Product', align: 'left' },
  { id: 'updatedAt', label: 'Bid date', align: 'left' },
  { id: 'amount', label: 'Your bid', align: 'center' },
  { id: 'winner', label: 'Winning user', align: 'center' },
  { id: 'status', label: 'Status', align: 'center', width: 180 },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function EcommerceBidList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const customerMatch = useMatch('/bid');
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.product);
  const { bids, highestBids } = useSelector((state) => state.product.bidList);
  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    if (user?.id) {
      dispatch(getBidsByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (bids.length) {
      setTableData(bids);
    }
  }, [bids]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleCancelRow = async (bidId) => {
    await dispatch(cancelBid(bidId));
    await dispatch(getBidsByUserId(user.id));
    enqueueSnackbar('Cancel success!', { variant: 'success' });
  };

  const handleCheckoutRow = async (bid) => {
    if (!bid) return;

    await dispatch(addAuctionCart(bid.auction.product));
    await dispatch(onAuctionGotoStep(0));

    localStorage.setItem(
      AUCTION_CHECKOUT_INFO,
      JSON.stringify({
        auctionId: bid.auction.id,
        amount: bid.amount,
        userId: bid.user.id,
      })
    );

    navigate(PATH_HOME.auctionCheckout);

    // await dispatch(
    //   endAuction(bid.auction.id, {
    //     amount: bid.amount,
    //     userId: bid.user.id,
    //     auctionId: bid.auction.id,
    //   })
    // );
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="Ecommerce: Bid List">
      <Container
        maxWidth={themeStretch ? false : 'lg'}
        sx={{
          marginBlock: customerMatch ? 15 : 0,
        }}
      >
        <HeaderBreadcrumbs
          heading="Bid List"
          links={[
            { name: 'Dashboard', href: PATH_PRODUCTOWNER.root },
            {
              name: 'E-Commerce',
              href: PATH_PRODUCTOWNER.eCommerce.root,
            },
            { name: 'Bid List' },
          ]}
        />

        <Card>
          <ProductTableToolbar filterName={filterName} onFilterName={handleFilterName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  onSort={onSort}
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered).map((row, index) =>
                    row ? (
                      <BidTableRow
                        key={row.id}
                        row={row}
                        winningBid={highestBids.find((highestBid) => highestBid.auction.id === row.auction.id)}
                        onCancelRow={() => handleCancelRow(row.id)}
                        onCheckoutRow={() => handleCheckoutRow(row)}
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
