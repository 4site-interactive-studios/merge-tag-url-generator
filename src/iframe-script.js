/*
 *
 * Sends the merge tag data from the iframe to the parent page to automatically populate the fields
 * Place this script on all EN pages that would be used to generate a URL
 *
 */

if (window.location !== window.parent.location) {
  const engridDataArr = [];
  const tagTitleArr = [];
  const tagElements = document.querySelectorAll(
    `
      .en__component--copyblock,
      .en__component--codeblock,
      .en__field
      `
  );
  if (tagElements.length > 0) {
    tagElements.forEach((item) => {
      if (
        item instanceof HTMLElement &&
        item.innerHTML.includes("{engrid_data~")
      ) {
        engridDataArr.push(item);
      }
    });
  }

  const regex = /{engrid_data~\[([\w-]+)\]~?\[?(.+?)?\]?}/g;
  fetch(document.location.href)
    .then((response) => response.text())
    .then((data) => {
      const tags = data.match(regex);
      const tagTitleArr = [];

      tags.forEach((tag) => {
        let tagTitle = tag.match(/\[([\w-]+)\]/);
        tagTitleArr.push(tagTitle[1]);
      });

      window.parent.postMessage(tagTitleArr, "*");
    });
}
