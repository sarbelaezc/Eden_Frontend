# Eden Frontend

Frontend de la aplicación Eden construido con **Angular 21** y conectado a la API REST de Django.

## 🚀 Stack Tecnológico

- **Angular 21.0**
- **TypeScript 5.9**
- **SCSS** para estilos
- **RxJS 7.8** para programación reactiva
- **Angular Router** para navegación
- **HTTP Client** para peticiones a la API

---

## ⚡ Quick Start

### 1. Clonar e Instalar Dependencias

```bash
# Clonar repositorio
git clone https://github.com/sarbelaezc/Eden_Frontend.git
cd eden-frontend

# Instalar dependencias
npm install
```

### 2. Configurar Variables de Entorno

El proyecto usa archivos de environment para diferentes entornos:

**Desarrollo** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

**Producción** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://eden-backend-he5q.onrender.com/api'
};
```

### 3. Ejecutar Servidor de Desarrollo

```bash
npm start
# o
ng serve
```

Abre tu navegador en `http://localhost:4200/`

### 4. Construir para Producción

```bash
npm run build
```

Los archivos de distribución se generarán en `dist/eden-frontend/browser/`

---

## 🚀 Despliegue en Vercel (Gratis)

Vercel es la opción recomendada para desplegar aplicaciones Angular de forma gratuita.

### **Requisitos Previos**
- ✅ Cuenta en [Vercel](https://vercel.com) (gratis)
- ✅ Backend desplegado en Render (con su URL)
- ✅ Código en GitHub

---

### **Paso 1: Configurar URL del Backend**

Actualiza el archivo de producción con la URL real de tu backend:

**`src/environments/environment.prod.ts`:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://eden-backend-he5q.onrender.com/api'
};
```

Guarda y haz commit:
```bash
git add src/environments/environment.prod.ts
git commit -m "Configurar URL de producción del backend"
git push
```

---

### **Paso 2: Desplegar en Vercel**

#### **2.1 Conectar repositorio**
1. Ve a [vercel.com](https://vercel.com) y crea una cuenta (puedes usar GitHub)
2. Dashboard → **"Add New..."** → **"Project"**
3. **"Import Git Repository"** → Selecciona tu repo de frontend
4. Click **"Import"**

#### **2.2 Configurar proyecto**
Vercel detectará automáticamente Angular, pero verifica:

- **Framework Preset**: Angular
- **Build Command**: `npm run build` (auto-detectado)
- **Output Directory**: `dist/eden-frontend/browser` (auto-detectado)
- **Install Command**: `npm install` (auto-detectado)

#### **2.3 Desplegar**
1. Click en **"Deploy"**
2. Espera 2-3 minutos mientras Vercel construye y despliega
3. ✅ ¡Listo! Obtendrás una URL como:
   ```
   https://eden-frontend.vercel.app
   ```

---

### **Paso 3: Configurar CORS en el Backend**

Ahora debes permitir que tu backend acepte peticiones desde Vercel:

**En Render.com (Backend):**
1. Dashboard → `eden-backend` → **"Environment"**
2. Edita o añade la variable `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://eden-frontend-seven.vercel.app
   ```
3. **Save Changes** → Render redesplegará automáticamente

---

### **Paso 4: Verificar el Despliegue**

1. Abre tu URL de Vercel: `https://eden-frontend-seven.vercel.app`
2. Prueba el login con las credenciales del backend
3. Verifica que las peticiones a la API funcionen correctamente

**Solución de problemas:**
- Si ves errores CORS, verifica que la URL en `CORS_ALLOWED_ORIGINS` sea exacta
- Si el login falla, revisa que `environment.prod.ts` tenga la URL correcta del backend
- Revisa la consola del navegador (F12) para ver errores

---

### **Actualizaciones Automáticas**

Vercel redespliega automáticamente cada vez que haces push:

```bash
# Hacer cambios
git add .
git commit -m "Nuevas funcionalidades"
git push

# Vercel detecta el push y redespliega automáticamente (1-2 min)
```

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/               # Servicios principales
│   │   ├── services/       # AuthService, PersonnelService, etc.
│   │   ├── guards/         # Route guards
│   │   └── interceptors/   # HTTP interceptors (JWT)
│   ├── features/          # Módulos de funcionalidad
│   │   ├── auth/          # Login, registro
│   │   └── personnel/     # Gestión de empleados
│   ├── shared/            # Componentes compartidos
│   └── app.routes.ts      # Configuración de rutas
├── environments/          # Configuración por entorno
│   ├── environment.ts     # Desarrollo
│   └── environment.prod.ts # Producción
└── styles.scss           # Estilos globales
```

---

## 🔐 Autenticación

La aplicación usa **JWT Authentication** conectándose al backend:

```typescript
// Login
this.authService.login(username, password).subscribe({
  next: (response) => {
    // Tokens guardados automáticamente en localStorage
    this.router.navigate(['/dashboard']);
  },
  error: (error) => console.error('Login falló', error)
});

// Las peticiones incluyen automáticamente el token JWT via interceptor
```

---

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm start                 # Servidor de desarrollo
npm run watch             # Build con watch mode

# Producción
npm run build             # Build de producción

# Testing
npm test                  # Ejecutar tests

# Utilidades
ng generate component nombre    # Generar componente
ng generate service nombre       # Generar servicio
ng generate --help              # Ver todas las opciones
```

---

## 🌐 Variables de Entorno

### **Desarrollo (localhost)**
- `apiUrl`: `http://localhost:8000/api`
- `production`: `false`

### **Producción (Vercel)**
- `apiUrl`: `https://eden-backend-he5q.onrender.com/api`
- `production`: `true`

---

## 🔄 Compartir/Transferir el Proyecto

### **Opción 1: Colaboración directa**
1. Añadir colaborador en GitHub
2. El colaborador clona y trabaja normalmente
3. Push automático redespliega en Vercel

### **Opción 2: Despliegue independiente**
1. Hacer fork del repositorio
2. Conectar el fork con Vercel
3. Configurar `environment.prod.ts` con su backend
4. ⏱️ Tiempo: ~5 minutos

---

## 📊 Características del Plan Gratuito Vercel

✅ **Despliegues ilimitados**  
✅ **100 GB ancho de banda/mes**  
✅ **SSL/HTTPS automático**  
✅ **CDN global**  
✅ **Redeploys automáticos desde GitHub**  
✅ **Preview deployments** para cada PR  
✅ **Analytics básico**  

**Sin limitaciones de tiempo** - Perfecto para proyectos académicos permanentes.

---

## 🔧 Archivos de Configuración

- ✅ **[vercel.json](vercel.json)** - Configuración de Vercel
- ✅ **[angular.json](angular.json)** - Configuración de Angular CLI
- ✅ **[package.json](package.json)** - Dependencias del proyecto
- ✅ **[tsconfig.json](tsconfig.json)** - Configuración de TypeScript

---

## 📚 Documentación Adicional

- **[Angular CLI](https://angular.dev/tools/cli)** - Referencia completa
- **[Vercel Docs](https://vercel.com/docs)** - Guía de despliegue
- **Backend API**: Consulta el README del backend para endpoints disponibles

---

## 📝 Licencia

Proyecto privado para Eden.
