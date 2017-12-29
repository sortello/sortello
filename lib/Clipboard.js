const Clipboard = {
  copyToClipboard: (text) => {
    const browserDoc = window.document;

    // IE specific
    if (window.clipboardData && window.clipboardData.setData) {
      window.clipboardData.setData("Text", text);
      return true;
    }

    // all other modern
    const scrollY = window.scrollY;
    let target = browserDoc.createElement("textarea");
    target.style.position = "absolute";
    target.style.left = "-9999px";
    target.style.top = 0;
    target.textContent = text;
    browserDoc.body.appendChild(target);
    target.focus();
    target.setSelectionRange(0, target.value.length);

    window.scrollTo(0, scrollY);

    // copy the selection of fall back to prompt
    try {
      browserDoc.execCommand("copy");
      target.remove();
      return true;
    } catch(e) {
      target.remove();
      return false;
    }
  }
}

export default Clipboard;