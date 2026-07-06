// Admin panel logic: login, publish posts (with optional image/PDF upload), list + delete posts.

const loginPanel = document.getElementById("login-panel");
const dashboard = document.getElementById("dashboard");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");
const loginMsg = document.getElementById("login-msg");
const logoutBtn = document.getElementById("logout-btn");

const postTitle = document.getElementById("post-title");
const postBody = document.getElementById("post-body");
const postImage = document.getElementById("post-image");
const postPdf = document.getElementById("post-pdf");
const publishBtn = document.getElementById("publish-btn");
const publishMsg = document.getElementById("publish-msg");
const postsList = document.getElementById("posts-list");

function showDashboard() {
  loginPanel.style.display = "none";
  dashboard.style.display = "block";
  loadPosts();
}
function showLogin() {
  loginPanel.style.display = "block";
  dashboard.style.display = "none";
}

// check existing session on load
supabaseClient.auth
  .getSession()
  .then(({ data }) => {
    if (data.session) showDashboard();
    else showLogin();
  })
  .catch((err) => {
    console.error("Session check failed:", err);
    showLogin();
  });

loginBtn.addEventListener("click", async () => {
  loginMsg.textContent = "";
  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  if (!email || !password) {
    loginMsg.textContent = "შეავსეთ ორივე ველი.";
    return;
  }
  loginBtn.textContent = "იტვირთება...";
  loginBtn.disabled = true;
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      loginMsg.textContent = "შეცდომა: " + error.message;
      console.error("Login error:", error);
      return;
    }
    showDashboard();
  } catch (err) {
    loginMsg.textContent =
      "დაფიქსირდა შეცდომა — გახსენით კონსოლი (F12) დეტალებისთვის.";
    console.error("Login exception:", err);
  } finally {
    loginBtn.textContent = "შესვლა →";
    loginBtn.disabled = false;
  }
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLogin();
});

async function uploadFile(bucket, file) {
  const path = `${Date.now()}-${file.name}`;
  const { error } = await supabaseClient.storage
    .from(bucket)
    .upload(path, file);
  if (error) throw error;
  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

publishBtn.addEventListener("click", async () => {
  publishMsg.className = "admin-msg";
  publishMsg.textContent = "";

  const title = postTitle.value.trim();
  const body = postBody.value.trim();
  if (!title || !body) {
    publishMsg.className = "admin-msg error";
    publishMsg.textContent = "სათაური და ტექსტი სავალდებულოა.";
    return;
  }

  publishBtn.textContent = "იქვეყნება...";
  publishBtn.disabled = true;

  try {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    console.log("Session at publish time:", sessionData.session);
    if (!sessionData.session) {
      publishMsg.className = "admin-msg error";
      publishMsg.textContent =
        "სესია ამოიწურა — გთხოვთ თავიდან შეხვიდეთ სისტემაში.";
      showLogin();
      return;
    }

    let imageUrl = null;
    let pdfUrl = null;

    if (postImage.files[0]) {
      imageUrl = await uploadFile("post-images", postImage.files[0]);
    }
    if (postPdf.files[0]) {
      pdfUrl = await uploadFile("post-pdfs", postPdf.files[0]);
    }

    const { error } = await supabaseClient.from("posts").insert({
      title,
      body,
      image_url: imageUrl,
      pdf_url: pdfUrl,
    });
    if (error) throw error;

    publishMsg.className = "admin-msg success";
    publishMsg.textContent = "გამოქვეყნებულია!";
    postTitle.value = "";
    postBody.value = "";
    postImage.value = "";
    postPdf.value = "";
    loadPosts();
  } catch (err) {
    publishMsg.className = "admin-msg error";
    publishMsg.textContent = "შეცდომა: " + (err.message || "უცნობი შეცდომა");
    console.error(err);
  } finally {
    publishBtn.textContent = "გამოქვეყნება";
    publishBtn.disabled = false;
  }
});

async function loadPosts() {
  postsList.innerHTML = '<div class="admin-msg">იტვირთება...</div>';
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    postsList.innerHTML =
      '<div class="admin-msg error">პოსტების ჩატვირთვა ვერ მოხერხდა.</div>';
    return;
  }
  if (!data || data.length === 0) {
    postsList.innerHTML = '<div class="admin-msg">პოსტები არ არის.</div>';
    return;
  }

  postsList.innerHTML = data
    .map(
      (post) => `
    <div class="admin-post-row" data-id="${post.id}">
      <div>
        <div class="title">${post.title.replace(/</g, "&lt;")}</div>
        <div class="date">${new Date(post.created_at).toLocaleDateString("ka-GE")}</div>
      </div>
      <button class="admin-delete-btn" data-id="${post.id}">წაშლა</button>
    </div>
  `,
    )
    .join("");

  postsList.querySelectorAll(".admin-delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("დარწმუნებული ხართ, რომ გსურთ ამ პოსტის წაშლა?")) return;
      const id = btn.dataset.id;
      const { error } = await supabaseClient
        .from("posts")
        .delete()
        .eq("id", id);
      if (!error) loadPosts();
    });
  });
}
