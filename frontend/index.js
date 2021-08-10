import {
  initializeBlock,
  useGlobalConfig,
} from '@airtable/blocks/ui';
import { useEffect, useState } from 'react';

import BillSplit from './BillSplit';
import React from 'react';
import Settings from './Settings';
import { settingsButton } from '@airtable/blocks';
import { useWatchable } from '@airtable/blocks/ui';

function BillSplitApp() {
  const [showSettings, setShowSettings] = useState(false);
  useEffect(() => {
    settingsButton.show();
  });
  useWatchable(settingsButton, 'click', function () {
    setShowSettings(true);
  });
  const globalConfig = useGlobalConfig();
  const billTable = globalConfig.get('bill_table');
  console.log(billTable);
  if (showSettings || billTable == null) {
    return <Settings onConfirm={() => setShowSettings(false)} />;
  } else {
    return <BillSplit billTable={billTable} />;
  }
}

initializeBlock(() => <BillSplitApp />);
