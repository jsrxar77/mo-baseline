# Guía de Instalación y Despliegue de ComfyUI para Holo Studio

Este documento detalla el procedimiento para instalar, configurar y ejecutar **ComfyUI** (versión oficial) junto con **ComfyUI-Manager** y la suite de nodos simplificados **ComfyUI-Easy-Use** de forma desacoplada fuera de este repositorio.

---

## 1. Requisitos Previos del Sistema

### macOS (Apple Silicon: M1 / M2 / M3 / M4)
- **Python**: Versión **3.10** o **3.11** (⚠️ *PyTorch y muchas librerías de IA aún no tienen soporte estable para Python 3.12+ o 3.14*).
- **Homebrew**: Instalado en el sistema (`/opt/homebrew/bin/brew`).
- **Git**: Disponible en terminal.

### Linux / Windows (NVIDIA GPU)
- Python 3.10 o 3.11.
- CUDA Toolkit 12.1+ y drivers actualizados de NVIDIA.

---

## 2. Instalación en macOS (Opción A: ComfyUI Desktop - Recomendada ⭐)

La forma más rápida, estable y optimizada para Apple Silicon (M1/M2/M3/M4) es la aplicación oficial **ComfyUI Desktop**:

1. Descarga el instalador `.dmg` para Mac (Apple Silicon) desde:
   👉 **[https://www.comfy.org/download](https://www.comfy.org/download)**
2. Arrastra **ComfyUI** a tu carpeta de **Aplicaciones**.
3. Abre la aplicación. En el primer inicio descargará automáticamente su entorno aislado de Python y PyTorch optimizado con soporte Metal (MPS).
4. El servidor local quedará activo por defecto en `http://127.0.0.1:8188`.
5. El **ComfyUI-Manager** ya viene preinstalado de fábrica en la interfaz.

---

## 3. Instalación Manual en macOS / Linux (Opción B: Terminal + Git)

Si prefieres la instalación manual por consola:

### Paso 1: Instalar Python 3.11 (vía Homebrew)
```bash
brew install python@3.11
```

### Paso 2: Clonar ComfyUI en tu carpeta personal (`~/AI`)
```bash
mkdir -p ~/AI
cd ~/AI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
```

### Paso 3: Crear el entorno virtual con Python 3.11
```bash
/opt/homebrew/bin/python3.11 -m venv .venv
source .venv/bin/activate
```

### Paso 4: Instalar PyTorch optimizado para Apple Silicon (Metal / MPS)
```bash
pip install --upgrade pip
pip install torch torchvision torchaudio
pip install -r requirements.txt
```

### Paso 5: Instalar ComfyUI-Manager
```bash
cd custom_nodes
git clone https://github.com/ltdrdata/ComfyUI-Manager.git
cd ..
```

---

## 4. Iniciar ComfyUI Manualmente (Solo si usas la Opción B)

```bash
cd ~/AI/ComfyUI
source .venv/bin/activate
python main.py --listen 127.0.0.1 --port 8188
```

Abre tu navegador en:
👉 **[http://127.0.0.1:8188](http://127.0.0.1:8188)**

---

## 4. Instalación del Pack "ComfyUI-Easy-Use"

Una vez abierta la interfaz de ComfyUI:
1. Haz clic en el botón **Manager** (en el panel flotante derecho).
2. Selecciona **Custom Nodes Manager**.
3. En el buscador superior, escribe: `ComfyUI-Easy-Use`.
4. Haz clic en **Install**.
5. Reinicia ComfyUI desde el botón **Restart** en el Manager (o reiniciando el proceso en la terminal).

---

## 5. Descarga de Modelos Esenciales (Checkpoints)

Coloca los modelos en `~/AI/ComfyUI/models/checkpoints/` o descárgalos directamente desde el botón **Model Manager** de ComfyUI-Manager:
- **Para B-Roll Estilizado Rápido**: `SDXL Turbo` o `Juggernaut XL` (SDXL).
- **Para Máxima Calidad Fotorrealista**: `Flux.1 Schnell` (versión GGUF/FP8 ideal para Apple Silicon con 16GB-32GB RAM).

---

## 6. Conexión con Holo Studio (`mo-baseline`)

Para que Holo Studio se comunique con ComfyUI, basta con verificar en `apps/holo-studio/.env.local`:

```env
NEXT_PUBLIC_COMFYUI_URL="http://127.0.0.1:8188"
```

El backend de Next.js enviará peticiones a `/prompt` y escuchará el progreso por WebSocket en `ws://127.0.0.1:8188/ws`.
