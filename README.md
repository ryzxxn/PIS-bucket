# Personal Image Storage

## Overview

This repository serves as a personal image storage solution. Initially, images were stored using a method that relied on dynamic URL generation for cached media. However, this approach proved futile due to the limitations and challenges posed by dynamic URL generation.

## Deployed Application

The application is deployed and can be accessed [here](https://pis.netlify.app/). Please note that the backend initialization may take around 40-50 seconds due to the free tier hosting on Render.com.

## Why the Change?

### Previous Setup

The previous setup relied on a method that involved dynamic URL generation for cached media. However, this approach faced challenges and limitations, prompting the need for an alternative solution.

### Current Setup

The current solution aims to address the challenges posed by dynamic URL generation for cached media. It was possible to overcome this issue by utilizing a platform called img.BB, which allows caching of images through an API.

## Technical Details

### Technologies Used

- **Frontend:** React
- **Backend:** Express
- **Database:** MongoDB

### Challenges Faced

1. **Limitations of Dynamic URL Generation:** The reliance on dynamic URL generation for cached media posed challenges and limitations, necessitating a shift to a more robust solution.

2. **Transitioning to a Stable Solution:** Finding a stable and reliable solution to overcome the limitations of dynamic URL generation proved to be a significant challenge.
