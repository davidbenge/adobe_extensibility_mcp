> **FRAMEWORK EXAMPLE**: This file demonstrates the structure of a UI-framework-specific pattern library doc. It is Adobe React Spectrum-specific. If your project uses a different UI framework, replace this file with the equivalent for your framework (MUI, Tailwind, Ant Design, etc.) or delete it.

# React Spectrum UI Patterns

> **Context pattern library for React Spectrum UI components**  
> Use this when implementing or reviewing UI code in Pattern Atlas so AI agents can generate React Spectrum-based interfaces correctly.

---

## Problem Space

### Domain Overview

Pattern Atlas uses **Adobe React Spectrum** for the web UI: layout, forms, lists, navigation, and dialogs. Key characteristics:

- **Component set**: `@adobe/react-spectrum` (View, Flex, Grid, Heading, Text, Button, TextField, SearchField, Picker, etc.) and `@spectrum-icons/workflow` for icons.
- **Theming**: `Provider` with `defaultTheme` (or custom theme); optional `colorScheme` and `locale`.
- **Routing**: React Router (`HashRouter`, `Routes`, `Route`, `NavLink`) for SPA navigation.
- **State**: React `useState` / `useEffect` for local and route-driven state; no global store in the current codebase.
- **Accessibility**: Spectrum components are built for a11y (ARIA, keyboard, focus); prefer Spectrum primitives over raw HTML for consistent behavior.
- **Data**: Some views use embedded data (e.g., product list in ProductDetail); others fetch from Runtime actions (e.g., retrieval, content browser).

Pattern Atlas uses React Spectrum for:

- **App shell**: Provider, sidebar navigation, main content area, chat panel.
- **Content browser and libraries**: Use Cases Library, Diagram Library, Products, Personas, KPIs, Glossary, etc.
- **Detail views**: Product detail, Use Case detail, Sales Play detail, Connector detail.
- **Forms and search**: SearchField for filtering lists; forms where needed.
- **Feedback**: IllustratedMessage for empty/error states; Well for grouped content; Badge for counts.

### Key Concepts

| Concept | Description |
|--------|-------------|
| **Provider** | Wraps the app; provides theme and locale. Use once at the root (e.g., in App.tsx). |
| **View / Flex / Grid** | Layout primitives; View = div-like container, Flex = flexbox, Grid = grid with `areas` or `columns`. |
| **Spectrum components** | Button, TextField, SearchField, Picker, Checkbox, etc.; use controlled props (value, onChange) for forms. |
| **NavLink** | React Router link with `className={({ isActive }) => ... }` for active state; use with SideBar for navigation. |
| **IllustratedMessage** | Empty state or error UI with icon and message. |

### Common Challenges

1. **Import path**: Components come from `@adobe/react-spectrum`; icons from `@spectrum-icons/workflow` (e.g., `Book`, `Alert`, `ChevronLeft`).
2. **Layout**: Use Flex/Grid for alignment and spacing; avoid ad-hoc divs with inline styles for structure when Spectrum layout fits.
3. **Responsiveness**: Spectrum Grid supports `repeat('auto-fill', 'size-3000')` and similar; use for responsive cards/lists.
4. **Form handling**: Controlled components with local state; no form library in current codebase—wire value/onChange explicitly.
5. **Accessibility**: Use semantic headings (Heading level), label form fields, and use IllustratedMessage for empty/error so screen readers get clear context.

---

## Solution Patterns

### Pattern: App Shell (Provider, layout, routing)

**Description**: Single Provider at the root, main layout (e.g., sidebar + content), and HashRouter with Routes. Auth or runtime config can be passed via props and stored in state.

**When to apply**: Root component of the React app (e.g., App.tsx).

**Pattern Atlas example** (from `App.tsx`):

```tsx
// src/dx-excshell-1/web-src/src/components/App.tsx
import React, { useEffect, useState } from 'react';
import { Provider, defaultTheme, Grid, View } from '@adobe/react-spectrum';
import ErrorBoundary from 'react-error-boundary';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SideBar from './SideBar';
import ChatPanel from './ChatPanel';
import { Home } from './Home';
// ... other route components

const App: React.FC<AppProps> = (props) => {
  const [authState, setAuthState] = useState({
    user: props.ims?.profile ? { userId: '...', name: '...', email: '...' } : null,
    token: props.ims?.token || null,
    imsOrg: props.ims?.org || null,
    isAuthenticated: !!(props.ims?.token && props.ims?.org)
  });

  props.runtime.on('configuration', ({ imsOrg, imsToken }: any) => {
    setAuthState(prev => ({
      ...prev,
      token: imsToken || prev.token,
      imsOrg: imsOrg || prev.imsOrg,
      isAuthenticated: !!(imsToken && imsOrg)
    }));
  });

  return (
    <ErrorBoundary>
      <Provider theme={defaultTheme}>
        <Router>
          <Grid areas={['sidebar content']} columns={['size-3000', '1fr']} rows={['100vh']} gap="size-0">
            <View gridArea="sidebar" backgroundColor="gray-100" padding="size-200">
              <SideBar />
            </View>
            <View gridArea="content" overflow="auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<ChatPanel />} />
                <Route path="/browse" element={<ContentBrowser />} />
                <Route path="/use-cases-library" element={<UseCasesLibrary />} />
                {/* ... more routes */}
              </Routes>
            </View>
          </Grid>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
};
```

**Guidelines**:

- One `Provider` wrapping the whole app.
- Use Grid or Flex for sidebar + content; assign grid areas or flex order for clarity.
- Keep route list in one place; use lazy loading for heavy pages if needed later.

---

### Pattern: Navigation (SideBar, NavLink, active state)

**Description**: Sidebar built with React Spectrum View/Heading/Text/Divider and React Router NavLink. Use `className={({ isActive }) => ... }` to style the active link and `aria-current="page"` for accessibility.

**When to apply**: Main app navigation (categories, primary links).

**Pattern Atlas example** (from `SideBar.tsx`):

```tsx
// src/dx-excshell-1/web-src/src/components/SideBar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { View, Heading, Divider, Text } from '@adobe/react-spectrum';

const SideBar: React.FC = () => {
  return (
    <View>
      <View marginBottom="size-300">
        <Heading level={3} UNSAFE_style={{ /* gradient text */ }}>Pattern Atlas</Heading>
        <Text UNSAFE_style={{ fontSize: '12px', color: '#6E6E6E' }}>Publishing Platform</Text>
      </View>
      <Divider size="S" marginBottom="size-200" />
      <ul className="SideNav">
        <li className="SideNav-item">
          <NavLink
            className={({ isActive }) => `SideNav-itemLink ${isActive ? 'is-selected' : ''}`}
            aria-current="page"
            end
            to="/"
          >
            🏠 Home
          </NavLink>
        </li>
        <li className="SideNav-item">
          <NavLink
            className={({ isActive }) => `SideNav-itemLink ${isActive ? 'is-selected' : ''}`}
            aria-current="page"
            to="/chat"
          >
            💬 Ask Assistant
          </NavLink>
        </li>
        <Route path="/browse" element={<ContentBrowser />} />
        {/* ... more NavLinks */}
      </ul>
      <Divider size="S" marginTop="size-200" marginBottom="size-200" />
      <View paddingX="size-150">
        <Text UNSAFE_style={{ fontSize: '11px', fontWeight: '600', color: '#6E6E6E', textTransform: 'uppercase' }}>
          Categories
        </Text>
        {/* Category links */}
      </View>
    </View>
  );
};
```

**Guidelines**:

- Use `NavLink` with `to` for SPA navigation; `end` on the root path so child routes don’t all match “/”.
- Apply active class for visual state and `aria-current="page"` for the current page link.
- Use Spectrum typography (Heading, Text) and spacing (margin, padding) for consistency.

---

### Pattern: Data List (cards, grid, search)

**Description**: Display a list of items (e.g., categories, products) as cards or rows. Use Grid with repeat for responsive cards; use SearchField for client-side or server-side filter. Use IllustratedMessage when the list is empty.

**When to apply**: Library landing (e.g., Use Cases Library), list of products, list of use cases.

**Pattern Atlas example** (from `UseCasesLibrary.tsx`):

```tsx
// src/dx-excshell-1/web-src/src/components/UseCasesLibrary.tsx
import React, { useState } from 'react';
import {
  Heading, View, Content, Flex, Text, Divider, SearchField, Grid, repeat, Badge, IllustratedMessage, Well
} from '@adobe/react-spectrum';
import Book from '@spectrum-icons/workflow/Book';

interface CategoryCardProps {
  title: string;
  description: string;
  count: number;
  icon: string;
  href: string;
  color: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, count, icon, href, color }) => (
  <View
    backgroundColor="gray-100"
    borderRadius="medium"
    borderWidth="thin"
    borderColor="gray-300"
    padding="size-300"
    minHeight="size-2000"
    UNSAFE_style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
  >
    <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Flex direction="column" gap="size-150" height="100%">
        <Flex alignItems="center" gap="size-150" justifyContent="space-between">
          <Text UNSAFE_style={{ fontSize: '32px' }}>{icon}</Text>
          <Badge variant="info">{count}</Badge>
        </Flex>
        <Heading level={3} marginTop="size-100">{title}</Heading>
        <Content flex>
          <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '14px' }}>{description}</Text>
        </Content>
        <Text UNSAFE_style={{ marginTop: 'auto', color, fontWeight: 600 }}>Explore {title} →</Text>
      </Flex>
    </a>
  </View>
);

export const UseCasesLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const categories = [ /* ... */ ];

  const filtered = categories.filter(c =>
    searchQuery === '' || c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View padding="size-300">
      <Heading level={1}>Use Cases Library</Heading>
      <SearchField
        placeholder="Search categories..."
        value={searchQuery}
        onChange={setSearchQuery}
        width="size-3600"
        marginBottom="size-300"
      />
      <Grid
        columns={repeat('auto-fill', 'size-3000')}
        autoRows="size-2000"
        gap="size-300"
      >
        {filtered.map(cat => (
          <CategoryCard key={cat.title} {...cat} />
        ))}
      </Grid>
      {filtered.length === 0 && (
        <IllustratedMessage>
          <Book />
          <Heading>No categories match</Heading>
          <Content>Try a different search.</Content>
        </IllustratedMessage>
      )}
    </View>
  );
};
```

**Guidelines**:

- Use Grid with `repeat('auto-fill', 'size-3000')` (or similar) for responsive card grids.
- Use SearchField in controlled mode (`value`, `onChange`) and filter the list in state (or call an API).
- Use IllustratedMessage when the filtered list is empty; include Heading and Content for clarity and a11y.
- Use Badge for counts; use Well to group related content if needed.

---

### Pattern: Detail View (breadcrumbs, headings, metadata)

**Description**: Single-entity detail page with breadcrumbs, heading, description, and metadata (badges, tags, links). Use Breadcrumbs, Heading, Text, Well, and optional IllustratedMessage for not-found.

**When to apply**: Product detail, Use Case detail, Sales Play detail, Connector detail.

**Pattern Atlas example** (from `ProductDetail.tsx`):

```tsx
// src/dx-excshell-1/web-src/src/components/ProductDetail.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heading, View, Content, Flex, Text, Divider, Badge, Breadcrumbs, Item, Well, IllustratedMessage
} from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';
import ChevronLeft from '@spectrum-icons/workflow/ChevronLeft';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  url?: string;
  docs?: string[];
  tags?: string[];
  ports?: { name: string; protocol: string; description: string }[];
  capabilities?: { name: string; description: string; category: string; critical: boolean }[];
  status: string;
  version: string;
}

export const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = productsData[productId!];

  if (!product) {
    return (
      <IllustratedMessage>
        <Alert />
        <Heading>Product not found</Heading>
        <Content>No product with ID "{productId}".</Content>
      </IllustratedMessage>
    );
  }

  return (
    <View padding="size-300">
      <Breadcrumbs>
        <Item key="products">
          <Link to="/products">Products</Link>
        </Item>
        <Item key="current">{product.name}</Item>
      </Breadcrumbs>
      <Flex direction="row" alignItems="center" gap="size-200" marginTop="size-200">
        <Text UNSAFE_style={{ fontSize: '48px' }}>{product.icon}</Text>
        <Flex direction="column">
          <Heading level={1}>{product.name}</Heading>
          <Flex gap="size-100" marginTop="size-100">
            <Badge variant="info">{product.status}</Badge>
            <Badge variant="friendly">{product.version}</Badge>
          </Flex>
        </Flex>
      </Flex>
      <Divider marginY="size-300" />
      <Content>
        <Text>{product.description}</Text>
      </Content>
      {product.tags && product.tags.length > 0 && (
        <Well marginTop="size-300">
          <Heading level={4}>Tags</Heading>
          <Flex wrap gap="size-100" marginTop="size-100">
            {product.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
          </Flex>
        </Well>
      )}
      {/* ports, capabilities, etc. */}
    </View>
  );
};
```

**Guidelines**:

- Use `useParams()` for route params (e.g., productId); resolve entity from data or API and show IllustratedMessage if not found.
- Use Breadcrumbs with Item and Link for hierarchy; current page can be Item without link.
- Use Heading levels consistently (level={1} for title, level={4} for sections); use Well for grouped metadata.
- Use Badge for status, version, tags; use Spectrum Text and Content for body text.

---

### Pattern: Form (controlled inputs, validation)

**Description**: Use React Spectrum form components (TextField, SearchField, Picker, Checkbox, Button) in controlled mode. Hold value in component state and pass value/onChange; validate on submit or on blur as needed.

**When to apply**: Settings, create/edit forms, filters.

**Example structure** (Pattern Atlas style):

```tsx
import { TextField, Button, Flex, Form } from '@adobe/react-spectrum';

const MyForm: React.FC = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    // submit
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        value={name}
        onChange={setName}
        isRequired
        validationState={error ? 'invalid' : undefined}
        errorMessage={error ?? undefined}
      />
      <Flex gap="size-200" marginTop="size-300">
        <Button type="submit" variant="cta">Save</Button>
        <Button type="button" variant="secondary" onPress={() => setName('')}>Clear</Button>
      </Flex>
    </Form>
  );
};
```

**Guidelines**:

- Use `label` and `isRequired` on form fields for accessibility.
- Use `validationState="invalid"` and `errorMessage` when you have a validation error.
- Use Button with `variant="cta"` for primary action and `variant="secondary"` for secondary.

---

### Pattern: Modal / Dialog (overlays)

**Description**: Use React Spectrum Dialog or Modal when you need a focused overlay (confirm, form in modal). Trigger from a Button or link; control visibility with state.

**When to apply**: Confirm delete, “Add item” form in a modal, alert.

**Example structure**:

```tsx
import { DialogTrigger, Dialog, Button, Content, Heading } from '@adobe/react-spectrum';

const [isOpen, setOpen] = useState(false);

<DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
  <Button variant="secondary">Open</Button>
  <Dialog>
    <Heading>Title</Heading>
    <Content>Body content.</Content>
    <ButtonGroup>
      <Button variant="cta" onPress={() => { /* confirm */ setOpen(false); }}>Confirm</Button>
      <Button variant="secondary" onPress={() => setOpen(false)}>Cancel</Button>
    </ButtonGroup>
  </Dialog>
</DialogTrigger>
```

**Guidelines**:

- Control open state so you can close after submit or cancel.
- Use Heading and Content inside the dialog for a11y; ButtonGroup for actions.

---

## Component Structure and Imports

### Typical imports

```tsx
// Layout and structure
import { Provider, defaultTheme, Grid, View, Flex, Content, Heading, Text, Divider, Well } from '@adobe/react-spectrum';

// Forms and inputs
import { TextField, SearchField, Button, Picker, Checkbox } from '@adobe/react-spectrum';

// Feedback and lists
import { Badge, IllustratedMessage, Breadcrumbs, Item } from '@adobe/react-spectrum';

// Icons (workflow set)
import Book from '@spectrum-icons/workflow/Book';
import Alert from '@spectrum-icons/workflow/Alert';
import ChevronLeft from '@spectrum-icons/workflow/ChevronLeft';

// Routing
import { HashRouter as Router, Routes, Route, NavLink, useParams, Link } from 'react-router-dom';
```

### File organization

- One main component per file (e.g., `UseCasesLibrary.tsx` exports `UseCasesLibrary`).
- Subcomponents (e.g., `CategoryCard`) can live in the same file if only used there.
- Types/interfaces at top of file or in a shared `types` file.

---

## State Management

- **Local state**: `useState` for form fields, open/closed, selected item.
- **Route state**: `useParams()`, `useLocation()`, `useNavigate()` for URL-driven views.
- **No global store**: Pattern Atlas does not use Redux or similar; pass props or use React Context only where needed (e.g., AuthContext in App).

---

## Accessibility

- Use **Heading** with appropriate level (1 for page title, 3 for card title, 4 for section).
- Use **label** on form components (TextField, SearchField, Picker).
- Use **IllustratedMessage** for empty and error states with Heading + Content.
- Use **aria-current="page"** on the active NavLink.
- Prefer Spectrum components over raw HTML so focus and keyboard behavior are consistent.

---

## Theming and Styling

- Use `Provider theme={defaultTheme}`; optional `colorScheme="light" | "dark"` and `locale`.
- Use Spectrum size tokens where possible: `padding="size-300"`, `gap="size-200"`, `marginTop="size-100"`.
- Use `UNSAFE_style` or `UNSAFE_className` only when necessary (e.g., gradient text, custom hover); prefer Spectrum props for layout and spacing.

---

## Real Pattern Atlas Examples Summary

| Component | File | Patterns used |
|-----------|------|----------------|
| App | App.tsx | Provider, Grid (sidebar + content), Router, Routes, auth state |
| SideBar | SideBar.tsx | View, Heading, Text, Divider, NavLink, active class, Categories |
| UseCasesLibrary | UseCasesLibrary.tsx | SearchField, Grid, CategoryCard (View, Flex, Badge), IllustratedMessage |
| ProductDetail | ProductDetail.tsx | useParams, Breadcrumbs, Heading, Well, Badge, IllustratedMessage (not found) |
| DiagramLibrary | DiagramLibrary/ | Grid, cards, IllustratedMessage |

---

## Anti-patterns

1. **Raw div/span for layout**: Prefer View, Flex, Grid for structure so spacing and alignment stay consistent.
2. **Uncontrolled form inputs**: Always use value + onChange (or equivalent) so state is predictable and you can validate.
3. **Missing empty/error state**: Use IllustratedMessage when the list is empty or the entity is not found.
4. **Skipping label on inputs**: Always set `label` (and optionally `aria-label`) for form fields.
5. **Multiple Providers**: Use a single Provider at the root; don’t nest Providers unless you need a different theme/locale for a subtree.

---

## Summary

| Pattern | When to use |
|--------|-------------|
| **App Shell** | Root: Provider, Grid (sidebar + content), Router, Routes. |
| **Navigation** | SideBar with NavLink, active class, aria-current, Spectrum typography. |
| **Data List** | Grid with repeat, SearchField, card components, IllustratedMessage when empty. |
| **Detail View** | useParams, Breadcrumbs, Heading, Well, Badge, IllustratedMessage for not-found. |
| **Form** | Controlled TextField/SearchField/Picker/Button, validationState, errorMessage. |
| **Modal** | DialogTrigger + Dialog for overlays; state-controlled open/close. |

Use React Spectrum for layout and form controls, React Router for navigation, and IllustratedMessage for empty and error states so AI-generated UI stays consistent and accessible.
