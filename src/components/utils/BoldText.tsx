import React from "react";

export function BoldedText(text: string, inputTextToBold: string, matchWholeWords: boolean) {
    const regex = matchWholeWords ? new RegExp(`\\b\\w*${inputTextToBold}\\w*\\b`, "ig") : new RegExp(inputTextToBold, "ig");
    const textArray = text.split(regex);
    const match = text.match(regex);
    return (
      <span>
        {textArray.map((item: string, index: number) => (
            <React.Fragment key={index}>
                {item}
                {index !== textArray.length - 1 && match && (
                    <b key={index}>{match[index]}</b>
                )}
            </React.Fragment>
        ))}
      </span>
    );
}