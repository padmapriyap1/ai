console.warn = function(message){
    if (message.includes("there was not an execution config")) {
        a.style.display = "block";
        console.error("Rewriter is not available: ", message);
        return;
    }
}
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
    try {
    let assistant = window.ai.rewriter || window.AIRewriter || window.Rewriter;
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
} catch(e) {
    console.error("Failed to create Rewriter: ", e);   
    a.style.display = "block";     
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
            try {
               let e = await y();
               let abortController = new AbortController();
               const stream = await e.rewriteStreaming(n.value, {signal: abortController.signal});
               let isFirstChunk = true;
               for await (const chunk of stream) {
                  if (isFirstChunk) {
                    isFirstChunk = false;
                    p.textContent = "";
                  }
                  p.textContent += chunk;
                }
              } catch (e) {
                console.error(e);
                a.style.display = "block";
              }
            e.destroy();
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
