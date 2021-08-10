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
    field: 'receiver',
    headerName: 'Receiver',
    flex: 1,
  },
  {
    field: 'sender',
    headerName: 'Sender',
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
];

const calculatePayment = (bills) => {
  const payment = {};
  for (let bill of bills) {
    let payer = bill.getCellValue('paid by')[0];
    let payerID = payer['name'];
    if (!(payerID in payment)) {
      payment[payerID] = {}
    }
    let payees = bill.getCellValue('split with');
    for (let payee of payees) {
      let payeeID = payee['name'];
      if (payeeID === payerID) {
        continue;
      }
      if (!(payeeID in payment[payerID])) {
        payment[payerID][payeeID] = 0;
      }
      payment[payerID][payeeID] += bill.getCellValue('amount') / payees.length;
    }
  }
  // merge the payment to avoid the situation when A has to send B some money and B also having to send A
  for (let receiver in payment) {
    for (let sender in payment[receiver]) {
      if (sender in payment && receiver in payment[sender]) {
        let canceled = Math.min(payment[receiver][sender], payment[sender][receiver]);
        payment[receiver][sender] -= canceled;
        payment[sender][receiver] -= canceled;
      }
    }
  }
  const rows = [];
  for (let receiver in payment) {
    for (let sender in payment[receiver]) {
      const amount = payment[receiver][sender];
      if (amount > 0) {
        rows.push({
          id: receiver + sender,
          receiver,
          sender,
          amount: payment[receiver][sender],
        });
      }
    }
  }
  return rows;
}

export default function Payment({bills}) {
  const classes = useStyles();
  const rows = useMemo(() => calculatePayment(bills), [bills]);
  return (
    <div className={classes.root}>
      <DataGrid
        autoHeight
        pageSize={bills.length > 8 ? 8 : bills.length}
        rows={rows}
        columns={columns}
      />
    </div>
  );
}
