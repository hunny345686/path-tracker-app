# PathTracker

PathTracker is a last-mile delivery route planner for small dispatch teams. It helps an operator collect delivery orders manually or through QR scan, place each order on a map, generate an optimized road route from a fixed hub, prepare the delivery bag in the correct loading order, and hand the route to a driver through Google Maps.

The current workspace is configured for a Bengaluru dispatch flow with the hub set to Indiranagar.

## Product Goal

Delivery teams often receive several orders at once and need to answer three operational questions quickly:

- Where are all customer deliveries located?
- What is the best order to visit them from the hub?
- How should packages be loaded so the first delivery is easiest to access?

PathTracker turns those steps into one dashboard.

## Core Workflow

1. Add an order with product, customer, phone number, and delivery address.
2. Or scan a delivery QR code that contains customer, order, phone, and address details.
3. The app geocodes the address using OpenStreetMap Nominatim.
4. The order is saved in browser storage so it survives refreshes.
5. The map shows the hub and all pending deliveries.
6. The operator clicks **Optimize route**.
7. The app requests a road-aware route from OSRM.
8. The dashboard shows distance, estimated drive time, stop count, route source, and map geometry.
9. The route manifest reverses the stop order to create a practical bag-loading sequence.
10. The final route can be opened in Google Maps for driver navigation.

## Features

- Real address lookup with Bengaluru search bias
- QR intake for delivery order details
- Manual QR payload fallback for browsers without camera QR detection
- First-run demo batch for portfolio demonstrations
- One-click demo batch reload
- OSRM road-route optimization
- Fallback nearest-stop estimation when the live route service is unavailable
- Interactive Leaflet map with hub, pending orders, planned stops, and route line
- Persistent local order queue using `localStorage`
- Duplicate customer/address prevention
- Customer phone contact links
- Route quality summary with distance, drive time, stop count, map point count, and generated time
- Bag loading order for last-in-first-out package handling
- Google Maps route export
- Responsive operations-style UI for desktop and mobile

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Leaflet and Leaflet
- Lucide React
- OpenStreetMap Nominatim API
- OSRM public routing API
- Browser `localStorage`
- Browser camera APIs and `BarcodeDetector` when available

## QR Order Format

The QR scanner accepts three common payload styles.

JSON:

```json
{
  "name": "Asha Mehta",
  "address": "MG Road, Bengaluru, Karnataka",
  "order": "Wireless Keyboard",
  "phone": "9876543210"
}
```

URL query params:

```text
https://example.com/order?name=Asha%20Mehta&address=MG%20Road%20Bengaluru&order=Wireless%20Keyboard&phone=9876543210
```

Plain text:

```text
Name: Asha Mehta
Address: MG Road, Bengaluru, Karnataka
Order: Wireless Keyboard
Phone: 9876543210
```

After scanning, PathTracker fills the form first so the operator can review the data before creating the delivery.

## Demo Data

On first launch, PathTracker seeds a small Bengaluru demo batch so the product is immediately reviewable. The top bar also includes a **Demo batch** button to reload sample deliveries during presentations.

## Route Logic

PathTracker uses two route modes:

### Live Road Route

For normal dispatch batches, the app sends the hub and delivery coordinates to OSRM. OSRM returns:

- optimized stop order
- route distance
- route duration
- road geometry used to draw the map line

### Estimated Fallback

If OSRM is unavailable or the batch is above the browser route limit, the app falls back to a nearest-stop algorithm. It selects the closest next delivery using map distance, applies a road-distance factor, and marks the route as estimated so the operator can see that it is not a live road route.

## Project Structure

```text
src/
  App.tsx                    Main dashboard state and layout
  components/
    DeliveryForm.tsx         Add and validate real delivery orders
    DispatchPanel.tsx        Order queue, route manifest, bag loading order
    Map.tsx                  Leaflet map, markers, route geometry
    QrScanner.tsx            Camera QR scanner and QR payload fallback
    TopBar.tsx               App header and order entry surface
  data/
    demoDeliveries.ts        First-run demo delivery batch
  services/
    geocoding.ts             Nominatim address lookup
    routing.ts               OSRM routing and fallback route estimation
  utils/
    deliveries.ts            Phone validation, duplicate checks, display helpers
    qrPayload.ts             QR payload parsing for JSON, URL, and text formats
  types/
    types.ts                 Shared TypeScript models
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Resume Summary

Built PathTracker, a production-style delivery route planning dashboard using React, TypeScript, Vite, Tailwind CSS, Leaflet, QR-based order intake, OpenStreetMap geocoding, OSRM route optimization, persistent browser storage, fallback route estimation, demo data seeding, and Google Maps export.

## Production Notes

This is a frontend-only portfolio implementation. For commercial usage, the geocoding and routing calls should move behind a backend service to support API keys, caching, rate limiting, audit logs, and provider failover.
