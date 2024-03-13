# Personal Image Storage

## Overview

This repository serves as a personal image storage solution, replacing the previous Discord CDN-based approach. The decision to migrate was prompted by changes in Discord's URL regeneration policy and limitations on media file sizes. The new solution utilizes Telegram as a reliable and feature-rich alternative.

## Why the Change?

### Previous Setup

Previously, images were stored on Discord CDN, and their links were stored in a MongoDB cluster on the cloud. An API facilitated retrieval, providing URLs for displaying images on the client side. However, Discord's policy changes, including URL regeneration, led to obsolescence of old image URLs.

### Current Setup

1. **Telegram Integration:** Telegram was chosen as an alternative due to its stable Terms and Conditions and the absence of a 25MB limit on media file sizes (unlike Discord's free tier).

2. **Increased Upload Limits:** Telegram supports unlimited uploads with file sizes up to 2GB, providing a significant improvement over Discord's restrictions.

## Technical Details

### Technologies Used

- **Frontend:** React
- **Backend:** Express
- **Database:** MongoDB

### Challenges Faced

1. **Discord Policy Changes:** Discord's URL regeneration policy necessitated a shift to a more reliable platform.

2. **Learning Telegram Webhook API:** To integrate Telegram into the system, understanding and implementing the Telegram Webhook API were essential.

## Repository Structure

