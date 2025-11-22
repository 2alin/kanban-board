const formatTypeMap = {
  normal: "normal",
  strong: "strong",
  emphasis: "emphasis",
  url: "url",
  code: "code",
} as const;
type FormatType = (typeof formatTypeMap)[keyof typeof formatTypeMap];

/**
 * An array of pairs indicating in the following order:
 * - The text to which a format will be applied
 * - The format to apply to the text
 */
type TextToTypeMap = Array<[string, FormatType]>;

/**
 * Gets the text matches that the a specific format type will be applied to
 *
 * @param text The original text to find the matches
 * @param matchType The format text type that will be applied to the matches
 * @param matchRegex A regular expression to indentify the matches
 * @returns A map of strings and the format to apply to them
 */
function getMatchesWithTypes(
  text: string,
  matchType: FormatType,
  matchRegex: RegExp
): TextToTypeMap {
  const textToTypeMap: TextToTypeMap = [];
  const matches = text.matchAll(matchRegex);
  let nonMatchStartIdx = 0;
  let nonMatchEndIdx = 0;
  for (const match of matches) {
    const matchedText = match[0];
    const matchStartIdx = match.index;
    const matchEndIdx = matchStartIdx + matchedText.length;
    const textToReplace = match[1];

    // skip urls that are not valid
    if (matchType === formatTypeMap.url) {
      if (!URL.canParse(matchedText)) {
        continue;
      }
    }

    if (nonMatchStartIdx < matchStartIdx) {
      nonMatchEndIdx = matchStartIdx;
      textToTypeMap.push([
        text.substring(nonMatchStartIdx, nonMatchEndIdx),
        formatTypeMap.normal,
      ]);
    }

    textToTypeMap.push([textToReplace, matchType]);
    nonMatchStartIdx = matchEndIdx;
  }

  if (nonMatchEndIdx < text.length) {
    textToTypeMap.push([
      text.substring(nonMatchStartIdx),
      formatTypeMap.normal,
    ]);
    nonMatchEndIdx = text.length;
  }

  return textToTypeMap;
}

/**
 * Updates a map of strings-to-formatTypes after finding new type matches
 *
 * @param textToTypeMap The original map of strings with format types
 * @param matchRegex Regular expression to find matches for the new format type
 * @param matchFormatType New format type for the matches found
 * @returns An new map of strings-to-formatTypes
 */
function updateFormatTypeMap(
  textToTypeMap: TextToTypeMap,
  matchRegex: RegExp,
  matchFormatType: FormatType
): TextToTypeMap {
  const newTextToTypeMap: TextToTypeMap = textToTypeMap.flatMap(
    ([subText, type]) => {
      if (type === formatTypeMap.normal) {
        return getMatchesWithTypes(subText, matchFormatType, matchRegex);
      } else {
        return [[subText, type]];
      }
    }
  );

  return newTextToTypeMap;
}

/**
 * Parses the paragraphs received into JSX objects
 *
 * @param text The unparsed paragraph as string
 * @param key An identifier for the paragraph
 * @returns A paragraph and its content parsed as JSX object
 */
function parseParagraph(text: string, key: string) {
  // handle empty paragraphs
  if (text === "") {
    return (
      <p key={key}>
        <br />
      </p>
    );
  }

  let textToTypeMap: TextToTypeMap = [[text, formatTypeMap.normal]];

  /**
   * TODO:
   * - Improve the logic and regex: it's not flexible enough
   * - Allow 'strong' and 'emphasis' format to be applied together
   *   easy solution: add a case for triple characters ('*' or '_')
   */

  //----------------------------------------------------------
  // !! Caution: the order is important in the following logic
  //----------------------------------------------------------

  // matches for 'code' type
  const codeRegex = /[`]{1}(?=\S)(.+?)(?<=\S)[`]{1}/g;
  textToTypeMap = updateFormatTypeMap(
    textToTypeMap,
    codeRegex,
    formatTypeMap.code
  );

  // matches for 'url' type
  const urlRegex = /(https?:\/\/[\S]+)/g;
  textToTypeMap = updateFormatTypeMap(
    textToTypeMap,
    urlRegex,
    formatTypeMap.url
  );

  // matches for 'strong' type
  let strongRegex = /[*]{2}(?=\S)([^*]+?)(?<=\S)[*]{2}/g;
  textToTypeMap = updateFormatTypeMap(
    textToTypeMap,
    strongRegex,
    formatTypeMap.strong
  );
  strongRegex = /[_]{2}(?=\S)([^_]+?)(?<=\S)[_]{2}/g;
  textToTypeMap = updateFormatTypeMap(
    textToTypeMap,
    strongRegex,
    formatTypeMap.strong
  );

  // matches for 'emphasis' type
  let emphRegex = /[*]{1}(?=\S)([^*]+?)(?<=\S)[*]{1}/g;
  textToTypeMap = updateFormatTypeMap(
    textToTypeMap,
    emphRegex,
    formatTypeMap.emphasis
  );
  emphRegex = /[_]{1}(?=\S)([^_]+?)(?<=\S)[_]{1}/g;
  textToTypeMap = updateFormatTypeMap(
    textToTypeMap,
    emphRegex,
    formatTypeMap.emphasis
  );

  return (
    <p key={key}>
      {textToTypeMap.map(([subtext, type], index) => {
        if (type === formatTypeMap.code) {
          return <code key={index}>{subtext}</code>;
        } else if (type === formatTypeMap.strong) {
          return <strong key={index}>{subtext}</strong>;
        } else if (type === formatTypeMap.emphasis) {
          return <em key={index}>{subtext}</em>;
        } else if (type === formatTypeMap.url) {
          return (
            <a href={subtext} target="_blank" key={index}>
              {subtext}
            </a>
          );
        } else {
          return subtext;
        }
      })}
    </p>
  );
}

interface RichTextProps {
  text: string;
}

export default function RichText({ text }: RichTextProps) {
  const textLines = text.split("\n");

  return (
    <>
      {text === ""
        ? null
        : textLines.map((line, index) =>
            parseParagraph(line, index.toString())
          )}
    </>
  );
}
