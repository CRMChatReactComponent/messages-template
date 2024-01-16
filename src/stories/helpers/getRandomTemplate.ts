import { TemplateType } from "../../types";
import { getCurrentTimestamp, uuidv4 } from "../../utils";
import { faker } from "@faker-js/faker";

export function getRandomTemplate() {
  return Array.from({ length: faker.number.int(50) }, () => {
    return {
      id: uuidv4(),
      title: faker.internet.userName(),
      shortCode: faker.hacker.noun(),
      content: faker.commerce.productDescription(),
      active: faker.datatype.boolean(),
      createdAt: getCurrentTimestamp(),
      modifiedAt: getCurrentTimestamp(),
    } as TemplateType;
  });
}
