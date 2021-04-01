import apiCredentials from "./apiCredentials.json";
import localforage from "localforage";
window.handleClientLoad =
  function handleClientLoad() {
    const clientId = apiCredentials.clientId;
    const scope = "https://www.googleapis.com/auth/drive.appdata";

    window.gapi.load('client:auth2', initClient);

    function initClient() {
      window.gapi.client.init({
        clientId,
        scope
      }).then(function () {
        window.driveSignInStateAttachListener = (listener) => window.gapi.auth2.getAuthInstance().isSignedIn.listen(listener);
      });
    }

    window.handleAuthClick = function handleAuthClick(event) {
      window.gapi.auth2.getAuthInstance().signIn();
    }

    window.handleSignoutClick = function handleSignoutClick(event) {
      window.gapi.auth2.getAuthInstance().signOut();
    }
    window.backupDrive = function () {
      saveBackup("sample data");
    }
    function saveBackup(data) {

      window.gapi.client.request({path:""
      })

      // window.gapi.client.drive.files.create({
      //   body: {
      //     'name': 'backup.db',
      //     'parents': ['appDataFolder'],
      //   },
      //   media: {
      //     mimeType: 'application/x-sqlite3',
      //     body: data,
      //   },
      //   fields: 'id',
      // },  function (err, file) {
      //   if (err) {
      //     // Handle error
      //     console.error(err);
      //   } else {
      //     console.log('Folder Id:', file.id);
      //   }
      // });

    }
  }