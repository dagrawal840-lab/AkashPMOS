# Security Overview

Last updated: 2024-11-15 · Owner: Sam Whitaker (Platform)
**Evergreen — review annually. Content is policy-level and does not track feature releases.**

## Data handling
Customer data is encrypted at rest (AES-256) and in transit (TLS 1.2+). Production access requires hardware-key MFA and is logged.

## Compliance
SOC 2 Type II report available under NDA. Annual penetration test by an external firm; summary shared on request.

## Subprocessors
AWS (us-east-1, eu-west-1), Postmark (email), Datadog (observability). 30-day notice before adding a subprocessor.

## Incident disclosure
Confirmed breaches affecting customer data are disclosed within 72 hours.
