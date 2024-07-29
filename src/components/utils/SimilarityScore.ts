// get similarity score by number of occurences of query string in result string
export function getSimilarity(result: string, query: string) {
    result = result.toLowerCase();
    query = query.toLowerCase();

    return result.length - result.replace(new RegExp(query, "ig"), '').length;
}