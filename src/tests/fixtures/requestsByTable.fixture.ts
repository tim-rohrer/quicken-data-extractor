export const dataRequestFixture = [
  // {
  //   tableName: 'ZTRANSACTION',
  //   cols: [
  //     'ALL',
  //     'Z_PK',
  //   ],
  //   filters: [
  //     // {
  //     //   name: 'ZUNIQUEID',
  //     //   expression: '!=',
  //     //   values: [null],
  //     // }
  //   ]
  // },
  {
    tableName: "ZFIPOSITION",
    cols: [
      "Z_PK",
      "ZSECURITYTYPE",
      "ZMARKETVALUE",
      "ZSECURITYUNITPRICE",
      "ZSHARESPERCONTRACT",
      "ZSTRIKEPRICE",
      "ZUNITPRICE",
      "ZUNITS",
      "ZASSETCLASS",
      "ZGUID",
      "ZSECURITYNAME",
      "ZSECURITYTICKER",
      "ZUNIQUEID",
    ],
    filters: [
      {
        name: "ZSECURITYTICKER",
        expression: "=",
        values: ["TEPLX"],
      },
    ],
  },
  {
    tableName: "ZACCOUNT",
    cols: [
      { Z_PK: "primaryKey" },
      "ZACTIVE",
      "ZSINGLEMUTUALFUND",
      "ZSTATUSTRANSACTIONCOUNT",
      "ZFINANCIALINSTITUTION",
      "ZCREATIONTIMESTAMP",
      "ZMODIFICATIONTIMESTAMP",
      "ZCURRENCY",
      "ZGUID",
      "ZNAME",
      "ZNOTES",
      "ZTYPENAME",
      "ZCLOSED",
    ],
    filters: [
      {
        name: "ZCLOSED",
        expression: "=",
        values: [0],
      },
      {
        name: "ZTYPENAME",
        expression: "=",
        values: ["RETIREMENTROTHIRA", "BROKERAGENORMAL"],
      },
    ],
  },
  {
    tableName: "ZSECURITY",
    cols: [
      { Z_PK: "primaryKey" },
      { ZTYPE: "type" },
      { ZLATESTQUOTEDATE: "latestQuoteDate" },
      { ZMODIFICATIONTIMESTAMP: "modificationTimestamp" },
      { ZMOSTRECENTQUOTEDOWNLOADTIMESTAMP: "latestQuoteTimestamp" },
      { ZASSETCLASSPERCENTAGEDOMESTICBOND: "latestQuoteDate" },
      { ZASSETCLASSPERCENTAGEINTLBOND: "percentageIntlBond" },
      { ZASSETCLASSPERCENTAGEINTLSTOCK: "percentageIntlStock" },
      { ZASSETCLASSPERCENTAGELARGESTOCK: "percentageLargeStock" },
      { ZASSETCLASSPERCENTAGEMONEYMRKT: "percentageMoneyMarket" },
      { ZASSETCLASSPERCENTAGEOTHER: "percentageOther" },
      { ZASSETCLASSPERCENTAGESMALLSTOCK: "percentageSmallStock" },
      { ZASSETCLASS: "assetClass" },
      { ZGUID: "globalUID" },
      { ZISSUETYPE: "issueType" },
      { ZNAME: "name" },
      { ZTICKER: "ticker" },
    ],
    filters: [
      {
        name: "ZISSUETYPE",
        expression: "!=",
        values: ["IN"],
      },
    ],
  },
  {
    tableName: "ZLOT",
    cols: [
      "Z_PK",
      "ZPOSITION",
      "ZACQUISITIONDATE",
      "ZCREATIONTIMESTAMP",
      "ZINITIALTRANSACTIONDATE",
      "ZLATESTTRANSACTIONDATE",
      "ZMODIFICATIONTIMESTAMP",
      "ZINITIALCOSTBASIS",
      "ZINITIALUNITS",
      "ZLATESTCOSTBASIS",
      "ZLATESTUNITS",
    ],
    // filters: [
    //   {
    //     name: 'ZPOSITION',
    //     expression: '=',
    //     values: [22],
    //   }
    // ]
  },
  {
    tableName: "ZLOTMOD",
    cols: [
      "Z_PK",
      "ZTERMTYPE",
      "ZLOT INTEGER",
      "ZLOTASSIGNMENT",
      "ZTRANSACTION",
      "ZCREATIONTIMESTAMP",
      "ZMODIFICATIONTIMESTAMP",
      "ZTRANSACTIONDATE",
      "ZAFTERCOSTBASIS",
      "ZAFTERPOSITIONCOSTBASIS",
      "ZAFTERPOSITIONUNITS",
      "ZAFTERUNITS",
      "ZBEFORECOSTBASIS",
      "ZBEFOREUNITS",
    ],
    filters: [
      // {
      //   name: 'ZTERMTYPE',
      //   expression: '!=',
      //   values: [1]
      // }
    ],
  },
  {
    tableName: "ZLOTASSIGNMENT",
    cols: ["ALL"],
  },
  {
    tableName: "ZPOSITION",
    cols: [
      "Z_PK",
      "ZTYPE",
      "ZACCOUNT",
      "ZSECURITY",
      "ZCREATIONTIMESTAMP",
      "ZMODIFICATIONTIMESTAMP",
      "ZGUID",
      "ZUNIQUEID",
      "ZUNIQUEIDTYPE",
    ],
  },
]
