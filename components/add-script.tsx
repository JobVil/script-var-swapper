import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { useRouter } from "next/router";

export const AddScript: NextPage = () => {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [vars, setVars] = useState<string[]>([]);
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
            const vars = value.match(/\%(.*?)\%/gm) || [];
            setVars([...new Set(vars)]);
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
              .then(() => {
                setIsAdding(false);
                router.push("/");
              })
              .catch((e) => {
                setIsAdding(false);
                alert(e);
              });
          }}
        >
          {isAdding ? "adding" : "add"}
        </button>
        {error && (
          <span style={{ color: "red" }}>
            Error!! !! !! !! !! !! y u no do it right?
          </span>
        )}
      </div>
      <div className={styles.varContent}>
        {vars.map((vari) => (
          <span key={vari}>{vari}</span>
        ))}
      </div>
    </div>
  );
};
