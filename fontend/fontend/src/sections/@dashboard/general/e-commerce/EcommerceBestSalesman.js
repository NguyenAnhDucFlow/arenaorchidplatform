// @mui
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import {
  Box,
  Card,
  Table,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  Typography,
  TableContainer,
} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// _mock_
import { _ecommerceBestSalesman } from '../../../../_mock';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Scrollbar from '../../../../components/Scrollbar';
import axios from '../../../../utils/axios';

// ----------------------------------------------------------------------

export default function EcommerceBestSalesman() {
  const theme = useTheme();
  const [bestSalesmen, setBestSalesmen] = useState([]);

  useEffect(() => {
    const fetchBestSalesmen = async () => {
      try {
        const response = await axios.get('/order-detail/top-sellers'); 
        setBestSalesmen(response.data.data);
      } catch (error) {
        console.error("Error fetching best salesmen:", error);
      }
    };

    fetchBestSalesmen();
  }, []);

  return (
    <Card>
      <CardHeader title="Best Salesman" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Seller</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="right">Rank</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bestSalesmen.map((row) => (
                <TableRow key={row.id}> {/* Make sure 'row.id' is unique */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar alt={row.name} src={row.avatar} />
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle2">{row.name}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {row.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{fCurrency(row.totalSales)}</TableCell>
                  <TableCell align="right">
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={
                        (row.rank === 'Top 1' && 'primary') ||
                        (row.rank === 'Top 2' && 'info') ||
                        (row.rank === 'Top 3' && 'success') ||
                        (row.rank === 'Top 4' && 'warning') ||
                        'error'
                      }
                    >
                      {`Top ${row.rank}`}
                    </Label>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}
