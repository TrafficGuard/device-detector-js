import {Cars, GenericDeviceResult} from "../../typings/device";
import {userAgentParser} from "../../utils/user-agent";
import {variableReplacement} from "../../utils/variable-replacement";

const cars: Cars = require("../../../fixtures/regexes/device/car_browsers.json");

export default class CarParser {
  public parse = (userAgent: string): GenericDeviceResult => {
    const result: GenericDeviceResult = {
      type: "",
      brand: "",
      model: "",
    };

    for (const [brand, car] of Object.entries(cars)) {
      const match = userAgentParser(car.regex, userAgent);

      if (!match) continue;

      result.type = "car";
      result.brand = brand;

      if (car.model) {
        result.model = variableReplacement(car.model, match).trim();
      } else if (car.models) {
        for (const model of car.models) {
          const modelMatch = userAgentParser(model.regex, userAgent);

          if (!modelMatch) continue;

          result.model = variableReplacement(model.model, modelMatch).trim();
          break;
        }
      }
      break;
    }

    return result;
  };
}
