const fs = require('fs');
const path = require('path');

const routes = [
  'outils',
  'questionnaire',
  'avant-apres',
  'contact',
  'blog/piliers-nutrition-sportive',
  'blog/erreurs-nutrition-debutant',
  'blog/exercices-poids-du-corps',
  'blog/musique-performance-entrainement',
  'blog/jours-repos-construction-musculaire',
];

const buildDirectory = path.join(__dirname, '..', 'build');
const source = path.join(buildDirectory, 'index.html');

fs.copyFileSync(source, path.join(buildDirectory, '404.html'));

for (const route of routes) {
  const destination = path.join(buildDirectory, route);
  fs.mkdirSync(destination, { recursive: true });
  fs.copyFileSync(source, path.join(destination, 'index.html'));
}
