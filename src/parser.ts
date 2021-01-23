export async function parseMsg(m: string): Promise<string> {
    return m.toLowerCase().replace('¿', '').replace('¡', '').replace('á','a').replace('é','e').replace('í','i').replace('ó','o').replace('ú','u');
}
