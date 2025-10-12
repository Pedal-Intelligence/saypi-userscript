import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "wxt";

const COMMONJS_CHUNK_PATTERN = "chunks/chunk-[hash].js";
const COMMONJS_HELPER_REGEX = /^_commonjsHelpers\.([^.]+)\.js(\.map)?$/;
const COMMONJS_HELPER_PREFIX = "chunks/commonjs-";
const TEXT_EXTENSIONS = new Set([".js", ".mjs", ".css", ".html", ".json", ".map"]);
const VAD_WORKLET_BUNDLE = fileURLToPath(
  new URL("./node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js", import.meta.url),
);
const ICON_SIZES = ["16", "32", "48", "128"] as const;
const ICON_FILE_NAMES = new Map(
  ICON_SIZES.map((size) => [size, `bubble-${size}px.png`]),
);

const EXTRA_ICON_FILES = [
  "bubble-green.svg",
  "bubble-bw.svg",
  "bubble-300px.png",
];

const EXTRA_ASSET_FILES = [
  { src: "src/popup/data-sharing-portrait.jpg", dest: "data-sharing-portrait.jpg" },
];

const FLAGS_DIR = fileURLToPath(new URL("./src/icons/flags", import.meta.url));

const replaceAllMappings = (input: string, mappings: Map<string, string>) => {
  let result = input;
  for (const [from, to] of mappings) {
    result = result.split(from).join(to);
  }
  return result;
};

const renameHelperFile = (fileName: string) => {
  const match = COMMONJS_HELPER_REGEX.exec(fileName);
  if (!match) {
    return null;
  }
  const [, hash, mapSuffix] = match;
  const base = `${COMMONJS_HELPER_PREFIX}${hash}.js`;
  return mapSuffix ? `${base}.map` : base;
};

const createCommonjsHelperRenamer = () => {
  const rewriteSet = (values: Set<string>, mappings: Map<string, string>) => {
    return new Set(Array.from(values, (value) => mappings.get(value) ?? value));
  };

  return {
    name: "commonjs-helper-safe-names",
    apply: "build",
    generateBundle(_options: any, bundle: Record<string, any>) {
      const renameMap = new Map<string, string>();

      for (const fileName of Object.keys(bundle)) {
        const renamed = renameHelperFile(fileName);
        if (renamed) {
          renameMap.set(fileName, renamed);
        }
      }

      if (renameMap.size === 0) {
        return;
      }

      for (const [from, to] of renameMap) {
        const entry = bundle[from];
        if (!entry) continue;
        entry.fileName = to;
        bundle[to] = entry;
        delete bundle[from];
      }

      const rewriteArray = (values: string[] | undefined) => {
        if (!Array.isArray(values)) return values;
        return values.map((value) => renameMap.get(value) ?? value);
      };

      for (const output of Object.values(bundle)) {
        if (output.type === "chunk") {
          output.imports = rewriteArray(output.imports);
          output.dynamicImports = rewriteArray(output.dynamicImports);
          output.implicitlyLoadedBefore = rewriteArray(output.implicitlyLoadedBefore);

          if (output.importedBindings) {
            const next: Record<string, any> = {};
            for (const [file, bindings] of Object.entries(output.importedBindings)) {
              const target = renameMap.get(file) ?? file;
              next[target] = bindings;
            }
            output.importedBindings = next;
          }

          if (output.viteMetadata) {
            if (output.viteMetadata.importedChunks instanceof Set) {
              output.viteMetadata.importedChunks = rewriteSet(output.viteMetadata.importedChunks, renameMap);
            }
            if (output.viteMetadata.importedAssets instanceof Set) {
              output.viteMetadata.importedAssets = rewriteSet(output.viteMetadata.importedAssets, renameMap);
            }
            if (output.viteMetadata.importedCss instanceof Set) {
              output.viteMetadata.importedCss = rewriteSet(output.viteMetadata.importedCss, renameMap);
            }
          }

          if (typeof output.code === "string") {
            output.code = replaceAllMappings(output.code, renameMap);
          }
        } else if (typeof output.source === "string") {
          output.source = replaceAllMappings(output.source, renameMap);
        }
      }
    },
  };
};

const renamePublicCommonjsAssets = (files: Array<Record<string, any>>) => {
  const renameMap = new Map<string, string>();

  for (const file of files) {
    const original = file.relativeDest;
    const renamed = renameHelperFile(original);
    if (renamed) {
      renameMap.set(original, renamed);
      file.relativeDest = renamed;
    }
  }

  if (renameMap.size === 0) {
    return;
  }

  for (const file of files) {
    if (!("absoluteSrc" in file)) continue;
    const targetPath = file.absoluteSrc;
    const destination = file.relativeDest;
    if (typeof targetPath !== "string" || typeof destination !== "string") continue;
    const extension = extname(destination).toLowerCase();
    if (!TEXT_EXTENSIONS.has(extension)) {
      continue;
    }
    const source = readFileSync(targetPath, "utf8");
    const updated = replaceAllMappings(source, renameMap);
    if (updated !== source) {
      file.contents = updated;
      delete file.absoluteSrc;
    }
  }

};

const LOCALES_DIR = fileURLToPath(new URL("./_locales", import.meta.url));

const addLocalePublicAssets = (files: Array<Record<string, any>>) => {
  try {
    const stats = statSync(LOCALES_DIR);
    if (!stats.isDirectory()) {
      return;
    }
  } catch {
    return;
  }

  const stack: Array<{ absolute: string; relative: string }> = [{ absolute: LOCALES_DIR, relative: "" }];

  while (stack.length) {
    const current = stack.pop();
    if (!current) continue;

    const entries = readdirSync(current.absolute, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = join(current.absolute, entry.name);
      const relativePath = current.relative ? `${current.relative}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        stack.push({ absolute: absolutePath, relative: relativePath });
      } else if (entry.isFile()) {
        files.push({
          relativeDest: `_locales/${relativePath}`,
          absoluteSrc: absolutePath,
        });
      }
    }
  }
};

const addIconPublicAssets = (files: Array<Record<string, any>>) => {
  for (const [size, fileName] of ICON_FILE_NAMES) {
    const relativeDest = `icons/${fileName}`;
    if (files.some((file) => file.relativeDest === relativeDest)) {
      continue;
    }

    const absolutePath = fileURLToPath(new URL(`./src/icons/${fileName}`, import.meta.url));
    try {
      const stats = statSync(absolutePath);
      if (!stats.isFile()) {
        continue;
      }
    } catch {
      continue;
    }

    files.push({
      relativeDest,
      absoluteSrc: absolutePath,
    });
  }

  for (const fileName of EXTRA_ICON_FILES) {
    const relativeDest = `icons/${fileName}`;
    if (files.some((file) => file.relativeDest === relativeDest)) {
      continue;
    }
    const absolutePath = fileURLToPath(new URL(`./src/icons/${fileName}`, import.meta.url));
    try {
      const stats = statSync(absolutePath);
      if (!stats.isFile()) continue;
    } catch {
      continue;
    }
    files.push({
      relativeDest,
      absoluteSrc: absolutePath,
    });
  }
};

const addFlagIconAssets = (files: Array<Record<string, any>>) => {
  try {
    const stats = statSync(FLAGS_DIR);
    if (!stats.isDirectory()) {
      return;
    }
  } catch {
    return;
  }

  const entries = readdirSync(FLAGS_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const extension = extname(entry.name).toLowerCase();
    if (extension !== ".svg" && extension !== ".png") {
      continue;
    }
    const absolutePath = join(FLAGS_DIR, entry.name);
    files.push({
      relativeDest: `icons/flags/${entry.name}`,
      absoluteSrc: absolutePath,
    });
  }
};

const addVadAssets = (files: Array<Record<string, any>>) => {
  try {
    const stats = statSync(VAD_WORKLET_BUNDLE);
    if (!stats.isFile()) {
      return;
    }
  } catch {
    return;
  }

  if (!files.some((file) => file.relativeDest === "vad.worklet.bundle.min.js")) {
    files.push({
      relativeDest: "vad.worklet.bundle.min.js",
      absoluteSrc: VAD_WORKLET_BUNDLE,
    });
  }
};

const addExtraAssets = (files: Array<Record<string, any>>) => {
  for (const asset of EXTRA_ASSET_FILES) {
    const absolutePath = fileURLToPath(new URL(`./${asset.src}`, import.meta.url));
    try {
      const stats = statSync(absolutePath);
      if (!stats.isFile()) continue;
    } catch {
      console.warn(`Extra asset not found: ${asset.src}`);
      continue;
    }
    files.push({
      relativeDest: asset.dest,
      absoluteSrc: absolutePath,
    });
  }
};

const applyChunkFilePattern = (config: { build?: Record<string, any>; plugins?: any[] }) => {
  config.build ??= {};
  const buildConfig = config.build as Record<string, any>;
  buildConfig.rollupOptions ??= {};
  const rollupOptions = buildConfig.rollupOptions as Record<string, any>;

  const assignPattern = (output: any) => {
    if (!output) {
      return;
    }
    if (Array.isArray(output)) {
      for (const entry of output) {
        assignPattern(entry);
      }
      return;
    }
    if (typeof output === "object") {
      output.chunkFileNames = COMMONJS_CHUNK_PATTERN;
    }
  };

  if (rollupOptions.output == null) {
    rollupOptions.output = { chunkFileNames: COMMONJS_CHUNK_PATTERN };
  } else {
    assignPattern(rollupOptions.output);
  }

  config.plugins ??= [];
  config.plugins.push(createCommonjsHelperRenamer());
};

const formatHostPermission = (url?: string | null): string | null => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const port = parsed.port ? `:${parsed.port}` : "";
    return `${parsed.protocol}//${parsed.hostname}${port}/*`;
  } catch {
    return null;
  }
};

const DEFAULT_HOST_PERMISSION_URLS = [
  "https://api.saypi.ai",
  "https://www.saypi.ai",
];

const hostPermissionCandidates = [
  process.env.VITE_API_SERVER_URL ?? process.env.API_SERVER_URL,
  process.env.VITE_AUTH_SERVER_URL ?? process.env.AUTH_SERVER_URL,
  ...DEFAULT_HOST_PERMISSION_URLS,
];

const HOST_PERMISSIONS = Array.from(
  new Set(
    hostPermissionCandidates
      .map((candidate) => formatHostPermission(candidate))
      .filter((value): value is string => Boolean(value)),
  ),
);

export default defineConfig((env) => {
  const browser = env?.browser ?? "chrome";
  const mode = env?.mode ?? "development";
  const isFirefox = browser === "firefox";
  const isProduction = mode === "production";

  const permissions: string[] = ["storage", "cookies", "tabs", "contextMenus"];

  if (!isFirefox) {
    permissions.push("offscreen", "audio");
  }

  if (!isProduction) {
    permissions.push("downloads");
  }

  return {
    hooks: {
      "vite:build:extendConfig": (entrypoints, config) => {
        applyChunkFilePattern(config);
      },
      "vite:devServer:extendConfig": (config) => {
        applyChunkFilePattern(config);
      },
      "build:publicAssets": (_wxt: any, files: any[]) => {
        addLocalePublicAssets(files);
        addIconPublicAssets(files);
        addFlagIconAssets(files);
        addVadAssets(files);
        addExtraAssets(files);
        renamePublicCommonjsAssets(files);
      },
    },
    root: ".",
    srcDir: ".",
    entrypointsDir: "entrypoints",
    outDir: ".output",
    optimizeDeps: {
      disabled: true,
    },
    manifest: {
      name: "__MSG_appName__",
      description: "__MSG_appDescription__",
      default_locale: "en",
      author: "Ross Cadogan",
      homepage_url: "https://www.saypi.ai",
      action: {
        default_title: "Say, Pi",
      },
      permissions,
      host_permissions: HOST_PERMISSIONS,
      content_security_policy: {
        extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
      },
      icons: {
        "16": "icons/bubble-16px.png",
        "32": "icons/bubble-32px.png",
        "48": "icons/bubble-48px.png",
        "128": "icons/bubble-128px.png",
      },
      web_accessible_resources: [
        {
          resources: [
            "silero_vad*.onnx",
            "*.wasm",
            "*.mjs",
            "*.js",
            "ort-wasm*",
            "vad.worklet*.js",
            "audio/*.mp3",
            "icons/*.svg",
            "icons/*.png",
            "icons/logos/*.svg",
            "icons/logos/*.png",
            "icons/flags/*.svg",
          ],
          matches: ["<all_urls>"],
        },
      ],
      browser_specific_settings: {
        gecko: {
          id: "gecko@saypi.ai",
        },
      },
    },
    vite: () => ({
      define: {
        __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      },
      resolve: {
        alias: {
          "~": fileURLToPath(new URL("./src", import.meta.url)),
          events: fileURLToPath(new URL("./src/utils/EventEmitterShim.js", import.meta.url)),
        },
      },
      build: {
        rollupOptions: {
          output: {
            chunkFileNames: COMMONJS_CHUNK_PATTERN,
            entryFileNames: "[name].[hash].js",
            assetFileNames: "assets/[name].[hash][extname]",
          },
        },
      },
    }),
  };
});
