# Japan Take-home Estimate Prototype

This is an isolated prototype for the planned paid Japan payroll/take-home module. It is not imported by the current `www/` app and does not change store listing or privacy files.

## What It Covers

- Baito / arubaito / part-time, haken, employee, and lightweight freelancer scenarios.
- Kyokai Kenpo FY2026 prefecture rates for all 47 branches.
- Standard monthly remuneration lookup for health insurance and employee pension.
- Care insurance age handling for ages 40-64.
- Employee pension age handling up to age 69 in the prototype.
- FY2026 employment insurance worker rates.
- FY2026 national pension monthly premium.
- Resident tax modes: off, manual notice, auto estimate, hybrid.
- Domestic and overseas dependent counting with an overseas-document eligibility toggle.

## Prototype Limits

- Income tax is an annualized estimate. Production should use the official NTA monthly/daily withholding tables.
- Resident tax auto mode is approximate. Manual notice mode should be the reliable path once the user has the municipal notice.
- Freelancer mode treats monthly gross as income after expenses. It is not a final tax return calculator.
- RevenueCat is not connected here. The entitlement/paywall layer should be added only after the calculation scope is accepted.

## Run

From the repo root:

```bash
python3 -m http.server 5177
```

Then open:

```text
http://127.0.0.1:5177/experiments/jp-takehome-prototype/
```

## Test

```bash
node experiments/jp-takehome-prototype/test-engine.mjs
```
