/**
 * @description Simplifies a string removing symbols that doesn't affect the meaning of a text.
 * @param m Text to parse
 */
export async function parseMsg(m: string): Promise<string> {
  return m
    .toLowerCase()
    .replace("á", "a")
    .replace("é", "e")
    .replace("í", "i")
    .replace("ó", "o")
    .replace("ú", "u")
    .replace(
      /¿|¡|\.|-|_|º|\\|#|·|@|"|\(|\)|\/|%|\$|~|\*|\^|¨|<|>|ª|'|=|\+|`|´|\{|\}|\[|\]|,|;|\|/g,
      ""
    );
}
