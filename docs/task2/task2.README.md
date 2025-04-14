# Membership Export System - Architecture Document

## Overview

This document outlines the architecture for an asynchronous membership export system. The system allows users to request a CSV export of all their membership data, which is then processed asynchronously and delivered via email.

## Architecture Diagram

The PDF illustrates the flow from API request to email delivery, including all necessary infrastructure components to ensure stability and scalability.

## Process Flow

1. **Create Export API Request**: The process begins when a user makes an API request to export their membership data
2. **Authentication & Authorization**: API Gateway validates the user's credentials and permissions
3. **Job Creation**: A job is created in the export service in the application layer and pushed to a queue a SQS or Kafka
4. **Job Processing**: An Export Worker service picks up the job from the queue
5. **Data Retrieval**: The Export Worker fetches the relevant user data from the database
6. **CSV Generation**: The worker generates a CSV file and stores it in object storage
7. **Event Publication**: Upon completion, an event is published to the central Event Bus using the GCP pub/sub
8. **Subscribers**: after the subscribers recieve the published event it sens it to the notification center
9. **Notification service**:
   - Handles the recieved event and transform its data using DTOs
10. **Email Preparation**: The notification service then formats the email with the correct template, localization, and branding
11. **Delivery**: Notifications are delivered through sendgrid

## Design Decisions

### Enhanced Notification System

1. **Google Cloud Pub/sub**:
   - Pub/Sub is an asynchronous and scalable messaging service
   - it decouples Export Worker from the notification service
   - very low latencies ≈100 milliseconds.
2. **SendGrid**:

   - Scallable
   - High deliverability rates
   - Good documentation + easy integration

3. **Notification Preferences**:

   - Users can set channel preferences (email, push, in-app)
   - Support for notification timing preferences
   - Ability to opt-out of specific notification types

4. **Resilience Features**:

   - Automatic retries for failed email delivery
   - Dead-letter queues for failed notifications

5. **Asynchronous Processing**:

   - Used job queues to decouple request and response handling from processing
   - Allows for better scalability and resilience under load

6. **Object Storage**:

   - Temporary storage of exports in S3-compatible storage
   - Pre-signed URLs for secure, time-limited access
   - Automatic expiration policies for data cleanup

7. **Resilience Mechanisms**:

   - Dead Letter Queue for failed jobs
   - Retry mechanisms

8. **Multi-Cloud Flexibility**:

   - Architecture can be implemented across different cloud providers
   - Core components have equivalents in AWS and Azure

9. **Monitoring and Alerting**:

   - Comprehensive monitoring for all components using Google Cloud monitoring or equivalent
   - Setting up Alerting for job failures and performance degradation
   - Distributed Tracing to track individual export requests end-to-end across different containers, services and workers.

10. **RabbitMQ or Kafka**:

- both offer really good solution and there are other really good solutions out there to consider here too, but for the sake of the time limit I choose those two and compared between them:
  - RabbitMQ setup time is quick and easier than kafka
  - Kafka supports horizontal scalling while RabbitMQ needs to add more queues or sharding which can be costy
  - RabbitMQ's messages are gone after ACK but kafka's data can be re-read anytime until TTL at lease
  - RabbitMQ is perfect for tasks under a few minutes, it has a timeout of 30 minutes by default consumer delivery ACK. which is very helpful to detect if an export is stuck in processing for some reason

## Scalability Considerations

1. **Horizontal Scaling**:

   - Worker pools can scale horizontally based on queue depth
   - Database read replicas for handling increased query load

2. **Performance Optimization**:
   - Pagination for large data exports
   - Efficient database queries with proper indexing
   - Increasing number of workers for multiple export processing

## Security Considerations

1. **Data Protection**:

   - Encryption of CSV files at rest
   - Secure, time-limited download links
   - Authentication and authorization at multiple layers, all Cloud infrastructure should be managed by IAM

2. **Access Control**:
   - Audit logging of all export requests and accesses
   - IAM user access control

## Conclusion

This architecture provides a robust, scalable solution for asynchronous membership exports. It leverages cloud-native services to ensure reliability and performance while maintaining security and cost-effectiveness.
