# Column Panels Implementation Guide

## Overview

This guide explains the column-based panel system implemented on the Spaces
page. The system provides 3 independent, horizontally-stacked panels with resize
capabilities.

## Architecture

### Layout Structure

```
┌────────────────────────────────────────────────────────────────────┐
│ Left Sidebars │ Panel 1 │ Panel 2 │ Panel 3 │ Main Content Area    │
│               │ Matters │ Data    │ Chat    │ (Flexible Space)     │
│               │ (350px) │ Room    │ History │                      │
│               │         │ (350px) │ (350px) │                      │
└────────────────────────────────────────────────────────────────────┘

Each panel can independently:
- Toggle visibility (open/close)
- Resize horizontally (250px - 600px)
- Display custom content with headers and scrollable areas
```

## Core Components

### 1. **ColumnPanel.tsx** - Reusable Panel Component

Displays a single column panel with header, scrollable content, and resize
handle.

**Features:**

- Title and icon
- Close/hide button
- Custom action buttons
- Scrollable content area
- Drag-to-resize functionality
- Smooth animations

**Usage:**

```typescript
<ColumnPanel
  id="panel1"
  title="Matters"
  icon={<BookOpen />}
  isVisible={isVisible}
  width={width}
  onToggle={() => togglePanel()}
  onResize={(width) => resizePanel(width)}
  actions={<Button>Action</Button>}
>
  {/* Panel content */}
</ColumnPanel>
```

### 2. **ColumnPanelsContainer.tsx** - Main Panels Container

Orchestrates all 3 panels with pre-configured content.

**Default Panels:**

- **Panel 1 (Matters)**: Displays matter items with status badges
- **Panel 2 (Data Room)**: Shows file categories and counts
- **Panel 3 (Chat History)**: Displays conversation history

**Features:**

- Manages all panel states
- Provides resize handles between panels
- Automatic layout adjustment

### 3. **PanelControls.tsx** - Global Panel Controls

Toolbar component with global control buttons.

**Buttons:**

- Show All
- Hide All
- Reset (restore default widths)
- Display visible panel count

**Usage:**

```typescript
<div className="toolbar">
  <PanelControls />
</div>
```

### 4. **PanelToggleHeader.tsx** - Individual Toggle Buttons

Header with individual toggle buttons for each panel.

**Features:**

- Shows/hides individual panels
- Visual indicator of active panels
- Icon + label display

**Usage:**

```typescript
<div className="header">
  <PanelToggleHeader />
</div>
```

## State Management

### Store: `useColumnPanelStore` (Zustand)

```typescript
interface PanelState {
  isVisible: boolean;
  width: number;
}

interface ColumnPanelStore {
  panels: {
    panel1: PanelState;
    panel2: PanelState;
    panel3: PanelState;
  };

  // Visibility control
  togglePanel(panelId): void;
  setPanelVisibility(panelId, boolean): void;

  // Width/resize control
  setPanelWidth(panelId, width): void;
  resetPanelWidth(panelId): void;

  // Bulk operations
  showAllPanels(): void;
  hideAllPanels(): void;
  resetAllPanels(): void;
}
```

### Default Values

- **Default Width**: 350px
- **Min Width**: 250px
- **Max Width**: 600px
- **Animation Duration**: 300ms

## Usage

### Basic Integration

The Spaces page now uses `SpacesLayout` with column panels by default:

```typescript
'use client';

import KnowledgeBots from '../knowledge/_components/KnowledgeBots';
import SpacesLayout from '@/components/sidebars/SpacesLayout';

const page = () => {
  return (
    <SpacesLayout showColumnPanels={true}>
      {/* Optional: fallback content if showColumnPanels is false */}
      <div className='p-6'>
        <KnowledgeBots />
      </div>
    </SpacesLayout>
  );
};
```

### Using the Hook for Programmatic Control

```typescript
'use client';

import { usePanelManagement } from '@/hooks/usePanelManagement';
import { Button } from '@/components/ui/button';

export const CustomPanelControl = () => {
  const {
    togglePanel,
    showAllPanels,
    hideAllPanels,
    resizePanel,
    getVisiblePanelCount,
  } = usePanelManagement();

  return (
    <div className="space-y-2">
      <Button onClick={() => togglePanel('panel1')}>
        Toggle Matters
      </Button>
      <Button onClick={() => resizePanel('panel1', 400)}>
        Resize to 400px
      </Button>
      <p>Visible panels: {getVisiblePanelCount()}/3</p>
    </div>
  );
};
```

## Customization

### Adding Custom Panel Content

Edit `ColumnPanelsContainer.tsx` to customize panel content:

```typescript
<ColumnPanel
  id="panel1"
  title="Matters"
  // ... other props
>
  {/* Replace with your custom content */}
  <div className="space-y-3">
    {/* Your content here */}
  </div>
</ColumnPanel>
```

### Changing Panel Widths

Update in `useColumnPanelStore.ts`:

```typescript
const DEFAULT_PANEL_WIDTH = 350; // Change this value
```

Or dynamically at runtime:

```typescript
const { resizePanel } = usePanelManagement();
resizePanel('panel1', 450); // Set to 450px
```

### Customizing Animations

Update transition classes in `ColumnPanel.tsx`:

```typescript
// Current: duration-300 (300ms)
// Change to: duration-200 (faster) or duration-500 (slower)
className = 'transition-all duration-300 ease-in-out';
```

### Changing Panel Limits

Edit width constraints in `useColumnPanelStore.ts`:

```typescript
// Current: 250px - 600px
width: Math.max(250, Math.min(width, 600)),

// Change to your preferred range
width: Math.max(200, Math.min(width, 800)),
```

### Custom Resize Handle Styling

Edit in `ColumnPanel.tsx`:

```typescript
<div
  className="group relative w-1 cursor-col-resize bg-transparent hover:bg-blue-500/50"
  // Customize colors and width
/>
```

## Features

✅ **Independent Toggle Control**

- Each panel can be shown/hidden independently
- Multiple panels can be open simultaneously
- Clean toggle buttons and smooth animations

✅ **Drag-to-Resize**

- Click and drag resize handles between panels
- Width constraints (250px - 600px)
- Real-time visual feedback

✅ **Responsive Layout**

- Panels automatically adjust when others collapse
- Main content expands when panels are hidden
- Maintains layout integrity

✅ **Accessibility**

- Proper ARIA labels and titles
- Keyboard navigable
- High contrast colors

✅ **Dark Mode Support**

- Full dark mode styling
- Consistent with app theme

✅ **Performance Optimized**

- Zustand for efficient state management
- CSS transitions for smooth animations
- No unnecessary re-renders

✅ **Customizable**

- Easy to swap panel content
- Configurable widths and animations
- Reusable components

## File Structure

```
src/
├── stores/
│   └── useColumnPanelStore.ts (NEW - Panel state management)
├── hooks/
│   └── usePanelManagement.ts (NEW - Panel control hook)
├── components/
│   ├── panels/ (NEW)
│   │   ├── ColumnPanel.tsx (NEW - Reusable panel)
│   │   ├── ColumnPanelsContainer.tsx (NEW - 3-panel container)
│   │   ├── PanelControls.tsx (NEW - Global controls)
│   │   ├── PanelToggleHeader.tsx (NEW - Toggle buttons)
│   │   └── index.ts (NEW)
│   └── sidebars/
│       └── SpacesLayout.tsx (UPDATED)
└── app/(protected)/
    └── workspaces/
        └── page.tsx (EXISTING)
```

## Integration Examples

### Adding Panel Controls to Layout Header

```typescript
import { PanelToggleHeader, PanelControls } from '@/components/panels';

export const SpacesHeader = () => {
  return (
    <header className="border-b bg-white p-4">
      <div className="flex items-center justify-between">
        <h1>Workspaces</h1>
        <PanelToggleHeader />
        <PanelControls />
      </div>
    </header>
  );
};
```

### Using Multiple Control Options

```typescript
export const CustomLayout = () => {
  const { togglePanel, showAllPanels } = usePanelManagement();

  return (
    <div>
      <header>
        <PanelToggleHeader />
      </header>
      <SpacesLayout showColumnPanels={true} />
    </div>
  );
};
```

### Conditional Panel Visibility

```typescript
'use client';

import { useColumnPanelStore } from '@/stores/useColumnPanelStore';

export const ConditionalPanels = () => {
  const store = useColumnPanelStore();

  // Hide a panel on mount
  useEffect(() => {
    store.setPanelVisibility('panel2', false);
  }, []);

  // Show panel when data loads
  useEffect(() => {
    if (dataLoaded) {
      store.setPanelVisibility('panel1', true);
    }
  }, [dataLoaded]);

  return <SpacesLayout showColumnPanels={true} />;
};
```

## Resize Behavior

### How Resize Works

1. **Click and hold** on the resize handle between panels
2. **Drag horizontally** to increase/decrease panel width
3. **Width constraints** are enforced (min: 250px, max: 600px)
4. **Release** to finalize the new width
5. **Persists** in store until reset

### Programmatic Resize

```typescript
const { resizePanel } = usePanelManagement();

// Set specific width
resizePanel('panel1', 400);

// Reset to default
store.resetPanelWidth('panel1');
```

## Troubleshooting

### Panels not showing?

1. Ensure `showColumnPanels={true}` in SpacesLayout
2. Check that store is properly initialized
3. Verify `useColumnPanelStore` visibility states are true

### Resize handle not working?

1. Ensure mouse move tracking is enabled
2. Check browser console for errors
3. Verify resize handler is attached to correct div

### Content not scrolling?

1. Ensure parent has `overflow-y-auto`
2. Check that inner content div exists
3. Verify height constraints are set

### Animation not smooth?

1. Check browser GPU acceleration is enabled
2. Verify CSS transition duration is set
3. Check for performance issues on slower devices

### Dark mode not working?

1. Verify Tailwind dark mode is enabled
2. Check `dark:` prefix classes present
3. Clear cache and rebuild

## Advanced Features

### Persist Panel State to LocalStorage

```typescript
// Add to useColumnPanelStore.ts after create()
useColumnPanelStore.subscribe(state => {
  localStorage.setItem('panelState', JSON.stringify(state.panels));
});

// Load on app start
const savedState = localStorage.getItem('panelState');
if (savedState) {
  // Apply to store
}
```

### Keyboard Shortcuts for Panels

```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case '1':
          store.togglePanel('panel1');
          break;
        case '2':
          store.togglePanel('panel2');
          break;
        case '3':
          store.togglePanel('panel3');
          break;
      }
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

### Responsive Breakpoints

Add media query adjustments in `ColumnPanel.tsx`:

```typescript
// Hide panels on mobile
// Add responsive width limits
```

## Performance Notes

- **Virtual Scrolling**: For large lists, consider react-window
- **Memoization**: Panel components are auto-memoized
- **Animation Performance**: Uses GPU-accelerated CSS transitions
- **State Updates**: Zustand minimizes unnecessary re-renders

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS Grid and Flexbox
- Smooth scrolling support recommended
- CSS3 transitions required

## Next Steps

1. **Customize Content**: Replace placeholder content in panels
2. **Add Controls**: Integrate PanelToggleHeader or PanelControls in your header
3. **Connect Data**: Wire panels to your data/API
4. **Test Resize**: Test drag-to-resize functionality
5. **Optimize**: Adjust widths and animations to your needs
6. **Persist State** (optional): Add localStorage integration
7. **Add Keyboard Shortcuts** (optional): Enhance UX
