export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  const isSectionCol = block.classList.contains('col-10-90');
  if (isSectionCol) {
    const imgs = block.querySelectorAll('img');
    imgs.forEach((img) => {
      img.style.width = `${img.width}px`;
    });
  }
  
  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
