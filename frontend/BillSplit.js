import {
  useBase,
  useRecords,
} from '@airtable/blocks/ui';
import { useMemo, useState } from 'react';

import Alert from '@material-ui/lab/Alert';
import BillSelector from './BillSelector';
import Button from '@material-ui/core/Button';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Payment from './Payment';
import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography'
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
    padding: 12,
  },
  button: {
    marginTop: 24,
    marginLeft: 4,
  },
  finalMessage: {
    display: 'flex',
    alignItems: 'center',
  },
  info: {
    width: '100%',
    marginBottom: 12,
  }
}));

const STEPS = ['Select bills to settle', 'Confirm payment', 'Done'];

export default function BillSplitApp({billTable}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedBills, setSelectedBills] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  const base = useBase();
  const table = base.getTableByIdIfExists(billTable);
  const records = useRecords(table);
  const unsettled = useMemo(() => records.filter(record => {
    return !record.getCellValue('settled') &&
      record.getCellValue('split with') != null &&
      record.getCellValue('paid by') != null &&
      record.getCellValue('split with').length &&
      record.getCellValue('paid by').length;
  }), [records]);
  let stepContent = null;
  switch (activeStep) {
    case 0:
      stepContent =
        <>
          {unsettled.length > 0 ? (
            <>
              <div className={classes.info}>
                <Alert severity="info">
                  Only unsettled bills with valid amount, payer, split with people are going to show here.
                </Alert>
              </div>
              <BillSelector
                bills={unsettled}
                selected={selectedBills}
                onSelect={selected => setSelectedBills(selected)}
              />
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={() => {
                  if (!selectedBills.length) {
                    setShowMessage(true);
                  } else {
                    setShowMessage(false);
                    setActiveStep(activeStep + 1);
                  }
                }}
              >
                Next
              </Button>
            </>
          ) : (
            <Typography color="textSecondary">
              There are no unseltted bills at the moment.
            </Typography>
          )}
          <Snackbar
            open={showMessage}
            autoHideDuration={6000}
            message="Please select some bills to continue"
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => setShowMessage(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </>;
      break;
    case 1:
      stepContent =
        <>
          <div className={classes.info}>
            <Alert severity="info">
              Please make the payment accordingly. Once confirmed, all the bills are going to become settled.
            </Alert>
          </div>
          <Payment bills={unsettled.filter(bill => selectedBills.indexOf(bill.id) >= 0)}
          />
          <div>
            <Button className={classes.button} variant="contained" color="default" onClick={() => {
              setActiveStep(activeStep - 1);
            }}>
              Back
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={() => {
                unsettled.map(bill => {
                  if (selectedBills.indexOf(bill.id) >= 0) {
                    table.updateRecordAsync(
                      bill, {
                      'settled': true,
                      'settled date': new Date(),
                    },
                    );
                  }
                });
                setActiveStep(activeStep + 1);
              }}>
              Confirm
            </Button>
          </div>
        </>;
      break;
    case 2:
      stepContent =
        <>
          <div className={classes.finalMessage}>
            <CheckCircleOutlineIcon style={{ color: green[500] }} fontSize="large" />
            <Typography color="textSecondary">
              All your selected bills are settled.
            </Typography>
          </div>
          <Button className={classes.button} variant="contained" color="primary" onClick={() => {
            setSelectedBills([]);
            setActiveStep(0);
          }}>
            Settle more bills
            </Button>
        </>;
      break;
  }
  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className={classes.stepContent}>
        {stepContent}
      </div>
    </>
  );
}
