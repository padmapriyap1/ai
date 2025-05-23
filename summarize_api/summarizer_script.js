(function() {
    const i = document.createElement("link").relList;
    if (i && i.supports && i.supports("modulepreload"))
        return;
    for (const e of document.querySelectorAll('link[rel="modulepreload"]'))
        a(e);
    new MutationObserver(e => {
        for (const t of e)
            if (t.type === "childList")
                for (const s of t.addedNodes)
                    s.tagName === "LINK" && s.rel === "modulepreload" && a(s)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function o(e) {
        const t = {};
        return e.integrity && (t.integrity = e.integrity),
        e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
        e.crossOrigin === "use-credentials" ? t.credentials = "include" : e.crossOrigin === "anonymous" ? t.credentials = "omit" : t.credentials = "same-origin",
        t
    }
    function a(e) {
        if (e.ep)
            return;
        e.ep = !0;
        const t = o(e);
        fetch(e.href, t)
    }
}
)();
const n = document.querySelector("#input")
  , q = document.querySelector("#context")
  , u = document.querySelector("#type")
  , l = document.querySelector("#format")
  , d = document.querySelector("#length")
  , p = document.querySelector("#output")
  , v = document.querySelector("#summarization-unsupported")
  , h = document.querySelector("#summarization-unavailable")
  , w = async (x, r, i, o, a) => {
    let e;
    if (!await y())
        throw new Error("AI Summarization is not supported");    
    return await window.ai.summarizer.create({
        sharedContext: x,
        type: r,
        format: i,
        length: o,
        monitor: e
            });
  }
  , cd = async () => {
      let result = await window.ai.summarizer.availability();
      if (result == 'after-download')
      {
          window.setTimeout(cd, 1000);
      }
      if (result == 'available')
      {
          window.location.reload();
      }
 }
 , y = async () => {
    let r = await window.ai.summarizer.availability();
    if (r === "available") {
        document.getElementById("modelDownloadProgress").value = 100;
        document.getElementById("okay").style.display = "block";
        return !0;
    }
    if(r === "after-download"){
        cd();
        return !0;
    }
    try {
        await window.ai.summarizer.create({
            sharedContext: q.value,
            type: u.value,
            format: l.value,
            length: d.value,
            monitor(m) {
                m.addEventListener("downloadprogress", e => {
                // update the progress bar with latest download status
                document.getElementById("modelDownloadProgress").value = (e.loaded / e.total) * 100;
                if (e.loaded == e.total) {
                    document.getElementById("modelDownloadProgress").value = 100;
                    console.log("Download complete");
                }
                });
            }
        })
    } catch {}
    return r = await window.ai.summarizer.availability(),
    r !== "no"
 }
 , S = async () => {
    if (!(window.ai !== void 0 && window.ai.summarizer !== void 0)) {
        h.style.display = "block";
        return
    }
    if (!await y()) {
        v.style.display = "block";
        return
    }
    let o;
    function a() {
        clearTimeout(o),
        o = setTimeout(async () => {
            p.textContent = "Generating summary...";
            let e = await w(q.value, u.value, l.value, d.value)
              , t = await e.summarize(n.value);
            e.destroy(),
            p.textContent = t
        }
        , 1e3)
    }
    q.addEventListener("change", a),
    u.addEventListener("change", a),
    l.addEventListener("change", a),
    d.addEventListener("change", a),
    n.addEventListener("input", a)
}
;
S();
