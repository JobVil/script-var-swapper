import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Script } from "@prisma/client";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const ScriptView: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [script, setScript] = useState<Script>();
  const [vars, setVars] = useState<{ [key in string]: string }>({});
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
          console.log(body[0]);
          const vars: string[] | null = body[0].value.match(/\%(.*?)\%/gm);
          const varObject: { [key in string]: string } = {};
          (vars || []).forEach((vari) => {
            varObject[vari] = "";
          });
          setVars(varObject);
          setScript(body[0]);
        });
    }
  }, [id]);

  const parseValue = () => {
    let locValue = script?.value || "";
    console.log({ locValue }, "b");
    Object.keys(vars).forEach((vari) => {
      locValue = locValue.replaceAll(vari, vars[vari]);
    });
    console.log({ locValue }, "a");
    return locValue;
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
            <span>{vari.replaceAll("%", "")}</span>
            <input
              value={vars[vari]}
              placeholder={vari.replaceAll("%", "")}
              onChange={(e) => {
                setVars({ ...vars, ...{ [vari]: e.target.value } });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
