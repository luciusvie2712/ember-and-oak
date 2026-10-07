"use client";

import { useState } from "react";

type Path = (string | number)[];

function label(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function replaceAt(root: unknown, path: Path, value: unknown): unknown {
  if (!path.length) return value;
  const copy: Record<string | number, unknown> = Array.isArray(root)
    ? { ...root }
    : { ...(root as Record<string, unknown>) };
  const [head, ...tail] = path;
  copy[head!] = replaceAt(copy[head!], tail, value);
  return Array.isArray(root)
    ? Object.keys(copy)
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => copy[key])
    : copy;
}

export function StructuredEditor({ initial }: { initial: unknown }) {
  const [content, setContent] = useState(initial);
  const update = (path: Path, value: unknown) =>
    setContent((current: unknown) => replaceAt(current, path, value));

  function field(value: unknown, path: Path, name: string): React.ReactNode {
    if (Array.isArray(value))
      return (
        <fieldset className="structured-group">
          <legend>{label(name)}</legend>
          {value.map((item, index) => (
            <div className="array-item" key={index}>
              {field(item, [...path, index], `${name} ${index + 1}`)}
              <div className="array-actions">
                <button
                  type="button"
                  onClick={() =>
                    update(
                      path,
                      value.filter((_: unknown, i: number) => i !== index),
                    )
                  }
                >
                  Remove
                </button>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => {
                    const next = [...value];
                    [next[index - 1], next[index]] = [next[index], next[index - 1]];
                    update(path, next);
                  }}
                >
                  Move up
                </button>
                <button
                  type="button"
                  onClick={() =>
                    update(path, [
                      ...value.slice(0, index + 1),
                      clone(item),
                      ...value.slice(index + 1),
                    ])
                  }
                >
                  Duplicate
                </button>
              </div>
            </div>
          ))}
          {value.length === 0 ? <p>No items.</p> : null}
        </fieldset>
      );
    if (value && typeof value === "object")
      return (
        <fieldset className="structured-group">
          <legend>{label(name)}</legend>
          {Object.entries(value).map(([key, item]) => (
            <div key={key}>{field(item, [...path, key], key)}</div>
          ))}
        </fieldset>
      );
    if (typeof value === "boolean")
      return (
        <label className="boolean-field">
          <input
            type="checkbox"
            checked={value}
            onChange={(event) => update(path, event.target.checked)}
          />
          {label(name)}
        </label>
      );
    if (typeof value === "number")
      return (
        <label>
          {label(name)}
          <input
            type="number"
            value={value}
            onChange={(event) => update(path, Number(event.target.value))}
          />
        </label>
      );
    const stringValue = value == null ? "" : String(value);
    return (
      <label>
        {label(name)}
        {stringValue.length > 120 ? (
          <textarea value={stringValue} onChange={(event) => update(path, event.target.value)} />
        ) : (
          <input value={stringValue} onChange={(event) => update(path, event.target.value)} />
        )}
      </label>
    );
  }

  return (
    <>
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      <div className="structured-editor">{field(content, [], "Content")}</div>
    </>
  );
}
