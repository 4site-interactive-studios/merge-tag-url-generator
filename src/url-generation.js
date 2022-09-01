import autosize from "autosize";
import scss from "./sass/main.scss";

let typingTimer;

function addMergeTag(title = "", data = "") {
  const tagContainer = document.querySelector(".merge-tag-container");

  const tagName = document.createElement("input");
  tagName.classList.add("merge-tag-name");
  tagName.disabled = true;
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
  tagDataLabel.innerHTML = "=";
  const tagData = document.createElement("textarea");
  autosize(tagData);
  tagData.classList.add("merge-tag-data");
  tagData.addEventListener("focusout", generateURL);
  tagData.addEventListener("keydown", (e) => {
    clearTimeout(typingTimer);
    autosize.update(tagData);
  });
  tagData.addEventListener("keyup", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(generateURL, 1000);
  });

  if (data != "") {
    tagData.placeholder = data;
  }

  const tagDiv = document.createElement("div");
  tagDiv.classList.add("merge-tag-info");

  tagDiv.appendChild(tagName);
  tagDiv.appendChild(tagDataLabel);
  tagDiv.appendChild(tagData);

  tagContainer.appendChild(tagDiv);
}

function generateURL() {
  const newURLContainer = document.querySelector(".generated-url");
  const mergeTags = document.querySelectorAll(".merge-tag-info");
  const originalURLContainer = document.querySelector(".url-input");
  const openBtn = document.querySelector(".open-url");
  let newURL;
  autosize(newURLContainer);

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
  autosize.update(newURLContainer);
  openBtn.href = newURL.href;
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

function generateTags() {
  // Remove previous mergeTags
  const mergeTags = document.querySelectorAll(".merge-tag-info");
  const pageURL = document.querySelector(".url-input");
  const newURL = document.querySelector(".generated-url");
  const params = `url=${pageURL.value}`;

  // Request merge tag data
  const request = new XMLHttpRequest();
  const url =
    "https://apps.4sitestudios.com/merge-tag-url-generator/src/merge-tag-parser.php";
  request.open("POST", url, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      const tagArr = JSON.parse(request.responseText);
      if (tagArr.length > 0) {
        mergeTags.forEach((tag) => {
          tag.remove();
        });

        for (let i = 0; i < tagArr[1].length; ++i) {
          tagArr[1][i] = tagArr[1][i].replace(/\\n/g, "\n");

          if (tagArr[2][i] != undefined) {
            tagArr[2][i] = tagArr[2][i].replace(/\\n/g, "\n");
            addMergeTag(tagArr[1][i], tagArr[2][i]);
          } else {
            addMergeTag(tagArr[1][i]);
          }
        }

        generateURL();
      }
    }
  };

  request.send(params);
}

window.onload = function () {
  const originalURL = document.querySelector(".url-input");
  const mergeTags = document.querySelectorAll(".merge-tag-info");
  const generatedURLContainer = document.querySelector(".generated-url");

  document.querySelector("input[value='with-tags']").checked = true;

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

      generateTags();
    }, 1000);
  });

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
};
