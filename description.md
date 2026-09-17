# Forms — Paid Workflows for LNbits

Build payment-gated forms and registration flows. Attendees fill in a public
form and pay a Lightning invoice that settles directly into the organizer's
LNbits wallet — no third-party form service, no card processor required.

- Form builder: text, email, phone, textarea, number, date, select, radio,
  checkbox, consent, and Nostr pubkey fields with required/optional rules.
- Paid or free flows with capacity limits and per-submission Lightning invoices.
- Public hosted page with preset light/dark themes and organizer custom CSS.
- Website embed widget (JavaScript, no iframe) — the only surface where NIP-07
  Nostr login is available.
- Organizer dashboard: submission list, approve/reject, CSV export,
  confirmation codes after verified payment.

Payment confirmation is verified server-side via the LNbits invoice-paid event;
the public status endpoint only reports `paid` after the event has been durably
recorded.
