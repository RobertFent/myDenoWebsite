/**
 * reads bytes from file and saves it into a string
 * @param filepath filepath to .env file
 */
const parseEnvFileToFileContent = (filepath: string): string => {
    const bytes = Deno.readFileSync(filepath);
    const fileContent = new TextDecoder('utf-8').decode(bytes);
    return fileContent;
}

/**
 * splits file into lines and parses every .env param per line
 * @param fileContent content of .env file
 * @returns {string[][]} 2d array of key + value strings
 */
const parseEnvVarsFromFileContent = (fileContent: string): string[][] => {
    const lineBreak = /\r\n?|\n/;
    const envList = fileContent.split(lineBreak);
    const parsedEnvs: string[][] = [];
    for (let i = 0; i < envList.length; i++) {
        parsedEnvs.push(envList[i].split('='));
    }
    return parsedEnvs;
}

/**
 * sets .env in Deno.env
 * @param parsedContent 2d array of key + value strings
 */
const setEnv = (parsedContent: string[][]): void => {
    for (let i = 0; i < parsedContent.length; i++) {
        Deno.env.set(parsedContent[i][0], parsedContent[i][1]);
    }
}

/**
 * reads .env file from given path or `.env`, loads it into Deno.Env and returns object containing envs
 * @param filepath optional path of .env file
 * @returns {[index: string]: string} Denos current envs as object
 */
export const dotenv = (filepath?: string): { [index: string]: string } => {
    const fileContent = parseEnvFileToFileContent(filepath? filepath: '.env');
    const parsedEnvs = parseEnvVarsFromFileContent(fileContent);
    setEnv(parsedEnvs);
    return Deno.env.toObject();
}
