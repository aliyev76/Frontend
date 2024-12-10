import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TablePagination,
  TableSortLabel,
  Box,
  LinearProgress,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { getProducts } from '../../../../api/product'; // API function for fetching products

const UserTables = ({ userRole, userId }) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pass userRole and userId to fetch the correct data
        const data = await getProducts(userRole, userId);
        setRows(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort by newest
        setFilteredRows(data);
      } catch (error) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userRole, userId]);

  // Reset page if it goes out of range
  useEffect(() => {
    if (page > Math.ceil(filteredRows.length / rowsPerPage) - 1) {
      setPage(0); // Reset to first page
    }
  }, [filteredRows, rowsPerPage, page]);

  const handleFilter = (category) => {
    setFilter(category);
    if (category === 'all') {
      setFilteredRows(rows);
    } else {
      setFilteredRows(rows.filter((row) => row.category === category));
    }
    setAnchorEl(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getProgress = (row) => {
    if (row.isFinished) return 100;
    if (row.isWorkingOn) return 80;
    if (row.isApproved) return 50;
    if (row.isOrder) return 25;
    return 0;
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(() => {
    return filteredRows
      .sort((a, b) => (order === 'desc' ? b[orderBy] - a[orderBy] : a[orderBy] - b[orderBy]))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredRows, order, orderBy, page, rowsPerPage]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: '10px' }}>
          Loading products...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
        <Typography variant="h6">{error}</Typography>
      </div>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Product List
        </Typography>
        <Button
          variant="outlined"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{ textTransform: 'none' }}
        >
          Filter: {filter}
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => handleFilter('all')}>All</MenuItem>
          <MenuItem onClick={() => handleFilter('prime')}>Prime</MenuItem>
          <MenuItem onClick={() => handleFilter('prop')}>Prop</MenuItem>
        </Menu>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Oligo Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Scale</TableCell>
            <TableCell>5' Modification</TableCell>
            <TableCell>3' Modification</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Progress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.oligoAdi}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.scale}</TableCell>
              <TableCell>{row.modifications?.fivePrime || 'N/A'}</TableCell>
              <TableCell>{row.modifications?.threePrime || 'N/A'}</TableCell>
              <TableCell>{row.isFinished ? 'Finished' : row.isWorkingOn ? 'In Progress' : row.isApproved ? 'Approved' : 'Ordered'}</TableCell>
              <TableCell>
                <LinearProgress variant="determinate" value={getProgress(row)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default UserTables;

