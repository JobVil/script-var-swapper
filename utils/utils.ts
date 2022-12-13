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
      let result: VariblesValues = {};
      if (variables["%INT-ADDR%"]) {
        const internalNetwork = getInternalNetwork(
          variables[key]!,
          variables["%INT-ADDR%"]
        );
        if (internalNetwork?.["%INT-NET%"]) {
          result = { ...result, ...internalNetwork };
        }

        const wildMask = getInternalWildMask(variables[key]!);
        if (variables["%INT-WILD%"] !== undefined && wildMask?.["%INT-WILD%"]) {
          result = { ...result, ...wildMask };
        }

        return result;
      }
      const wildMask = getInternalWildMask(variables[key]!);
      if (wildMask && variables["%INT-WILD%"] !== undefined) {
        return wildMask;
      }
    }
    case "%HOS-VLAN%": {
      const impliedVariables = getImpliedVariablesFromVlan(variables[key]!);
      return getFiilteredImpliedVariables(variables, impliedVariables);
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
    case "%LOOP2-IDEN%":
    case "%HOS-IDEN%":
    case "%LOOP-IDEN%": {
      if (variables[key] && variables[key]!.length > 3) {
        const impliedVariables = getImpliedVariablesFromVlan(variables[key]!);
        return getFiilteredImpliedVariables(variables, impliedVariables);
      }
      return null;
    }
    default: {
      return null;
    }
  }
};

const getFiilteredImpliedVariables = (
  variables: VariblesValues,
  impliedVariables: ReturnType<typeof getImpliedVariablesFromVlan>
) => {
  if (!impliedVariables) {
    return null;
  }
  let result: VariblesValues = {};
  if (
    variables["%LOOP-IDEN%"] !== undefined &&
    impliedVariables["%LOOP-IDEN%"]
  ) {
    result["%LOOP-IDEN%"] = impliedVariables["%LOOP-IDEN%"];
  }
  if (
    variables["%LOOP2-IDEN%"] !== undefined &&
    impliedVariables["%LOOP2-IDEN%"]
  ) {
    result["%LOOP2-IDEN%"] = impliedVariables["%LOOP2-IDEN%"];
  }
  if (variables["%HOS-IDEN%"] !== undefined && impliedVariables["%HOS-IDEN%"]) {
    result["%HOS-IDEN%"] = impliedVariables["%HOS-IDEN%"];
  }
  return result;
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
      return ["FastEthernet0/0", "GigabitEthernet0/0/0"];
    case "%INTERFACE1%":
      return ["FastEthernet0/1", "GigabitEthernet0/0/1"];
    case "%WAN-INT%":
      return ["FastEthernet0/1", "GigabitEthernet0/0/1"];
    case "%BMNVPN-INT%":
      return ["FastEthernet0/0/0", "GigabitEthernet0/0/2"];
    default:
      return [];
  }
};

export const getInputDefaultValue = (key: VariableDesKeys) => {
  switch (key) {
    case "%QOS-PLCY%":
      return "BankOnIT-";
    default:
      return "";
  }
};
