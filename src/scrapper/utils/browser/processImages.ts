export const processImages = () => {
  const elements = Array.from(document.querySelectorAll('img.media-element'));

  return elements.map((post: HTMLImageElement) => {
    const href = post.src;
    const parent: any = post.parentElement.parentElement.parentElement;
    const title = parent.href.split('/')[7].split('_').join(' ');
    const postLink = parent.href;
    post.className = '.done';
    return { title, href, postLink };
  });
};
