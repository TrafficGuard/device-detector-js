import { Notebooks, GenericDeviceResult } from "../../typings/device";
import { variableReplacement } from "../../utils/variable-replacement";
import { userAgentParser } from "../../utils/user-agent";

const notebooks: Notebooks = require("../../../fixtures/regexes/device/notebooks.json");

export default class NotebookParser {
  public parse = (userAgent: string): GenericDeviceResult => {
    const result: GenericDeviceResult = {
      type: "",
      brand: "",
      model: ""
    };

    for (const [brand, notebook] of Object.entries(notebooks)) {
      const match = userAgentParser(notebook.regex, userAgent);

      if (!match) continue;

      result.type = "desktop";
      result.brand = brand;

      if (notebook.model) {
        result.model = variableReplacement(notebook.model, match).trim();
      } else if (notebook.models) {
        for (const model of notebook.models) {
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
