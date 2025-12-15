import logging
import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import fitz  
import pytesseract
from PIL import Image
import io

app = FastAPI()

logging.basicConfig(level=logging.INFO)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def extract_images_from_pdf(pdf_bytes):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    images = []

    for page in doc:
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image = Image.open(io.BytesIO(image_bytes))
            images.append(image)

    return images

def extract_text_from_pdf(pdf_bytes):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    logging.info(f"Extracted {len(doc)} pages")
    text = ""
    for page in doc:
        text += page.get_text()
        logging.info(f"Extracted text from page {page.number}")
        logging.info(f"Text: {text}")
    return text

def ocr_images(images):
    text = ""
    for img in images:
        text += pytesseract.image_to_string(img)
        logging.info(text)
    return text

@app.post("/process-pdf/")
async def process_pdf(file: UploadFile = File(...)):
    pdf_bytes = await file.read()


    # Extract text from pdf 
    text = extract_text_from_pdf(pdf_bytes)
    logging.info(f"Extracted text from PDF")
    logging.info(f"Text: {text}")

    # Extract images from pdf
    images = extract_images_from_pdf(pdf_bytes)
    logging.info(f"Extracted {len(images)} images")

    # OCR images
    images_text = ocr_images(images)
    logging.info(f"Extracted text from images")
    logging.info(f"Text: {images_text}")

    # Merge text from pdf and images
    text = text + "\n" + images_text
    logging.info(f"Merged text from PDF and images")
    logging.info(f"Text: {text}")

    return {"text": text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
