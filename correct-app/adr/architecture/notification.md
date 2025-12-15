# ADR: Notification Service for React Native App

Contents:

- [Summary](#summary)
  - [Issue](#issue)
  - [Decision](#decision)
  - [Status](#status)
- [Details](#details)
  - [Assumptions](#assumptions)
  - [Constraints](#constraints)
  - [Positions](#positions)
  - [Argument](#argument)
  - [Implications ](#implications)
- [Related](#related)
  - [Related decisions](#related-decisions)
  - [Related requirements](#related-requirements)
  - [Related artifacts](#related-artifacts)
  - [Related principles](#related-principles)
- [Notes](#notes) Here’s how your ADR (Architectural Decision Record) could
  look:

---

## Summary

### Issue

Our React Native application requires a robust and scalable notification system
to support both our initial launch (10 users) and future growth (500-1000 users
in 6-8 months). The system should handle push notifications efficiently while
being cost-effective and easy to integrate.

### Decision

We will use **Firebase Cloud Messaging (FCM)** for push notifications due to its
cost-effectiveness, ease of integration with React Native, and scalability.
Other services like **Knock** and **Novu** were considered but are better suited
for more advanced notification workflows and orchestration.

### Status

**Pending** - will need to revisit this decision as we grow.

---

## Details

### Assumptions

- Our app will require push notifications primarily for user engagement.
- The app is currently at an early stage but needs to be scalable.
- We want a solution with minimal setup effort and low costs initially.
- Assuming we have 10 users at launch, we will need to support 500-1000 users in
  6-8 months.

### Constraints

- Budget is limited, so we prefer a free or low-cost solution.
- The solution should integrate well with **React Native**.
- It should be scalable as the user base grows.

### Positions

1. **Firebase Cloud Messaging (FCM)**

   - Pros: Free, well-documented, easy to implement, directly supports push
     notifications.
   - Cons:
     - Lacks advanced notification workflows (e.g., user preferences, in-app
       notifications).

2. **Knock**

   - Pros: Advanced notification orchestration, multi-channel support (email,
     SMS, in-app, push).
   - Cons: Paid service, more complex than required for our current needs cannot
     be self hosted.

3. **Novu**
   - Pros: Open-source, supports multiple notification channels.
   - Cons: Requires self-hosting for full flexibility or reliance on their
     hosted service and self hosting requires more computing power for server
     eg: for basic installation it requires 1GB of RAM and 8 CPU cores.(it will
     be costly to run on our own servers)

### Argument

- **FCM is the best choice for our current stage** because it is free and
  straightforward for push notifications.
- If our notification needs become more complex (e.g., multi-channel, advanced
  workflows), we can later integrate **Knock** or **Novu**.

### Implications

- Initial development effort will focus on integrating FCM.
- We may need to reevaluate our notification strategy as our app scales.

---

## Related

### Related decisions

- Future decision on multi-channel notifications (email, SMS).
- Potential adoption of a notification orchestration platform if required.

### Related requirements

- The ability to send real-time push notifications.
- Scalability as user count grows.

### Related artifacts

- Firebase setup documentation.
- React Native integration guide.

### Related principles

- Choose cost-effective solutions initially.
- Prioritize scalability and developer experience.

---

## Notes

- We will periodically review our notification system and adjust if necessary.
- Future expansion may involve integrating with a more advanced service.
