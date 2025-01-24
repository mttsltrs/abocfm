import fs from 'fs';
import { format } from 'date-fns';

const getAddedDay = (date) =>
  `${format(date, 'EEEE')}, ${format(date, 'dd/MM/yyyy')}`;

const getDateRange = (start, end) =>
  `${format(end, 'dd/MM/yyyy')} - ${format(start, 'dd/MM/yyyy')}`;

const buildPage = (name, catalogue, years) => {
  const templateContent = fs.readFileSync('template.html', 'utf-8');

  const footerContent = years
    .map((y, i) => `<div id=filter-${i}><p><strong>${y}</strong></p></div>`)
    .join('\n\t');

  const ulContent = catalogue
    .map(
      ({ tracks, start, end }, i) =>
        `<div id=${i}-${end.getFullYear()}>
            <div class="date"><p><strong>🍺 ${getDateRange(
              start,
              end
            )} 🍺</p></strong></div>
            <ul>
              ${
                tracks.length === 0
                  ? '<li>No new songs...</li>'
                  : tracks
                      .map(
                        (t) => `<li><p><strong>${t.artist} - ${
                          t.title
                        }</strong></p><span>added on ${getAddedDay(
                          t.added
                        )} by ${t.user}</span>
                        </li>`
                      )
                      .join('\n\t')
              }
            </ul>
          </div>`
    )
    .join('\n\t');

  const headerContent = `<h5>🍻 ${name} 🍻</h5>`;

  const updatedContent = templateContent
    .replace(/<title><\/title>/, `<title>${name}</title>`)
    .replace(/<header><\/header>/, `<header>${headerContent}</header>`)
    .replace(/<main><\/main>/, `<main>${ulContent}</main>`)
    .replace(
      /<footer class="footer"><\/footer>/,
      `<footer class="footer">${footerContent}</footer>`
    );

  fs.mkdirSync('build', { recursive: true });

  fs.writeFileSync('build/index.html', updatedContent, 'utf-8');
};

export { buildPage };
