# Clave de Cristal

Juego original en español para **Un juego cada día**, 25 de octubre de 2026. Seis cerraduras, seis problemas de deducción y ninguna cuenta atrás. Cada una tiene pistas fijas que, juntas, determinan una sola clave. Las pruebas del jugador añaden pistas nuevas.

## Jugar

Selecciona una casilla y después un símbolo. **Exactos** cuenta símbolos en su posición correcta; **desplazados** cuenta símbolos presentes en otra posición. Son totales, no marcas asociadas a las casillas de la fila. Un exacto no cuenta también como desplazado. No se repiten símbolos ni en la clave ni en una prueba. Pueden sobrar símbolos de la paleta.

Las seis cerraduras pasan de 3 casillas y 4 símbolos a 5 casillas y 7 símbolos. Sus espacios iniciales son 24, 60, 120, 360, 720 y 2520 combinaciones. El archivo permanece visible, por lo que el reto es cruzar restricciones, sin memorizar secuencias. Cada cerradura permite entre 6 y 8 pruebas nuevas y reintentos sin límite. Tras agotarlas se ofrece reintentar o consultar la solución; consultarla no otorga progreso.

- Ratón o táctil: toca una casilla y un símbolo; no requiere arrastrar.
- Tab recorre los controles. Enter o Espacio activa botones.
- En las casillas o la paleta: 1–7 coloca símbolos; izquierda/derecha cambia la casilla; Supr/Retroceso borra. Enter en una casilla comprueba la clave.
- Escape cancela una confirmación. Reinicio y borrado tienen confirmación con foco inicial en Cancelar.

Los colores siempre van acompañados de formas y nombres. La interfaz incluye anuncios de estado, foco visible, controles nativos, enlace para saltar al juego y reducción de movimiento.

## Ejecutar y comprobar

Solo Node.js 24. No hay dependencias, instalación ni compilación:

```sh
npm start
# http://127.0.0.1:8505
npm run check
```

`check` comprueba sintaxis y ejecuta los tests de Node. Incluyen un oráculo independiente para las pistas, 729 pares con repeticiones hipotéticas, las 3804 combinaciones legales contra las seis claves, unicidad de cada acertijo, validación de pruebas, agotamiento y recuperación del almacenamiento. Los tests no sustituyen la revisión visual ni una prueba física táctil.

## Progreso y privacidad

La clave exclusiva es `daily-games:clave-de-cristal:v1`. Formato compatible con el catálogo:

```json
{"version":1,"currentLevel":0,"completed":{"0":{"bestMoves":2}},"run":null,"updatedAt":null}
```

`bestMoves` significa menor número de pruebas nuevas para abrir una cerradura. `run` guarda nivel, pruebas y borrador. Se valida tamaño, versión, rangos, símbolos distintos, orden de desbloqueo y legalidad de cada prueba. Un guardado dañado recupera solo datos válidos. Si el almacenamiento falla, el juego sigue en memoria y muestra un aviso. Continuar restaura también los estados de victoria o de pruebas agotadas. Cambios desde otra pestaña vuelven al taller con el progreso más reciente. No se promete sincronización entre dispositivos.

No hay telemetría, feedback externo, ranking global, cuentas, cookies, secretos, librerías ni peticiones a terceros. La política CSP desactiva conexiones de red del código del juego. Solo el enlace explícito al catálogo navega fuera del repositorio.

## Publicación independiente

Destino previsto: `mitchell-castillo/clave-de-cristal`, GitHub Pages desde `main` y `/ (root)`. `.nojekyll` permite publicar los archivos estáticos. Las rutas de recursos son relativas para funcionar bajo `/clave-de-cristal/`. El workflow `.github/workflows/check.yml` usa Node 24 y permisos de solo lectura, sin secretos. El workflow valida; GitHub Pages publica por separado.

La ficha y la copia de la portada para el catálogo se preparan fuera de este repositorio. El catálogo solo debe incorporar la ficha publicada después de verificar el despliegue real. No se modifica ningún juego anterior.

## Archivos y originalidad

- `core.js`: reglas puras y enumerador de soluciones.
- `puzzles.js`: seis composiciones fijas originales, sin aleatoriedad.
- `storage.js`: progreso validado y fallos seguros.
- `app.js`, `index.html`, `styles.css`: interfaz del juego.
- `assets/`: portada, favicon y siete símbolos SVG dibujados para este juego.
- `tests/`: pruebas de reglas, solvencia, persistencia y entrega.

La mecánica es deducción por posición y pertenencia con símbolos distintos. No utiliza rutas inerciales, apuntado de un faro, gestión del huerto, cambios ferroviarios simultáneos, memoria visual secuencial, masas/momentos ni encaje de poliminós. El código fuente contiene las soluciones como cualquier puzle estático local: no es un sistema competitivo ni protege sus claves frente a la inspección del navegador.
