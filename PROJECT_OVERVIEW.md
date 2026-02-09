# Wild Flower - Project Documentation

## 1. Project Overview
**Wild Flower** is a lightweight, mobile-first Inventory & Order Management System (OMS) designed for boutique shops. It is built as a Progressive Web App (PWA) to be installable on mobile devices.

### key Features
*   **Inventory Management**: Track stock levels for products.
*   **Order Processing**: manage order lifecycle (Pending → Paid → Shipping → Completed).
*   **Product Master**: Define products with categories and automatic code generation.
*   **Instagram Integration**: Connect (simulated) to Instagram for order notifications.
*   **Clean UI/UX**: A minimalist, nature-inspired design (Sage, Terracotta, Sand colors).

---

## 2. Technology Stack
*   **Framework**: React (Vite)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (Custom color palette)
*   **State Management**: React Context API (`DataContext`)
*   **Routing**: React Router DOM
*   **Persistence**: `localStorage` (Currently local-only)

---

## 3. Directory Structure
```
src/
├── components/       # Reusable UI components
│   └── Layout.tsx    # Main app shell (Navigation, Header)
├── context/          # Global state management
│   └── DataContext.tsx # The "Brain" of the app
├── pages/            # Page components
│   ├── Welcome.tsx   # Landing & Onboarding
│   ├── Inbox.tsx     # Message/Notification center
│   ├── Inventory.tsx # Stock overview
│   ├── OrderManagement.tsx # Order processing board
│   ├── ProductMasterPage.tsx # Product creation
│   └── Settings.tsx  # App configuration
├── App.tsx           # Routing configuration
├── main.tsx          # Entry point
└── index.css         # Global styles & Tailwind directives
```

---

## 4. Key Modules & Implementation Details

### A. Global State (`src/context/DataContext.tsx`)
This file acts as the central database and logic controller for the application.
*   **Data Models**:
    *   `InventoryItem`: Links products to stock levels.
    *   `Order`: details about customer, product, and status.
    *   `ProductMaster`: Definitions of products (Name, Code, Price).
    *   `InstagramConfig`: Stores handle and connection status.
*   **Key Functions**:
    *   `addOrder()`: Creates an order AND deducts stock automatically.
    *   `updateOrderStatus()`: Moves orders through the workflow.
    *   `connectInstagram()`: Mocks the API connection process.
    *   `updateAdminPassword()`: Manages the admin access control.

### B. Routing & Navigation (`src/App.tsx`, `src/components/Layout.tsx`)
*   **Entry Point (`/`)**: handled by `Welcome.tsx`.
    *   If first run -> Shows "Set Password" screen.
    *   If returning -> Shows "Start Managing" button.
*   **App Routes (`/inbox`, `/inventory`, etc.)**:
    *   These are wrapped in `Layout.tsx`.
    *   **Layout**: Provides the persistent top header and bottom navigation bar, ensuring a native app-like feel.

### C. Onboarding Flow (`src/pages/Welcome.tsx`)
*   **Purpose**: To provide a branded, professional entry point.
*   **Logic**:
    *   Checks `isPasswordSet` from `DataContext`.
    *   If `false` (Default '1234'), it forces the user to set a new password with double-entry confirmation.
    *   The UI is optimized for mobile to prevent keyboard overlap.

### D. Settings & Configuration (`src/pages/Settings.tsx`)
*   **Instagram Connection**:
    *   Simulates an OAuth flow with a loading state (`isVerifying`).
    *   Persists the connected handle to `localStorage`.
*   **Category Management**:
    *   Allows adding/removing product categories (e.g., Dress, Top).
    *   These categories are used in the Product Master to generate codes (e.g., `DR-001`).

### E. Order Management (`src/pages/OrderManagement.tsx`)
*   **Kanban-style Logic**:
    *   Orders are grouped by status: `Pending` → `Paid` → `Shipping` → `Completed`.
    *   Users can click "Next Step" to advance an order's status.
    *   **Visual Cues**: Each status has a distinct color (Yellow, Blue, Orange, Green).

---

## 5. Design System
The app uses a custom Tailwind configuration (`tailwind.config.js`) to enforce consistency.

*   **Sage (Green)**: Primary brand color, used for headers and primary actions.
*   **Terracotta (Orange/Red)**: Accent color, used for alerts or high-priority actions.
*   **Sand (Beige)**: Background color, creating a warm, paper-like texture.
*   **Cream**: Used for card backgrounds and the logo container.
