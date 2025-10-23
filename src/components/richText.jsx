const formatType = {
  normal: "normal",
  strong: "strong",
  emphasis: "emphasis",
  url: "url",
};

function getMatchTypes(text, textType, matchRegex) {
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
    if (textType === formatType.url) {
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

    textToTypeMap.push([textToReplace, textType]);
    nonMatchStartIdx = matchEndIdx;
  }

  if (nonMatchEndIdx < text.length) {
    textToTypeMap.push([text.substring(nonMatchStartIdx), formatType.normal]);
    nonMatchEndIdx = text.length;
  }

  return textToTypeMap;
}

function getParagraph(text, key) {
  let textToTypeMap = [[text, formatType.normal]];

  const urlMatchRegex = /(https?:\/\/[\S]+)/g;
  textToTypeMap = textToTypeMap.flatMap(([subText, type]) => {
    if (type === formatType.normal) {
      return getMatchTypes(subText, formatType.url, urlMatchRegex);
    } else {
      return [[subText, type]];
    }
  });

  const strongMatchRegex = /[*]{2}(.+?)[*]{2}/g;
  textToTypeMap = textToTypeMap.flatMap(([subText, type]) => {
    if (type === formatType.normal) {
      return getMatchTypes(subText, formatType.strong, strongMatchRegex);
    } else {
      return [[subText, type]];
    }
  });
  const altStrongMatchRegex = /[_]{2}(.+?)[_]{2}/g;
  textToTypeMap = textToTypeMap.flatMap(([subText, type]) => {
    if (type === formatType.normal) {
      return getMatchTypes(subText, formatType.strong, altStrongMatchRegex);
    } else {
      return [[subText, type]];
    }
  });

  const emphaMatchRegex = /[*]{1}(.+?)[*]{1}/g;
  textToTypeMap = textToTypeMap.flatMap(([subText, type]) => {
    if (type === formatType.normal) {
      return getMatchTypes(subText, formatType.emphasis, emphaMatchRegex);
    } else {
      return [[subText, type]];
    }
  });
  const altEmphaMatchRegex = /[_]{1}(.+?)[_]{1}/g;
  textToTypeMap = textToTypeMap.flatMap(([subText, type]) => {
    if (type === formatType.normal) {
      return getMatchTypes(subText, formatType.emphasis, altEmphaMatchRegex);
    } else {
      return [[subText, type]];
    }
  });

  return (
    <p key={key}>
      {textToTypeMap.map(([subtext, type], index) => {
        if (type === formatType.strong) {
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

  return <>{textLines.map((line, index) => getParagraph(line, index))}</>;
}
