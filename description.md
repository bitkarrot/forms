# Forms — Paid Workflows

Build payment-gated forms, event registrations, and membership workflows. Attendees fill in a public hosted form and pay a Lightning invoice that settles directly into the organizer's LNbits wallet — no third-party form service, no card processor required.

## Demo

[![Watch the demo](https://raw.githubusercontent.com/bitkarrot/forms/main/screenshots/demo-video.png)](https://www.youtube.com/watch?v=fLjzZwiQaxI)

_40-second walkthrough: Typeform-style stepper → Lightning invoice → confirmation with ticket code, the admin builder, and the JavaScript embed._

## Features

- **Form builder** with live canvas preview: text, paragraph, email, phone, number, date, dropdown, multiple choice, checkbox, consent, and Nostr pubkey fields with required/optional rules.
- **Pre-built templates** — event ticket, paid membership, donation + signup, and application with manual approval.
- **Paid or free flows** with capacity limits, optional manual approval after payment, and per-submission Lightning invoices.
- **Hosted public pages** with preset themes (standard, minimal, contrast, Typeform), per-element colors, header/background/thank-you images, card transparency, and custom CSS.
- **JavaScript embed widget** for websites you control — the only surface where one-click NIP-07 Nostr login is available.
- **Organizer dashboard**: submission list, approve/reject, CSV export, ticket/confirmation codes after verified payment.
- **Submission notifications** via HTTPS webhooks — email through Web3Forms, or ntfy, Slack, Discord, Telegram, IFTTT, and webhook.site for testing.

Payment confirmation is verified server-side via the LNbits invoice-paid event; the public status endpoint only reports `paid` after settlement has been durably recorded.

This extension respects the stock LNbits WASM sandbox: no relay connections, no extension websockets, no external CDN assets. All public inputs are validated in-module and prices are always computed server-side — never trusted from the client.

Created by bitkarrot. MIT licensed.
