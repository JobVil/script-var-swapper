import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Script } from "@prisma/client";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  MaskCIDRMap,
  VariableDescription,
  VariableDesKeys,
  VariblesValues,
} from "../utils/constants";
import {
  getImpliedVariables,
  getInputDefaultValue,
  getInputHint,
} from "../utils/utils";
import { Hint } from "react-autocomplete-hint";

export const ScriptView: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [script, setScript] = useState<Script>();
  const [vars, setVars] = useState<VariblesValues>({});
  const [wasCopied, setWasCopied] = useState(false);
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (id) {
      fetch(`api/scripts?id=${id as unknown as string}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((body) => {
          const vars: string[] | null = body[0].value.match(/\%(.*?)\%/gm);
          const varObject: VariblesValues = {};
          (vars || []).forEach((vari) => {
            varObject[vari as VariableDesKeys] = "";
          });
          setVars((localVars) => {
            const varObject: VariblesValues = {};
            (vars || []).forEach((vari) => {
              varObject[vari as VariableDesKeys] =
                localVars[vari as VariableDesKeys] ||
                getInputDefaultValue(vari as VariableDesKeys);
            });
            return varObject;
          });
          setScript(body[0]);
        });
    }
  }, [id]);

  const parseValue = () => {
    let locValue = script?.value || "";
    if (
      vars["%INTERFACE0%"] &&
      vars["%INTERFACE0%"].toUpperCase().includes("GIGABIT")
    ) {
      locValue = locValue.replaceAll(
        "ip nhrp group %HOS-VLAN%_%LOCATION%",
        "nhrp group %HOS-VLAN%_%LOCATION%"
      );
    }
    Object.keys(vars).forEach((vari) => {
      locValue = locValue.replaceAll(
        vari as VariableDesKeys,
        vars[vari as VariableDesKeys]!
      );
    });

    return locValue;
  };

  const onChange =
    (varKey: VariableDesKeys) => (e: ChangeEvent<HTMLInputElement>) => {
      setVars((localVars) => {
        const newLocalVars = {
          ...localVars,
          ...{
            [varKey]:
              varKey === "%CLIENTID%" || varKey === "%LOCATION%"
                ? e.target.value.toUpperCase()
                : e.target.value,
          },
        };
        const maybeOverrideVaribles = getImpliedVariables(newLocalVars, varKey);
        if (maybeOverrideVaribles) {
          return {
            ...newLocalVars,
            ...maybeOverrideVaribles,
          };
        }
        return newLocalVars;
      });
    };

  const onBlur =
    (varKey: VariableDesKeys) => (e: ChangeEvent<HTMLInputElement>) => {
      if (
        varKey === "%INT-MASK%" &&
        MaskCIDRMap[e.target.value as keyof typeof MaskCIDRMap]
      ) {
        setVars((localVars) => {
          const newLocalVars = {
            ...localVars,
            ...{
              [varKey]: MaskCIDRMap[e.target.value as keyof typeof MaskCIDRMap],
            },
          };
          const maybeOverrideVaribles = getImpliedVariables(
            newLocalVars,
            varKey
          );
          if (maybeOverrideVaribles) {
            return {
              ...newLocalVars,
              ...maybeOverrideVaribles,
            };
          }
          return newLocalVars;
        });
      }
    };

  return (
    <div className={styles.mainLayout}>
      <div className={styles.scriptContent}>
        <h2>{script?.title}</h2>
        <CopyToClipboard
          text={script?.value || ""}
          onCopy={() => {
            setWasCopied(true);
            setTimeout(() => {
              isMounted.current && setWasCopied(false);
            }, 2000);
          }}
        >
          <button>{wasCopied ? "Copied" : "copy original script"}</button>
        </CopyToClipboard>
        <button
          onClick={() => {
            const result = confirm("Are you sure you want to delete?");
            if (result) {
              fetch(`api/scripts?id=${id as unknown as string}`, {
                method: "DELETE",
              }).then(() => {
                router.push("/");
              });
            }
          }}
        >
          Delete
        </button>
        <textarea readOnly value={parseValue()} placeholder="script" />
      </div>
      <div className={styles.varContent}>
        {Object.keys(vars).map((vari) => (
          <div key={vari} className={styles.variable}>
            <span title={VariableDescription[vari as VariableDesKeys]}>
              {vari.replaceAll("%", "")}
            </span>
            <Hint
              options={getInputHint(vari as VariableDesKeys)}
              allowEnterFill
              allowTabFill
            >
              <input
                value={vars[vari as VariableDesKeys]}
                placeholder={vari.replaceAll("%", "")}
                onChange={onChange(vari as VariableDesKeys)}
                onBlur={onBlur(vari as VariableDesKeys)}
              />
            </Hint>
          </div>
        ))}
      </div>
    </div>
  );
};
