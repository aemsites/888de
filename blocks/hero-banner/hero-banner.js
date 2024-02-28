export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cols = [...row.children];
    if (cols[0].innerText === 'background') {
      const background = cols[1].querySelector('picture');
      background.classList.add('hero-background');
      block.append(background);
      block.removeChild(row);
    } else if (cols[0].innerText === 'icon') {
      const dtIcon = cols[1].querySelector('.icon');
      dtIcon.classList.add('hero-icon-dt');
      block.append(dtIcon);
      const mobIcon = cols[1].querySelector('.icon');
      mobIcon.classList.add('hero-icon-mob');
      block.append(mobIcon);
      block.removeChild(row);
    } else {
      const anchor = document.createElement('a');
      anchor.className = 'hero-image-anchor';
      anchor.href = `#${cols[0].innerText}`;
      const dtImage = cols[1].querySelector('picture');
      anchor.append(dtImage);
      block.append(anchor);
      const mobImage = cols[1].querySelector('picture');
      const anchorMob = document.createElement('a');
      anchorMob.className = 'hero-image-anchor-mob';
      anchorMob.href = `#${cols[0].innerText}`;
      anchorMob.append(mobImage);
      block.append(anchorMob);
      block.removeChild(row);
    }
  });
}
