# Slotwise Changelog
<!-- snapshot captured 2026-07-06 07:00 PT · source: slotwise.com/changelog -->

## July 3, 2026 — v4.18
- **AI Assist: agenda drafts.** The scheduling assistant now drafts a meeting agenda from the invite title and attendee roles. Rolling out to Team and Business plans.
- Fixed: recurring events created via API ignored the `buffer_minutes` field.
- Fixed: Outlook add-in crashed when a calendar had more than 400 shared calendars attached.

## July 1, 2026 — v4.17.2
- Patch release. Reverted the timezone picker change from v4.17.1 after reports of double-booked slots for attendees in half-hour offset zones (IST, ACST).

## June 26, 2026 — v4.17
- **AI Assist: smart rescheduling (beta).** When a required attendee declines, AI Assist proposes three alternative slots ranked by historical acceptance. Beta, Business plan only, waitlist.
- New: webhook event `booking.no_show` fires 15 minutes after a missed meeting.
- Deprecation notice: legacy embed v1 widget will stop receiving fixes on Sept 30, 2026.
