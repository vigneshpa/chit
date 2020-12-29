class Ipcmain {
  private connections: { [id: number]: ChitIpcMainWebcontents };
  private ports: { [id: number]: MessagePort };
  public noOfPorts: number;
  private onceListeners: { [channel: string]: ((event: ChitIpcMainEvent, ...args: any[]) => void)[] };
  private listeners: { [channel: string]: ((event: ChitIpcMainEvent, ...args: any[]) => void)[] };
  private ipcmainevent(connection: ChitIpcMainWebcontents): ChitIpcMainEvent {
    return { sender: connection, reply: connection.send };
  };
  //Constructor
  constructor() {
    this.onceListeners = {};
    this.listeners = {};
    this.noOfPorts = 0;
  };

  public addPort(port: MessagePort) {
    let portId = this.noOfPorts;
    this.ports[portId] = port;
    this.connections[portId] = {
      id: portId,
      send(channel: string, ...args: any[]) {
        console.log("IPCMain: Sending ", channel, args, " to renderer ", portId);
        port.postMessage({ channel, args });
      }
    };
    let connection = this.connections[portId];
    this.noOfPorts++;

    //Event handeling
    port.addEventListener("message", (ev) => {
      if (ev.data.channel) {
        console.log("IPCMain: Recived message ", ev.data, " from renderer ", portId);
        if (this.listeners[ev.data.channel]) this.listeners[ev.data.channel].forEach((listener) => listener(this.ipcmainevent(connection), ...ev.data?.args));
        if (this.onceListeners[ev.data.channel]) {
          this.onceListeners[ev.data.channel].forEach((listener) => listener(this.ipcmainevent(connection), ...ev.data?.args));
          this.onceListeners[ev.data.channel] = null;
        }
      }
    });

    //Sending ID to the  renderer
    port.postMessage({ toIpcClass: true, id: portId });
    return connection;
  }

  on(channel: string, listener: (event: ChitIpcMainEvent, ...args: any[]) => void) {
    if (!this.listeners[channel]) this.listeners[channel] = [];
    this.listeners[channel].push(listener);
    return this;
  };

  once(channel: string, listener: (event: ChitIpcMainEvent, ...args: any[]) => void) {
    if (!this.onceListeners[channel]) this.onceListeners[channel] = [];
    this.onceListeners[channel].push(listener);
    return this;
  }
}
export default Ipcmain;