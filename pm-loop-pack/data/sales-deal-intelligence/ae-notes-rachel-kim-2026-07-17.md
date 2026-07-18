# Rachel Kim — deal notes, week of 7/13
pasted from my Gong summaries + a few from memory, sorry for shorthand

## NW-1044 Ridgeway Haulage — LOST 7/13 to Cortexa
Brutal one. Their ops lead (Karl) said the eval came down to live tracking.
Cortexa demoed sub-60s event streams, ours webhooks land ~90s. Karl quote:
"ninety seconds is a different truck position." Dashboards they actually
liked BETTER than Cortexa's — said so twice — but not enough. Price never
really discussed, we never got that far. No exec sponsor on their side
either tbh, Karl was doing this solo and his VP checked out after demo 1.

## NW-1050 Veltri Bros — LOST 7/16, Cortexa again
Same movie. Frank Veltri liked us, his dispatch mgr pushed Cortexa hard bc
"the drivers already know it" (they use Cortexa at their sister company).
Also the McLeod thing came up AGAIN — no native connector, they'd have to
run our REST API through a middleware shop. Frank: "I'm not paying a
consultant to duct-tape two systems." We offered 15% off, didn't move him,
he said money wasn't the issue. So price came up but wasn't the decider.

## NW-1051 Tallgrass — open, Evaluation
Deep-dive Tue on webhook latency. Their eng is comparing us vs Cortexa
streams spec-sheet style. I need something better than "90s is usually
fine" — like WHEN is 90s actually fine (their use case is yard mgmt +
detention billing, not live driver ETA). If product can give me a one-pager
on latency-vs-use-case I think we survive the bake-off. Do NOT want to
promise the sub-60 rearchitecture, I know it's not committed.
