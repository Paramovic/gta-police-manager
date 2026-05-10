const mongoose = require('mongoose');
const Division = require('../models/Division');
require('dotenv').config();

// ── Divisiones troncales (mutuamente excluyentes) ───────────────────────────
// Un agente solo puede pertenecer a UNA de estas dos.
// ── Divisiones adicionales ──────────────────────────────────────────────────
// Se pueden combinar libremente entre sí y con ninguna/una troncal.

const divisions = [
  // ── Troncales ─────────────────────────────────────────────────────────────
  {
    name: 'Detective Bureau',
    acronym: 'DB',
    description: 'División de detectives encargada de la investigación criminal.',
    troncal: true,
  },
  {
    name: 'Metropolitan Division',
    acronym: 'METRO',
    description: 'División metropolitana de operaciones tácticas en zonas urbanas.',
    troncal: true,
  },

  // ── Adicionales ───────────────────────────────────────────────────────────
  {
    name: 'Recruitment and Training Division',
    acronym: 'RTD',
    description: 'Gestión del reclutamiento y la formación de nuevos agentes.',
    troncal: false,
  },
  {
    name: 'Air Support Division',
    acronym: 'ASD',
    description: 'Unidad aérea de apoyo y vigilancia mediante helicópteros.',
    troncal: false,
  },
  {
    name: 'San Andreas Highway Patrol',
    acronym: 'SAHP',
    description: 'Patrulla y control de la seguridad en las carreteras del estado.',
    troncal: false,
  },
  {
    name: 'Port Police Division',
    acronym: 'PPD',
    description: 'Seguridad y vigilancia en el puerto y zonas costeras.',
    troncal: false,
  },
  {
    name: 'San Andreas State Prison Authority',
    acronym: 'SASPA',
    description: 'Autoridad penitenciaria del estado de San Andreas.',
    troncal: false,
  },
  {
    name: 'Psychology Division',
    acronym: 'PD',
    description: 'Apoyo psicológico y evaluación de agentes del departamento.',
    troncal: false,
  },
  {
    name: 'Public Relation',
    acronym: 'RRPP',
    description: 'Gestión de la imagen pública y comunicación del departamento.',
    troncal: false,
  },
  {
    name: 'K9 Unit',
    acronym: 'K9',
    description: 'Unidad canina de apoyo en operaciones e investigación.',
    troncal: false,
  },
  {
    name: 'SSD (nombre pendiente de confirmar)',
    acronym: 'SSD',
    description: 'Descripción pendiente de confirmar.',
    troncal: false,
  },
];

const seedDivisions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado\n');

    for (const data of divisions) {
      await Division.findOneAndUpdate(
        { acronym: data.acronym },
        data,
        { upsert: true, new: true }
      );
      const tipo = data.troncal ? '[TRONCAL]   ' : '[Adicional] ';
      console.log(`✓ ${tipo} ${data.acronym.padEnd(6)} – ${data.name}`);
    }

    console.log('\n── Divisiones en BD ──────────────────────────────');
    const troncales   = await Division.find({ troncal: true  }).sort({ acronym: 1 });
    const adicionales = await Division.find({ troncal: false }).sort({ acronym: 1 });

    console.log('\nTRONCALES (mutuamente excluyentes):');
    troncales.forEach(d => console.log(`  ${d.acronym.padEnd(6)} – ${d.name}`));

    console.log('\nADICIONALES (combinables libremente):');
    adicionales.forEach(d => console.log(`  ${d.acronym.padEnd(6)} – ${d.name}`));

  } catch (err) {
    console.error('Error en seed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado.');
  }
};

seedDivisions();
