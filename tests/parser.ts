import { parseMsg } from "../src/parser";

test("Question parser", async () => {
  expect(await parseMsg("¡Qué buenas son las pruebas!")).toBe(
    "que buenas son las pruebas!"
  );
  expect(
    await parseMsg(
      "El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja"
    )
  ).toBe(
    "el veloz murcielago hindu comia feliz cardillo y kiwi la cigüeña tocaba el saxofon detras del palenque de paja"
  );
  expect(await parseMsg("¿¡.-_º\\#·@\"|()/%$~*^¨<>ª'=+`´{}[],;")).toBe("");
});
