# SE call log — Sam Torres, week of 7/13
(solutions engineer notes, appended after technical calls)

7/14 Petrel Shipping (NW-1046, pre-signature technical Q&A): walked
their analysts through the route P&L dashboard build. Confirmed what
Diego heard — dashboards were the wedge. Their team had FreightIQ's
trial open side-by-side and closed it mid-call.

7/15 Lantern Freight (NW-1048, post-mortem, 20 min): their analyst
confirmed the scorecard: reporting 8.6 us / 7.9 Cortexa, "real-time
visibility" 6.1 us / 9.0 Cortexa. Migration deadline made the decision
for them. No price row in the scorecard at all.

7/16 Tallgrass (NW-1051, prep): built latency comparison for Tuesday.
Their detention-billing use case genuinely doesn't need sub-60s — events
are reconciled hourly. Need product's blessing on how we frame this,
draft language keeps drifting into "faster webhooks later this year"
territory which we should NOT say.

7/16 Bluewater (NW-1054, doc review): sent current SSO whitepaper.
It doesn't cover contractor-account lifecycle or audit-log export,
which are literally their two questions. Gap is in our docs, not
necessarily the product — audit export exists via API since 4.9.
