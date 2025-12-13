# VetConnect Frontend (Structure & Build Guide)

This project is built with **Next.js (App Router)** + **TypeScript** and follows an architecture designed to **scale** without turning into spaghetti code.

The main goal is to clearly separate:

* **UI (visual components)**
* **Business logic / API integration (core)**
* **Types (types)**
* **Routing (app)**

---

## Tech Stack

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* ESLint

---

## Architecture Philosophy

### Golden Rule

* `src/core/` = “frontend backend” (API logic, auth, services, helpers, constants)
* `src/components/` = UI (Atomic Design)
* `src/app/` = routes, pages, layouts (routing & composition)
* `src/types/` = shared contracts and types

This allows us to:

* keep UI clean
* reuse business logic
* change backend without touching UI
* scale features by modules

---

## Folder Structure

```txt
src/
├── app/                      # Routes and layouts (Next.js App Router)
│   ├── api/                  # API Routes (BFF / frontend endpoints)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/               # UI and reusable components
│   ├── feedback/             # alerts, loaders, toasts, empty states
│   └── ui/                   # Atomic Design
│       ├── atoms/            # buttons, inputs, badges, icon wrappers
│       ├── molecules/        # fields (label+input+error), small cards, modals
│       └── organisms/        # full forms, headers, sidebars, sections
│
├── core/                     # Business logic / “frontend backend”
│   ├── auth/                 # auth service, cookies, guards, helpers
│   ├── api/                  # http client, endpoints, interceptors (future)
│   ├── config/               # global configuration (theme, settings)
│   ├── constants/            # constants (roles, routes, etc.)
│   └── utils/                # helpers (formatters, validators, etc.)
│
└── types/                    # Shared TypeScript types (DTOs, models, enums)
```

---

## Routing (App Router)

Using Next.js App Router:

* `src/app/page.tsx` → `/`
* `src/app/login/page.tsx` → `/login`
* `src/app/dashboard/page.tsx` → `/dashboard`

Folders create routes. `layout.tsx` allows layouts per section.

---

## Styling

Tailwind CSS is the standard.

### Rules

* Avoid `style={{ ... }}` in pages/components.
* Use `className` with Tailwind.
* For reusable styles, create base components (atoms) or layouts.

Example:

```tsx
<main className="min-h-screen grid place-items-center bg-green-50/60">
```

Instead of:

```tsx
<main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
```

---

## How a Feature Is Built (Step by Step)

### 1) Create types (if needed)

In `src/types/`

Examples:

* `types/auth.ts`
* `types/user.ts`
* `types/appointment.ts`

### 2) Create business logic in core

In `src/core/<feature>/`

Examples:

* `core/auth/auth.service.ts`
* `core/auth/auth.cookies.ts`

### 3) Create API routes if a BFF is needed

In `src/app/api/<feature>/.../route.ts`

Used to:

* avoid CORS issues
* set httpOnly cookies from Next
* unify backend access

### 4) Build UI using Atomic Design

* atoms: input, button, etc.
* molecules: field (label+input+error)
* organisms: full forms
* pages: final composition

---

## Login (Mock Mode – No DB, Future-Ready)

### Goal

Have a working login without database connection, but ready to plug in a real backend later.

### Pieces involved

* `core/auth/` → logic and cookie handling
* `app/api/auth/login` → internal endpoint (mock today, real tomorrow)
* `components/ui/organisms/LoginForm` → login UI
* `app/login/page.tsx` → screen

### How it connects later

Only `core/auth/auth.service.ts` needs to change to:

* call real backend
* validate credentials
* return real token/user

---

## Environment Variables

Create `.env.local` at the project root:

```bash
BACKEND_URL=http://localhost:3001
```

(Used when real backend is connected)

---

## Scripts

```bash
npm install
npm run dev
```

App runs at:

* `http://localhost:3000`

---

## Team Conventions

### Naming

* Components: `PascalCase.tsx` (`LoginForm.tsx`)
* Helpers: `camelCase.ts` (`auth.service.ts`)
* Folders: keep consistent (`camelCase` or `kebab-case`)

### Pull Requests

Each PR should include:

* UI + logic + types (if needed)
* short explanation:

  * what was added
  * where it lives
  * how to test it

---

## Roadmap / Next Steps

* [ ] Separate Auth layout (`/login`) without dashboard padding
* [ ] Dashboard layout (sidebar + header)
* [ ] Pets module (types + core + UI + pages)
* [ ] Real backend integration (auth + endpoints)
* [ ] Roles and permission-based UI
* [ ] Global error and loading handling

---

## How to Contribute Quickly (For Teammates)

If you’re creating a new module (e.g. `pets`):

1. `src/types/pets.ts`
2. `src/core/pets/` (service, constants)
3. `src/components/ui/organisms/PetsList.tsx`
4. `src/app/pets/page.tsx`

Keep logic out of UI.

---
# VetConnect Frontend (Estructura + Guía de construcción)

Este proyecto está construido con **Next.js (App Router)** + **TypeScript** y sigue una arquitectura pensada para **escalar** sin que el código se vuelva un caos.

La idea principal es separar bien:

* **UI (componentes visuales)**
* **Lógica de negocio / integración con APIs (core)**
* **Tipos (types)**
* **Rutas (app)**

---

## Stack

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* ESLint

---

## Filosofía de arquitectura

### Regla de oro

* `src/core/` = “backend del frontend” (API, auth, servicios, helpers, constantes)
* `src/components/` = UI (Atomic Design)
* `src/app/` = rutas/páginas/layouts (routing y composition)
* `src/types/` = contratos y tipos compartidos

Esto permite:

* escribir UI limpia
* tener lógica reutilizable
* cambiar backend sin tocar UI
* escalar features por módulos

---

## Estructura de carpetas

```txt
src/
├── app/                      # Rutas y layouts (Next.js App Router)
│   ├── api/                  # API Routes (BFF / endpoints del frontend)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/               # UI y componentes reutilizables
│   ├── feedback/             # alertas, loaders, toasts, empty states
│   └── ui/                   # Atomic Design
│       ├── atoms/            # botones, inputs, badges, icons wrappers
│       ├── molecules/        # field (label+input+error), cards pequeños, modals
│       └── organisms/        # forms completos, headers, sidebars, sections
│
├── core/                     # Lógica de negocio / “backend del frontend”
│   ├── auth/                 # auth service, cookies, guards, helpers
│   ├── api/                  # http client, endpoints, interceptors (futuro)
│   ├── config/               # configuración global (theme, settings)
│   ├── constants/            # constantes (roles, rutas, etc.)
│   └── utils/                # helpers (formatters, validators, etc.)
│
└── types/                    # Tipos TS compartidos (DTOs, modelos, enums)
```

---

## Convención de rutas (App Router)

En Next.js App Router:

* `src/app/page.tsx` → `/`
* `src/app/login/page.tsx` → `/login`
* `src/app/dashboard/page.tsx` → `/dashboard`

Las carpetas crean rutas. Los `layout.tsx` permiten layouts por sección.

---

## Estilos

Usamos Tailwind CSS como estándar.

### Reglas

* Evitar `style={{ ... }}` en páginas/componentes.
* Usar `className` con Tailwind.
* Para estilos reutilizables, crear componentes base (atoms) o layouts.

Ejemplo:

```tsx
<main className="min-h-screen grid place-items-center bg-green-50/60">
```

En vez de:

```tsx
<main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
```

---

## Cómo se construye un feature (paso a paso)

### 1) Crear tipos (si aplica)

En `src/types/`

Ej:

* `types/auth.ts`
* `types/user.ts`
* `types/appointment.ts`

### 2) Crear lógica en core

En `src/core/<feature>/`

Ej:

* `core/auth/auth.service.ts`
* `core/auth/auth.cookies.ts`

### 3) Crear API route si necesitamos BFF

En `src/app/api/<feature>/.../route.ts`

Esto sirve para:

* evitar problemas de CORS
* setear cookies httpOnly desde Next
* unificar el acceso a backend

### 4) Crear UI por Atomic Design

* atoms: input, button, etc.
* molecules: field (label+input+error)
* organisms: forms completos
* pages: composición final

---

## Login (modo mock - sin BD, listo para futuro)

### Objetivo

Tener un login funcional sin conectar BD, pero listo para después conectar backend real.

#### Qué piezas usamos

* `core/auth/` → lógica y manejo de cookies
* `app/api/auth/login` → endpoint interno (mock hoy, real mañana)
* `components/ui/organisms/LoginForm` → UI del login
* `app/login/page.tsx` → pantalla

#### Cómo se conecta en el futuro

Solo se cambia `core/auth/auth.service.ts` para:

* llamar al backend real
* validar credenciales
* retornar token/usuario real

---

## Variables de entorno

Crear `.env.local` en la raíz:

```bash
BACKEND_URL=http://localhost:3001
```

(esto se usará cuando conectemos el backend real)

---

## Scripts

```bash
npm install
npm run dev
```

App en:

* `http://localhost:3000`

---

## Convenciones de trabajo en equipo

### Nombres

* Componentes: `PascalCase.tsx` (`LoginForm.tsx`)
* Helpers: `camelCase.ts` (`auth.service.ts`)
* Carpetas: `kebab-case` o `camelCase` (mantener consistente)

### Pull Requests

Cada feature debe incluir:

* UI + lógica + tipos (si aplica)
* mínimo una explicación breve en el PR:

  * qué se agregó
  * dónde está
  * cómo probarlo

---

## Próximos pasos (roadmap)

* [ ] Layout separado para Auth (`/login`) sin padding de sidebar
* [ ] Dashboard layout (sidebar + header)
* [ ] Módulo de mascotas (types + core + UI + pages)
* [ ] Integración con backend real (Auth + endpoints)
* [ ] Roles y protección por permisos
* [ ] Manejo de errores y loaders globales

---

## Cómo contribuir rápido (para compañeros)

Si vas a crear un módulo nuevo (ej: `pets`):

1. `src/types/pets.ts`
2. `src/core/pets/` (service, constants)
3. `src/components/ui/organisms/PetsList.tsx`
4. `src/app/pets/page.tsx`

Mantener la lógica fuera de UI.

---