// Copyright 2000-2022 JetBrains s.r.o. and contributors. Use of this source code is governed by the Apache 2.0 license.
// Copyright 2000-2022 JetBrains s.r.o. and contributors. Use of this source code is governed by the Apache 2.0 license.
import type {ScriptKind} from 'typescript/lib/tsserverlibrary'
import {Parser} from "htmlparser2/lib/Parser"

type TS = typeof import("typescript/lib/tsserverlibrary");

const prefix = ";(()=>{";
const suffix = "})();";
const prefixLength = prefix.length;
const suffixLength = suffix.length;
const componentShim = "import componentDefinition from '*.vue'; export default componentDefinition;";

export function transformVueSfcFile(ts: TS, contents: string): { result: string, scriptKind: ScriptKind } {
  let result = "";

  let lastIndex = 0;
  let level = 0;
  let isScript = false;
  let scriptKind = ts.ScriptKind.JS;
  let inScriptSetup = false;
  let addedScriptSetupPrefix = false;

  let hadScriptSetup = false;
  let hadScriptNormal = false;
  let scriptSetupStartLoc = -1;
  let scriptSetupEndLoc = -1;

  const parser = new Parser({
    onopentag(name: string, attrs: { [p: string]: string }) {
      if (name === "script" && level === 0) {
        isScript = true
        inScriptSetup = false
        for (let attr in attrs) {
          if (attr.toLowerCase() == "lang") {
            const attrValue = attrs[attr]!.toLowerCase()
            scriptKind = getUpdatedScriptKind(ts, scriptKind, attrValue)
          }
          if (attr.toLowerCase() == "setup") {
            inScriptSetup = true
            addedScriptSetupPrefix = false
            hadScriptSetup = true
          }
        }
        hadScriptNormal = hadScriptNormal || !inScriptSetup
      }
      level++;
    },
    ontext(data: string) {
      if (isScript) {
        const lineCount = contents.substring(lastIndex, parser.startIndex).split("\n").length - 1
        let charsCount = parser.startIndex - lastIndex - lineCount
        if (inScriptSetup && !addedScriptSetupPrefix) {
          addedScriptSetupPrefix = true
          scriptSetupStartLoc = result.length
          result += prefix
          charsCount -= prefixLength
        }
        result += " ".repeat(charsCount) + "\n".repeat(lineCount) + data
        lastIndex = parser.endIndex! + 1 // TODO handle null assertion
      }
    },
    onclosetag(name: string) {
      if (inScriptSetup) {
        scriptSetupEndLoc = result.length
        result += suffix
        inScriptSetup = false
        lastIndex += suffixLength
      }
      isScript = false;
      level--
    }
  }, {
    recognizeSelfClosing: true
  })

  parser.write(contents)
  parser.end()

  // Support empty <script> tag
  if (result.trim() === "") {
    result = componentShim;
    scriptKind = ts.ScriptKind.TS;
  }
  // Support <script setup> syntax
  else if (hadScriptSetup && !hadScriptNormal) {
    result = `${result}; ${componentShim}`

    // Remove wrapper for imports to work properly
    if (scriptSetupStartLoc >= 0) {
      result = result.substring(0, scriptSetupStartLoc) + " ".repeat(prefixLength) + result.substring(scriptSetupStartLoc + prefixLength)
    }
    if (scriptSetupEndLoc >= 0) {
      result = result.substring(0, scriptSetupEndLoc) + " ".repeat(suffixLength) + result.substring(scriptSetupEndLoc + suffixLength)
    }
  }
  else if (hadScriptSetup && hadScriptNormal) {
    // Add imports at the end of the file
    result += "\n;"
    const r = /import[^'"]*['"]([^'"]*)['"]/g;
    const fragmentToMatch = result.substring(scriptSetupStartLoc, scriptSetupEndLoc)
    let match: RegExpMatchArray | null
    while ((match = r.exec(fragmentToMatch)) !== null) {
      result += `import "${match[1]}";\n`
    }
  }

  return {
    result,
    scriptKind
  }
}

function getUpdatedScriptKind(ts: TS, scriptKind: ScriptKind, value: string): ScriptKind {
  switch (value) {
    case "jsx":
      if (scriptKind == ts.ScriptKind.JS) {
        scriptKind = ts.ScriptKind.JSX;
      }
      else {
        scriptKind = ts.ScriptKind.TSX;
      }
      break;
    case "ts":
      if (scriptKind == ts.ScriptKind.JS) {
        scriptKind = ts.ScriptKind.TS;
      }
      else if (scriptKind == ts.ScriptKind.JSX) {
        scriptKind = ts.ScriptKind.TSX;
      }
      break;
    case "tsx":
      scriptKind = ts.ScriptKind.TSX;
      break;
  }

  return scriptKind
}