import { useState } from "react";
import storage from "../storage";

/**
 * Checks if a text is a valid URL or not
 *
 * @param text The text URL to check against
 * @returns Whether the text URL is a valid URL or not
 */
function isValirURL(text: string) {
  return URL.canParse(text);
}

interface ExportSectionProps {
  /**
   * The last time the board data (cards data or state, columns)
   * was changed, in ISO string format
   */
  lastChangedBoard: string;
}

export default function ExportSection({
  lastChangedBoard,
}: ExportSectionProps) {
  const [downloadUrl, setDownloadUrl] = useState("");
  const [lastChangedDownload, setLastChangedDownload] = useState("");

  function handleExportDataClick() {
    const boardData = storage.board.get();
    const blob = new Blob([JSON.stringify(boardData, null, 2)], {
      type: "application/json",
    });
    const blobUrl = URL.createObjectURL(blob);
    setDownloadUrl(blobUrl);
    setLastChangedDownload(lastChangedBoard);
  }

  const isDownloadHidden =
    !isValirURL(downloadUrl) || lastChangedBoard !== lastChangedDownload;

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
