# SCSS Theming System Turborepo

An advanced SCSS theming system demonstration using Turborepo, Next.js, and TypeScript featuring task management and design system capabilities.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap, Build, and Test
- **Install dependencies**: `yarn install --frozen-lockfile` -- takes 28 seconds
- **Type check all packages**: `yarn check-types` -- takes 3 seconds
- **Build all apps and packages**: `yarn build` -- takes 38 seconds. **NEVER CANCEL**. Set timeout to 60+ minutes
- **Lint all packages**: `yarn lint` -- takes 4 seconds (expect linting errors in only-tasks app: @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars)
- **Format all code**: `yarn format` -- takes 3 seconds

### Development Workflow
- **Start all development servers**: `yarn dev` 
  - **WARNING**: The global `yarn dev` command may hang. Use individual app commands instead:
  - **Only-tasks app**: `cd apps/only-tasks && npm run dev` -- runs on http://localhost:3001 (port 3000 is occupied)
  - **Themes-demo app**: `cd apps/themes-demo && npm run dev` -- runs on http://localhost:7002
- **Build individual apps**: `yarn build --filter=only-tasks` or `yarn build --filter=demo-css-props`
- **Run individual commands**: Use Turborepo filters like `yarn lint --filter=only-tasks`

### Package Managers
- **Primary**: Yarn 1.22.22 (configured in packageManager)
- **Alternative**: npm 10.8.2 works but prefer yarn for consistency
- **NOT AVAILABLE**: pnpm

## Validation

### Manual Testing Requirements
**ALWAYS manually validate changes by running through complete user scenarios after making code changes.**

#### Only-Tasks App (http://localhost:3001)
1. **Landing page**: Verify hero section, features, testimonials, and call-to-action buttons work
2. **Demo functionality**: Click "Try Live Demo" and test:
   - **Task view**: Verify sprint sections, task rows, add/edit task functionality
   - **Kanban view**: Test drag-and-drop, status columns, sprint selector, backlog toggle
   - **Analytics view**: Check charts, statistics, completion metrics, status distributions
   - **Settings**: Test theme toggles, edit modes, field configuration

#### Themes-Demo App (http://localhost:7002)
1. **Theme switching**: Test all combinations of Mode (Light/Dark), Theme (1/2), Brand (A/B)
2. **Visual verification**: Ensure typography, spacing, colors, and components change appropriately
3. **Design tokens**: Verify color swatches and font samples update dynamically

### Database Setup (Only-Tasks App)
- **Default connection**: Uses Supabase PostgreSQL (connection string in DATABASE_SETUP.md)
- **Environment setup**: Create `.env.local` with `DATABASE_URL` if using custom database
- **Schema**: Auto-initializes on first API call
- **Fallback**: App handles database failures gracefully with form-based interface

## Architecture

### Repository Structure
```
apps/
├── only-tasks/          # Main task management Next.js app
└── themes-demo/         # SCSS theming demonstration app
packages/
├── design-system-2/     # SCSS design system with CSS custom properties
├── eslint-config/       # Shared ESLint configuration
└── typescript-config/   # Shared TypeScript configuration
```

### Key Technologies
- **Turborepo**: Monorepo build system with caching
- **Next.js 15.4.1**: React framework with App Router
- **TypeScript 5.x**: Type safety
- **Tailwind CSS**: Utility-first CSS (only-tasks app)
- **SCSS/Sass**: Advanced theming system (themes-demo app)
- **PostgreSQL**: Database backend (only-tasks app)

### Important Files
- `turbo.json`: Turborepo task configuration
- `package.json`: Root workspace configuration
- `apps/only-tasks/package.json`: Task app dependencies (Node 20+)
- `apps/themes-demo/package.json`: Demo app configuration
- `packages/design-system-2/package.json`: SCSS build system

## Common Tasks

### Linting and Type Checking
- **Before committing**: ALWAYS run `yarn lint` and `yarn check-types`
- **Known issues**: only-tasks app has TypeScript linting errors (any types, unused vars) - this is expected
- **CI requirements**: Lint and type check must pass for CI build to succeed

### Theme Development
- **SCSS compilation**: `cd packages/design-system-2 && yarn build` or `yarn dev` for watch mode
- **CSS custom properties**: Located in `packages/design-system-2/scss/`
- **Theme combinations**: Mode + Theme + Brand classes (e.g., "light-mode theme-1 brand-a")

### Task Management Features
- **Sprints**: Current Sprint 3, Backlog Sprint 2, Historical Sprint 1
- **Views**: Table view (default), Kanban board, Analytics dashboard
- **Demo data**: Includes realistic tasks with assignees, priorities, due dates, estimates

## Build and CI Information

### Timing Expectations
- **Dependency install**: ~30 seconds **NEVER CANCEL**
- **Full build**: ~40 seconds **NEVER CANCEL**. Set timeout to 60+ minutes
- **Type checking**: ~3 seconds
- **Linting**: ~4 seconds (expect failures in only-tasks)
- **Formatting**: ~3 seconds

### CI Pipeline (.github/workflows/ci.yml)
1. Checkout code
2. Setup Node.js 20 with yarn cache
3. Install dependencies (`yarn install --frozen-lockfile`)
4. Run lint (`yarn lint`)
5. Run type check (`yarn check-types`)
6. Build all packages (`yarn build`)

### Node.js Requirements
- **Minimum**: Node.js 18+ (root package.json)
- **Apps require**: Node.js 20+ (individual app package.json)
- **Current environment**: Node.js 20.19.4

## Troubleshooting

### Development Server Issues
- **Port conflicts**: only-tasks auto-switches from 3000 to 3001 if occupied
- **Hanging dev command**: Use individual app dev commands instead of global `yarn dev`
- **Hydration errors**: React hydration warnings in console are expected

### Build Issues
- **Slow builds**: Builds taking 30+ minutes are normal, do not cancel
- **Memory issues**: Use `--max_old_space_size=4096` if Node.js runs out of memory
- **Dependency conflicts**: Remove node_modules and package-lock.json, use only yarn.lock

### Database Issues
- **Connection failures**: App shows space creation form when database unavailable
- **Schema errors**: Check DATABASE_SETUP.md and DATABASE_SCHEMA_FIX.md
- **Environment**: Verify DATABASE_URL in .env.local

## Quick Reference

### Common Commands
```bash
# Setup
yarn install --frozen-lockfile

# Development
cd apps/only-tasks && npm run dev       # Task management app
cd apps/themes-demo && npm run dev      # Theming demo app

# Build and validate
yarn build                              # Build all (38s)
yarn check-types                        # Type check (3s)
yarn lint                               # Lint with expected errors (4s)
yarn format                             # Format code (3s)

# Individual packages
yarn build --filter=only-tasks          # Build specific app
yarn dev --filter=demo-css-props        # Dev specific app
cd packages/design-system-2 && yarn dev # Watch SCSS compilation
```

### URLs and Ports
- **Only-tasks app**: http://localhost:3001 (or 3000 if available)
- **Themes-demo app**: http://localhost:7002
- **Demo path**: http://localhost:3001/demo (task management interface)

### Testing Scenarios
1. **Complete task workflow**: Create task → assign → move through statuses → analytics
2. **Theme variations**: Test all 8 combinations (2 modes × 2 themes × 2 brands)
3. **Responsive design**: Verify mobile and desktop layouts
4. **Database operations**: Create space → add projects → manage tasks

**Remember**: Always run complete end-to-end scenarios after making changes to ensure full functionality.