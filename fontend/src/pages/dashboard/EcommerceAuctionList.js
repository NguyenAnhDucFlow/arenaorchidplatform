import { useState, useEffect } from 'react';
// @mui
import {
  Box,
  Card,
  Table,
  Switch,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  DialogTitle,
} from '@mui/material';
import { useSnackbar } from 'notistack';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { deleteAuction, deleteAuctions, getAuctionsTable } from '../../redux/slices/product';
// routes
import { PATH_PRODUCTOWNER } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedActions,
} from '../../components/table';
// sections
import { ProductTableToolbar } from '../../sections/@dashboard/e-commerce/product-list';
import AuctionTableRow from '../../sections/@dashboard/e-commerce/auction/AuctionTableRow';
import { DialogAnimate } from '../../components/animate';
import AuctionEditForm from '../../sections/@dashboard/e-commerce/auction/AuctionEditForm';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Product', align: 'left' },
  { id: 'startDate', label: 'Start date', align: 'left' },
  { id: 'endDate', label: 'End date', align: 'left' },
  { id: 'currentPrice', label: 'Current price', align: 'center' },
  { id: 'status', label: 'Review', align: 'center', width: 180 },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function EcommerceAuctionList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { auctions, isLoading } = useSelector((state) => state.product);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [isOpenModal, setOpenModal] = useState(false);

  const [selectedAuction, setSelectedAuction] = useState(null);

  useEffect(() => {
    dispatch(getAuctionsTable(filterName, page, rowsPerPage, orderBy));
  }, [dispatch, filterName, page, rowsPerPage, orderBy]);

  useEffect(() => {
    if (auctions.length) {
      setTableData(auctions);
    }
  }, [auctions]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
    enqueueSnackbar('Delete success!');
    dispatch(deleteAuction(id));
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
    enqueueSnackbar('Delete success!');
    dispatch(deleteAuctions(selected.map((id) => id)));
  };

  const handleEditRow = (auction) => {
    setSelectedAuction(auction);
    setOpenModal(true);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  console.log(selectedAuction);

  return (
    <Page title="Ecommerce: Product List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Auction List"
          links={[
            { name: 'Dashboard', href: PATH_PRODUCTOWNER.root },
            {
              name: 'E-Commerce',
              href: PATH_PRODUCTOWNER.eCommerce.root,
            },
            { name: 'Auction List' },
          ]}
        />

        <Card>
          <ProductTableToolbar filterName={filterName} onFilterName={handleFilterName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered).map((row, index) =>
                    row ? (
                      <AuctionTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row)}
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
        <DialogAnimate open={isOpenModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Auction detail</DialogTitle>

          <AuctionEditForm
            auction={selectedAuction || {}}
            onCancel={() => setOpenModal(false)}
            refetchTable={async () => dispatch(getAuctionsTable(filterName, page, rowsPerPage, orderBy))}
          />
        </DialogAnimate>
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
