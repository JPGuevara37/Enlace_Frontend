# /progress

Registro de decisiones, archivos modificados e historial de ejecución de subagentes.

Cualquier sesión nueva puede retomar el trabajo leyendo aquí, sin recorrer todo el repositorio.

Convención:

- Un archivo por tarea activa: `{id}-{nombre-tarea}.md`.
- Registrar: decisiones tomadas, archivos modificados, estado de los gates (`init.sh`), pendientes.
- Al cerrar una tarea como `done`, mover el resumen relevante a `history.md` y limpiar este
  directorio de archivos intermedios.
