const n = document.querySelector("#input").innerHTML
  , q = document.querySelector("#context")
  , u = document.querySelector("#type")
  , l = document.querySelector("#format")
  , d = document.querySelector("#length")
  , p = document.querySelector("#output")
  , a = document.querySelector("#summarization-runtime-error")
  , v = document.querySelector("#summarization-unsupported")
  , h = document.querySelector("#summarization-unavailable")
  , cd = async () => {
    let result = await window.ai.summarizer.availability();
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
        let r = await window.ai.summarizer.availability();
        if (r === "available") {
            document.getElementById("modelDownloadProgress").value = 100;
            document.getElementById("okay").style.display = "block";
        }
        if(r === "downloadable" || r === "downloading" || r === "unavailable"){
            cd();
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
        a.style.display = "block";     
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
        clearTimeout(o);
        o = setTimeout(async () => {
            try {
                p.textContent = "Generating summary...";
                let e = await y()
                  , stream = await e.summarizeStreaming(n.value);
            } catch (e) {
                console.error("Failed to summarize: ", e);
                a.style.display = "block";
            }
            try {
                let result = '';
                let previousLength = 0;
                for await (const segment of stream) {
                    const newContent = segment.slice(previousLength);
                    console.log("New content: \n" + newContent);
                    previousLength = segment.length;  
                    result += newContent;
                }
                p.textContent(result);
            } catch (e) {
                console.error("Failed to stream the summary: ", e);
                a.style.display = "block";
            }
            
        }, 1e3)
    }
    q.addEventListener("change", a),
    u.addEventListener("change", a),
    l.addEventListener("change", a),
    d.addEventListener("change", a),
    n.addEventListener("input", a)
}
;
S();
