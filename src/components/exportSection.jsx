import { useState } from "react";
import storage from "../storage";

function isValirURL(url) {
  return URL.canParse(url);
}

export default function ExportSection({ lastChangedBoardData }) {
  const [downloadUrl, setDownloadUrl] = useState("");
  const [lastChangedDownload, setLastChangedDownload] = useState("");

  function handleExportDataClick() {
    const boardData = storage.board.get();
    const blob = new Blob([JSON.stringify(boardData, null, 2)], {
      type: "application/json",
    });
    const blobUrl = URL.createObjectURL(blob);
    setDownloadUrl(blobUrl);
    setLastChangedDownload(lastChangedBoardData);
  }

  const isDownloadHidden =
    !isValirURL(downloadUrl) || lastChangedBoardData !== lastChangedDownload;

  return (
    <section id="export-section">
      <span>Export board data: </span>
      <button id="export-button" onClick={handleExportDataClick}>
        export
      </button>
      <span className="download" hidden={isDownloadHidden}>
        <span>Your board data is ready to </span>
        <a
          href={downloadUrl}
          className="download"
          download={`board-${lastChangedDownload}.json`}
        >
          download
        </a>
      </span>
    </section>
  );
}
