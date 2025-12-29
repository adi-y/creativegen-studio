from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import io
import base64
import uuid
from datetime import datetime
import os

app = FastAPI(
    title="CreativeGen Background Removal API",
    description="AI-powered background removal service for packshot images",
    version="1.0.0"
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins - change to specific domains in production for security
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def validate_image(file: UploadFile) -> None:
    """Validate uploaded image file"""
    # Check file extension
    ext = file.filename.split('.')[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    
    if size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "CreativeGen Background Removal API",
        "status": "operational",
        "version": "1.0.0"
    }

@app.post("/api/remove-background")
async def remove_background(
    file: UploadFile = File(...),
    return_format: str = "png"
):
    """
    Remove background from uploaded image
    
    Parameters:
    - file: Image file (PNG, JPG, JPEG, WEBP)
    - return_format: Output format ('png' or 'base64')
    
    Returns:
    - PNG image with transparent background or base64 encoded string
    """
    try:
        # Validate input
        validate_image(file)
        
        # Read uploaded file
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary
        if input_image.mode != 'RGB':
            input_image = input_image.convert('RGB')
        
        # Remove background using rembg
        output_image = remove(input_image)
        
        # Prepare response based on format
        if return_format == "base64":
            # Convert to base64
            buffered = io.BytesIO()
            output_image.save(buffered, format="PNG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode()
            
            return JSONResponse({
                "success": True,
                "data": {
                    "image": f"data:image/png;base64,{img_base64}",
                    "original_filename": file.filename,
                    "format": "png",
                    "size": {
                        "width": output_image.width,
                        "height": output_image.height
                    }
                },
                "timestamp": datetime.now().isoformat()
            })
        else:
            # Return as PNG file
            img_byte_arr = io.BytesIO()
            output_image.save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)
            
            return StreamingResponse(
                img_byte_arr,
                media_type="image/png",
                headers={
                    "Content-Disposition": f"attachment; filename=removed_bg_{file.filename}"
                }
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Background removal failed: {str(e)}"
        )

@app.post("/api/batch-remove-background")
async def batch_remove_background(
    files: list[UploadFile] = File(...)
):
    """
    Remove background from multiple images
    
    Parameters:
    - files: List of image files
    
    Returns:
    - JSON with base64 encoded images
    """
    if len(files) > 10:
        raise HTTPException(
            status_code=400,
            detail="Maximum 10 files allowed per batch"
        )
    
    results = []
    errors = []
    
    for idx, file in enumerate(files):
        try:
            validate_image(file)
            contents = await file.read()
            input_image = Image.open(io.BytesIO(contents))
            
            if input_image.mode != 'RGB':
                input_image = input_image.convert('RGB')
            
            output_image = remove(input_image)
            
            buffered = io.BytesIO()
            output_image.save(buffered, format="PNG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode()
            
            results.append({
                "index": idx,
                "filename": file.filename,
                "success": True,
                "image": f"data:image/png;base64,{img_base64}",
                "size": {
                    "width": output_image.width,
                    "height": output_image.height
                }
            })
        except Exception as e:
            errors.append({
                "index": idx,
                "filename": file.filename,
                "success": False,
                "error": str(e)
            })
    
    return JSONResponse({
        "success": len(errors) == 0,
        "processed": len(results),
        "failed": len(errors),
        "results": results,
        "errors": errors,
        "timestamp": datetime.now().isoformat()
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)