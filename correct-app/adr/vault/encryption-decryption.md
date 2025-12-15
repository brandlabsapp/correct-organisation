# ADR: Uploading Files to S3 Using Presigned URLs

## Contents:

- [Summary](#summary)
  - [Issue](#issue)
  - [Decision](#decision)
  - [Status](#status)
- [Details](#details)
  - [Assumptions](#assumptions)
  - [Constraints](#constraints)
  - [Positions](#positions)
  - [Argument](#argument)
  - [Implications](#implications)
- [Related](#related)
  - [Related decisions](#related-decisions)
  - [Related requirements](#related-requirements)
  - [Related artifacts](#related-artifacts)
  - [Related principles](#related-principles)
- [Notes](#notes)

## Summary

### Issue

- we need to provide support for encryption and decryption of files E2EE.
- we need to decide on the encryption algorithm to use.
- we need to decide on the key management strategy.

### Decision

- We have decided to use AES-256-CBC to encrypt the file. Currently the frontend
  is generating the key and encrypting the file. And we are using CryptoJS to
  encrypt and decrypt the file.
- Why AES ?
  - AES is a symmetric encryption algorithm that is fast and secure.
  - AES-256-CBC is a secure encryption algorithm that is widely used.
  - AES-256-CBC is supported by all major browsers.
  - AES-256-CBC is mostly used in file encryption and decryption.

### Status

**Pending**

## Details

### Assumptions

- The Frontend is responsible for encrypting the file and the backend is
  responsible for generating the presigned URL and decrypting the file.
- The key will be stored in the database and used to decrypt the file when it is
  downloaded.
- The frontend will use the provided presigned URL to upload files directly to
  S3.

### Constraints

- while encryption and decryption we need to use the same algorithm and key.

  ### Encryption

  - the key must be stored in the database and used to decrypt the file when it
    is downloaded.
  - In encryption method ArrayBuffer can be converted to wordArray and then to
    base64string.
  - Encrypted data will be larger than the original data (as it includes the
    IV).

  #### Decryption

  - In decryption method base64string can be converted to wordArray and then to
    ArrayBuffer.

### Positions

- The secret key must be stored securely in the database.
- The file must be encrypted using AES-256-CBC.
- The key must be stored in the database and used to decrypt the file when it is
  downloaded.

### Argument

- Enhanced security by preventing direct public access to the S3 bucket.
- The `uploadToS3` function must be updated to use presigned URLs.
- Backend modifications are required to generate presigned URLs and validate
  user requests.
- The GPT is suggesting to use client side encryption (preferred in IndexedDB)
  for better security.
- My thoughts on this : we can generate the key in the backend and store it in
  the database and use it to encrypt and decrypt the file.

## Related

### Related decisions

- [Presigned URLs](./presigned-url.md)

### Related requirements

- AES-256-CBC encryption.
- Secret key must be stored securely in the database.
- CryptoJS encryption.
- Key must be stored in the database and used to decrypt the file when it is
  downloaded.

### Related artifacts

- [AES-256-CBC encryption decryption](https://stackoverflow.com/questions/60520526/aes-encryption-and-decryption-of-files-using-crypto-js#:~:text=encrypt%20.-,CryptoJS.,to%20directly%20create%20the%20blob.)

- [AES-E2EE](https://stackoverflow.com/questions/73551878/how-to-encrypt-files-with-aes-algorithm-with-cryptojs)

### Related principles

## Notes
