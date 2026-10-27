# FLORAN / Martian Bloom

## Installation screens

- `/` — original flower-free opening and cinematic journey.
- `/display` — flower-free QR invitation for the entrance display.
- `/join` — phone entry into the existing name, date, memory, wheel and bloom journey.
- `/live` — shared installation, refreshing every three seconds and rotating through the latest 36 blooms every ten seconds. New arrivals take focus.
- `/admin` — existing Payload administration; installation staff can remove shared blooms.

Open `/display` or `/live` on the public published site before inviting phone
visitors. QR codes use the screen's current origin, so published screens point
to the published `/join` route. A private Make preview may require preview access
on the visitor's phone.

## Data boundaries

The original flower/word associations, seed geometry and luminous alternates
remain fixed artistic mapping rules in source. Their assets are under
`public/floran`. No new flower or word mappings were imported from the ZIP.

My Herbarium remains optional, browser-local storage under its original
`floran-herbarium-v1` key. Existing browser records are preserved. They are not
uploaded or synchronized.

Sharing to the installation is a separate, explicit opt-in at the bloom result.
Payload's `blooms` collection stores only a public name, server-computed flower
index, collection, timestamps and a private random retry key. Birth dates are
used transiently on the server to verify the symbolic flower assignment; neither
birth dates nor Earth memories are written to shared storage.

Anonymous visitors cannot directly create records through Payload's REST API,
update records, or access retry keys. The validated sharing action is the only
creation path. Staff may delete records through Payload Admin.

## Delivery lifecycle

The four public pages are static shells. Live records are operational data read
at request time by a Server Action, not build-time snapshots or editorial cache
entries. New submissions and staff deletions appear on the next successful
three-second poll, without another Publish.

One clearly labeled **Transmission test** bloom was retained after verifying
phone-to-screen persistence. Staff can remove it in Admin.
