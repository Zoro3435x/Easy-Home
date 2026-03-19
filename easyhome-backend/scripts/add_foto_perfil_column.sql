-- Script para agregar la columna foto_perfil a la tabla usuario
-- Ejecutar este script en tu base de datos PostgreSQL

-- Agregar la columna foto_perfil a la tabla usuario
ALTER TABLE usuario 
ADD COLUMN IF NOT EXISTS foto_perfil VARCHAR(500);

-- Comentario para documentar la columna
COMMENT ON COLUMN usuario.foto_perfil IS 'S3 key de la foto de perfil del usuario';

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'usuario' AND column_name = 'foto_perfil';
