import fs from 'fs';
import { format } from 'date-fns';

const getAddedDay = (date) =>
  `${format(date, 'EEEE')}, ${format(date, 'dd/MM/yyyy')}`;

const getDateRange = (interval) => {
  const date = new Date();
  const end = `${date.getDate()}/${date.getMonth() + 1}`;
  const start = `${interval.getDate()}/${interval.getMonth() + 1}`;

  return `${start} - ${end}`;
};

const buildPage = (name, newTracks, interval) => {
  const templateContent = fs.readFileSync('template.html', 'utf-8');
  const ulContent = `
    <ul>
      ${
        newTracks.length === 0
          ? '<li>🍺 No new songs...</li>'
          : newTracks
              .map(
                (t) => `
            <li>
              <p><strong>${t.artist} - ${t.title}</strong></p>
              <span>added on ${getAddedDay(t.added)} by ${t.user}</span>
            </li>`
              )
              .join('\n\t')
      }
    </ul>
  `;
  const headerContent = `<h5>🍻 ${name} ${getDateRange(interval)} 🍻</h5>`;

  const updatedContent = templateContent
    .replace(/<title>([\s\S]*?)<\/title>/, `<title>${name}</title>`)
    .replace(
      /<header>([\s\S]*?)<\/header>/,
      `<header>${headerContent}</header>`
    )
    .replace(/<main>([\s\S]*?)<\/main>/, `<main>${ulContent}</main>`);

  fs.mkdirSync('build', { recursive: true });

  fs.writeFileSync('build/index.html', updatedContent, 'utf-8');
};

export { buildPage };
