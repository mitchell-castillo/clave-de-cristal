# Verificación · 25 de octubre de 2026

## Automatización

`npm run check`: 29 pruebas aprobadas, 0 fallos. Comprobación de sintaxis de los cuatro módulos del juego y pruebas con Node.js 24.18.0.

- 729 pares de códigos con repeticiones hipotéticas comparados contra un oráculo independiente de intersección de multiconjuntos.
- 3804 combinaciones legales comparadas contra las seis claves: 24 + 60 + 120 + 360 + 720 + 2520.
- Una única solución para cada archivo de pistas; las pistas se contrastan con su clave y ninguna es la solución completa.
- Rechazo de símbolos repetidos, pruebas conocidas, datos inválidos y pruebas posteriores al límite.
- Victoria en la última prueba, fallo y reintento deterministas.
- Persistencia, seis marcas de finalización, borradores, JSON dañado, exceso de tamaño, versión desconocida, lectura bloqueada, escritura bloqueada, desbloqueos falsos y borrado de una sola clave.

## Chrome real, escritorio y ventanas adaptables

Prueba realizada con la herramienta de control del navegador sobre HTTP local. No se utilizó un emulador DOM como sustituto del navegador.

- Se abrieron las seis cerraduras en orden: cinco con atajos de teclado y la última con clics en la paleta; se llegó al final de la colección.
- Borrador y victoria restaurados mediante recarga y Continuar. Pantalla final restaurada después de recargar.
- Propuesta incompleta, símbolo duplicado, combinación conocida y prueba repetida: mensaje correcto, sin consumir pruebas.
- Se agotaron seis pruebas distintas mediante la interfaz, se recargó el estado de fallo, se reveló la solución y se reintentó con historial vacío.
- Confirmación de reinicio cancelada con Escape. Borrado global cancelado y después confirmado. Vuelta a 0/6.
- Tab selecciona la siguiente casilla, flechas cambian la selección y Supr borra la casilla enfocada. Se corrigió y volvió a comprobar el seguimiento del foco.
- Fixture local de JSON dañado: aviso de recuperación y partida nueva funcional.
- Iframe local con sandbox y sin acceso al almacenamiento: aviso visible y cerradura resuelta íntegramente en memoria.
- Dos pestañas del mismo origen: un cambio externo vuelve al taller con aviso. Borrar el juego conservó un dato ajeno de prueba (`qa:unrelated`).
- Escritorio, 390 × 844 y 320 × 740. En 320 px, la última cerradura no desborda horizontalmente y las cinco casillas miden aproximadamente 44,6 × 70 px. Las pistas, paleta y confirmaciones usan columnas y desplazamiento vertical normal.
- Se inspeccionaron las formas SVG renderizadas y las etiquetas accesibles. No se observaron errores del código del juego en la consola; el navegador tenía avisos de una extensión ajena al juego.

## Límites de la revisión

No se probó un dispositivo táctil físico, lector de pantalla, Safari ni Firefox. El soporte táctil usa botones nativos sin arrastrar; no se afirma prueba física táctil. La revisión local de almacenamiento bloqueado usa un sandbox, no todos los modos privados de cada navegador. Los fixtures y el servidor de QA están fuera del repositorio entregable.

La publicación y la integración del catálogo se verifican por separado; este documento registra la revisión del código del juego.
