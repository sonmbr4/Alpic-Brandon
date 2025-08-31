
# ALQUIPC - Sistema de Gestión de Alquiler de Equipos

ALQUIPC es una aplicación web para gestionar el alquiler de equipos informáticos. Permite calcular costos de alquiler, aplicar descuentos y recargos según diferentes condiciones, generar facturas y mantener un historial de todas las transacciones realizadas.

## Características

- Cálculo automático de costos de alquiler
- Aplicación de descuentos y recargos según:
  - Ubicación (dentro/fuera de la ciudad o en establecimiento)
  - Días adicionales de alquiler
- Generación de IDs únicos para clientes y facturas
- Historial persistente usando localStorage
- Interfaz responsive con Tailwind CSS
- Funcionalidad para copiar resúmenes de facturas




## Instalación y Uso

1. **Requisitos**: Solo necesita un navegador web moderno
2. **Ejecución**: 
   - Descargue el archivo
   - Ábralo directamente en su VisualStudio
   - Es recomendable tener la extension LiveServer
   - Inicie el live LiveServer
## Instrucciones de Uso

### Crear una nueva factura

1. Complete el formulario con:
   - Cantidad de equipos (mínimo 2)
   - Número de días iniciales
   - Seleccione la ubicación de uso
   - Ingrese días adicionales si aplica

2. Haga clic en "Calcular Alquiler"
3. Revise los detalles de la factura generada
4. Opcionalmente copie el resumen con el botón "Copiar Resumen"### Ver historial

1. Haga clic en "Historial" en la barra de navegación
2. Explore las facturas anteriores ordenadas por fecha
3. Haga clic en "Ver detalles" para revisar cualquier factura

## Detalles Técnicos

### Tarifas y Porcentajes

- Tarifa diaria por equipo: $30.000
- Recargo por uso fuera de la ciudad: 20%
- Descuento por uso en establecimiento: 10%
- Descuento por días adicionales: 5%

### Almacenamiento

Los datos se guardan automáticamente en el localStorage del navegador, por lo que:
- El historial persiste entre sesiones
- Los datos son específicos del navegador y dispositivo

### Tecnologías Utilizadas

- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS para estilos
- LocalStorage API para persistencia de datos

## Notas

- Para garantizar el funcionamiento, permita que su navegador use localStorage
- Las facturas se generan con IDs únicos basados en timestamp
- El diseño es responsive y funciona en dispositivos móviles y escritorio

## Soporte

Para problemas o preguntas, verifique que su navegador esté actualizado y que tenga habilitado JavaScript.
