const n = document.querySelector("#input")
  , q = document.querySelector("#context")
  , u = document.querySelector("#type")
  , l = document.querySelector("#format")
  , d = document.querySelector("#length")
  , p = document.querySelector("#output")
  , v = document.querySelector("#summarization-unsupported")
  , h = document.querySelector("#summarization-unavailable")
  , y = async () => {
    try {
        let r = await window.ai.summarizer.availability();
        if (r === "available") {
            document.getElementById("modelDownloadProgress").value = 100;
            document.getElementById("okay").style.display = "block";
        }
        return await window.ai.summarizer.create({
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
    } catch(e) {
        console.error("Failed to create summarizer: ", e);        
    }
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
        if (n.value === "") {
            return
        }
        clearTimeout(o),
        o = setTimeout(async () => {
            p.textContent = "Generating summary...";
            let e = await y()
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
