# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al Panel Ejecutivo! Esta guía te ayudará a comenzar.

## 🚀 Cómo Contribuir

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub y luego:
git clone https://github.com/TU_USUARIO/Panel-Ejecutivo.git
cd Panel-Ejecutivo
```

### 2. Crear una Rama

```bash
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
```

### 3. Hacer Cambios

- Mantén el código limpio y comentado
- Sigue las convenciones de nomenclatura existentes
- Asegúrate de que el código sea responsive

### 4. Testing

- Prueba en diferentes navegadores
- Verifica la responsividad en móviles
- Comprueba que no se rompan funcionalidades existentes

### 5. Commit

```bash
git add .
git commit -m "✨ feat: agregar nueva funcionalidad de..."
# o
git commit -m "🐛 fix: corregir problema con..."
```

### 6. Push y Pull Request

```bash
git push origin feature/nueva-funcionalidad
```

Luego crea un Pull Request en GitHub.

## 📝 Convenciones de Commit

Usa estos prefijos en tus commits:

- `✨ feat:` Nueva funcionalidad
- `🐛 fix:` Corrección de bugs
- `📚 docs:` Documentación
- `🎨 style:` Mejoras visuales/CSS
- `♻️ refactor:` Refactorización de código
- `⚡ perf:` Mejoras de rendimiento
- `🔧 config:` Configuración

## 🛠️ Áreas para Contribuir

### Funcionalidades Sugeridas

- [ ] Modo claro/oscuro
- [ ] Exportación a PDF/Excel
- [ ] Más tipos de gráficos
- [ ] Filtros avanzados
- [ ] Notificaciones
- [ ] Autenticación de usuarios

### Mejoras de UI/UX

- [ ] Animaciones adicionales
- [ ] Nuevos temas de colores
- [ ] Mejor accesibilidad
- [ ] Micro-interacciones

### Optimizaciones

- [ ] Lazy loading mejorado
- [ ] Service Workers
- [ ] Performance optimizations
- [ ] SEO improvements

## 📋 Checklist para Pull Requests

Antes de enviar tu PR, asegúrate de que:

- [ ] El código funciona correctamente
- [ ] Es responsive en móviles y desktop
- [ ] Sigue las convenciones de código existentes
- [ ] Incluye comentarios donde sea necesario
- [ ] No rompe funcionalidades existentes
- [ ] Actualiza la documentación si es necesario

## 🎯 Para Junior Developers

### Primeras Contribuciones Sugeridas

1. **Agregar nuevos iconos** a la tabla de inventario
2. **Mejorar mensajes de error** en la consola
3. **Agregar tooltips** a los KPIs
4. **Crear animaciones CSS** adicionales
5. **Mejorar accesibilidad** (aria-labels, alt texts)

### Estructura del Código

```
├── index.html          # Estructura HTML
├── styles.css          # Todos los estilos
├── app.js             # Lógica JavaScript
├── *.json             # Datos de ejemplo
└── README.md          # Documentación
```

### Buenas Prácticas

- **CSS**: Usa variables CSS para colores y espaciado
- **JavaScript**: Funciones pequeñas y reutilizables
- **HTML**: Elementos semánticos y accesibles
- **Responsive**: Mobile-first approach

## 🐛 Reportar Bugs

Usa el template de issues para reportar bugs:

**Describe el bug:**
Descripción clara del problema.

**Para reproducir:**

1. Ir a '...'
2. Hacer clic en '....'
3. Scroll hasta '....'
4. Ver error

**Comportamiento esperado:**
Lo que debería haber pasado.

**Screenshots:**
Si aplica, agrega screenshots.

**Environment:**

- OS: [ej. Windows 10]
- Browser: [ej. Chrome 91]
- Versión: [ej. 1.0.0]

## 💡 Sugerir Features

Para sugerir nuevas funcionalidades:

1. **Verifica** que no exista ya un issue similar
2. **Describe** claramente la funcionalidad
3. **Explica** por qué sería útil
4. **Incluye** mockups si es posible

## 🔍 Code Review

### Como Reviewer

- Sé constructivo y amable
- Sugiere mejoras específicas
- Reconoce el buen código
- Enseña, no solo corrijas

### Como Contributor

- Responde a comentarios constructivamente
- Pregunta si no entiendes algo
- Agradece el feedback
- Aprende de las sugerencias

## 🏆 Reconocimiento

Los contribuidores serán reconocidos en:

- Lista de contributors en GitHub
- Sección de agradecimientos en README
- Releases notes

## 📞 Contacto

Si tienes preguntas:

- Abre un issue con la etiqueta `question`
- Menciona a @JhonLaurens en el issue

## 🎓 Recursos para Aprender

### HTML/CSS

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)

### JavaScript

- [JavaScript.info](https://javascript.info/)
- [Eloquent JavaScript](https://eloquentjavascript.net/)

### Git/GitHub

- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

¡Gracias por contribuir! 🎉
