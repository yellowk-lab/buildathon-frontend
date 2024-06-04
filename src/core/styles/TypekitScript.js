import { useEffect } from "react";

const TypekitScript = () => {
  useEffect(() => {
    const config = {
      kitId: "gwr1yvw",
      scriptTimeout: 3000,
      async: true,
    };
    const h = document.documentElement;
    const t = setTimeout(() => {
      h.className = h.className.replace(/\bwf-loading\b/g, "") + " wf-inactive";
    }, config.scriptTimeout);
    const tk = document.createElement("script");
    let f = false;
    const s = document.getElementsByTagName("script")[0];
    let a;
    h.className += " wf-loading";
    tk.src = "https://use.typekit.net/" + config.kitId + ".js";
    tk.async = true;
    tk.onload = tk.onreadystatechange = function () {
      a = this.readyState;
      if (f || (a && a != "complete" && a != "loaded")) return;
      f = true;
      clearTimeout(t);
      try {
        Typekit.load(config);
      } catch (e) {}
    };
    s.parentNode.insertBefore(tk, s);
  }, []);

  return null;
};

export default TypekitScript;
