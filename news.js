// Fetches published posts from Supabase and renders them as cards.
(async function loadNews() {
  const loadingEl = document.getElementById("news-loading");
  const gridEl = document.getElementById("news-grid");
  const emptyEl = document.getElementById("news-empty-msg");

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("ka-GE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  try {
    const { data, error } = await supabaseClient
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("News fetch result — data:", data, "error:", error);

    if (error) throw error;

    loadingEl.style.display = "none";

    if (!data || data.length === 0) {
      emptyEl.style.display = "block";
      return;
    }

    gridEl.style.display = "grid";
    gridEl.innerHTML = data
      .map(
        (post) => `
      <div class="news-card reveal in">
        ${post.image_url ? `<img class="news-card-img" src="${escapeHtml(post.image_url)}" alt="${escapeHtml(post.title)}">` : ""}
        <div class="news-card-date">${formatDate(post.created_at)}</div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.body)}</p>
        ${post.pdf_url ? `<a class="news-card-pdf" href="${escapeHtml(post.pdf_url)}" target="_blank" rel="noopener">PDF გახსნა ↗</a>` : ""}
      </div>
    `,
      )
      .join("");
  } catch (err) {
    loadingEl.textContent = "სიახლეების ჩატვირთვა ვერ მოხერხდა.";
    console.error("News load error:", err);
  }
})();
