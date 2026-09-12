/**
 * Lector de la carpeta del viaje.
 *
 * Devuelve en JSON todos los archivos de la carpeta de Drive, con su ruta y su
 * identificador, para que la página los muestre sin que nadie toque el código.
 * No permite escribir ni borrar nada: solo lee y lista.
 *
 * Cómo se instala (una sola vez, unos cinco minutos):
 *
 *   1. Entra a https://script.google.com con la cuenta cateladi09@gmail.com
 *      y crea un proyecto nuevo.
 *   2. Borra lo que traiga el editor y pega este archivo completo.
 *   3. Botón "Implementar" > "Nueva implementación".
 *   4. En el engranaje elige "Aplicación web". En "Ejecutar como" deja tu
 *      cuenta, y en "Quién tiene acceso" elige "Cualquier usuario".
 *   5. Acepta los permisos y copia la URL que termina en /exec.
 *
 * Esa URL es la que va en la constante SYNC_URL de index.html.
 */

var CARPETA = '1netn2u_ku8Yxdi6mD4T4mCXVgAldnLX4';

function doGet() {
  var archivos = [];
  try {
    recorrer(DriveApp.getFolderById(CARPETA), '');
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
  return json({ ok: true, at: new Date().toISOString(), files: archivos });

  function recorrer(carpeta, ruta) {
    var fs = carpeta.getFiles();
    while (fs.hasNext()) {
      var f = fs.next();
      archivos.push({
        p: ruta + '/' + f.getName(),
        id: f.getId(),
        t: f.getMimeType(),
        m: f.getLastUpdated().toISOString()
      });
    }
    var subs = carpeta.getFolders();
    while (subs.hasNext()) {
      var sub = subs.next();
      recorrer(sub, ruta + '/' + sub.getName());
    }
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
