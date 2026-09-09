#!/usr/bin/env zsh
# ==============================================================================
# devops-git-commit-push.sh - Flujo Ágil y Seguro de Commit y Push en Git
# ==============================================================================
# Propósito: Inspecciona el estado del repositorio, gestiona commits con mensaje
#            asistido o por argumento y sube los cambios a la rama activa en origin.
#            Inspirado en la automatización de mac-baseline/swirl-baseline.
# ==============================================================================
set -euo pipefail

echo "======================================================================"
echo "🚀 INICIANDO PROCESO DE CONFIRMACIÓN Y SUBIDA A GIT (COMMIT & PUSH)    "
echo "======================================================================"
echo ""

# 1. Verificar si estamos dentro de un repositorio Git
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "❌ Error: El directorio actual no es un repositorio Git válido."
    exit 1
fi

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
echo "🌿 Rama actual detectada: $CURRENT_BRANCH"
echo ""

# 2. Analizar estado de archivos locales
echo "🔍 Analizando estado de archivos en el repositorio..."
git status --short
echo ""

HAS_CHANGES=false
if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git status --porcelain)" ]; then
    HAS_CHANGES=true
fi

UNPUSHED_COMMITS=$(git log origin/"$CURRENT_BRANCH"..HEAD --oneline 2>/dev/null || true)

if [ "$HAS_CHANGES" = false ] && [ -z "$UNPUSHED_COMMITS" ]; then
    echo "✔️ No hay cambios pendientes ni commits por subir. Tu copia local está al día."
    echo "======================================================================"
    exit 0
fi

# 3. Confirmar cambios si existen
if [ "$HAS_CHANGES" = true ]; then
    echo "📦 Se detectaron cambios locales pendientes."
    
    COMMIT_MSG="${1:-}"
    if [ -z "$COMMIT_MSG" ]; then
        read -r "COMMIT_MSG?✍️  Introduce el mensaje del commit: "
    fi
    
    if [ -z "$COMMIT_MSG" ]; then
        echo "❌ Error: El mensaje del commit no puede estar vacío."
        exit 1
    fi
    
    echo ""
    echo "➕ Agregando todos los cambios a Git (git add -A)..."
    git add -A
    
    echo "📝 Registrando commit..."
    git commit -m "$COMMIT_MSG"
fi

CURRENT_HASH=$(git rev-parse --short HEAD)
echo "🔑 Commit local listo: $CURRENT_HASH"
echo ""

# 4. Subir a origin
echo "⬆️ Subiendo cambios a origin/$CURRENT_BRANCH..."
git push origin "$CURRENT_BRANCH"

echo ""
echo "======================================================================"
echo "🎉 ¡Cambios sincronizados y subidos exitosamente a origin/$CURRENT_BRANCH!"
echo "======================================================================"
