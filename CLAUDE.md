# Enlace_Frontend — Frontend Angular

SPA en **Angular 22** (standalone + Signals) para el sistema Enlace. Consume la API del backend
`DB_ENLACE`.

## Stack

- Angular 22 (componentes standalone, control flow `@if`/`@for`)
- TypeScript 6
- Bootstrap 5 + Font Awesome
- ngx-pagination, ng-angular-popup (toasts), xlsx (export a Excel)
- HttpClient para el consumo de la API

## Mapa del repositorio

```
angular.json                ← config de build (application builder, sin SSR)
package.json                ← dependencias
src/main.ts                 ← bootstrapApplication(AppComponent, appConfig)
src/app/app.config.ts       ← provideRouter + provideHttpClient
src/app/app.routes.ts       ← rutas + authGuard
src/app/app.component.ts    ← raiz (router-outlet + ng-toast)
src/app/guards/             ← auth.guard.ts (funcional)
src/app/modelos/            ← interfaces alineadas a la API
src/app/Servicios/api/      ← ApiService (único punto de acceso a la API)
src/app/Servicios/alertas/  ← AlertasService (toasts)
src/app/plantillas/         ← header, footer, menu, loguot
src/app/vistas/             ← login, signup, reset, dashboard + CRUDs
specs/                      ← especificaciones SDD por tarea
progress/                   ← registro de avance de subagentes
tasks.json                  ← backlog (única fuente de verdad de estado)
```

## Reglas de comportamiento

- **Regla de arranque (obligatoria):** al iniciar una sesión, lee este archivo y ejecuta
  inmediatamente `init.sh` (Git Bash/WSL) o `init.ps1` (Windows PowerShell) antes de tocar código.
  Si el script falla, detente, reporta el error exacto y no modifiques lógica de negocio.
- Componentes standalone; no usar NgModules.
- Control flow nuevo: `@if`, `@for`, `@switch` (no `*ngIf` ni `*ngFor`).
- Todo acceso a la API pasa por `ApiService`; no hardcodear URLs en componentes.
- Modelos en `modelos/` deben reflejar el contrato del backend (ver `docs/modelo-datos.md` del
  backend); no añadir campos que la API no devuelve.
- Textos visibles en español.

## Comandos

```bash
npm install                 # instalar dependencias
npm start                   # ng serve (http://localhost:4200)
npm run build               # ng build (dist/db-enlace-front/browser)
npm test                    # ng test (requiere specs y navegador)
```

## Flujo SDD

1. Lee `tasks.json` para saber qué tarea sigue.
2. Si una tarea requiere SDD (`requiere_sdd: true`), escribe la spec en `specs/{id}-{nombre}.md`
   y ponla en `spec_ready` para aprobación humana.
3. Implementa, registra avance en `progress/`, ejecuta `init.sh`/`init.ps1` y actualiza `tasks.json`.
