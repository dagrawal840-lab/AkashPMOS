# Launch One-Pager: Usage-Based Alerts GA

**Author:** Priya Raman (PM, Growth) · **Draft v0.2** · Last edited 2026-07-15
**Review:** Launch review 2026-07-18, 09:30 PT · **Target GA:** 2026-08-04

## What's launching

Usage-based alerts leave beta and go GA for all Growth and Enterprise workspaces. Admins can set threshold alerts on any workspace metric (seats, API calls, storage) and get notified by email or Slack when a threshold is crossed. Beta feedback has been strong, so we expect smooth adoption at GA.

## Why now

Beta workspaces that configured at least one alert renewed at a noticeably higher rate, and alerting is the most-requested item on the Growth roadmap. Shipping before the September renewal wave maximizes impact.

## Launch plan

- 7/21: enable `usage_alerts_ga` flag for 10% of eligible workspaces.
- 7/28: 50% if metrics look healthy.
- 8/04: 100% + blog post, changelog, in-app announcement.
- Lifecycle email to beta users announcing GA pricing.

Alerts fire via the existing notifications pipeline. Slack delivery uses each workspace's connected Slack integration as-is.

## Success

- Adoption: a healthy share of eligible workspaces create an alert in the first 30 days.
- Alert engagement: recipients act on alerts rather than muting them.
- Support tickets stay manageable through rollout.

## Pricing

Included in Growth and Enterprise. Starter workspaces see an upgrade prompt when they open the alerts tab.

## Non-goals

- SMS or webhook delivery channels: email and Slack only for GA; tracked as GROW-2301.
- Anomaly detection (auto-thresholds): explicitly out of scope; thresholds are manual for GA.

## Open items

- Confirm blog post date with marketing.
