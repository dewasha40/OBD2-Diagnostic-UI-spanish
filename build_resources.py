"""Prepara recursos gzip; no genera una imagen de partición ni programa placas."""
from pathlib import Path
import gzip

root=Path(__file__).resolve().parent
assets=['index.html','css/style.css','js/script.js','js/webSocket.js','js/errorCodes.js','js/errorCodes.es.js','js/i18n.js','js/units.js','fonts/Montserrat-Bold.woff2']
for relative in assets:
    source=root/relative
    target=root/'data'/(relative if source.suffix=='.woff2' else relative+'.gz')
    target.parent.mkdir(parents=True,exist_ok=True)
    raw=source.read_bytes()
    target.write_bytes(raw if source.suffix=='.woff2' else gzip.compress(raw,mtime=0))
    print('Preparado:',target.relative_to(root))
print('Recursos listos en data. Falta generar/cargar SPIFFS para la placa y sus particiones.')
