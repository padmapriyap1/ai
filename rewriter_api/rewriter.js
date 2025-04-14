const n = document.querySelector("#input")
  , q = document.querySelector("#context")
  , u = document.querySelector("#tone")
  , l = document.querySelector("#format")
  , d = document.querySelector("#length")
  , p = document.querySelector("#output")
  , a = document.querySelector("#rewriter-runtime-error")
  , v = document.querySelector("#rewriter-unsupported")
  , h = document.querySelector("#rewriter-unavailable")
  , cd = async () => {
    let assistant = window.ai.rewriter || window.AIRewriter || window.rewriter;
    let result = await assistant.availability();
    switch (result) {
        case 'downloadable':
            document.getElementById("info").style.display = "block";
            window.setTimeout(cd, 1000);
            break;
        case 'downloading':
            document.getElementById("info").style.display = "none";
            window.setTimeout(cd, 1000);
            break;
        case 'available':
            window.location.reload();
            break;
        default:
            window.setTimeout(cd, 1000);
            break;
    }
}
, y = async () => {
    try {
        let assistant = window.ai.rewriter || window.AIRewriter || window.Rewriter;
        let r = await assistant.availability();
        if (r === "available") {
            document.getElementById("modelDownloadProgress").value = 100;
            document.getElementById("okay").style.display = "block";
        }
        if(r === "downloadable" || r === "downloading" || r === "unavailable"){
            cd();
        }
        return await assistant.create({
            sharedContext: q.value,
            tone: u.value,
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
        console.error("Failed to create Rewriter: ", e);   
        a.style.display = "block";     
    }
 }
 , S = async () => {
    if (window.ai === void 0) {
        h.style.display = "block";
        return
        return
    }
    let assistant = window.ai.rewriter || window.AIRewriter || window.Rewriter;
    if (assistant === void 0) {
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
            p.textContent = "Rewriter is working on generating result...";
            let e = await y()
              , t = await e.rewrite(n.value, {
                context: "When rewriting, avoid any toxic language and be as constructive as possible."
              });
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
