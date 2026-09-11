#!/usr/bin/env bash
# ==============================================================================
# Holo Studio - Launcher
# Next.js + React + TypeScript + Tailwind CSS + Lucide Icons
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$DIR/apps/holo-studio"

echo "=========================================================="
echo "⚡ Iniciando Holo Studio • Direct Response Video AI Engine"
echo "=========================================================="

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias de Next.js..."
    npm install
fi

echo "🚀 Servidor de desarrollo activo en http://localhost:3000..."
npm run dev
