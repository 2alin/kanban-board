import { useEffect, useState } from "react";

const loadScript = (src: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      return resolve();
    }
    
    const script = document.createElement("script");
    script.src = src;
    script.id = id;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
};

export function useGAuthScripts(): boolean {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      loadScript("https://accounts.google.com/gsi/client", "gsi-client"),
      loadScript("https://apis.google.com/js/api.js", "gapi-client"),
    ])
      .then(() => setReady(true))
      .catch(console.error);
  }, []);

  return ready;
}
