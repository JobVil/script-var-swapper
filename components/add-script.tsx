import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";

export const AddScript: NextPage = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [checkClicked, setCheckedClicked] = useState(false);
  const [error, setError] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [vars, setVars] = useState<string[]>([]);
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return (
    <div className={styles.mainLayout}>
      <div className={styles.scriptContent}>
        <input
          value={title}
          placeholder="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <textarea
          value={value}
          placeholder="script"
          onChange={(e) => {
            const value = e.target.value;
            const vars = value.match(/\%(\w)*\%/gm);
            setVars(vars || []);
            setValue(value);
          }}
        />
        <button
          onClick={() => {
            if (!value || !title) {
              setError(true);
              return;
            }
            setError(false);
            setIsAdding(true);
            fetch("api/scripts", {
              method: "POST",
              body: JSON.stringify({ title, value }),
            })
              .then(() => setIsAdding(false))
              .catch((e) => alert(e));
          }}
        >
          {isAdding ? "adding" : "add"}
        </button>
        {error && (
          <span style={{ color: "red" }}>
            Error!! !! !! !! !! !! y u no do it right?
          </span>
        )}
        <button
          onClick={() => {
            fetch("api/scripts", {
              method: "GET",
            })
              .then((res) => res.json())
              .then((body) => {
                console.log({ CheckResult: body });
                setCheckedClicked(true);
                setTimeout(() => {
                  isMounted.current && setCheckedClicked(false);
                }, 10000);
              });
          }}
        >
          check
        </button>
        {checkClicked && "Database printed to console"}
      </div>
      <div className={styles.varContent}>
        {vars.map((vari) => (
          <span key={vari}>{vari}</span>
        ))}
      </div>
    </div>
  );
};
