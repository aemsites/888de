import { readBlockConfig } from '../../scripts/aem.js';

export default function decorate(block) {
    const cols = [...block.firstElementChild.children];
    const slidesWrapper = document.createElement('div');
    slidesWrapper.classList.add('slides-wrapper');
    const configs = readBlockConfig(block);
    console.log(configs);
    const transitionDuration = configs['transition-duration'];

    // add index to each slide
    let slideIndex = 1;
    [...block.children].forEach((row) => {
        if (row.children.length === 2) {
            if (row.children[0].innerText === 'transition duration') {
                block.removeChild(row);
                return;
            }
        }
        const slide = document.createElement('div');
        slide.className = `slide slide-${slideIndex++}`;
        [...row.children].forEach((col) => {
            if (col.innerText === 'transition duration') {
            }
            slide.append(col);
        });
        slidesWrapper.append(slide);
    });
    block.replaceChildren(slidesWrapper);
}
