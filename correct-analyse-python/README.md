# PDF Analyzer API (FastAPI)

FastAPI service that extracts text from PDFs and performs OCR on embedded images
using PyMuPDF, Pillow, and Tesseract.

## Features

- Extracts text from PDF pages (PyMuPDF)
- Extracts images embedded in PDFs
- Runs OCR on images (pytesseract)
- Combines PDF text and OCR results into a single response

## Requirements

- Python 3.13 (or compatible 3.10+)
- Tesseract OCR installed on your system
  - macOS: `brew install tesseract`
  - Linux (Debian/Ubuntu): `sudo apt-get install tesseract-ocr`
  - Windows: Install from `https://github.com/UB-Mannheim/tesseract/wiki`

## Setup

```bash
# Enter the project
cd /Users/yashnerkar/Documents/correct-organisation/correct-analyse-python

# Create and activate virtual environment (already present as myenv)
python3 -m venv myenv
source myenv/bin/activate

# Install dependencies
pip install fastapi uvicorn pymupdf pillow pytesseract python-multipart
```

## Running the API

```bash
# Activate the venv if not already active
source myenv/bin/activate

# Start the server
python main.py
# or
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

The API will be available at `http://localhost:8001`.

## Endpoint

- POST `/process-pdf/`
  - Form field: `file` (PDF file)
  - Returns: `{ "text": "...combined extracted text..." }`

### Example with curl

```bash
curl -X POST \
  -F "file=@pdfs/Certificate of LLP Incorporation.PDF" \
  http://localhost:8001/process-pdf/
```

## Notes

- If Tesseract is not found, set the binary path in code before using
  `pytesseract`:

```python
import pytesseract
pytesseract.pytesseract.tesseract_cmd = "/usr/local/bin/tesseract"  # macOS Homebrew default
```

- Large PDFs may take time; consider background tasks or streaming if needed.

## Project Structure

```
correct-analyse-python/
├── main.py
├── pdfs/
├── images/
├── myenv/  # virtual environment (ignored by git)
└── README.md
```

## Development Tips

- Use `--reload` during development for auto-reload.
- Validate CORS settings if calling from a browser.
- Consider adding a `requirements.txt` via `pip freeze > requirements.txt`.
# correct-analyse-app
