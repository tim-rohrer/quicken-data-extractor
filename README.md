# Table Descriptions

## ZFIPOSITION

At present, this table is confusing. It almost appears to comprised of snapshots in time for various securities.

The `ZUNIQUEID` may be consistent for a particular security. This field is also found in `ZFITRANSACTION`, `ZFIPOSITION`, `ZSECURITYID`, and `ZPOSITION`

* However, `ZUNIQUEID` is null in `ZFITRANSACTION`

## ZPOSITION

This appears to be the table that holds investment position. It contains two fields that appear to map to the `primaryKey` of the table bearing their name: `ZACCOUNT` AND `ZSECURITY`

For `ZSECURITY`, this appears to be a one-to-many
`ZACCOUNT`: Same: one account has many positions.

## ZFITRANSACTION

These transactions are not unique to investment accounts. Each entry does have a numeric `ZACCOUNT` reference, and my initial assumption is that this relates to `Z_PK` in the `Z_ACCOUNT` table.

Will return to this table later to determine its usefulness.

## ZTRANSACTION

Contains a large number of fields, but none that are obviously identifiable using text. The table does contain `ZGUID` which may be useful for reference.

## ZSECURITY

## ZSECURITYQUOTE

References a `ZSECURITY` of type *number* which is probably the `ZSECURITY` `Z_PK`

In further consideration, I probably do not need to pull this data from Quicken unless I find I cannot download it for free from other sources.

Will skip this for now.

## ZSECURITYQUOTEDETAIL

Skipping for the same reason as `ZSECURITYQUOTE`

## ZLOT

Appears to be the starting point for tracking lots. Contains `ZPOSITION`, possible reference for `Z_PK` in the `ZPOSITION` table.

## ZLOTMOD

Appears to provide details of the modifications to particular lots.

`ZTERMTYPE` is unknown, but may be germane.

## ZLOTASSIGNMENT

An unknown. There are only two entries in this table.

Skipping for now.
