# ============================================================
#  Arnes de verificacion - Enlace_Frontend (Angular 22)
#  Ejecuta el diagnostico del entorno antes de tocar codigo.
#  Retorna 0 si todo esta en verde; distinto de 0 si algo falla.
# ============================================================
$ErrorActionPreference = "Stop"

Write-Host "== [1/4] Verificando herramientas =="
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "'node' no esta instalado o no esta en el PATH."
    exit 1
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "'npm' no esta instalado o no esta en el PATH."
    exit 1
}
node --version
npm --version

Write-Host "== [2/4] Verificando archivos criticos del arnes =="
foreach ($f in @("CLAUDE.md", "tasks.json")) {
    if (-not (Test-Path -LiteralPath $f)) {
        Write-Error "Falta el archivo '$f'."
        exit 1
    }
}

if (-not (Test-Path -LiteralPath "node_modules")) {
    Write-Error "'node_modules' no existe. Ejecuta 'npm install' primero."
    exit 1
}

Write-Host "== [3/4] Compilando (build de produccion) =="
npx ng build --configuration=production
if ($LASTEXITCODE -ne 0) {
    Write-Error "El build fallo. Revisa el reporte de 'ng build'."
    exit $LASTEXITCODE
}

Write-Host "== [4/4] Ejecutando tests (si existen specs) =="
$specs = Get-ChildItem -Path "src" -Recurse -Filter "*.spec.ts" -ErrorAction SilentlyContinue
if ($specs) {
    npx ng test --watch=false --browsers=ChromeHeadless
    if ($LASTEXITCODE -ne 0) {
        Write-Error "'ng test' fallo."
        exit $LASTEXITCODE
    }
} else {
    Write-Host "No se detectaron archivos '*.spec.ts'; se omite 'ng test'."
}

Write-Host ""
Write-Host "== OK: entorno en verde =="
exit 0
