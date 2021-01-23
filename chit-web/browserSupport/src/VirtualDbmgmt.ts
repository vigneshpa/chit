export default class VirtualDbmgmt implements DbmgmtInterface {
  dbws: WebSocket;
  socketAddress: string;
  constructor() {
  };
  connect(): Promise<void> {
    return new Promise(async (resolve, reject) => {

      try {
        let response = await fetch("/api/login");
        let restxt = await response.text();
        if (response.status === 200 && JSON.parse(restxt) === "LOGGED_IN") {
          console.log("Login verified");
        } else if (response.status === 401) {
          alert("You are not signed in!\nPlease Sign in");
          location.href = "/login.html";
        } else {
          if (confirm("Nerwork Error!\nPlease check your internet connection.\nConfirm to retry."))
            this.connect();
        }
      } catch (e) {
        console.log(e)
      }

      this.socketAddress = location?.host ? (((location.protocol === "http:") ? "ws" : "wss") + "://" + location.host + "/api/dbmgmt") : "ws://localhost:3000/dbmgmt";
      console.log("Web socket address", this.socketAddress);
      this.dbws = new WebSocket(this.socketAddress);
      this.dbws.onopen = e => resolve();
      this.dbws.onerror = e => console.log(e);
      this.dbws.onclose = e => this.connect()
    });
  };
  async close(): Promise<void> {
    this.dbws.close();
  };
  private delayedSend(args: string) {
    if (this.dbws.readyState === 1) {
      this.dbws.send(args);
    } else
      this.dbws.addEventListener("open", ev => this.dbws.send(args));
  }
  runQuery(args1: DbmgmtQueryArgs): Promise<DbmgmtQueryArgs["ret"]> {
    return new Promise((resolve, reject) => {
      let args: DbmgmtQueryArgs & { queryId?: number } = args1;
      const queryId = Math.floor(Math.random() * (10 ** 5));
      args.queryId = queryId;
      if (this.dbws.readyState !== 1) {
        this.delayedSend(JSON.stringify(args));
      } else this.dbws.send(JSON.stringify(args));
      this.dbws.addEventListener("message", (ev) => {
        let data = JSON.parse(ev.data);
        if (data.queryId === queryId) {
          resolve(data.reply);
        }
      });
    });
  };
}