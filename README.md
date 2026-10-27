# OBD2 Diagnostic UI en español

Interfaz web de diagnóstico OBD2 con **Español / English**. Adaptación del proyecto de [Muksin Muksin / muki01](https://github.com/muki01/OBD2-Diagnostic-UI), conservando su licencia MIT y atribución. [Documentación original en inglés](README.en.md).

## Qué incluye esta traducción

- Español como idioma inicial.
- Selector **Ajustes → Idioma**, con Español y English.
- Preferencia guardada en el navegador mediante `localStorage`; se conserva al recargar y no cambia la configuración de la ECU.
- Menús, sensores, ayudas, mensajes de conexión, formularios y textos de actualización traducidos.
- Catálogo español de 999 descripciones de averías; el catálogo inglés permanece disponible. Las descripciones se traducen con un glosario técnico y no sustituyen los procedimientos específicos de diagnóstico del fabricante.
- Presión del colector en **bar absolutos** cuando el servidor envía kPa.
- Caudalímetro en **mg** calculados por admisión y cilindro para un motor de cuatro tiempos y cuatro cilindros, usando el caudal en g/s y las RPM del mismo conjunto de datos.

Los nombres de comandos, claves JSON, identificadores de protocolo y códigos de avería no se traducen: forman parte de la comunicación con el dispositivo. Las medidas de bar y mg se mantienen en ambos idiomas.

## Cómo funciona

El navegador carga HTML, CSS y módulos JavaScript desde el ESP32 u otro servidor compatible. `js/webSocket.js` conecta con `ws://<dirección-del-dispositivo>/ws`. El dispositivo envía JSON con los datos y recibe las órdenes de la interfaz.

Esta descarga contiene la aplicación web. Necesita un firmware que implemente la comunicación con la ECU y el contrato de datos; no sustituye al firmware del lector, no emula por sí sola un ELM327 y no incorpora un controlador gráfico para una pantalla TFT.

## Páginas disponibles

| Página | Función |
| --- | --- |
| Inicio | Estado de batería y acceso a las páginas |
| Datos actuales | Valores de los sensores seleccionados |
| Averías | Consulta y solicitud de borrado de DTC |
| Datos congelados | Captura de sensores asociada a una avería |
| Prueba de aceleración | Cronómetro basado en el dato de velocidad |
| Información del vehículo | VIN, calibración e identificadores admitidos |
| Ajustes | Idioma, apariencia, protocolo, PID, red y actualizaciones |

La disponibilidad de sensores y funciones depende de la ECU y del firmware. Que aparezcan opciones CAN en la interfaz no convierte un lector K-Line en un lector CAN.

## Preparar los archivos para el ESP32

1. Descarga o clona este fork.
2. Con Python 3 instalado, ejecuta `python build_resources.py`, o abre `build_spiffs.bat` en Windows.
3. El resultado es una carpeta `data/` con HTML, CSS y JavaScript comprimidos y la tipografía. El script no elimina carpetas ni empaqueta documentación o archivos de Git.
4. Integra los recursos en la carpeta de datos del firmware compatible. Conserva los archivos de configuración del dispositivo, por ejemplo `settings.conf` si ese firmware lo utiliza.
5. Genera y carga el sistema de archivos con la herramienta correspondiente a la placa y sus particiones.

**El script prepara archivos gzip; no crea una imagen SPIFFS `.bin`, no compila el programa y no escribe en el dispositivo.** El archivo de sistema de archivos y el firmware deben corresponder al chip y al esquema de particiones.

El fork conserva las rutas de actualización de su versión original: `/firmwareUpdate` para el programa y `/fileSystemUpdate` para recursos. Algunos lectores tienen otra implementación de esas rutas; comprueba esa compatibilidad antes de usar los botones de mantenimiento. La traducción no cambia esos endpoints.

## Contrato de comunicación

Ejemplo de datos recibidos. Los nombres de campos y las claves de sensores se conservan en inglés en el protocolo; solo cambia su presentación al usuario.

```json
{
  "vehicleStatus": true,
  "Voltage": 14.1,
  "LiveData": {
    "RPM": { "value": 850, "unit": "rpm" },
    "Coolant Temp": { "value": 88, "unit": "°C" },
    "Intake Manifold Abs Pressure": { "value": 101, "unit": "kPa" },
    "MAF Flow Rate": { "value": 8.2, "unit": "g/s" }
  },
  "DTCs": "P0101",
  "FreezeFrame": {},
  "Speed": 0,
  "VIN": "",
  "ID": "",
  "IDNum": "",
  "selectedProtocol": "ISO9141",
  "connectedProtocol": "ISO9141",
  "SupportedLiveData": {
    "RPM": { "pid": 12 },
    "Coolant Temp": { "pid": 5 }
  },
  "DesiredLiveData": [5, 12]
}
```

Respeta los tipos de PID que utilice tu firmware; el ejemplo anterior utiliza números como el lector K-Line revisado. El README original muestra otro ejemplo de identificadores de texto: no deben mezclarse sin adaptar ambos lados.

| Orden enviada | Significado |
| --- | --- |
| `page0` a `page6` | Notifica la página que se está viendo |
| `clear_dtc` | Solicita borrar averías |
| `beep` | Solicita un aviso sonoro |

## Unidades para el SEAT 1.9 TDI

`js/units.js` conserva los datos recibidos y convierte una copia para mostrarlos:

- Presión: `bar = kPa / 100`. Es presión absoluta; no resta la presión atmosférica para representar sobrepresión de turbo.
- Caudal: `mg = g/s × 120000 / (RPM × 4)`, para cuatro cilindros y cuatro tiempos.
- Si faltan RPM válidas o son cero, el caudal calculado se presenta como un guion. No se sustituye un dato desconocido por cero.

La etiqueta se abrevia a mg por espacio en pantalla. Es un cálculo a partir de caudal y régimen, no una lectura directa del bloque de medición VAG. El firmware debe enviar medidas válidas y próximas en el tiempo; esta interfaz no puede garantizar por sí sola la frescura de valores que el servidor no identifica con su fecha de lectura. Otros motores necesitan adaptar el número de cilindros y la interpretación.

## Archivos principales

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura de páginas, menús y formularios |
| `css/style.css` | Apariencia y ajustes para textos traducidos |
| `js/script.js` | Navegación, interacción y presentación de datos |
| `js/i18n.js` | Traducciones y selector de idioma |
| `js/units.js` | Conversión de presión y masa de aire |
| `js/errorCodes.js` | Descripciones originales en inglés |
| `js/errorCodes.es.js` | Descripciones en español |
| `js/webSocket.js` | Transporte de datos original |
| `build_resources.py` | Preparación de recursos comprimidos |

Los comentarios internos y nombres técnicos se conservan cuando ayudan a comparar con el original. La licencia legal se mantiene íntegra en inglés.

## Comprobaciones y límites

Se verifica sintaxis JavaScript, generación de recursos comprimidos, conservación del transporte y códigos originales, selector bilingüe y conversiones de unidades. No se ha programado una placa ni probado esta adaptación con la ECU del SEAT. Las conversiones no demuestran que el coche admita los PID necesarios.

## Proyectos relacionados

- [Lector OBD2 K-Line](https://github.com/muki01/OBD2_K-line_Reader): firmware para ISO 9141-2 e ISO 14230.
- [Lector OBD2 CAN](https://github.com/muki01/OBD2_CAN_Bus_Reader): firmware para diagnóstico CAN.
- [Biblioteca K-Line en español](https://github.com/dewasha40/OBD2_KLine_Library_Spanish): biblioteca y guía de construcción.
- [Biblioteca CAN](https://github.com/muki01/OBD2_CAN_Bus_Library).
- [VAG KW1281](https://github.com/muki01/VAG_KW1281).
- [BMW I/K-Bus](https://github.com/muki01/I-K_Bus).

## Autor, apoyo y licencia

Autor original: **Muksin Muksin / muki01**. Contacto: **muksin.muksin04@gmail.com**, para información, colaboración, patrocinio o dispositivos. Puedes apoyar su trabajo mediante [Buy Me a Coffee](https://www.buymeacoffee.com/muki01), [PayPal](https://www.paypal.com/donate/?hosted_button_id=SAAH5GHAH6T72) o [GitHub Sponsors](https://github.com/sponsors/muki01).

La aplicación se distribuye bajo [MIT](LICENSE). Se conserva el aviso de copyright del autor y el texto legal. Adaptación al español para el fork de dewasha40; no implica aprobación del autor original.
