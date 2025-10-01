/* Stuff for webpack config / build process 
Note / step for cutting release -
update package.json FIRST with version - to keep updated version in license.
THEN create build.
*/ 

import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const configPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../package.json'
);
const packageData = JSON.parse(fs.readFileSync(configPath, 'utf8'));


const REPONAME = `Emoji-Fallback.js`;

const LICENSE = `/**!
 * @license ${REPONAME} - ${packageData.description}
 * VERSION: ${packageData.version}
 * LICENSED UNDER ${packageData?.license} LICENSE
 * MORE INFO CAN BE FOUND AT https://github.com/MarketingPipeline/${REPONAME}/
 */`;

const FILENAME = "index"; // used for output file name

const packageCONFIG = {LICENSE,FILENAME, ...packageData};

export default packageCONFIG;
