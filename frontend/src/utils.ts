export function debounce<Params extends any[], Context extends object> (func:(this:Context, ...args:Params)=>any, delay:number):(this:Context, ...args:Params)=>void{
  let debounceTimer:any;
  return function(this:Context, ...args:Params) {
      const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay)
  }
}