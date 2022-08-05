import * as ip from "ip";
import {
  VariableDesKeys,
  VariableDescription,
  VariblesValues,
} from "./constants";

export const isKeyValue = (key: unknown): key is VariableDesKeys => {
  try {
    return !!VariableDescription[key as VariableDesKeys];
  } catch {
    return false;
  }
};

export const getImpliedVariables = (
  variables: VariblesValues,
  key: VariableDesKeys
) => {
  if (!variables[key]) {
    return null;
  }

  switch (key) {
    case "%INT-MASK%": {
      if (variables["%INT-ADDR%"]) {
        const internalNetwork = getInternalNetwork(
          variables[key]!,
          variables["%INT-ADDR%"]
        );
        const wildMask = getInternalWildMask(variables[key]!);
        if (internalNetwork?.["%INT-NET%"] && wildMask?.["%INT-WILD%"]) {
          const result = {
            ...internalNetwork,
            ...wildMask,
          };
          return result;
        }
      }
      const wildMask = getInternalWildMask(variables[key]!);
      if (wildMask) {
        return wildMask;
      }
    }
    case "%HOS-VLAN%": {
      return getImpliedVariablesFromVlan(variables[key]!);
    }
    case "%INT-ADDR%": {
      if (variables["%INT-MASK%"]) {
        const internalNetwork = getInternalNetwork(
          variables["%INT-MASK%"],
          variables[key]!
        );
        if (internalNetwork?.["%INT-NET%"]) {
          return internalNetwork;
        }
      }
    }
    default: {
      return null;
    }
  }
};

export const getInternalWildMask = (
  intneralMask: string
): { "%INT-WILD%": string } | null => {
  const internalMaskSections = intneralMask.split(".");
  const validSections = internalMaskSections.filter((section) => {
    const tryNumber = Number(section);
    return section && !isNaN(tryNumber) && tryNumber >= 0 && tryNumber <= 255;
  });
  if (validSections.length === 4) {
    const wildMaskSeciont = validSections.map(
      (section) => `${Math.abs(Number(section) - 255)}`
    );
    return { "%INT-WILD%": wildMaskSeciont.join(".") };
  }

  return null;
};

export const getImpliedVariablesFromVlan = (
  vlan: string
): {
  "%LOOP-IDEN%": string;
  "%LOOP2-IDEN%": string;
  "%HOS-IDEN%": string;
} | null => {
  const vlanNumber = Number(vlan);
  if (!isNaN(vlanNumber) && vlanNumber >= 1000 && vlanNumber <= 1511) {
    return {
      "%LOOP-IDEN%": `${vlanNumber <= 1255 ? 17 : 18}`,
      "%LOOP2-IDEN%": `${vlanNumber <= 1255 ? 24 : 25}`,
      "%HOS-IDEN%": `${
        vlanNumber <= 1255 ? vlanNumber - 1000 : vlanNumber - 1256
      }`,
    };
  }

  return null;
};

export const getInternalNetwork = (
  intneralMask: string,
  intneralAddress: string
): { "%INT-NET%": string } | null => {
  const internalMaskSections = intneralMask.split(".");
  const validMaskSections = internalMaskSections.filter((section) => {
    const tryNumber = Number(section);
    return section && !isNaN(tryNumber) && tryNumber >= 0 && tryNumber <= 255;
  });
  const internalAddressSections = intneralAddress.split(".");
  const validAddressSections = internalAddressSections.filter((section) => {
    const tryNumber = Number(section);
    return section && !isNaN(tryNumber) && tryNumber >= 0 && tryNumber <= 255;
  });
  if (validMaskSections.length === 4 && validAddressSections.length === 4) {
    const result = ip.mask(intneralAddress, intneralMask);
    return { "%INT-NET%": result };
  }

  return null;
};

export const getInputHint = (key: VariableDesKeys) => {
  switch (key) {
    case "%INTERFACE0%":
      return ["FASTETHERNET/0", "GIGABITETHERNET0/0/0"];
    case "%INTERFACE1%":
      return ["FASTETHERNET/1", "GIGABITETHERNET0/0/1"];
    default:
      return [];
  }
};
