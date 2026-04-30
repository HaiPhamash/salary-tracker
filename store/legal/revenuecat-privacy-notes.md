# RevenueCat Privacy Notes — Pending IAP Enablement

These notes are for the future build where `@revenuecat/purchases-capacitor`
is installed and RevenueCat API keys are configured.

The current app build still has no live RevenueCat SDK configuration and does
not transmit salary, shift, tax, dependent, or payroll-profile data.

## Data That Must Remain Local

- Salary, shifts, jobs, allowances, deductions
- Japan payroll profile inputs
- Dependents and overseas-dependent checklist data
- Resident tax notice amounts
- Calculation results and traces

## Data RevenueCat Will Receive After Enablement

- Anonymous app user identifier
- App Store / Google Play purchase receipt
- Product identifier purchased
- Purchase/subscription status and renewal history
- Device/platform metadata required for purchase validation

## App Privacy / Data Safety Direction

Once RevenueCat is enabled, the previous "No data collected" answer should be
updated. A safe phrasing is:

> Salary and payroll data stays on the user's device. Purchase validation is
> handled by RevenueCat, which receives anonymous purchase identifiers and
> receipt/subscription status. The developer does not receive salary, shift,
> dependent, or payroll calculation data.

## Store Review Notes

The paid feature should be described as an estimate tool. Do not claim official
tax advice or guaranteed payroll accuracy. Include the in-app disclaimer:

> Results are estimates and do not replace official payslips, employer payroll,
> tax office guidance, or professional advice.
