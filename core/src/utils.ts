
export function isFiniteUnSignInteger(num:number){
  return Number.isSafeInteger(num) && Number.isFinite(num) && num >= 0;
}