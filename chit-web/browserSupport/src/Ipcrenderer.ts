class Ipcrenderer {
  private worker: SharedWorker;
  private port: MessagePort;
  id: number;
  private onceListeners: { [channel: string]: ((event: ChitIpcRendererEvent, ...args: any[]) => void)[] };
  private listeners: { [channel: string]: ((event: ChitIpcRendererEvent, ...args: any[]) => void)[] };
  private ipcrendererevent(): ChitIpcRendererEvent {
    return { sender: this, senderId: this.id };
  };
  //Constructor
  constructor(worker: SharedWorker) {
    this.worker = worker;
    this.port = this.worker.port;
    this.onceListeners = {};
    this.listeners = {};

    //Events handler
    this.port.addEventListener("message", (ev) => {
      if (ev.data?.channel) {
        console.log("IPCRenderer: Recived message ", ev.data, " from main");
        if (this.listeners[ev.data.channel]) this.listeners[ev.data.channel].forEach((listener) => listener(this.ipcrendererevent(), ...ev.data?.args));
        if (this.onceListeners[ev.data.channel]) {
          this.onceListeners[ev.data.channel].forEach((listener) => listener(this.ipcrendererevent(), ...ev.data?.args));
          this.onceListeners[ev.data.channel] = null;
        }
      } else if (ev.data?.toIpcClass) {
        this.id = ev.data.id;
        if (this.id = 0) alert("This tab holds the main process!\nDon't close this.");
      }
    });
  };

  on(channel: string, listener: (event: ChitIpcRendererEvent, ...args: any[]) => void) {
    if (!this.listeners[channel]) this.listeners[channel] = [];
    this.listeners[channel].push(listener);
    return this;
  };

  once(channel: string, listener: (event: ChitIpcRendererEvent, ...args: any[]) => void) {
    if (!this.onceListeners[channel]) this.onceListeners[channel] = [];
    this.onceListeners[channel].push(listener);
    return this;
  }

  send(channel: string, ...args: any[]) {
    console.log("Posting message ", channel, ":", args, " to the worker")
    this.port.postMessage({ channel, args });
  };

  sendSync(channel: string, ...args: any[]) {
    console.log("Posting message ", channel, ":", args, " to the worker")
    this.port.postMessage({ channel, args });
  };
}
export default Ipcrenderer;