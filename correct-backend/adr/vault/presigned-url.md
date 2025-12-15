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

Previously, we used the `uploadToS3` function to upload files directly from the frontend to Amazon S3. However, this approach required enabling public read-write access to update and delete files, exposing the bucket to potential security risks.

### Decision

We have decided to use presigned URLs to upload files to S3. The backend will generate a presigned URL, and the frontend will use this URL to upload files. This approach enhances security by controlling access through time-limited URLs and allows user validation before granting access.

### Status

**Accepted**

## Details

### Assumptions

- Using presigned URLs is a secure and AWS-recommended practice for controlled file uploads.
- The backend is responsible for generating presigned URLs and validating user requests.
- The frontend will use the provided presigned URL to upload files directly to S3.

### Constraints

- The presigned URL has an expiration time, after which it becomes invalid.
- Additional backend logic is required to generate and manage presigned URLs.
- The `uploadToS3` function must be updated to support presigned URLs.

### Positions

- Continue using direct uploads to S3 with public access (Rejected due to security concerns).
- Implement presigned URL-based uploads (Accepted for security and access control).
- Use an intermediary backend service for file uploads (Not chosen due to potential performance bottlenecks and increased backend load).

### Argument

- Presigned URLs improve security by limiting public access to the S3 bucket.
- The backend can enforce authentication and authorization before generating a presigned URL.
- The time-limited nature of presigned URLs reduces the risk of unauthorized access.
- This method aligns with AWS best practices for secure file uploads.

### Implications

- Enhanced security by preventing direct public access to the S3 bucket.
- The `uploadToS3` function must be updated to use presigned URLs.
- Backend modifications are required to generate presigned URLs and validate user requests.

## Related

### Related decisions

- Decision to use Amazon S3 for file storage.

### Related requirements

- Secure file upload mechanism.
- User authentication and authorization before file uploads.

### Related artifacts

- AWS S3 documentation on presigned URLs.

### Related principles

- Security by design.
- Least privilege access control.

## Notes

- The expiration time of presigned URLs should be carefully chosen to balance security and usability.
- Monitoring and logging mechanisms should be implemented to track file uploads and potential misuse.
