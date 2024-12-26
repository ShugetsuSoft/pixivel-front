/* eslint-disable no-console */

import { register } from "register-service-worker";

if (
  "serviceWorker" in window.navigator &&
  process.env.NODE_ENV === "production"
) {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
    },
    registered() {
      console.log("Service worker has been registered.");
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated(reg) {
      console.log("New content is available; please refresh.");

      let newWorker = reg.installing;
      window.addEventListener("skip-waiting", () => {
        newWorker.skipWaiting();
      });
      window.dispatchEvent(new Event("new-content-available"));

      // Invalidate all caches and remove the worker after update
      newWorker.addEventListener("statechange", (event) => {
        if (event.target.state === "activated") {
          // Clear all caches
          caches.keys().then((cacheNames) => {
            return Promise.all(
              cacheNames.map((cacheName) => {
                return caches.delete(cacheName); // Delete each cache
              })
            );
          }).then(() => {
            console.log("All caches cleared.");
            // Clear local storage and indexedDB
            localStorage.clear();
            sessionStorage.clear();
            // Optionally clear IndexedDB if you want
            indexedDB.databases().then((databases) => {
              databases.forEach((db) => {
                indexedDB.deleteDatabase(db.name); // Delete all IndexedDB databases
              });
            });
            console.log("LocalStorage, SessionStorage, and IndexedDB cleared.");

            // Unregister the service worker and remove it
            reg.unregister().then(() => {
              console.log("Service worker unregistered.");
            });

            // Redirect to a new URL after cleanup
            window.location.replace("https://beta.pixivel.art"); // Replace with your new URL
          });
        }
      });
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });

  let refreshing;
  window.navigator.serviceWorker.addEventListener(
    "controllerchange",
    function () {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    }
  );
}
