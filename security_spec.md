# Security Specification - Medikatalog

## Data Invariants
1. Products can only be created, updated, or deleted by authenticated admins.
2. Anyone can read product data.
3. Timestamp fields (`createdAt`, `updatedAt`) must be set using server timestamps.
4. Product prices must be positive numbers.
5. `ownerId` logic is not applicable here as it is a public catalog, but write access is restricted to a set of admins.

## The "Dirty Dozen" Payloads (Attacks)
1. **Unauthorized Create**: Non-authenticated user tries to add a product.
2. **Unauthorized Delete**: Non-authenticated user tries to delete a product.
3. **Price Manipulation**: Authenticated user tries to set price to a negative value.
4. **ID Poisoning**: User tries to create a product with a 2KB long ID.
5. **Ghost Field Update**: Admin tries to add `isSecret: true` to a product.
6. **Immutable Field Change**: Admin tries to change `createdAt` of an existing product.
7. **Bypass Admin Check**: Authenticated non-admin developer tries to write to the `products` collection.
8. **Resource Exhaustion**: Sending a payload with a 1MB description.
9. **Email Spoofing**: Trying to access admin features by spoofing user email (must check `email_verified`).
10. **Terminal State Bypass**: Not applicable for this simple catalog, but we'll lock down valid keys.
11. **Malicious Query Scraping**: Trying to list products without filtering (not an issue as products are public).
12. **Relationship Orphanage**: Trying to create a product with an invalid category (must match `MEDICINE_CATEGORIES`).

## Admin List
The following email is considered an admin:
- assyfachanel99@gmail.com
