#!/usr/bin/env bash
set -euo pipefail

# ============================================================
#  Arnes de verificacion — Enlace_Frontend (Angular 22)
#  Ejecuta el diagnostico del entorno antes de tocar codigo.
#  Retorna 0 si todo esta en verde; distinto de 0 si algo falla.
# ============================================================

echo "== [1/4] Verificando herramientas =="
command -v node >/dev/null 2>&1 || { echo "ERROR: 'node' no esta instalado o no esta en el PATH."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "ERROR: 'npm' no esta instalado o no esta en el PATH."; exit 1; }
node --version
npm --version

echo "== [2/4] Verificando archivos criticos del arnes =="
for f in CLAUDE.md tasks.json; do
  if [ ! -f "$f" ]; then
    echo "ERROR: falta el archivo '$f'."
    exit 1
  fi
done

if [ ! -d node_modules ]; then
  echo "ERROR: 'node_modules' no existe. Ejecuta 'npm install' primero."
  exit 1
fi

echo "== [3/4] Compilando (build de produccion) =="
npx ng build --configuration=production
BUILD_EXIT=$?
if [ "$BUILD_EXIT" -ne 0 ]; then
  echo "ERROR: el build fallo. Revisa el reporte de 'ng build'."
  exit "$BUILD_EXIT"
fi

echo "== [4/4] Ejecutando tests (si existen specs) =="
SPEC_COUNT=$(find src -name '*.spec.ts' 2>/dev/null | wc -l | tr -d ' ')
if [ "$SPEC_COUNT" -gt 0 ]; then
  npx ng test --watch=false --browsers=ChromeHeadless
  TEST_EXIT=$?
  if [ "$TEST_EXIT" -ne 0 ]; then
    echo "ERROR: 'ng test' fallo."
    exit "$TEST_EXIT"
  fi
else
  echo "No se detectaron archivos '*.spec.ts'; se omite 'ng test'."
fi

echo ""
echo "== OK: entorno en verde =="
exit 0
