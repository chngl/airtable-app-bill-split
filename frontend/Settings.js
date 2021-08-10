import { Button, Link, Typography } from '@material-ui/core';
import {
  useBase,
  useGlobalConfig,
} from '@airtable/blocks/ui';

import React from 'react'
import { TablePicker } from "@airtable/blocks/ui";
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    margin: 24,
  },
  desc: {
    margin: '12px 24px 12px 24px',
  },
  button: {
    margin: 12,
  }
}));
export default function Settings({ onConfirm }) {
  const base = useBase();
  const globalConfig = useGlobalConfig();
  const classes = useStyles();
  const table = base.getTableByIdIfExists(globalConfig.get('bill_table'));
  const [billTable, setBillTable] = useState(table);
  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.label}>
        Welcome to the bill split app 💰
      </Typography>
      <Typography color="textSecondary" className={classes.desc}>
        This bill split app allows you to easily manage and split bills with your friends and roommates etc. Watch this demo to see how it works.
      </Typography>
      <iframe width="560" height="315"
        src="https://www.youtube.com/embed/nHbBdkYr1zM?&autoplay=1"
        frameBorder="0"
        allowFullScreen />
      <Typography color="textSecondary" className={classes.desc}>
        To get started, please select the bill table from the dropdown below.
        A bill table should contain the following fields: name, date, amount, paid by, split with, settled and settled date.
        'paid by' and 'split with' fields are linked records to the people table. People table should have a unique name field.
        You can check out this <Link target="_blank" href="https://airtable.com/shrcVcnd77U1iRuwm">base</Link> as an example.
      </Typography>
      <TablePicker
        table={billTable}
        onChange={table => setBillTable(table)}
        width={320}
      />
      <Button
        className={classes.button}
        disabled={billTable == null}
        variant="contained"
        color="primary"
        onClick={() => {
          globalConfig.setAsync('bill_table', billTable.id);
          onConfirm && onConfirm();
        }}
      >
        Confirm
      </Button>
    </div>
  )
}
