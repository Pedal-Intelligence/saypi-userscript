#!/usr/bin/env python3
"""Prune unused initializers from ONNX models.

This focuses on the Silero VAD models bundled with the extension. It removes
initializers that are never referenced by any node input, graph output, or
value info entry, matching the behaviour ONNX Runtime reports at load time.
"""

import argparse
import pathlib
from typing import Set

import onnx


def collect_used_names(graph: onnx.GraphProto) -> Set[str]:
  used: Set[str] = set()

  for node in graph.node:
    used.update(node.input)

  for output in graph.output:
    used.add(output.name)

  for value_info in graph.value_info:
    used.add(value_info.name)

  return {name for name in used if name}


def prune_model(input_path: pathlib.Path, output_path: pathlib.Path) -> None:
  model = onnx.load_model(str(input_path))
  graph = model.graph

  used_names = collect_used_names(graph)

  retained_initializers = [init for init in graph.initializer if init.name in used_names]
  removed_count = len(graph.initializer) - len(retained_initializers)

  if removed_count == 0:
    onnx.save_model(model, str(output_path))
    print("No unused initializers found; model unchanged.")
    return

  graph.ClearField("initializer")
  graph.initializer.extend(retained_initializers)

  if graph.sparse_initializer:
    retained_sparse = [init for init in graph.sparse_initializer if init.name in used_names]
    graph.ClearField("sparse_initializer")
    graph.sparse_initializer.extend(retained_sparse)

  onnx.save_model(model, str(output_path))
  print(f"Removed {removed_count} unused initializers.")


def main() -> None:
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("--input", required=True, help="Path to the source ONNX model")
  parser.add_argument("--output", required=True, help="Path to write the optimized model")
  args = parser.parse_args()

  input_path = pathlib.Path(args.input)
  output_path = pathlib.Path(args.output)

  prune_model(input_path, output_path)


if __name__ == "__main__":
  main()
