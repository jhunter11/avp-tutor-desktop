"""Cross-platform setup and launch for the local presentation. No credentials."""
import argparse
import os
from pathlib import Path
import shutil
import subprocess
import sys
import venv

ROOT = Path(__file__).resolve().parent


def run(command, **kwargs):
    environment = kwargs.pop('env', os.environ.copy())
    environment['PYTHONUTF8'] = '1'
    kwargs['env'] = environment
    subprocess.run([str(part) for part in command], cwd=ROOT, check=True, **kwargs)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['setup', 'run', 'check', 'download-model'])
    args = parser.parse_args()
    python = ROOT/'.venv'/('Scripts/python.exe' if os.name == 'nt' else 'bin/python')
    if args.command == 'download-model':
        # This is the explicit online setup step. Inference stays offline.
        from huggingface_hub import snapshot_download
        from backend.embeddings import MODEL_ID, MODEL_REVISION
        snapshot_download(repo_id=MODEL_ID, revision=MODEL_REVISION, token=False,
                          allow_patterns=['config.json','model.safetensors','tokenizer.json',
                                          'tokenizer_config.json','special_tokens_map.json','vocab.txt'])
        print('Pinned embedding model downloaded. No answer-model API is used.')
        return
    if args.command == 'setup':
        if sys.version_info[:2] != (3, 11):
            raise SystemExit('Use Python 3.11: Windows: py -3.11 desktop.py setup; macOS: python3.11 desktop.py setup')
        if not python.exists():
            venv.EnvBuilder(with_pip=True).create(ROOT/'.venv')
        run([python, '-m', 'pip', 'install', '-r', 'requirements-rag.txt'])
        online = os.environ.copy()
        for key in ('HF_HUB_OFFLINE', 'TRANSFORMERS_OFFLINE'):
            online.pop(key, None)
        run([python, 'desktop.py', 'download-model'], env=online)
        if not (ROOT/'dist/index.html').is_file():
            npm = shutil.which('npm')
            if not npm:
                raise SystemExit('Source clone needs Node 22. The presentation ZIP includes the built page and needs no Node.')
            run([npm, 'ci', '--ignore-scripts'])
            run([npm, 'run', 'build'])
        run([python, 'desktop.py', 'check'])
        print('Setup complete. Next: python desktop.py run')
        return
    if not python.exists():
        raise SystemExit('Run setup first. See DESKTOP.md.')
    if Path(sys.executable).absolute() != python.absolute() or not sys.flags.utf8_mode:
        run([python, '-X', 'utf8', 'desktop.py', args.command])
        return
    if args.command == 'check':
        from backend.vector_rag import ask
        result = ask('How do I write an AVP for loop that includes both endpoints?')
        if result['mode'] != 'offline_source_extract' or 'avp-syntax.for-loop' not in result['citations']:
            raise SystemExit('Retrieval smoke check failed. See docs/ACCURACY.md.')
        if not (ROOT/'dist/index.html').is_file() or not (ROOT/'dist/media/avp-rag-walkthrough.mp4').is_file():
            raise SystemExit('Built page or video missing. Use the presentation ZIP or npm run build.')
        print('PASS: real local embeddings, expected AVP source citation, built page and video present.')
    else:
        run([python, '-m', 'backend.presentation', '--site', ROOT/'dist'])


if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError as error:
        raise SystemExit(f'Command failed ({error.returncode}). Read the error above; rerun setup after resolving it.')
    except KeyboardInterrupt:
        pass
