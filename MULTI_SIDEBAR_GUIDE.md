# Multi-Sidebar Implementation Guide for Spaces Page

## Overview

This guide explains the multi-sidebar implementation on the Spaces page
(`/workspaces`). The system allows three independent, toggleable sidebars
alongside the main content area.

## Architecture

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Left Sidebar (Main)                           │
├──────────┬──────────────────────────────────────────┬──────────┬─────┤
│Secondary │      Main Content Area                   │ Right 1  │ Right│
│ Sidebar  │                                          │          │  2   │
│(Filters) │    KnowledgeBots Component              │ (Details)│(Alerts)
│          │    or Custom Content                     │          │      │
│          │                                          │          │      │
└──────────┴──────────────────────────────────────────┴──────────┴─────┘
```

### Key Components

1. **SpacesLayout.tsx** - Main layout wrapper

   - Orchestrates all sidebars
   - Manages responsive behavior
   - Handles content area expansion

2. **SecondarySidebar.tsx** - Left inner sidebar

   - Purpose: Filters, search, categorization
   - Default width: 16rem (w-64)
   - Collapsed width: 0

3. **RightSidebar1.tsx** - Inner right sidebar

   - Purpose: Item details, metadata, properties
   - Default width: 18rem (w-72)
   - Collapsed width: 0

4. **RightSidebar2.tsx** - Outermost right sidebar
   - Purpose: Notifications, alerts, quick actions
   - Default width: 20rem (w-80)
   - Collapsed width: 0

### State Management

All sidebar states are managed by **useSidebarStore** (Zustand):

```typescript
interface SidebarStore {
  isSecondarySidebarOpen: boolean;
  isRightSidebar1Open: boolean;
  isRightSidebar2Open: boolean;

  toggleSecondarySidebar(): void;
  toggleRightSidebar1(): void;
  toggleRightSidebar2(): void;

  setSecondarySidebarOpen(isOpen: boolean): void;
  setRightSidebar1Open(isOpen: boolean): void;
  setRightSidebar2Open(isOpen: boolean): void;
}
```

## Usage

### Basic Implementation

The Spaces page already implements the multi-sidebar layout:

```typescript
'use client';

import KnowledgeBots from '../knowledge/_components/KnowledgeBots';
import SpacesLayout from '@/components/sidebars/SpacesLayout';

const page = () => {
  return (
    <SpacesLayout>
      <div className='p-6'>
        <KnowledgeBots />
      </div>
    </SpacesLayout>
  );
};

export default page;
```

### Using the Multi-Sidebar Hook

For more complex interactions, use the `useMultiSidebar` hook:

```typescript
'use client';

import { useMultiSidebar } from '@/hooks/useMultiSidebar';
import { Button } from '@/components/ui/button';

export const SidebarControlPanel = () => {
  const {
    openAll,
    closeAll,
    toggleAll,
    toggleSidebar,
    getStates,
    setSidebarOpen,
    isSecondarySidebarOpen,
    isRightSidebar1Open,
    isRightSidebar2Open,
  } = useMultiSidebar();

  return (
    <div className="space-y-2">
      <Button onClick={() => toggleSidebar('secondary')}>
        Toggle Filters {isSecondarySidebarOpen ? '✓' : ''}
      </Button>
      <Button onClick={() => toggleSidebar('right1')}>
        Toggle Details {isRightSidebar1Open ? '✓' : ''}
      </Button>
      <Button onClick={() => toggleSidebar('right2')}>
        Toggle Alerts {isRightSidebar2Open ? '✓' : ''}
      </Button>
      <Button onClick={openAll} variant="outline">
        Open All
      </Button>
      <Button onClick={closeAll} variant="outline">
        Close All
      </Button>
    </div>
  );
};
```

## Customization

### Changing Sidebar Content

Each sidebar component can be customized independently:

#### Secondary Sidebar (Filters)

Edit `/src/components/sidebars/SecondarySidebar.tsx`:

```typescript
<div className="p-4 space-y-4">
  {/* Replace with your content */}
  {/* Example: Search, Filters, Categories, etc. */}
</div>
```

#### Right Sidebar 1 (Details)

Edit `/src/components/sidebars/RightSidebar1.tsx`:

```typescript
<div className="p-4 space-y-4">
  {/* Replace with your content */}
  {/* Example: Item metadata, properties, information */}
</div>
```

#### Right Sidebar 2 (Alerts)

Edit `/src/components/sidebars/RightSidebar2.tsx`:

```typescript
<div className="p-3 space-y-2">
  {/* Replace with your content */}
  {/* Example: Notifications, alerts, quick actions */}
</div>
```

### Adjusting Sidebar Widths

Modify the width classes in each sidebar component:

```typescript
// Current: w-64 (256px) for secondary
// Change to: w-80 (320px) or any other Tailwind size
isSecondarySidebarOpen ? 'w-64' : 'w-0';
```

Available Tailwind width classes:

- `w-60` (240px)
- `w-64` (256px)
- `w-72` (288px)
- `w-80` (320px)
- `w-96` (384px)

### Changing Animation Duration

Modify the transition duration in sidebar components:

```typescript
// Current: duration-300 (300ms)
// Change to: duration-200 or duration-500
className={cn(
  'transition-all duration-300 ease-in-out',
  ...
)}
```

### Styling

All sidebars use:

- **Light mode**: White background with gray borders
- **Dark mode**: Gray-950 background with gray-800 borders
- **Smooth transitions**: 300ms ease-in-out animation
- **Subtle shadows**: On hover state

To customize styling globally, modify the Tailwind classes in each sidebar
component.

## Features

✅ **Independent Toggle Control**

- Each sidebar can be opened/closed independently
- Multiple sidebars can be open simultaneously
- Smooth animations for each transition

✅ **Responsive Design**

- Main content expands when sidebars close
- Maintains layout integrity
- Scrollable content areas

✅ **Clean UI/UX**

- Minimal, professional design
- Light borders and subtle shadows
- Icon-based toggle buttons with tooltips
- Dark mode support

✅ **Performance**

- Zustand for efficient state management
- Smooth CSS transitions
- No unnecessary re-renders

✅ **Accessibility**

- Proper ARIA labels on buttons
- Keyboard navigable
- High contrast text

## File Structure

```
src/
├── stores/
│   └── useSidebarStore.ts (Updated with 3 new sidebar states)
├── hooks/
│   └── useMultiSidebar.ts (New multi-sidebar management hook)
├── components/
│   ├── sidebars/
│   │   ├── SecondarySidebar.tsx (New)
│   │   ├── RightSidebar1.tsx (New)
│   │   ├── RightSidebar2.tsx (New)
│   │   ├── SpacesLayout.tsx (New)
│   │   └── index.ts (New)
│   └── ...
└── app/
    └── (protected)/
        └── workspaces/
            └── page.tsx (Updated to use SpacesLayout)
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS Grid and Flexbox support
- Smooth transitions require CSS3 support

## Performance Considerations

1. **Virtual Scrolling**: For large lists in sidebars, consider using
   react-window
2. **Code Splitting**: Sidebar components are already in separate files
3. **State Updates**: Zustand is optimized for minimal re-renders
4. **Animation Performance**: CSS transitions are GPU-accelerated

## Troubleshooting

### Sidebars not toggling?

- Ensure store is properly initialized
- Check that `useSidebarStore` is imported correctly
- Verify button onClick handlers are connected

### Layout looks broken on mobile?

- The main layout wraps sidebars, check breakpoints in parent layout
- Consider hiding sidebars on mobile (add `hidden md:flex` class)

### Content not scrolling?

- Ensure parent container has `overflow-y-auto`
- Check that inner content div has proper height constraints

### Dark mode not working?

- Verify Tailwind dark mode is enabled in `tailwind.config.ts`
- Check `dark:` prefix classes are present in components

## Future Enhancements

Potential improvements:

1. Add persistence to localStorage for user preferences
2. Add keyboard shortcuts for toggling sidebars (e.g., Cmd/Ctrl + B)
3. Add sidebar resize handles for custom widths
4. Add animation customization settings
5. Add sidebar collapse animation (slide vs fade)
6. Implement sidebar context for sharing data between sidebars

## Support

For issues or questions about the implementation:

1. Check the Architecture section above
2. Review component code in `/src/components/sidebars/`
3. Verify store state with browser DevTools
4. Check Tailwind classes are available in your config
