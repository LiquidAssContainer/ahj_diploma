import hljs from 'highlight.js';
import { emojis } from './constants';

export function formatDate(dateString) {
  const twoDigits = (number) => (number > 9 ? number : `0${number}`);

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = twoDigits(date.getMonth() + 1);
  const day = twoDigits(date.getDate());
  const hours = twoDigits(date.getHours());
  const minutes = twoDigits(date.getMinutes());

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

export function handleEmojiInString(str) {
  const replaceEmojiWithImg = (codePoint) => {
    const emoji = emojis.find((elem) => elem.codePoint === codePoint);
    return emoji
      ? `<img class="emoji" src="http://localhost:7070/emoji/${emoji.src}">`
      : String.fromCodePoint(codePoint);
  };

  return str.replaceAll(/\p{Emoji}/gu, (match) =>
    replaceEmojiWithImg(match.codePointAt(0)),
  );
}

export function handleLinksInString(str) {
  return str.replaceAll(
    // в нужных случаях регулярка работает, но далеко не все варианты покрывает
    /https?:\/\/\S+?(?=([).,;]?(\s|$)))/gi,
    (match) =>
      `<a class="message_link" target="_blank" href=${match}>${decodeURIComponent(
        match,
      )}</a>`,
  );
}

export function handleCodeInString(str) {
  const getHighlighted = (code) =>
    `<code>${hljs.highlightAuto(code).value}</code>`;

  return str
    .replaceAll(/```\n*(.+?)\n*```/gs, (_, code) => {
      const highlighted = `<pre>${getHighlighted(code)}</pre>`;
      return highlighted.replaceAll('`', '&#96;');
    })
    .replaceAll(/`[\s\n]*(.+?)[\s\n]*`/gs, (_, code) => getHighlighted(code));
}
