import * as React from 'react';

import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from 'react';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}));

const columns = [
  {
    field: 'bill',
    headerName: 'Bill',
    flex: 1,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    flex: 1,
    renderCell: cell => {
      const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      return currencyFormatter.format(cell.value);
    }
  },
  {
    field: 'date',
    headerName: 'Date',
    flex: 1,
  },
  {
    field: 'paid_by',
    headerName: 'Paid By',
    flex: 1,
  },
  {
    field: 'split_with',
    headerName: 'Split With',
    flex: 1.5,
  },
];

export default function BillSelector({bills, selected, onSelect}) {
  const classes = useStyles();
  const rows = useMemo(() => bills.map(bill => ({
    id: bill.id,
    bill: bill.getCellValue('name'),
    amount: bill.getCellValue('amount'),
    date: bill.getCellValue('date'),
    paid_by: bill.getCellValue('paid by')[0]['name'],
    split_with: bill.getCellValue('split with').map(payee => payee['name']).join(', '),
  })), [bills]);
  return (
    <div className={classes.root}>
      <DataGrid
        autoHeight
        selectionModel={selected}
        rows={rows}
        columns={columns}
        pageSize={bills.length > 8 ? 8 : bills.length}
        checkboxSelection
        disableSelectionOnClick
        onSelectionModelChange={(selected) => onSelect && onSelect(selected)}
      />
    </div>
  );
}
