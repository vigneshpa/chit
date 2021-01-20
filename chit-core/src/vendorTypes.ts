declare global {
  type Await<T> = T extends PromiseLike<infer U> ? U : T;
  type RangeOf2<From extends number, To extends number> = Exclude<RangeOf<To>, RangeOf<From>> | From;
  interface ChitMessageBoxOptions {
    type?: string;
    buttons?: string[];
    defaultId?: number;
    title?: string;
    message: string;
    detail?: string;
    checkboxLabel?: string;
    checkboxChecked?: boolean;
    icon?: any;
    cancelId?: number;
    noLink?: boolean;
    normalizeAccessKeys?: boolean;
  }
  interface ChitOpenDialogOptions {
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: {
      extensions: string[];
      name: string;
    }[];
    properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>;
    message?: string;
    securityScopedBookmarks?: boolean;
  }
  interface ChitOpenDialogReturnValue {
    /**
     * whether or not the dialog was canceled.
     */
    canceled: boolean;
    /**
     * An array of file paths chosen by the user. If the dialog is cancelled this will
     * be an empty array.
     */
    filePaths: string[];
    /**
     * An array matching the `filePaths` array of base64 encoded strings which contains
     * security scoped bookmark data. `securityScopedBookmarks` must be enabled for
     * this to be populated. (For return values, see table here.)
     *
     * @platform darwin,mas
     */
    bookmarks?: string[];
  }
  //IPC channel definitions
  interface ipcMainChannels {
    "ipci-methods": [{
      methodID: number;
      args: Record<string, any>;
    }];
    "ipci-methods-ret": [{
      methodID: number;
      ret: any;
    }];
  }
  interface ipcRendererChannels {
    "ipci-methods": [{
      methodID: number;
      args: Record<string, any>;
    }];
    "ipci-methods-ret": [{
      methodID: number;
      ret: any;
    }];
  }
  type ChitIpcMain = ChitIpcM<ipcMainChannels, ipcRendererChannels>;
  type ChitIpcRenderer = ChitIpcR<ipcRendererChannels, ipcMainChannels>;
  type ChitIpcMainWebcontents = ChitIpcMWebcontents<ipcRendererChannels>;
  type ChitIpcRendererEvent = ChitIpcREvent<ipcRendererChannels, ipcMainChannels>;
  type ChitIpcMainEvent = ChitIpcMEvent<ipcRendererChannels>;
}


// TYPE DEFINITIONS FOR IPC
export interface ChitIpcR<RCM, MCM> {
  once: ListenerFunctionRegisterer<RCM, ChitIpcR<RCM, MCM>, ChitIpcREvent<RCM, MCM>>;
  on: ListenerFunctionRegisterer<RCM, ChitIpcR<RCM, MCM>, ChitIpcREvent<RCM, MCM>>;
  send: SendFunction<MCM, void>;
  sendSync: SendFunction<MCM, any>;
  id?: number;
}
export interface ChitIpcM<MCM, RCM> {
  on: ListenerFunctionRegisterer<MCM, ChitIpcM<MCM, RCM>, ChitIpcMEvent<RCM>>;
  once: ListenerFunctionRegisterer<MCM, ChitIpcM<MCM, RCM>, ChitIpcMEvent<RCM>>;
}
export interface ChitIpcMWebcontents<RCM> {
  send: SendFunction<RCM, void>;
  id: number;
}
export interface ChitIpcMEvent<RCM> {
  sender: ChitIpcMWebcontents<RCM>;
  reply: Function;
  returnValue?: any;
}
export interface ChitIpcREvent<RCM, MCM> {
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
type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends ((k: infer I) => void) ? I : never;

type IntersectMethodSignatures<S> = UnionToIntersection<S[keyof S]>;




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
