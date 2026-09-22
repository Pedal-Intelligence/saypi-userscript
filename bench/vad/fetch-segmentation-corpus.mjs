#!/usr/bin/env node
// Fetch the continuous-speech corpora for the #655 fragmentation benchmark into
// bench/vad/corpus-segmentation/ (git-ignored; no third-party bytes are committed).
//
//   AMI Meeting Corpus (CC-BY-4.0, https://groups.inf.ed.ac.uk/ami/corpus/license.shtml):
//     the four close-talk headset channels of scenario meetings ES2002a + ES2003a (~2.8 h of
//     spontaneous conversational speech, 16 kHz), plus the manual annotations (word timings
//     and dialogue acts), which give the ground truth for "one thought" and "one turn".
//   LibriSpeech test-clean (CC-BY-4.0, https://www.openslr.org/12): 2,620 read-speech
//     utterances; each one is a single continuous span, so any split is a cut.
//
// The synthetic pause sweep is generated on the fly by segmentation.ts (macOS `say`).
// Needs `curl`, `tar` and `unzip`; the benchmark itself also needs `ffmpeg` (FLAC decode).
// Usage: npm run bench:vad:fetch-segmentation   (~800 MB download)
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "corpus-segmentation");
const amiDir = resolve(outDir, "ami");
mkdirSync(amiDir, { recursive: true });

const curl = (url, dest) => execFileSync("curl", ["-sS", "-L", "--fail", "-o", dest, url], { stdio: "inherit" });

const AMI_MEETINGS = ["ES2002a", "ES2003a"];
const AMI_AUDIO = "https://groups.inf.ed.ac.uk/ami/AMICorpusMirror/amicorpus";
const AMI_ANNOTATIONS = "https://groups.inf.ed.ac.uk/ami/AMICorpusAnnotations/ami_public_manual_1.6.2.zip";
const LIBRISPEECH = "https://www.openslr.org/resources/12/test-clean.tar.gz";

if (!existsSync(resolve(amiDir, "ann/corpusResources/meetings.xml"))) {
  console.log("Downloading AMI manual annotations (~22 MB)…");
  const zip = resolve(amiDir, "annotations.zip");
  curl(AMI_ANNOTATIONS, zip);
  execFileSync("unzip", ["-q", "-o", zip, "-d", resolve(amiDir, "ann")]);
  rmSync(zip);
}
for (const meeting of AMI_MEETINGS) {
  for (const ch of [0, 1, 2, 3]) {
    const file = `${meeting}.Headset-${ch}.wav`;
    const dest = resolve(amiDir, file);
    if (existsSync(dest)) continue;
    console.log(`Downloading AMI ${file} (~40 MB)…`);
    curl(`${AMI_AUDIO}/${meeting}/audio/${file}`, dest);
  }
}

if (!existsSync(resolve(outDir, "LibriSpeech/test-clean"))) {
  console.log("Downloading LibriSpeech test-clean (~350 MB)…");
  const tgz = resolve(outDir, "test-clean.tar.gz");
  curl(LIBRISPEECH, tgz);
  execFileSync("tar", ["xzf", tgz, "-C", outDir]);
  rmSync(tgz);
}

writeFileSync(
  resolve(outDir, "ATTRIBUTION.md"),
  `# Fragmentation-benchmark corpora (#655)

- **AMI Meeting Corpus**: headset audio for ${AMI_MEETINGS.join(", ")} and manual annotations v1.6.2.
  CC-BY-4.0. Carletta et al., "The AMI Meeting Corpus: A Pre-Announcement", MLMI 2005.
  ${AMI_AUDIO} · ${AMI_ANNOTATIONS}
- **LibriSpeech test-clean**: CC-BY-4.0. Panayotov et al., "LibriSpeech: an ASR corpus based on
  public domain audio books", ICASSP 2015. ${LIBRISPEECH}
`
);
console.log(`Done → ${outDir}\nRun: npm run bench:vad:segmentation`);
