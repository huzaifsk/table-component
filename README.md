## 📦 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview the build
npm run preview
```

## 📁 Project Structure

```
├── public/              # Static assets
├── src/
│   ├── data/          # data of employees
│   ├── components/      # React components
│   └── App.jsx         # App entry point
├── index.html           # HTML template
├── package.json
├── vite.config.js       # Vite configuration
└── .eslintrc.cjs        # ESLint rules
```

📊 Table Component Features

🔍 Column-wise Filtering – Filter rows based on individual column inputs (text and date).

📝 Inline Editing – Double-click on any cell to edit it in-place.

⬇️ Row Expansion – Expand rows to view additional details (projects, skills, performance, etc.).

🧠 Smart Filtering Logic – Handles nested data like details.project and details.skills.

✅ Row Selection – Select individual or all rows using checkboxes.

🗑️ Delete Selected Rows – Remove selected rows with a single action.

📤 CSV Export – Export the currently filtered table data to a downloadable CSV file.

🔃 Keyboard Shortcuts – Save (Enter) or cancel (Esc) edits from the keyboard.

📆 Date Filtering – Filter by exact joined date using a date picker.
