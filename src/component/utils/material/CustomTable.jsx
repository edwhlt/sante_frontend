import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Popover from '@mui/material/Popover';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';

import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import {useEffect} from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function descendingComparator(a, b, orderByCol) {
  if (orderByCol.getValue(b) < orderByCol.getValue(a)) {
    return -1;
  }
  if (orderByCol.getValue(b) > orderByCol.getValue(a)) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderByCol) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderByCol)
    : (a, b) => -descendingComparator(a, b, orderByCol);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function TableHeadCustom(props) {
  const { order, orderBy, onRequestSort, headCells } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            style={headCell.style}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable && (
                <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell)}
                >
                {headCell.label}
                {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                ) : null}
                </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TableHeadCustom.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const TableHeadTools = (props) => {
  const { title, headActions, headCells, onFilter } = props;
  
  const [anchorFilter, setAnchorFilter] = React.useState(null);
  const [colonneFilter, setColonneFilter] = React.useState(headCells.filter(c => c.filterable)[0].id);
  const [filterValue, setFilterValue] = React.useState("");

  const handleClick = (event) => {
    setAnchorFilter(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorFilter(null);
  };
  
  const open = Boolean(anchorFilter);
  const id = open ? 'simple-popover' : undefined;

  return (
    <CardHeader title={title} action={
        <><Tooltip title="Liste de filtre">
          <IconButton aria-describedby={id} onClick={handleClick}>
              <FilterListIcon />
          </IconButton>
        </Tooltip>
        <Popover
        open={open}
        anchorEl={anchorFilter}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        >
          <Box sx={{ p: 2 }}>
              <FormControl variant="standard">
                <InputLabel id="filter-input">Colonne</InputLabel>
                <Select
                    labelId="filter-input"
                    value={colonneFilter}
                    label="Colonne"
                    onChange={(event) => {
                    console.log(event.target.value)
                        setColonneFilter(event.target.value)}
                    }
                >
                    {headCells.filter(column => column.filterable).map(column => (
                        <MenuItem value={column.id}>{column.label}</MenuItem>
                    ))}
                </Select>
              </FormControl>
              <TextField
                  id="filled-hidden-label-small"
                  defaultValue={filterValue}
                  label="Valeur à filtrer" variant="standard"
                  onChange={(event) => {
                  setFilterValue(event.currentTarget.value)
                  onFilter(colonneFilter, event.currentTarget.value)
                  }
                  }
              />
          </Box>
        </Popover>
        {headActions.map(action => action.content)}</>
    }/>
  );
};

TableHeadTools.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function CustomTable(props) {
  const { title, headCells, rows, headActions, empty } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [order, setOrder] = React.useState('desc');
  const [orderByCol, setOrderByCol] = React.useState(headCells.filter(c => c.sortable)[0]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(isMobile ? 'small' : 'large');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [fRows, setFRows] = React.useState(rows);



  const handleRequestSort = (event, property) => {
    const isAsc = orderByCol === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderByCol(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filter = (cId, value) => {
    const filteredRows = rows.filter((row) => {
      return String(row[cId]).toLowerCase().includes(value.toLowerCase());
    });
    setFRows(filteredRows);
  }
  
  useEffect(() => {
     setFRows(rows);   
  }, [rows])


  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - fRows.length) : 0;

  return (
    <Card>
      <TableHeadTools title={title} headActions={headActions} headCells={headCells} onFilter={filter}/>
      <Divider/>
      <CardContent>
        {rows.length !== 0 ? (
        <><TableContainer>
          <Table aria-labelledby="tableTitle" size={dense}>
            <TableHeadCustom order={order} orderBy={orderByCol} onRequestSort={handleRequestSort} rowCount={fRows.length} headCells={headCells}/>
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(fRows, getComparator(order, orderByCol))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {

                  return (
                    <TableRow
                      tabIndex={-1}
                      key={row.id}
                    >
                      {headCells.map(col => {
                        return (<TableCell align={col.align}>{col.cellRender(row)}</TableCell>)
                      })}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={fRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={"Lignes par page :"}
          nextIconButtonText="Page suivante"
          backIconButtonText="Page précédente"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `more than ${to}`}`}
        /></>
        ) : (
            <span>{empty}</span>
        )}
      </CardContent>
    </Card>
  );
}