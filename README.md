# 🏥 Digital Health Web Suite (HIS & Patient/Physician Portals)

Plataforma modular e-Health para la gestión hospitalaria, seguimiento ambulatorio de pacientes y estación de trabajo radiológica con visor DICOM. Desarrollada en el marco del **Laboratorio de Aplicaciones en Salud Digital** (Grado en Ingeniería Biomédica / Telecomunicaciones, GBT - UPM).

---

## 🌟 Arquitectura del Ecosistema

El sistema integra tres módulos independientes que interoperan compartiendo modelos relacionales clínicos, almacenamiento de bioseñales e imágenes médicas:

```text
Digital-Health-Suite/
├── aplicacion_web_gestion/        # Módulo de Admisión y Gestión Hospitalaria
├── aplicacion_web_paciente/       # Portal del Paciente (Monitoreo ambulatorio)
├── aplicacion_web_profesional/    # Portal Médico & Visor Radiológico DICOM
├── database/                      # Esquemas SQL para MySQL/phpMyAdmin
├── docs/                          # Memorias técnicas de diseño y UX
└── .gitignore
```


💻 MÓDULOS Y TECNOLOGÍAS

1. Módulo de Gestión Hospitalaria (aplicacion_web_gestion)
Portal administrativo para el personal de admisión y coordinación médica:

- CRUD Completo: Altas, bajas, modificaciones y consultas de Pacientes, Médicos y Visitas.

- Integridad referencial clínica: Validación de reglas de negocio para impedir el borrado de facultativos o pacientes con visitas       activas en el histórico.

- Formularios Dinámicos con UI Bootstrap: Selectores enlazados (ng-options) que evitan inconsistencias vinculando identificadores reales (PAC_ID, MED_ID).

Stack: AngularJS 1.4.x, Node.js, Express, express-myconnection, MySQL, Bootstrap 3, FontAwesome.

2. Portal del Paciente (aplicacion_web_paciente)
Portal personal para el paciente enfocado en telemedicina y seguimiento metabólico:

- Autenticación y Sesión: Control de acceso mediante login/password y persistencia de sesión en cliente vía localStorage.

- Rutas Dinámicas (ngRoute): Navegación desacoplada tipo Single Page Application (SPA).

- Seguimiento Telemétrico: Registro de peso diario (con resolución de duplicados en BD mediante INSERT ... ON DUPLICATE KEY UPDATE).

- Visualización Gráfica: Gráficos interactivos de evolución temporal mediante ng-google-chart (Google Visualization API).

- Historial de Consultas: Consulta en tiempo real de citas, diagnósticos y médicos asignados.

- Stack: AngularJS, angular-route, ng-google-chart, Express, MySQL.

3. Portal Profesional & Estación DICOM (aplicacion_web_profesional)
Estación clínica para médicos y radiólogos:

- Filtrado por Facultativo: Consulta de agenda y citas asignadas a cada profesional.

- Hibridación Relacional + PACS/DICOM: Consulta cruzada entre la base de datos relacional de gestión (MySQL) y el catálogo de imágenes médicas (Microsoft Access .mdb mediante node-adodb).

- Visor Radiológico Web: Renderizado y parseo de imágenes médicas DICOM nativas en cliente utilizando NgDicomViewer y openjpeg.js.

- Herramientas de Diagnóstico por Imagen:

    Ventaneo y ajuste de contraste (Window/Level).

    Paletas de falso color (Rainbow, Hot, Invert, Sobel, Sharpen).

    Anotaciones y calibración de medidas (líneas, elipses, rectángulos).

    Inspector de metadatos clínicos y cabeceras de tags DICOM.

- Stack: AngularJS, node-adodb, NgDicomViewer, openjpeg, Express, MySQL, Access ODBC.


⚙️ REQUISITOS PREVIOS

- Node.js (versión 14.x a 18.x recomendada para compatibilidad de dependencias legadas).

- XAMPP (con servicios de Apache y MySQL activos).

- Entorno Windows con Microsoft Access Database Engine (necesario para el driver OLE DB de node-adodb en el módulo profesional).


🚀 DESPLIEGUE E INSTALACIÓN

1. Configuración de la Base de Datos
Inicia XAMPP Control Panel y arranca los módulos Apache y MySQL.

Entra en http://localhost/phpmyadmin.

Crea las tres bases de datos requeridas por cada módulo:

- testdb (utilizada por aplicacion_web_gestion).

- testdb2 (utilizada por aplicacion_web_profesional).

- testdb3 (utilizada por aplicacion_web_paciente).

Selecciona cada una de ellas e importa el archivo database/database_schema.sql.

2. Arranque de los Módulos
Para ejecutar cualquiera de las aplicaciones:

# Navega al directorio del módulo que deseas arrancar
cd aplicacion_web_gestion       # o aplicacion_web_paciente / aplicacion_web_profesional

# Instala las dependencias (solo la primera vez)
npm install

# Inicia el servidor Node.js
node server.js

Abre tu navegador en http://localhost:8080.


🔐 CREDENCIALES DE PRUEBA (PORTAL PACIENTE)

Para verificar el control de acceso en aplicacion_web_paciente:

- Usuario: PRODRIGUEZ | Contraseña: 2222

- Usuario: CLOPEZ | Contraseña: 1111

- Usuario: GPEREZ | Contraseña: 3333
