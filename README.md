# AVP Tutor — Desktop Copy

Algorithm visualizer with an integrated Hint/Explain tutor. The tutor receives the current student code, viewed interpreter state and visualization screenshots through one fixed API, then returns text guidance. It does not replace student code.

This is a public development snapshot for running locally, based on the existing AVP frontend. It is not the team's merged release or Miami server deployment. See [source and changes](MODIFICATIONS.md) and the [API contract](docs/tutor/API.md).

## Set up on your desktop

Install Git, Python 3.10+ and Node.js 24.19.0 (the version used for the local validation). Then:

```sh
git clone https://github.com/jhunter11/avp-tutor-desktop.git
cd avp-tutor-desktop
npm ci --ignore-scripts
npm run build-g4
```

The grammar command uses `npx` and may ask to install `antlr-ng`; accept that prompt. With nvm, `nvm install` and `nvm use` select the version in `.nvmrc`.

### Terminal 1: tutor backend

Create your own local `api-key.txt` containing your OpenRouter key. That file is ignored by Git. The key is not included in this repository and must be configured separately on each machine.

macOS/Linux:

```sh
TUTOR_API_KEY_FILE="$PWD/api-key.txt" python3 -m backend.server
```

Windows PowerShell:

```powershell
$env:TUTOR_API_KEY_FILE = (Join-Path $PWD 'api-key.txt')
py -3 -m backend.server
```

Python uses only its standard library. Environment configuration examples are in [backend/.env.example](backend/.env.example); the server does not automatically load `.env` files.

### Terminal 2: frontend

From the same repository folder:

```sh
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open **http://127.0.0.1:5173/MiamiOH-AVP-Demo/** and select an algorithm. The visualizer works without an API key; tutor replies require the backend and a key. Loading dots show a pending reply, and failed requests can be retried.

## Providers

The default is a free-only OpenRouter vision model. The backend rechecks model availability, image support and listed pricing at request time. Free models can be rate limited or become unavailable; choose a supported vision model through `TUTOR_MODEL` if needed.

The OpenAI Responses adapter uses the same frontend API, but has only been verified with mocked responses. Paid providers are disabled by default. Choosing OpenAI requires server-side provider/model/key configuration and explicit `TUTOR_ALLOW_PAID=1`; no paid provider is enabled by these instructions.

## Checks

```sh
python3 -m unittest backend.test_tutor backend.test_server -v
npm run typecheck
npm run build
```

For browser tests, install the browser runtimes with `npx playwright install`, then run the relevant Vitest files. See [validation notes](docs/tutor/VALIDATION.md) for the focused checks and remaining limitations. A production deployment also needs a backend and reverse proxy; publishing this repository does not deploy the app.

## License

The original GPLv3 license is preserved in [LICENSE](LICENSE). Changes to the imported frontend are identified in [MODIFICATIONS.md](MODIFICATIONS.md).

## Credits

### Algorithm Logic & Pseudocode Designers
  - Matthew Valachek
  - Charlie Szczepanski
  - Xavier Rankin

### Pseudocode Developers
  - Nat Wagner
  - Stefan Wenzske

### UI/UX Designers
  - Benjamin Pryor
  - Cole Lingo
  - Nate Richmond

### AI Integration Developers
  - Huy Tran
