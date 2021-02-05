declare global {
  type Await<T> = T extends PromiseLike<infer U> ? U : T;
  type RangeOf2<From extends number, To extends number> = Exclude<RangeOf<To>, RangeOf<From>> | From;

  // UNION TO INTERSECTION
  type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
  ) extends ((k: infer I) => void) ? I : never;

  type IntersectMethodSignatures<S> = UnionToIntersection<S[keyof S]>;

}
// TYPE DEFINITIONS FOR IPC IMPROVED
type IpciMap = Record<string, (...args: any[]) => any>;

type mainHandlers<MMM extends IpciMap, RMM extends IpciMap> = {
  [K in keyof MMM]: (sender: IpciWC<MMM, RMM>, ...args: Parameters<MMM[K]>) => Promise<ReturnType<MMM[K]>>;
}

type mainCall<RMM extends IpciMap> = IntersectMethodSignatures<{
  [K in keyof RMM]: (method: K, ...args: Parameters<RMM[K]>) => Promise<ReturnType<RMM[K]>>;
}>

type rendererHandlers<RMM extends IpciMap, MMM extends IpciMap> = {
  [K in keyof RMM]: (sender: IpciR<RMM, MMM>, ...args: Parameters<RMM[K]>) => Promise<ReturnType<RMM[K]>>;
}

type rendererCall<MMM extends IpciMap> = IntersectMethodSignatures<{
  [K in keyof MMM]: (method: K, ...args: Parameters<MMM[K]>) => Promise<ReturnType<MMM[K]>>;
}>
// IPCI OBJECTS
export interface IpciM<MMM extends IpciMap, RMM extends IpciMap> {
  init: (handlers?: IpciM<MMM, RMM>["handlers"]) => void;
  handlers: mainHandlers<MMM, RMM>;
}
export interface IpciR<RMM extends IpciMap, MMM extends IpciMap> {
  init: (handlers?: IpciR<RMM, MMM>["handlers"]) => void;
  handlers: rendererHandlers<RMM, MMM>;

  callMethod: rendererCall<MMM>;
}
export interface IpciWC<MMM extends IpciMap, RMM extends IpciMap> {
  callMethod: mainCall<RMM>;
}



// TYPE DEFINITIONS FOR IPC
interface ChitIpcR<RCM, MCM> {
  once: ListenerFunctionRegisterer<RCM, ChitIpcR<RCM, MCM>, ChitIpcREvent<RCM, MCM>>;
  on: ListenerFunctionRegisterer<RCM, ChitIpcR<RCM, MCM>, ChitIpcREvent<RCM, MCM>>;
  send: SendFunction<MCM, void>;
  sendSync: SendFunction<MCM, any>;
  id?: number;
}
interface ChitIpcM<MCM, RCM> {
  on: ListenerFunctionRegisterer<MCM, ChitIpcM<MCM, RCM>, ChitIpcMEvent<RCM>>;
  once: ListenerFunctionRegisterer<MCM, ChitIpcM<MCM, RCM>, ChitIpcMEvent<RCM>>;
}
interface ChitIpcMWebcontents<RCM> {
  send: SendFunction<RCM, void>;
  id: number;
}
interface ChitIpcMEvent<RCM> {
  sender: ChitIpcMWebcontents<RCM>;
  reply: Function;
  returnValue?: any;
}
interface ChitIpcREvent<RCM, MCM> {
  sender: ChitIpcR<RCM, MCM>;
  senderId: number;
}
type SendFunction<
  ChannelMap extends Record<string, any>,
  Sup
  > = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (
      channel: C,
      ...args: ChannelMap[C]
    ) => Sup
  }>;
type ListenerFunctionRegisterer<
  ChannelMap extends Record<string, any>,
  Sup,
  SupEvent
  > = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (
      channel: C,
      listener: ChannelMap[C] extends void ?
        (event: SupEvent) => void :
        (event: SupEvent, ...args: ChannelMap[C]) => void
    ) => Sup
  }>;




// TYPE DEFINITIONS FOR RANGE OF NUMBERS

type BuildPowersOf2LengthArrays<N extends number, R extends never[][]> =
  R[0][N] extends never ? R : BuildPowersOf2LengthArrays<N, [[...R[0], ...R[0]], ...R]>;

type ConcatLargestUntilDone<N extends number, R extends never[][], B extends never[]> =
  B["length"] extends N ? B : [...R[0], ...B][N] extends never
  ? ConcatLargestUntilDone<N, R extends [R[0], ...infer U] ? U extends never[][] ? U : never : never, B>
  : ConcatLargestUntilDone<N, R extends [R[0], ...infer U] ? U extends never[][] ? U : never : never, [...R[0], ...B]>;

type Replace<R extends any[], T> = { [K in keyof R]: T }

type TupleOf<T, N extends number> = number extends N ? T[] : {
  [K in N]:
  BuildPowersOf2LengthArrays<K, [[never]]> extends infer U ? U extends never[][]
  ? Replace<ConcatLargestUntilDone<K, U, []>, T> : never : never;
}[N]

type RangeOf<N extends number> = Partial<TupleOf<unknown, N>>["length"];