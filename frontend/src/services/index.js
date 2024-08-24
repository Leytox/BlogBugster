import {toast} from "react-toastify";


const copyToClipboard = (text) => {
  if (navigator.clipboard)
    navigator.clipboard
        .writeText(text)
        .then(() => toast.success("Copied to clipboard"))
        .catch((error) => toast.error("Failed to copy", error))
  else {
    const x = window.scrollX;
    const y = window.scrollY;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      window.scrollTo(x, y);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
      toast.error("Failed to copy", err);
    }
    document.body.removeChild(textArea);
  }
};

export {copyToClipboard};
