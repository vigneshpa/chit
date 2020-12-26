function msToHR(ms:number){
  const S = (ms/1000);
  const s = (S%60).toFixed(3);
  const m = Math.floor(S/60)%60;
  const h = Math.floor(S/3600)%24;
  const d = Math.floor(S/86400);
  return s+"s "+m+"m "+h+"h "+(d==0?"":d+"d ");
}
export default {
  msToHR
};