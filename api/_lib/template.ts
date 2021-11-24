import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);


const rglr = readFileSync(
  `${__dirname}/../_fonts/CustomFont-Book.woff2`
).toString("base64");
const bold = readFileSync(`${__dirname}/../_fonts/CustomFont-Medium.woff2`).toString(
  "base64"
);
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  "base64"
);

// const rglr = readFileSync(
//   `${__dirname}/../_fonts/Inter-Regular.woff2`
// ).toString("base64");
// const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
//   "base64"
// );
// const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
//   "base64"
// );

function getCss(theme: string, fontSize: string, subheadingFontSize: string) {
  let background = "white";
  let foreground = "black";
  let radial = "lightgray";

  if (theme === "dark") {
    background = "#181818";
    foreground = "white";
    radial = "dimgray";
  }

  return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        // background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
      
    }

    .body--blog {
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .body--docs {
        padding: 80px 128px;
        min-width: 3680px:
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo-wrapper--docs {
        display: flex;
        justify-content: flex-start;
        // align-content: center;
        margin: 110px 0 64px;
    } 

    .logo {
        margin: 0 75px;
    }

    .logo--docs {
      // margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
        margin: 0 48px;
    }

    .header-logo {
        margin-top: 48px;
    }

    .strip {
        background-image: linear-gradient(to right, #3ECF8E , #238D5D);
        position: relative;
        display: block;
        width: 100%;
        height: 12px;
    }

    .spacer--blog {
        margin: 150px;
    }

    .spacer--docs {
      // margin-top: 48px;
      // margin-bottom: 48px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        height: inherit;
        font-style: normal;
        color: ${foreground};
        line-height: 1.3;
        margin: 0;
        padding: 0;
        // background: red;
    }
    
    .subheading {
      font-family: 'Inter', sans-serif;
      font-size: ${sanitizeHtml(subheadingFontSize)};
      height: inherit;
      font-style: normal;
      color: #BBB;
      line-height: 1.2;
      margin: 0;
      padding: 0;
      // background: yellow;
    }

    p {
      margin-bottom: 32px;
    }
    `;
}

export function templateHandler(parsedReq: ParsedRequest) {
const { ogType } = parsedReq;
console.log('parsedReq', parsedReq)
console.log('ogType', ogType)
  // switch (ogType) {
  //   case "blog":
  //     return getBlogHtml(parsedReq);
  //     break;
  //   case "docs":
  //     return getDocsHtml(parsedReq);
  //     break;
  //   default:
  //     return getBlogHtml(parsedReq);
  //     break;
  // }

  switch (ogType) {
    case 'blog':
      console.log('running blog')
      return getBlogHtml(parsedReq);
      break;
    case 'docs':
      console.log('running docs')
      return getDocsHtml(parsedReq);
      // expected output: "Mangoes and papayas are $2.79 a pound."
      break;
    default:
      return ``
  }
}

export function getBlogHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, images, widths, heights, subheadingFontSize } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize, subheadingFontSize)}
    </style>
    <body class="body--blog">
      <div>
          <div class="spacer--blog">
          <div class="logo-wrapper">
              ${images
                .map(
                  (img, i) =>
                    getPlusSign(i) + getImage(img, widths[i], heights[i])
                )
                .join("")}
          </div>
          <div class="spacer--blog">
          <div class="heading">${emojify(
            md ? marked(text) : sanitizeHtml(text)
          )}
          </div>
      </div>
    </body>
</html>`;
}

export function getDocsHtml(parsedReq: ParsedRequest) {
  // @ts-ignore
  const { text, theme, md, fontSize, images, widths, heights, subheading, subheadingFontSize } = parsedReq;
  console.log('subheading', subheading, emojify(subheading))

  console.log('subheading front size', subheadingFontSize)
  console.log('front size', fontSize)

  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize, subheadingFontSize)}
    </style>
    <body class="body--docs">  
        <div class="strip"></div>
        <img 
          class="header-logo"
          src="https://supabase.com/docs/supabase-dark.svg"
          width="512"
        />
        <div class="spacer--docs">
          <div class="logo-wrapper logo-wrapper--docs">
              ${images
                .map(
                  (img, i) =>
                    getPlusSign(i) + getImage(img, widths[i], heights[i])
                )
                .join("")}
          </div>
          <div class="spacer--docs">
            <div class="heading">${emojify(md ? marked(text) : sanitizeHtml(text))}</div>
            <div class="subheading">${emojify(sanitizeHtml(subheading))}</div>
          </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = "auto", height = "225") {
  return `<img
        class="logo--docs"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i: number) {
  return i === 0 ? "" : '<div class="plus">+</div>';
}
