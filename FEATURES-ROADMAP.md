# Food Bot 2 – Features Roadmap

This document captures the full scope of features requested for customer app, restaurant app, and backend. Implementation is phased; each section lists backend and frontend work.

## Implementation status (foundation in place)

- **Backend**
  - **Order service**: Order `timeline`, `customerName`, `customerPhone`, `eta`, `atRisk`; `listOrdersByRestaurant`, `getOrderByRestaurant`, `updateOrderStatus(orderId, status, note?)`, `setOrderCustomer`, `setOrderEta`. Restaurant-facing controller: `GET/PATCH .../restaurant-orders/:restaurantId`, `.../orders/:orderId`, `.../status`, `.../customer`, `.../eta`.
  - **Menu (restaurant-service)**: `imageUrl` on create/update and DTOs.
  - **Restaurant-service**: **Promotions** (CRUD, type/code/schedule), **Campaigns** (CRUD, channels, content), **Segments** (create/list for targeting), **Reviews** (create, list by restaurant, aggregate, reply), **Tickets** (create, list by user/restaurant, reply, update status).
  - **API Gateway**: **Notifications** – `GET /v1/notifications?audience=&recipientId=`, `PATCH /v1/notifications/:id/read`, `POST /v1/notifications/mark-all-read`, `POST /v1/notifications` (create). Types: order_status, new_order, order_at_risk, offer, campaign, promotion.
- **Frontend (implemented)**  
  - **Restaurant app**: New tabs – Price management (demand rules, AI suggestions), Promotions (table + create), Marketing (campaigns, segments, delivery channels), Reviews (aggregate, list, reply), Tickets (list, view & reply). Order detail modal – status dropdown, customer name/phone, Call/Chat buttons, timeline, at-risk badge. Orders – at-risk alert banner, row highlight for at-risk. Menu – imageUrl in add/edit/view, thumbnail column.  
  - **Customer app**: Notifications panel (icon + dropdown, mark read). Banner (dismissible promo). Order tracking page (`/order/track/:orderId`) with timeline. Reviews page (list, write review form). Tickets page (list, create, detail with replies). Nav links: Reviews, Tickets. Track order link on Order page.  
  - **Gateway**: Tickets proxy (`/v1/tickets`) forwards to restaurant-service with `x-user-id`.

---

## 1. Customer App – Discovery & Options

- **Options as cards**: Search results (restaurants, dishes), chat suggestions, and follow-up choices must render as **cards** (image, title, subtitle, CTA), not plain lists.
- **Follow-up input fields**: When the assistant asks for data (e.g. date, headcount, budget, dietary preference), render proper **form fields** (date picker, number, dropdown, checkboxes) and submit as structured follow-up, not only free text.
- **Rendering**: Rich messages (cards, CTAs, inputs) must be properly parsed and rendered; no broken or “childish” layouts.

**Backend**: Chat/job payload may include structured `options` and `inputSchemas` for follow-up; workflow service and LLM response shape to support this.

---

## 2. Customer App – Orders & Tracking

- **Orders**: Full order list with status, amount, date; filter and search.
- **Order tracking**: Dedicated **tracking** view per order: timeline (placed → confirmed → preparing → out for delivery → delivered), ETA, map placeholder, status updates.
- **Order detail**: Full order details (items, quantities, price, address, payment, status history).

**Backend**: Order service already has order CRUD; add **order timeline** (status history with timestamps), **ETA** field, and optional **tracking events**. Gateway order-proxy to expose timeline and tracking.

---

## 3. Customer App – Notifications & Banners

- **Notifications**: In-app list of notifications: **offers**, **campaigns**, **order status updates** (e.g. “Your order is out for delivery”). Mark read/unread; optional push later.
- **Banner ads**: Top or inline **banner** area showing active campaigns/promotions (image, title, CTA). Dismissible or rotating.

**Backend**: **Notifications API** (list, mark read, types: offer | campaign | order_status). **Campaigns/Banners API** (active banners for customer segment/channel). Delivery options (in-app, push, WhatsApp, SMS, etc.) drive which notifications are created.

---

## 4. Customer App – Reviews, Ratings & Tickets

- **Reviews and ratings**: Per restaurant or per order: submit **rating** (e.g. 1–5 stars) and **review text**; view own and aggregate ratings.
- **Tickets**: **Create ticket** (subject, message, category e.g. order issue / payment / general); **list my tickets**; **ticket detail** with thread (replies). Status: open / in progress / resolved.

**Backend**: **Reviews service** (submit, list by restaurant/order, aggregate stats). **Tickets service** (create, list, get, add reply, status update). Both can live in customer-service or a dedicated module; gateway proxies.

---

## 5. Restaurant App – Menu & Images

- **Menu images**: Each menu item has an **image URL** (or upload); list and detail views show **images** in cards/grid.
- **Menu suggestions**: Section or tab for **demand-based menu suggestions** (e.g. “Top demanded items”, “Consider adding based on trends”).

**Backend**: Menu DTO and storage already support optional fields; add **imageUrl**. Optional **demand/suggestions** endpoint (from order/item stats or external).

---

## 6. Restaurant App – Order Management

- **Order details**: **Full order detail** view: items, quantities, price, **customer data** (name, phone, address), **order timeline**, **notes**.
- **Change status**: Buttons/actions to **change order status** (e.g. confirm → preparing → out for delivery → delivered).
- **Customer contact**: **Call** and **Chat** options (click-to-call, open chat with customer) from order detail.
- **Order alerts**:  
  - **New order** alerts (in-app, optionally sound/badge).  
  - **Orders at risk**: e.g. orders past expected prep time or missing timeline milestones; list and highlight in UI.

**Backend**: Order service: **status transition** API, **timeline** with timestamps, **customer contact** (phone, userId for chat). **Alerts/notifications** for restaurant: new order, at-risk order (rules: e.g. placed > 15 min without “preparing”).

---

## 7. Restaurant App – Price Management

- **Tab: Price management**: List menu items with current price; **edit price**; **bulk update**.
- **Demand-based auto price change**: **Schedule** (e.g. peak hours increase by X%); **rules** (time window, multiplier or fixed delta).
- **AI suggested price change**: Section showing **AI-suggested** price changes (with reason); accept/reject.

**Backend**: **Price rules** (schedule, rule type, scope: item/category); **price history**; **suggestion** endpoint (stub or AI) returning suggested prices with reason.

---

## 8. Restaurant App – Promotions

- **Tab: Promotion management**: Create/edit **promotions**: type (e.g. % off, BOGO, fixed amount off), scope (item/category/order min), **schedule** (start/end), code optional.
- **Promotion options**: Multiple types; **scheduling**; enable/disable.

**Backend**: **Promotions API** (CRUD, list active by restaurant, schedule, type).

---

## 9. Restaurant App – Marketing Campaigns

- **Tab: Marketing campaign management**:  
  - **Manual** and **AI-suggested** campaign content (title, body, CTA, image).  
  - **Target segment**: Create/select segment (e.g. “Users who ordered in last 30 days”, “Vegetarian”, custom).  
  - **Scheduling**: Start/end, optional recurrence.  
  - **Delivery options**: In-app **banner**, **push notification**, **WhatsApp**, **SMS**, **Facebook ads**, **Instagram ads** (integration stubs or links to external tools).

**Backend**: **Campaigns API** (CRUD, content, segmentId, schedule, delivery channels). **Segments API** (create/list segments: rules-based). **Delivery** per channel (in-app + stub endpoints for WhatsApp/SMS/ads).

---

## 10. Restaurant App – Reviews & Ratings

- **Tab: Reviews and ratings**: List **reviews** for the restaurant; **rating** aggregate; filter by rating/date; **reply** to review (optional).

**Backend**: Reviews service: list by restaurant, aggregate; optional reply stored with review.

---

## 11. Restaurant App – Tickets

- **Tab: Tickets management**: List **tickets** (from customers); **status** (open / in progress / resolved); **detail** view with thread; **reply** and **status update**.

**Backend**: Tickets service: list by restaurant (or global), get, add reply, update status.

---

## 12. Notifications (Cross-cutting)

- **Restaurant**: New order alert; order at-risk alert; optional campaign/offer reminders.  
- **Customer**: Order status update; offer/campaign notification; banner for active promotions.  
- **Delivery**: In-app first; extensible to push, WhatsApp, SMS, email, ads (stub or integration).

**Backend**: **Notifications service** or module: create notification (type, recipient, payload), list by user/restaurant, mark read. Optional **delivery worker** (per channel) for future.

---

## Implementation Phases (Suggested)

| Phase | Focus | Backend | Customer App | Restaurant App |
|-------|--------|---------|--------------|----------------|
| A | Foundation | Notifications, Reviews, Tickets APIs; Order timeline & alerts | Notifications panel, Banner, Reviews, Tickets pages | Order detail (full data, status, customer, call/chat), Order alerts (new + at-risk), Menu images |
| B | Discovery & forms | Chat options/inputSchemas in workflow | Options as cards, follow-up forms, Order tracking page | Price management tab, Promotions tab |
| C | Marketing | Campaigns, Segments, delivery stubs | Campaign/offer notifications | Marketing tab (campaigns, segments, scheduling, delivery) |
| D | Intelligence | Demand suggestions, AI price suggestions | — | Menu suggestions, AI price suggestion UI |

---

## File / Module Mapping (Backend)

- **Order service**: Order timeline, status transition, customer contact fields, at-risk rules.  
- **Restaurant service**: Menu imageUrl; Promotions module; Campaigns module; Reviews (or shared); Tickets (or shared); Price rules.  
- **Customer service** (or shared): Reviews submit/list; Tickets create/list/reply.  
- **Notifications**: New module (e.g. `notification-service`) or under gateway: create, list by user/restaurant, mark read; types: order_status, new_order, at_risk, offer, campaign.

This roadmap should be used to break tasks into TASK-BOARD items and implemented incrementally with both frontend and backend for each feature slice.
