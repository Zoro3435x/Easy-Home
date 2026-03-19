
import React, { useState } from 'react';
import '../../assets/styles/Filters.css';

import api from '../../config/api';
const API_BASE_URL = api.BASE_URL;

// Si usas CSS Modules, importarías: import styles from './Filtros.module.css';

export default function Filtros() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);

    // Datos de ejemplo para las secciones
    const categorias = [
        { name: "Carpintería", count: 10 },
        { name: "Electricidad", count: 12 },
        { name: "Plomería", count: 8 },
        { name: "Limpieza", count: 18 },
        { name: "Pintura", count: 14 },
        { name: "Construcción", count: 21 },
    ];

    const busquedaPor = [
        { name: "Suscriptores" },
        { name: "Mejor calificados" },
        { name: "Más recientes" },
    ];

    // Manejador genérico para checkboxes
    const handleCheckboxChange = (e, setter, currentList) => {
        const { value, checked } = e.target;
        if (checked) {
            setter([...currentList, value]);
        } else {
            setter(currentList.filter(item => item !== value));
        }
    };

    const handleApplyFilters = () => {
        // Lógica para enviar o aplicar los filtros
        console.log("Filtros aplicados. Categorías:", selectedCategories, "Filtros:", selectedFilters);
    };

    return (
        // Contenedor principal de filtros. Usaremos la clase CSS 'filtro-card'
        <div className="filtro-card">
            <h2 className="filtro-titulo-principal">Filtros</h2>

            {/* Sección de Categorías */}
            <div className="filtro-seccion">
                <h3 className="filtro-titulo-seccion">Categorías</h3>
                <div className="filtro-grupo-checkbox">
                    {categorias.map(cat => (
                        <label key={cat.name} className="filtro-item">
                            <input
                                type="checkbox"
                                name="category"
                                value={cat.name}
                                checked={selectedCategories.includes(cat.name)}
                                onChange={(e) => handleCheckboxChange(e, setSelectedCategories, selectedCategories)}
                                className="filtro-checkbox"
                            />
                            {/* El texto y el contador se muestran en la misma etiqueta */}
                            <span>{cat.name}</span>
                            <span className="filtro-contador">({cat.count})</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Separador visual si lo necesitas (no se ve en la imagen, pero puede ser útil) */}
            <hr className="filtro-separador" />

            {/* Sección de Buscar por */}
            <div className="filtro-seccion">
                <h3 className="filtro-titulo-seccion">Buscar por</h3>
                <div className="filtro-grupo-checkbox">
                    {busquedaPor.map(fil => (
                        <label key={fil.name} className="filtro-item">
                            <input
                                type="checkbox"
                                name="filter"
                                value={fil.name}
                                checked={selectedFilters.includes(fil.name)}
                                onChange={(e) => handleCheckboxChange(e, setSelectedFilters, selectedFilters)}
                                className="filtro-checkbox"
                            />
                            {fil.name}
                        </label>
                    ))}
                </div>
            </div>

            {/* Botón Aplicar */}
            <button
                onClick={handleApplyFilters}
                className="filtro-boton-aplicar"
            >
                Aplicar
            </button>
        </div>
    );
}