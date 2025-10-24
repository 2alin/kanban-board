const formatType = {
  normal: "normal",
  strong: "strong",
  emphasis: "emphasis",
  url: "url",
  code: "code",
};

/**
 * Gets the text matches that the a specific format type will be applied to
 *
 * @param {string} text - the original text to find the matches
 * @param {string} matchType - the format text type that will be applied to the matches
 * @param {RegExp} matchRegex - a regular expression to indentify the matches
 * @returns  An array containing array entries with two values:
 * - the first one indicating a portion of the text that has a specific format
 * - the format for a specific portion of the text
 */
function getMatchesWithTypes(text, matchType, matchRegex) {
  const textToTypeMap = [];
  const matches = text.matchAll(matchRegex);
  let nonMatchStartIdx = 0;
  let nonMatchEndIdx = 0;
  for (const match of matches) {
    const matchedText = match[0];
    const matchStartIdx = match.index;
    const matchEndIdx = matchStartIdx + matchedText.length;
    const textToReplace = match[1];

    // skip urls that are not valid
    if (matchType === formatType.url) {
      if (!URL.canParse(matchedText)) {
        continue;
      }
    }

    if (nonMatchStartIdx < matchStartIdx) {
      nonMatchEndIdx = matchStartIdx;
      textToTypeMap.push([
        text.substring(nonMatchStartIdx, nonMatchEndIdx),
        formatType.normal,
      ]);
    }

    textToTypeMap.push([textToReplace, matchType]);
    nonMatchStartIdx = matchEndIdx;
  }

  if (nonMatchEndIdx < text.length) {
    textToTypeMap.push([text.substring(nonMatchStartIdx), formatType.normal]);
    nonMatchEndIdx = text.length;
  }

  return textToTypeMap;
}

/**
 * Finds the matches given by a regex and applies the type specified
 *
 * @param {Array} textToTypeMap - The array of pairs (string and type)
 *                                to which we will apply the matcher
 * @param {*} matchRegex - regular expression to find the matches
 * @param {*} matchType - type to apply to the matches
 * @returns an array of pairs (string and type)
 *          with the matches and its type applied
 */
function applyMatcher(textToTypeMap, matchRegex, matchType) {
  const newTextToTypeMap = textToTypeMap.flatMap(([subText, type]) => {
    if (type === formatType.normal) {
      return getMatchesWithTypes(subText, matchType, matchRegex);
    } else {
      return [[subText, type]];
    }
  });

  return newTextToTypeMap;
}

/**
 * Parses the paragraphs received into JSX objects
 *
 * @param {string} text - the unparsed paragraph as string
 * @param {string} key - an identifier for the paragraph
 * @returns a paragraph and its content parsed as JSX object
 */
function parseParagraph(text, key) {
  let textToTypeMap = [[text, formatType.normal]];

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
  textToTypeMap = applyMatcher(textToTypeMap, codeRegex, formatType.code);

  // matches for 'url' type
  const urlRegex = /(https?:\/\/[\S]+)/g;
  textToTypeMap = applyMatcher(textToTypeMap, urlRegex, formatType.url);

  // matches for 'strong' type
  let strongRegex = /[*]{2}(?=\S)([^*]+?)(?<=\S)[*]{2}/g;
  textToTypeMap = applyMatcher(textToTypeMap, strongRegex, formatType.strong);
  strongRegex = /[_]{2}(?=\S)([^_]+?)(?<=\S)[_]{2}/g;
  textToTypeMap = applyMatcher(textToTypeMap, strongRegex, formatType.strong);

  // matches for 'emphasis' type
  let emphRegex = /[*]{1}(?=\S)([^*]+?)(?<=\S)[*]{1}/g;
  textToTypeMap = applyMatcher(textToTypeMap, emphRegex, formatType.emphasis);
  emphRegex = /[_]{1}(?=\S)([^_]+?)(?<=\S)[_]{1}/g;
  textToTypeMap = applyMatcher(textToTypeMap, emphRegex, formatType.emphasis);

  return (
    <p key={key}>
      {textToTypeMap.map(([subtext, type], index) => {
        if (type === formatType.code) {
          return <code key={index}>{subtext}</code>;
        } else if (type === formatType.strong) {
          return <strong key={index}>{subtext}</strong>;
        } else if (type === formatType.emphasis) {
          return <em key={index}>{subtext}</em>;
        } else if (type === formatType.url) {
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

export default function RichText({ text }) {
  const textLines = text.split("\n");

  return (
    <>
      {textLines.map((line, index) => parseParagraph(line, index.toString()))}
    </>
  );
}
