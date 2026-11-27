import {copyFile, mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {basename, join, relative, sep} from 'node:path';

export async function writeBundle({root, dist, result, fallbackLicenses, extraCss = ''}) {
  const dependencies = new Map();
  for (const output of Object.values(result.metafile.outputs)) {
    for (const [file, {bytesInOutput}] of Object.entries(output.inputs)) {
      if (!bytesInOutput) continue;
      const match = file.match(/^(.*node_modules\/)((?:@[^/]+\/)?[^/]+)\//);
      if (match) dependencies.set(match[1] + match[2], match[2]);
    }
  }

  const notices = [];
  for (const [path, name] of [...dependencies].sort()) {
    const directory = join(root, path);
    const {version} = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
    const id = `${name}@${version}`;
    const licenseFiles = (await readdir(directory)).filter(file => /^(?:licen[cs]e|notice|copying)(?:\.|$)/i.test(file));
    const fallback = fallbackLicenses.get(id);
    if (!licenseFiles.some(file => /^(?:licen[cs]e|copying)(?:\.|$)/i.test(file)) && !fallback) {
      throw new Error(`缺少分发许可：${id}`);
    }
    const paths = licenseFiles.sort().map(file => join(directory, file));
    if (fallback && !licenseFiles.some(file => /^licen[cs]e(?:\.|$)/i.test(file))) paths.push(join(root, fallback));
    const texts = await Promise.all(paths.map(path => readFile(path, 'utf8')));
    notices.push(`${id}\n\n${texts.map(text => text.trim()).join('\n\n')}`);
  }

  await mkdir(dist, {recursive: true});
  // Write the immutable chunks before updating the index and entry points.
  await mkdir(join(dist, 'chunks'), {recursive: true});
  const chunkDirectory = join(dist, 'chunks') + sep;
  await Promise.all(result.outputFiles.filter(file => file.path.startsWith(chunkDirectory))
    .map(file => writeFile(file.path, file.contents)));
  await Promise.all([
    copyFile(join(root, 'src/index.html'), join(dist, 'index.html')),
    writeFile(join(dist, 'THIRD_PARTY_LICENSES.txt'), notices.join('\n\n----------------------------------------\n\n') + '\n'),
    ...result.outputFiles.filter(file => !file.path.startsWith(chunkDirectory)).map(file => {
      const contents = basename(file.path) === 'demo.css' && extraCss
        ? Buffer.concat([Buffer.from(file.contents), Buffer.from('\n' + extraCss)])
        : file.contents;
      return writeFile(file.path, contents);
    }),
  ]);
  const artifactFiles = ['index.html', 'THIRD_PARTY_LICENSES.txt', ...result.outputFiles.map(file => relative(dist, file.path))];
  await writeFile(join(dist, 'assets.json'), JSON.stringify(artifactFiles) + '\n');
}
