import fitz # PyMuPDF
import io
import os

pdf_file = "doc/NaturApp_Informe_Sesion10.docx.pdf"
pdf_document = fitz.open(pdf_file)

for page_index in range(len(pdf_document)):
    page = pdf_document.load_page(page_index)
    image_list = page.get_images(full=True)
    
    if image_list:
        print(f"[+] Found {len(image_list)} images on page {page_index}")
    else:
        print(f"[!] No images found on page {page_index}")
        
    for image_index, img in enumerate(image_list, start=1):
        xref = img[0]
        base_image = pdf_document.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        image_filename = f"extracted_page{page_index}_img{image_index}.{image_ext}"
        with open(image_filename, "wb") as f:
            f.write(image_bytes)
        print(f"[-] Saved {image_filename}")
