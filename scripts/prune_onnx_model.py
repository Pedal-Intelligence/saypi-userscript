#!/usr/bin/env python3
"""Prune unused initializers from ONNX models, including nested subgraphs."""

import argparse
import pathlib
from typing import Iterable, Set

import onnx


def _gather_used_names(graph: onnx.GraphProto) -> Set[str]:
  """Return the set of tensor names referenced within a graph."""

  used: Set[str] = set()

  def _add_all(names: Iterable[str]) -> None:
    for name in names:
      if name:
        used.add(name)

  for node in graph.node:
    _add_all(node.input)
    _add_all(node.output)

  _add_all(t.name for t in graph.output)
  _add_all(t.name for t in graph.value_info)
  _add_all(t.name for t in graph.input)

  return used


def _prune_graph(graph: onnx.GraphProto) -> int:
  """Prune unused initializers from a graph and any nested subgraphs."""

  removed = 0
  used_names = _gather_used_names(graph)

  # Retain initializers without names; ONNX allows nameless entries that cannot be
  # referenced elsewhere, so we conservatively keep them to avoid corrupting the model.
  retained = [init for init in graph.initializer if not init.name or init.name in used_names]
  removed += len(graph.initializer) - len(retained)
  graph.ClearField("initializer")
  graph.initializer.extend(retained)

  if graph.sparse_initializer:
    # Same reasoning applies for sparse initializers – preserve nameless entries.
    retained_sparse = [init for init in graph.sparse_initializer if not init.name or init.name in used_names]
    removed += len(graph.sparse_initializer) - len(retained_sparse)
    graph.ClearField("sparse_initializer")
    graph.sparse_initializer.extend(retained_sparse)

  for node in graph.node:
    for attr in node.attribute:
      if attr.type == onnx.AttributeProto.GRAPH and attr.g:
        removed += _prune_graph(attr.g)
      elif attr.type == onnx.AttributeProto.GRAPHS:
        for subgraph in attr.graphs:
          removed += _prune_graph(subgraph)

  return removed


def prune_model(input_path: pathlib.Path, output_path: pathlib.Path) -> None:
  model = onnx.load_model(str(input_path))
  total_removed = _prune_graph(model.graph)

  onnx.save_model(model, str(output_path))

  if total_removed == 0:
    print("No unused initializers found; model unchanged.")
  else:
    print(f"Removed {total_removed} unused initializer(s).")


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
