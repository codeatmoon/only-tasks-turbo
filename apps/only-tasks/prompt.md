## **Prompt: Simple Task Tracker App (Next.js)**

**UI Reference:**
Follow the clean and minimalist look from the attached images (Google Area20-style tables).

* Icons: Circular, from **Lucide** icon set.
* Color scheme: Light backgrounds, subtle text colors for statuses, clean borders.

---

### **Tech Stack & Storage**

* **Framework:** Next.js
* **Persistence:** Browser Local Storage (for remembering last selected project & app)
* **No authentication** for now.

---

### **Basic Hierarchy**

```
Projects > Project > Apps > App > Sprints > Tasks
```

---

### **Default Screen**

* Opens directly on **Tasks screen**.
* Remember last selected **Project** and **App** (via local storage).
* Include a **sample Project and App** with multiple sprints & demo tasks for trying out.

---

### **App & Project Selection**

* **Two circular icons** at the top of the tasks screen:

  1. **Switch Project** icon
  2. **Switch App** icon
* Clicking an icon opens a **dropdown with card-style background** showing the list of available Projects/Apps.
* Also provide a **modal to see the Apps grid** categorized by Project.
* Options to **add new Project** and **add new App** inside a Project.

---

### **Tasks Screen Layout**

* **Tasks listed by Sprint**:

  1. **Current Sprint** tasks shown first.
  2. Below that: Incomplete tasks from previous sprints, grouped under headers like:
     `"Sprint 1 - Backlog"`.

---

### **Task Table Functionality**

* Ability to configure **field options** (e.g., Status, Priority).
* Ability to **add additional columns** with these types:

  * Text
  * Number
  * Date
  * Link
* Table cells should allow inline editing (like Google Sheets).

---

### **View Modes**

* **Sheet View** (default) — minimalist like Google Area20 tables.
* **Kanban View** (toggle option):

  * Minimal style, still showing sprint grouping.
  * Drag-and-drop optional for now.

---

### **Data Requirements**

* Demo project must have:

  * **2–3 Sprints**
  * Mix of completed, in-progress, and pending tasks.
  * At least 4–5 columns (e.g., Task Name, Status, Priority, Due Date, Assignee).

---

### project structure
```
only-tasks/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # Default Tasks screen
│   ├── projects/
│   │   ├── page.tsx                  # Modal/Dropdown for projects (if needed as page)
│   └── globals.css                   # Tailwind base styles
│
├── components/
│   ├── tasks/
│   │   ├── TaskTable.tsx              # Google Area20 style sheet view
│   │   ├── KanbanBoard.tsx            # Minimal Kanban view
│   │   ├── SprintSection.tsx          # Groups tasks by sprint
│   │   ├── TaskRow.tsx                # Single row in table view
│   │   ├── TaskDropdown.tsx           # Inline dropdown for Status/Priority
│   │   ├── ColumnConfigModal.tsx      # Add/configure columns
│   │
│   ├── projects/
│   │   ├── ProjectDropdown.tsx        # Circular icon -> dropdown card
│   │   ├── AppDropdown.tsx            # Circular icon -> dropdown card
│   │   ├── ProjectAppModal.tsx        # Grid view of apps by project
│   │   ├── AddProjectModal.tsx
│   │   ├── AddAppModal.tsx
│   │
│   ├── ui/
│   │   ├── IconButton.tsx              # Circular Lucide icon button
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Card.tsx
│   │   ├── SprintHeader.tsx
│
├── hooks/
│   ├── useLocalStorage.ts             # For persisting last project/app
│   ├── useViewMode.ts                  # Toggle sheet/kanban
│
├── lib/
│   ├── types.ts                        # TypeScript interfaces
│   ├── utils.ts                        # Helper functions (e.g., groupBySprint)
│
├── data/
│   ├── mockData.ts                     # Sample project, apps, sprints & tasks
│
├── public/
│   ├── favicon.ico
│
├── package.json
├── tailwind.config.js
├── tsconfig.json
```

### **Additional UI Notes**

* Circular Lucide icons for all action buttons (Add, Edit, Delete, Switch Views).
* Dropdown menus and modals must follow **minimalist card styling** with subtle shadows.
* Sprint headers should have a clear, consistent style to separate groups visually.