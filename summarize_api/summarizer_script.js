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
const f = 4e3
  , n = document.querySelector("#input")
  , t = document.querySelector("#context")
  , u = document.querySelector("#type")
  , l = document.querySelector("#format")
  , d = document.querySelector("#length")
  , c = document.querySelector("#character-count")
  , m = document.querySelector("#character-count-exceed")
  , v = document.querySelector("#summarization-unsupported")
  , h = document.querySelector("#summarization-unavailable")
  , p = document.querySelector("#output")
  , w = async (t, r, i, o, a) => {
    let e;
    if (!await y())
        throw new Error("AI Summarization is not supported");
    return window.ai.summarizer.create({
        sharedContext: t,
        type: r,
        format: i,
        length: o,
        monitor: e
    })
}
  , y = async () => {
    let r = await window.ai.summarizer.capabilities();
    if (r.available === "readily" || r.available === "after-download")
        return !0;
    try {
        await window.ai.summarizer.create({
            sharedContext: t.value,
            type: u.value,
            format: l.value,
            length: d.value
        })
    } catch {}
    return r = await window.ai.summarizer.capabilities(),
    r.available !== "no"
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
            let e = await w(t.value, u.value, l.value, d.value)
              , t = await e.summarize(n.value);
            e.destroy(),
            p.textContent = t
        }
        , 1e3)
    }
    t.addEventListener("change", a),
    u.addEventListener("change", a),
    l.addEventListener("change", a),
    d.addEventListener("change", a),
    n.addEventListener("input", () => {
        c.textContent = n.value.length.toFixed(),
        n.value.length > f ? (c.classList.add("tokens-exceeded"),
        m.classList.remove("hidden")) : (c.classList.remove("tokens-exceeded"),
        m.classList.add("hidden")),
        a()
    }
    )
}
;
S();
