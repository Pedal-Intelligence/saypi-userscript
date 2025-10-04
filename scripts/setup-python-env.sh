#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PYTHON_VERSION="${PYTHON_VERSION:-3.11.12}"
VENV_DIR="$ROOT_DIR/.venv"

info() { printf '\033[1;34m[python-setup]\033[0m %s\n' "$1"; }
warn() { printf '\033[1;33m[python-setup]\033[0m %s\n' "$1"; }

select_python() {
  local candidate=""

  if command -v pyenv >/dev/null 2>&1; then
    local prefix
    prefix="$(pyenv prefix "${PYTHON_VERSION}" 2>/dev/null || true)"
    if [ -n "$prefix" ] && [ -x "$prefix/bin/python" ]; then
      info "pyenv: using ${PYTHON_VERSION} from ${prefix}" >&2
      echo "$prefix/bin/python"
      return 0
    fi
    warn "pyenv detected but Python ${PYTHON_VERSION} is not installed. Run 'pyenv install ${PYTHON_VERSION}' or set PYTHON=<path>." >&2
  fi

  if [ -n "${PYTHON:-}" ] && command -v "$PYTHON" >/dev/null 2>&1; then
    candidate="$PYTHON"
  else
    candidate="python3"
  fi

  if ! command -v "$candidate" >/dev/null 2>&1; then
    warn "Could not find a Python interpreter. Install Python ${PYTHON_VERSION} or set PYTHON=<path>." >&2
    exit 1
  fi

  local version_output
  version_output="$($candidate --version 2>&1 | awk '{print $2}')"
  if [[ ! "$version_output" =~ ^3\.11 ]]; then
    warn "Python ${version_output} detected. Python ${PYTHON_VERSION} is recommended to align with saypi-api." >&2
  fi

  echo "$candidate"
}

PYTHON_BIN="$(select_python)"
info "Using Python interpreter: ${PYTHON_BIN}"

if [ ! -d "$VENV_DIR" ]; then
  info "Creating virtual environment in ${VENV_DIR}"
  "$PYTHON_BIN" -m venv "$VENV_DIR"
else
  info "Reusing existing virtual environment in ${VENV_DIR}"
fi

# shellcheck source=/dev/null
source "$VENV_DIR/bin/activate"

info "Upgrading pip"
pip install --upgrade pip >/dev/null

info "Installing tooling dependencies from pyproject.toml"
pip install -e "$ROOT_DIR" >/dev/null

info "Python environment ready. Activate it with: source ${VENV_DIR}/bin/activate"
