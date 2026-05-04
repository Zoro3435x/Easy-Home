from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.core.config import settings, BASE_DIR
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.core.config import settings, BASE_DIR
from app.api.v1.endpoints import example, auth, categories, solicitud, perfil_proveedor, perfil_usuario, publicacion

app = FastAPI(
    title="EasyHome Backend API",
    description="API for managing EasyHome smart home devices and services.",
    version="1.0.0"
)

# Servir archivos subidos localmente (simula el comportamiento de S3)
app.mount(
    settings.LOCAL_UPLOAD_URL_PREFIX,
    StaticFiles(directory=str(BASE_DIR / settings.LOCAL_UPLOAD_DIR)),
    name="uploads",
)

# Configurar CORS para permitir peticiones desde el frontend.
# IMPORTANTE: allow_credentials=True es incompatible con allow_headers=["*"] según la
# especificación CORS — el navegador elimina los headers custom en ese caso.
# Se listan explícitamente todos los headers que usa el frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://d84l1y8p4kdic.cloudfront.net"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "X-User-Email",
        "X-User-Roles",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
)

app.include_router(example.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])
app.include_router(publicacion.router, prefix="/api/v1", tags=["Publicaciones"])
app.include_router(solicitud.router, prefix="/api/v1") 
app.include_router(perfil_proveedor.router, prefix="/api/v1")
app.include_router(perfil_usuario.router, prefix="/api/v1")

# Montar archivos estáticos para fotos (subidos localmente)
uploads_path = Path(BASE_DIR) / settings.LOCAL_UPLOAD_DIR
uploads_path.mkdir(parents=True, exist_ok=True)
app.mount(settings.LOCAL_UPLOAD_URL_PREFIX, StaticFiles(directory=str(uploads_path)), name="uploads")



@app.get("/")
def root():
    return {"message": "Welcome to the EasyHome Backend API!"}