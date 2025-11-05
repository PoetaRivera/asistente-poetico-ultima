# Asistente Poético

Aplicación web interactiva para generar poemas utilizando inteligencia artificial. Este proyecto está alojado en Firebase Hosting.

## Descripción

Asistente Poético es una herramienta que permite a los usuarios crear poemas de forma interactiva. La aplicación utiliza tecnologías web modernas y está diseñada con una interfaz intuitiva y atractiva.

## Características

- Interfaz web moderna y responsiva
- Generación de poemas interactivos
- Diseño limpio con tipografía Roboto
- Página "Acerca de" con información del proyecto
- Configurado con Firebase Hosting
- Linting con ESLint para mantener la calidad del código

## Estructura del Proyecto

```
asistente-poetico-ultima/
├── .firebaserc           # Configuración de Firebase
├── .gitignore           # Archivos ignorados por Git
├── firebase.json        # Configuración de Firebase Hosting
├── package.json         # Dependencias y scripts
├── eslint.config.mjs    # Configuración de ESLint
├── public/              # Archivos públicos del sitio
│   ├── index.html       # Página principal
│   ├── index.css        # Estilos principales
│   ├── acercade.html    # Página "Acerca de"
│   ├── acercade.css     # Estilos de "Acerca de"
│   ├── acercade.js      # JavaScript de "Acerca de"
│   ├── asistentepoetico.js    # Lógica principal
│   ├── asistentepoetico.css   # Estilos de la aplicación
│   ├── funciones.js     # Funciones auxiliares
│   └── imagenes/        # Recursos de imagen
│       ├── FOTOPERFILCIRCULAR.png
│       ├── asistentepoetico.png
│       └── fondocabecera.png
└── node_modules/        # Dependencias (ignorado por Git)
```

## Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Cuenta de Firebase (para deployment)

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/PoetaRivera/asistente-poetico-ultima.git
cd asistente-poetico-ultima
```

2. Instala las dependencias:
```bash
npm install
```

## Uso

### Desarrollo Local

Para ejecutar el servidor de desarrollo de Firebase:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5000` (o el puerto que Firebase asigne).

### Linting

Para verificar la calidad del código:

```bash
npm run lint
```

Para corregir automáticamente los problemas de linting:

```bash
npm run lint:fix
```

### Deployment

Para desplegar la aplicación a Firebase Hosting:

```bash
npm run deploy
```

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Hosting**: Firebase Hosting
- **Fuentes**: @fontsource/roboto
- **Herramientas de Desarrollo**: ESLint, Firebase Tools
- **Control de Versiones**: Git

## Configuración de Firebase

El proyecto está configurado para usar Firebase Hosting. El proyecto de Firebase se llama `asistentepoetico` según el archivo `.firebaserc`.

Para configurar tu propia instancia:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Instala Firebase CLI: `npm install -g firebase-tools`
3. Inicia sesión: `firebase login`
4. Inicializa el proyecto: `firebase init`
5. Selecciona Hosting y sigue las instrucciones

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo local
- `npm run deploy` - Despliega a Firebase Hosting
- `npm run lint` - Ejecuta ESLint en el código
- `npm run lint:fix` - Corrige automáticamente problemas de linting

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Autor

**PoetaRivera**

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Historial de Cambios

### v1.0.0 (2025)
- Versión inicial del proyecto
- Implementación de la interfaz principal
- Configuración de Firebase Hosting
- Integración de ESLint
- Migración del código fuente desde el repositorio original

## Soporte

Para reportar problemas o sugerir mejoras, por favor abre un issue en el repositorio de GitHub.
