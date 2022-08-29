import scss from "./sass/main.scss";

let typingTimer;

function addMergeTag(title = "") {
  const tagContainer = document.querySelector(".merge-tag-container");

  const tagNameLabel = document.createElement("label");
  tagNameLabel.innerHTML = "Merge Tag Name";
  const tagName = document.createElement("input");
  tagName.classList.add("merge-tag-name");
  tagName.addEventListener("focusout", generateURL);
  tagName.addEventListener("keydown", () => {
    clearTimeout(typingTimer);
  });
  tagName.addEventListener("keyup", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(generateURL, 1000);
  });

  if (title != "") {
    tagName.value = title;
  }

  const tagDataLabel = document.createElement("label");
  tagDataLabel.innerHTML = "Merge Tag Data";
  const tagData = document.createElement("textarea");
  tagData.classList.add("merge-tag-data");
  tagData.addEventListener("focusout", generateURL);
  tagData.addEventListener("keydown", () => {
    clearTimeout(typingTimer);
  });
  tagData.addEventListener("keyup", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(generateURL, 1000);
  });

  const tagDiv = document.createElement("div");
  tagDiv.classList.add("merge-tag-info");

  tagDiv.appendChild(tagNameLabel);
  tagDiv.appendChild(tagName);
  tagDiv.appendChild(tagDataLabel);
  tagDiv.appendChild(tagData);

  tagContainer.appendChild(tagDiv);
}

function generateURL() {
  const newURLContainer = document.querySelector(".generated-url");
  const mergeTags = document.querySelectorAll(".merge-tag-info");
  const originalURLContainer = document.querySelector(".url-input");
  let newURL;

  if (originalURLContainer.value.length == 0) {
    newURLContainer.value = "Please enter a valid URL.";
    return;
  }

  try {
    newURL = new URL(originalURLContainer.value);
  } catch {
    newURLContainer.value = "Please enter a valid URL.";
  }

  mergeTags.forEach((tag) => {
    const tagName = tag.querySelector(".merge-tag-name");
    const tagData = tag.querySelector(".merge-tag-data");

    if (tagName.value.length > 0 && tagData.value.length > 0) {
      const queryTagName = `engrid_data[${tagName.value}]`;
      const queryTagData = tagData.value;
      newURL.searchParams.set(queryTagName, queryTagData);
    }
  });

  newURLContainer.value = newURL.href;
  document.querySelector("input[value='with-tags']").checked = true;
  setIframe(true);
  return;
}

function setIframe(withTags) {
  const iframe = document.querySelector(".merge-tag-url");
  const origURL = document.querySelector(".url-input");
  const generatedURL = document.querySelector(".generated-url");

  if (generatedURL.value != "" && withTags) {
    iframe.src = generatedURL.value;
    document.querySelector("[value='with-tags']").checked = true;
  } else if (origURL.value.length > 0) {
    iframe.src = origURL.value;
    document.querySelector("[value='without-tags']").checked = true;
  }
}

function copyURL() {
  const url = document.querySelector(".generated-url");
  url.select();
  url.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(url.value);
}

function generateTags(array) {
  // Remove previous mergeTags
  const mergeTags = document.querySelectorAll(".merge-tag-info");

  mergeTags.forEach((tag) => {
    tag.remove();
  });

  for (let i = 0; i < array.length; ++i) {
    addMergeTag(array[i]);
  }
}

window.onload = function () {
  const originalURL = document.querySelector(".url-input");
  const addTagBtn = document.querySelector(".add-tag");
  const mergeTags = document.querySelectorAll(".merge-tag-info");
  const generatedURLContainer = document.querySelector(".generated-url");
  let previousURL;

  // Autofill merge tag titles if possible
  window.addEventListener("message", (e) => {
    if (originalURL.value != previousURL && e.data && Array.isArray(e.data)) {
      generateTags(e.data);
      previousURL = originalURL.value;
    }
  });

  originalURL.addEventListener("focusout", () => {
    setIframe(false);
  });

  originalURL.addEventListener("keydown", () => {
    clearTimeout(typingTimer);
  });
  originalURL.addEventListener("keyup", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      try {
        new URL(originalURL.value);
      } catch {
        generatedURLContainer.value = "Please enter a valid URL.";
        return;
      }

      setIframe(false);
    }, 1000);
  });

  addTagBtn.addEventListener("click", () => addMergeTag());

  mergeTags.forEach((tag) => {
    const tagName = tag.querySelector(".merge-tag-name");
    const tagData = tag.querySelector(".merge-tag-data");

    tagData.addEventListener("focusout", generateURL);
    tagName.addEventListener("focusout", generateURL);

    tagName.addEventListener("keydown", () => {
      clearTimeout(typingTimer);
    });
    tagName.addEventListener("keyup", () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(generateURL, 1000);
    });

    tagData.addEventListener("keydown", () => {
      clearTimeout(typingTimer);
    });
    tagData.addEventListener("keyup", () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(generateURL, 1000);
    });
  });

  document
    .querySelector("input[value='with-tags']")
    .addEventListener("click", (e) => {
      setIframe(true);
    });

  document
    .querySelector("input[value='without-tags']")
    .addEventListener("click", (e) => {
      setIframe(false);
    });

  document.querySelector(".copy-button").addEventListener("click", copyURL);
};
