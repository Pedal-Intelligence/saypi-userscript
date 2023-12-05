// Function to construct the URL for local extension resources
export function getExtensionResourceUrl(filename: string) {
    const web_accessible_resources_dir = "public";
    const filepath = web_accessible_resources_dir + "/" + filename;
    return chrome.runtime.getURL(filepath);
}
