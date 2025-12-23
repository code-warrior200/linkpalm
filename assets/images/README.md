# Listing Images

This folder is for storing product images for palm oil listings.

## How to Add Images

### Option 1: Local Images
1. Add your image files (`.jpg`, `.png`, etc.) to this folder
2. In your code, reference them using `require()`:
   ```typescript
   image: require('../assets/images/palm-oil-product.jpg')
   ```

### Option 2: Remote Images
Use image URLs in your listings:
```typescript
image: 'https://example.com/palm-oil-image.jpg'
```

### Option 3: Upload via App
Users can upload images directly when creating a listing through the CreateListingScreen.

## Image Recommendations
- Recommended format: JPG or PNG
- Recommended size: 800x600px or larger
- Aspect ratio: 4:3 works well for product images
- File size: Keep under 2MB for better performance

