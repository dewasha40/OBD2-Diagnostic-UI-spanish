// Conversiones de presentación para el 1.9 TDI de cuatro cilindros y cuatro tiempos.
// No modifica la trama JSON recibida ni los PID solicitados.
export function displayReading(key,data,readings){
 const item={...data}; const name=key.toLowerCase();
 if(name.includes('manifold') && name.includes('pressure') && item.unit==='kPa' && Number.isFinite(item.value)){
   item.value=item.value/100; item.unit='bar';
 }
 if((name.includes('maf') || name.includes('mass air flow')) && item.unit==='g/s'){
   const rpm=(readings.RPM ?? readings['Engine RPM'] ?? readings['Engine Speed'])?.value;
   item.value=Number.isFinite(item.value) && item.value>=0 && Number.isFinite(rpm) && rpm>0 ? Math.round(item.value*120000/(rpm*4)) : '—';
   item.unit='mg';
 }
 return item;
}
