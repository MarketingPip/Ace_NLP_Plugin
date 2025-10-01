/* Stuff for webpack config / build process 
Note / step for cutting release -
update package.json FIRST with version - to keep updated version in license.
THEN create build.
*/ 
import packageData from '../package.json' assert { type: 'json' };


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
