# Tailwind CSS

### 2. **Instalar Tailwind CSS versión `3.1.6` con Bun**

```bash
bun add -d tailwindcss@3.1.6 postcss autoprefixer
npx tailwindcss init -p
```

> Aunque usas Bun, el `npx tailwindcss init -p` es necesario porque `bunx` aún tiene limitaciones con algunos CLIs globales.

---

### 3. **Configura `tailwind.config.js`**

Edita el archivo generado para incluir los paths correctos:

```js
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

### 4. **Crea el archivo `src/index.css`** con Tailwind:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 5. **Importa ese CSS en `main.tsx`**

```tsx
import "./index.css";
```

---

### 6. **Ejecutar la app**

```bash
bun dev
```

> Asegúrate de tener `"scripts": { "dev": "vite" }"` en tu `package.json`.

---

### 7. **Verifica la versión instalada**

```bash
bun pm ls tailwindcss
```
