# 📊 Panel Ejecutivo de Inflación & Inventario

Un dashboard profesional desarrollado con HTML, CSS y JavaScript vanilla para monitoreo de datos financieros e inventario en tiempo real.

## 🌐 Demo en Vivo

🔗 **[Ver Demo en GitHub Pages](https://jhonlaurens.github.io/Panel-Ejecutivo/)**

> 📌 **Para habilitar GitHub Pages:**
>
> 1. Ve a **Settings** → **Pages** en tu repositorio de GitHub
> 2. En **Source**, selecciona **"GitHub Actions"**
> 3. El sitio se desplegará automáticamente en cada push

![Panel Preview](https://via.placeholder.com/800x400/0f172a/22d3ee?text=Panel+Ejecutivo+Coltefinanciera)

## 🎯 Propósito del Proyecto

Este proyecto fue creado como una demostración de desarrollo web frontend, mostrando cómo crear dashboards profesionales utilizando tecnologías web fundamentales sin frameworks externos.

## ✨ Características

- 📈 **Visualización de datos en tiempo real** con Chart.js
- 🎨 **Diseño moderno y responsive** con CSS Grid y Flexbox
- 🔍 **Funcionalidad de búsqueda y filtrado** en tablas
- 📱 **Completamente responsive** para dispositivos móviles
- 🌙 **Tema oscuro profesional** con esquema de colores consistente
- ⚡ **Rendimiento optimizado** con lazy loading de imágenes
- 🔄 **Ordenamiento dinámico** de tablas por columnas

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con Grid, Flexbox y animaciones
- **JavaScript ES6+**: Lógica de aplicación y manipulación del DOM
- **Chart.js**: Biblioteca para gráficos interactivos
- **Font Awesome**: Iconografía profesional
- **Google Fonts**: Tipografía Inter para mejor legibilidad

## 📁 Estructura del Proyecto

```
panel-inflacion-inventario/
├── index.html              # Página principal
├── styles.css              # Estilos CSS
├── app.js                  # Lógica JavaScript
├── estadisticas_inventario.json  # Datos de inventario
├── grafico_inventario.json      # Datos de gráficos
├── logo colte.png          # Logo principal
├── logo.ico               # Favicon
├── logo.png               # Logo alternativo
└── README.md              # Documentación
```

## 🚀 Guía de Desarrollo Paso a Paso

### Fase 1: Estructura HTML Base

#### Paso 1: Configurar el documento HTML

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Panel Ejecutivo</title>
  </head>
</html>
```

**Conceptos clave:**

- `lang="es"`: Especifica idioma para accesibilidad
- `viewport`: Hace el sitio responsive
- `charset="utf-8"`: Soporte para caracteres especiales

#### Paso 2: Crear la estructura del header

```html
<header class="topbar">
  <div class="logo-section">
    <div class="company-logo">
      <img src="./logo colte.png" alt="Coltefinanciera" class="logo-img" />
    </div>
    <div class="title">
      <i class="fas fa-tachometer-alt"></i>
      <h1>Panel Ejecutivo de Inflación & Inventario</h1>
    </div>
  </div>
</header>
```

**Conceptos clave:**

- Estructura semántica con `<header>`
- Uso de clases descriptivas
- Atributos `alt` para accesibilidad

#### Paso 3: Crear grid de KPIs

```html
<section class="card kpis">
  <div class="kpi">
    <div class="kpi-header">
      <i class="fas fa-chart-area kpi-icon"></i>
      <h4>IPC Actual</h4>
    </div>
    <div class="kpi-value" id="kpiIpc">--</div>
    <small>Índice base 2020=100</small>
  </div>
  <!-- Más KPIs... -->
</section>
```

### Fase 2: Estilos CSS Avanzados

#### Paso 4: Variables CSS personalizadas

```css
:root {
  --bg: #0f172a;
  --panel: #111827;
  --card: #1f2937;
  --text: #e5e7eb;
  --accent: #22d3ee;
}
```

**Conceptos clave:**

- Variables CSS para consistencia
- Esquema de colores cohesivo
- Facilidad de mantenimiento

#### Paso 5: Grid Layout responsive

```css
.grid {
  display: grid;
  gap: 16px;
  padding: 16px;
  grid-template-columns: repeat(12, 1fr);
}

.kpis {
  grid-column: 1/-1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
```

**Conceptos clave:**

- CSS Grid para layouts complejos
- Responsive design con media queries
- Flexbox para alineación

#### Paso 6: Efectos visuales avanzados

```css
.logo-img {
  filter: brightness(1.1) contrast(1.05) drop-shadow(0 2px 8px rgba(34, 211, 238, 0.15));
  background: linear-gradient(
    135deg,
    rgba(34, 211, 238, 0.08) 0%,
    rgba(34, 211, 238, 0.02) 100%
  );
  transition: all 0.3s ease;
}
```

**Conceptos clave:**

- Filtros CSS para efectos visuales
- Gradientes para profundidad
- Transiciones suaves

### Fase 3: JavaScript Dinámico

#### Paso 7: Configuración inicial

```javascript
// Configuración global
const CONFIG = {
  chartColors: {
    primary: "#22d3ee",
    secondary: "#22c55e",
    danger: "#ef4444",
  },
};
```

#### Paso 8: Manejo de datos

```javascript
// Cargar datos de inventario
function loadInventoryData() {
  const data = window.__DATA__.items;
  return data.map((item) => ({
    ...item,
    pedido: item.stock <= item.nivel_reorden ? "Sí" : "No",
  }));
}
```

**Conceptos clave:**

- Manipulación de arrays con métodos ES6
- Spread operator para inmutabilidad
- Transformación de datos

#### Paso 9: Crear gráficos con Chart.js

```javascript
function createInflationChart() {
  const ctx = document.getElementById("chartInflacion").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Índice de Precios (IPC)",
          data: inflationData,
          borderColor: CONFIG.chartColors.primary,
          tension: 0.4,
        },
      ],
    },
  });
}
```

#### Paso 10: Funcionalidad de búsqueda

```javascript
function setupTableSearch() {
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterTable(searchTerm);
  });
}
```

### Fase 4: Características Avanzadas

#### Paso 11: Ordenamiento de tablas

```javascript
function setupTableSorting() {
  document.querySelectorAll(".sortable").forEach((header) => {
    header.addEventListener("click", () => {
      const column = header.dataset.column;
      const type = header.dataset.type;
      sortTable(column, type);
    });
  });
}
```

#### Paso 12: Responsive design

```css
@media (max-width: 1100px) {
  .chart:nth-of-type(2),
  .chart:nth-of-type(3) {
    grid-column: 1/-1;
    height: 350px;
  }
}
```

### Fase 5: Optimización y Mejores Prácticas

#### Paso 13: Optimización de rendimiento

- Lazy loading de imágenes
- Debouncing en búsquedas
- Minimización de reflows del DOM

#### Paso 14: Accesibilidad

- Atributos ARIA
- Navegación por teclado
- Contraste de colores apropiado

#### Paso 15: SEO y Metadatos

```html
<meta name="description" content="Panel ejecutivo para monitoreo financiero" />
<meta property="og:title" content="Panel Ejecutivo Coltefinanciera" />
<link rel="canonical" href="URL_CANONICA" />
```

## 🔧 Instalación y Uso

### Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional para desarrollo)

### Instalación

1. **Clonar el repositorio:**

```bash
git clone https://github.com/JhonLaurens/Panel-Ejecutivo.git
cd Panel-Ejecutivo
```

2. **Abrir en navegador:**

```bash
# Opción 1: Abrir directamente
open index.html

# Opción 2: Servidor local con Python
python -m http.server 8000

# Opción 3: Servidor local con Node.js
npx http-server
```

3. **Acceder al panel:**

```
http://localhost:8000
```

## 📊 Funcionalidades del Dashboard

### KPIs Principales

- **IPC Actual**: Índice de Precios al Consumidor
- **Meta Anual**: Objetivo de inflación (4.0%)
- **Proyección**: Estimación del próximo mes
- **Valor Inventario**: Suma total del inventario

### Gráficos Interactivos

- **Gráfico de Líneas**: Evolución mensual de la inflación
- **Gráfico Circular**: Distribución del estado del inventario

### Tabla de Inventario

- **Búsqueda en tiempo real** por nombre de producto
- **Ordenamiento** por cualquier columna
- **Indicadores visuales** para productos que requieren reorden
- **Estados**: Activo, Descontinuado, Bajo stock

## 🎨 Personalización

### Cambiar Colores del Tema

```css
:root {
  --bg: #tu-color-fondo;
  --accent: #tu-color-acento;
  --text: #tu-color-texto;
}
```

### Agregar Nuevos KPIs

```javascript
const newKPI = {
  icon: "fas fa-icon-name",
  title: "Nuevo KPI",
  value: "valor",
  description: "Descripción",
};
```

### Modificar Datos

Edita los archivos JSON en la carpeta del proyecto:

- `estadisticas_inventario.json`: Datos de inventario
- `grafico_inventario.json`: Datos de gráficos

## 🔍 Conceptos de Desarrollo Web Aplicados

### HTML Semántico

- Uso correcto de elementos semánticos (`<header>`, `<main>`, `<section>`)
- Atributos de accesibilidad (`aria-label`, `role`)
- Estructura lógica del documento

### CSS Moderno

- **CSS Grid**: Para layouts complejos y responsive
- **Flexbox**: Para alineación y distribución
- **Custom Properties**: Variables CSS para mantenibilidad
- **Pseudo-elementos**: Para efectos visuales avanzados

### JavaScript ES6+

- **Módulos**: Organización del código
- **Arrow Functions**: Sintaxis moderna
- **Destructuring**: Extracción de datos
- **Template Literals**: Interpolación de strings

### Metodologías

- **Mobile First**: Diseño responsive desde móvil
- **Progressive Enhancement**: Funcionalidad básica garantizada
- **Separation of Concerns**: HTML, CSS y JS separados

## 📱 Responsive Design

El dashboard está optimizado para diferentes dispositivos:

- **Desktop** (1200px+): Layout completo con 4 KPIs por fila
- **Tablet** (768px-1199px): KPIs en 2 columnas, gráficos apilados
- **Mobile** (< 768px): KPIs en 1 columna, tabla scrolleable

## 🔒 Mejores Prácticas Implementadas

### Seguridad

- Validación de datos de entrada
- Sanitización de contenido dinámico
- Headers de seguridad apropiados

### Rendimiento

- Optimización de imágenes
- Minimización de requests
- Lazy loading de recursos

### Mantenibilidad

- Código modular y comentado
- Convenciones de nomenclatura consistentes
- Documentación completa

## 🐛 Solución de Problemas Comunes

### Problema: Gráficos no se muestran

**Solución**: Verificar que Chart.js esté cargado correctamente

```javascript
if (typeof Chart === "undefined") {
  console.error("Chart.js no está cargado");
}
```

### Problema: Estilos no se aplican

**Solución**: Verificar la ruta del archivo CSS

```html
<link rel="stylesheet" href="./styles.css" />
```

### Problema: Datos no cargan

**Solución**: Verificar la estructura de datos en el objeto global

```javascript
console.log("Datos disponibles:", window.__DATA__);
```

## 🚀 Próximas Mejoras

- [ ] Integración con APIs reales
- [ ] Modo claro/oscuro
- [ ] Exportación a PDF
- [ ] Notificaciones push
- [ ] Dashboard personalizable
- [ ] Autenticación de usuarios

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Jhon Dayron**

- GitHub: [@JhonLaurens](https://github.com/JhonLaurens)
- LinkedIn: [Tu LinkedIn]

## 🙏 Agradecimientos

- **GitHub Copilot** por asistencia en el desarrollo
- **Chart.js** por los gráficos interactivos
- **Font Awesome** por los iconos
- **Google Fonts** por la tipografía

---

⭐ Si te gustó este proyecto, ¡dale una estrella en GitHub!

## 📚 Recursos de Aprendizaje

### Para Junior Developers:

1. **HTML5 Semántico**:

   - [MDN HTML Elements](https://developer.mozilla.org/es/docs/Web/HTML/Element)
   - [HTML5 Accessibility](https://www.w3.org/WAI/tutorials/)

2. **CSS Grid y Flexbox**:

   - [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
   - [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

3. **JavaScript Moderno**:

   - [ES6 Features](https://es6-features.org/)
   - [JavaScript.info](https://javascript.info/)

4. **Chart.js**:
   - [Documentación Oficial](https://www.chartjs.org/docs/latest/)

### Ejercicios Prácticos:

1. **Agregar un nuevo KPI** personalizado
2. **Crear un filtro adicional** por categoría
3. **Implementar modo claro/oscuro**
4. **Agregar animaciones CSS** personalizadas
5. **Crear un componente reutilizable** para cards
