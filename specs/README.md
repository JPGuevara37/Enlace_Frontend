# /specs

Especificaciones formales de cada funcionalidad que requiera SDD (`requiere_sdd: true` en
`tasks.json`).

Convención de nombre: `{id}-{nombre-tarea}.md` (ej. `T-08-pruebas-unitarias.md`).

Cada spec debe contener:

1. **Requerimientos EARS** — con sintaxis *"Cuando [disparador], el sistema debe [respuesta]"*.
2. **Diseño técnico** — archivos a tocar, funciones/clases nuevas, tests a añadir y archivos que
   **no** se deben modificar.
3. **Lista de tareas unitarias** (`tasks.md` del desglose).
4. **Métricas de calidad** — CRAP por módulo <= 15 y mutation score >= 80% (puerta de salida).

Cuando una spec quede lista, marca la tarea como `spec_ready` en `tasks.json` y detente para la
aprobación humana antes de programar.
