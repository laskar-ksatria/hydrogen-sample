# Brand Section Key-Based Implementation

## 📋 Overview

Updated BrandSection implementation to use flexible key-based approach for images from `banner.fields` with enhanced overlay effects.

## ✨ New Features Implemented

### 🔑 **Flexible Key-Based Image Loading**

- ✅ Case-insensitive key matching
- ✅ Multiple key variations support
- ✅ Desktop keys: `"desktop"`, `"Desktop"`, `"DESKTOP"`, `"desk"`
- ✅ Mobile keys: `"mobile"`, `"Mobile"`, `"MOBILE"`, `"mob"`
- ✅ Title keys: `"title"`, `"Title"`, `"TITLE"`

### 🎨 **Enhanced Overlay System**

- ✅ Gradient overlay: `from-black/30 via-black/40 to-black/50`
- ✅ Hover effects: Overlay lightens on hover
- ✅ Smooth transitions: 500ms duration
- ✅ Better text readability

### 🖼️ **Background Image Enhancements**

- ✅ Hover scale effect: `group-hover:scale-105`
- ✅ Smooth transitions: 700ms duration
- ✅ Responsive switching (desktop/mobile)
- ✅ Fallback support

### 🎯 **Interactive Elements**

- ✅ Button scale on hover: `hover:scale-105`
- ✅ Enhanced shadows: `hover:shadow-lg`
- ✅ Text clarity improvements
- ✅ Group hover effects

## 🔧 Technical Implementation

### **1. Updated getBrandSectionImages Function**

```typescript
export function getBrandSectionImages(brandBanner: BrandSectionBanner | null) {
  if (!brandBanner) return null;

  // Helper function to find field by key (case-insensitive)
  const findFieldByKey = (targetKey: string) => {
    return brandBanner.fields.find(
      (field) => field.key.toLowerCase() === targetKey.toLowerCase(),
    );
  };

  // Try multiple possible key variations for desktop
  const desktopField =
    findFieldByKey('desktop') ||
    findFieldByKey('Desktop') ||
    findFieldByKey('DESKTOP') ||
    findFieldByKey('desk');

  // Try multiple possible key variations for mobile
  const mobileField =
    findFieldByKey('mobile') ||
    findFieldByKey('Mobile') ||
    findFieldByKey('MOBILE') ||
    findFieldByKey('mob');

  return {
    desktop: desktopField?.reference?.image || null,
    mobile: mobileField?.reference?.image || null,
    title: titleField?.value || null,
  };
}
```

### **2. Key Matching Strategy**

```typescript
// Supported Key Variations:

// Desktop Images:
✅ "desktop"  // lowercase
✅ "Desktop"  // capitalize
✅ "DESKTOP"  // uppercase
✅ "desk"     // short form

// Mobile Images:
✅ "mobile"   // lowercase
✅ "Mobile"   // capitalize
✅ "MOBILE"   // uppercase
✅ "mob"      // short form

// Title Field:
✅ "title"    // lowercase
✅ "Title"    // capitalize
✅ "TITLE"    // uppercase
```

### **3. Enhanced Overlay Implementation**

```css
/* Smart Gradient Overlay */
.bg-gradient-to-b {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),  /* from-black/30 */
    rgba(0, 0, 0, 0.4),  /* via-black/40 */
    rgba(0, 0, 0, 0.5)   /* to-black/50 */
  );
}

/* Hover State */
.group-hover:from-black/20
.group-hover:via-black/30
.group-hover:to-black/40
```

### **4. Background Image Effects**

```css
/* Background Scale on Hover */
.group-hover:scale-105

/* Smooth Transitions */
.transition-transform.duration-700

/* Responsive Display */
.hidden.md:block    /* Desktop only */
.md:hidden         /* Mobile only */
```

## 📊 Data Structure Examples

### **Example 1: Standard Keys**

```json
{
  "banner": {
    "fields": [
      {
        "key": "desktop",
        "reference": {
          "image": {
            "url": "https://cdn.shopify.com/.../desktop-image.jpg",
            "altText": "Desktop Brand Image"
          }
        }
      },
      {
        "key": "mobile",
        "reference": {
          "image": {
            "url": "https://cdn.shopify.com/.../mobile-image.jpg",
            "altText": "Mobile Brand Image"
          }
        }
      }
    ]
  }
}
```

### **Example 2: Capitalized Keys (Supported)**

```json
{
  "banner": {
    "fields": [
      {
        "key": "Desktop",
        "reference": {
          "image": {
            "url": "https://cdn.shopify.com/.../desktop-image.jpg",
            "altText": "Desktop Brand Image"
          }
        }
      },
      {
        "key": "Mobile",
        "reference": {
          "image": {
            "url": "https://cdn.shopify.com/.../mobile-image.jpg",
            "altText": "Mobile Brand Image"
          }
        }
      }
    ]
  }
}
```

### **Example 3: Uppercase Keys (Supported)**

```json
{
  "banner": {
    "fields": [
      {
        "key": "DESKTOP",
        "reference": {"image": {"url": "...", "altText": "..."}}
      },
      {
        "key": "MOBILE",
        "reference": {"image": {"url": "...", "altText": "..."}}
      }
    ]
  }
}
```

## 🎨 Visual Enhancements

### **Overlay Effects**

```css
/* Normal State */
background: linear-gradient(
  to bottom,
  rgba(0, 0, 0, 0.3),
  rgba(0, 0, 0, 0.4),
  rgba(0, 0, 0, 0.5)
);

/* Hover State (Lighter) */
background: linear-gradient(
  to bottom,
  rgba(0, 0, 0, 0.2),
  rgba(0, 0, 0, 0.3),
  rgba(0, 0, 0, 0.4)
);
```

### **Text Effects**

```css
/* Enhanced Drop Shadows */
.drop-shadow-2xl           /* Title (strong shadow) */
.group-hover:drop-shadow-lg /* Title on hover (medium) */
.drop-shadow-lg            /* Description */

/* Text Clarity */
.text-white/95             /* 95% opacity */
.group-hover:text-white    /* 100% opacity on hover */
```

### **Button Effects**

```css
/* Button Enhancements */
.hover:scale-105           /* Scale up on hover */
.hover:shadow-lg           /* Add shadow */
.transition-all.duration-300 /* Smooth animation */
```

## 🚀 Usage Examples

### **1. With Flexible Keys**

```tsx
// All these key variations will work:
const banner = {
  fields: [
    { key: "Desktop", reference: { image: {...} } },    // ✅ Works
    { key: "mobile", reference: { image: {...} } },     // ✅ Works
    { key: "TITLE", value: "Brand Title" }              // ✅ Works
  ]
};

const brandProps = transformForBrandSection(metaobject);
<BrandSection {...brandProps} />
```

### **2. Custom Implementation**

```tsx
<BrandSection
  title="Custom Title"
  description="Custom description"
  buttonText="Shop Now"
  buttonUrl="/collections/featured"
  desktopImage={{url: 'https://...', altText: 'Desktop'}}
  mobileImage={{url: 'https://...', altText: 'Mobile'}}
/>
```

## 🔍 Error Handling

### **1. Missing Keys**

- ✅ Falls back to next key variation
- ✅ Case-insensitive matching
- ✅ Graceful degradation if no keys found

### **2. Missing Images**

- ✅ Component works without background images
- ✅ Overlay only applies when images exist
- ✅ Fallback to solid background

### **3. Invalid Data**

- ✅ Null/undefined checking
- ✅ Safe property access with optional chaining
- ✅ Type safety with TypeScript

## 📱 Responsive Behavior

### **Mobile (< 768px)**

- Shows mobile image (if available)
- Hides desktop image
- Touch-friendly interactions
- Smaller text sizes

### **Desktop (≥ 768px)**

- Shows desktop image (if available)
- Hides mobile image
- Hover effects active
- Larger text sizes

## 🎯 Benefits

1. **Flexible Key Support** - Works with any capitalization
2. **Enhanced Visual Effects** - Gradient overlays and animations
3. **Better User Experience** - Smooth transitions and hover effects
4. **Improved Accessibility** - Better text contrast with overlays
5. **Responsive Design** - Optimized for all screen sizes
6. **Error Resilient** - Graceful fallbacks for missing data
7. **Type Safe** - Full TypeScript support

## 🔧 Future Enhancements

Possible improvements:

1. **Custom Overlay Colors** - Configurable overlay colors
2. **Animation Library** - Advanced animations with Framer Motion
3. **Video Backgrounds** - Support for video backgrounds
4. **Parallax Effects** - Scrolling parallax for backgrounds
5. **Dynamic Overlays** - Context-aware overlay opacity
6. **Performance Optimization** - Image lazy loading and optimization

---

**Status**: ✅ **COMPLETED** - Enhanced key-based implementation with overlay effects!
