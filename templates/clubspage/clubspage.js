export default async function decorate(doc) {
  const main = doc.querySelector('main');
  const fetchClubNav = await fetch('/888club/clubs-nav.plain.html');
  if (fetchClubNav.ok) {
    const navHTML = await fetchClubNav.text();
    const clubNav = document.createElement('div');
    clubNav.classList.add('club-nav');
    clubNav.innerHTML = navHTML;
    main.prepend(clubNav);
    const clubLinks = clubNav.querySelectorAll('a');
    clubNav.innerHTML = '';
    clubLinks.forEach((link) => {
      if (link.href === window.location.href) {
        link.classList.add('active');
      }
      clubNav.append(link);
    });
  }
}
