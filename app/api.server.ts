const APP_BASE_URL = process.env.APP_BASE_URL;
const APP_BASE_PORT = process.env.APP_BASE_PORT;

export function getFetchURL() {
    return APP_BASE_URL + ":" + APP_BASE_PORT
}