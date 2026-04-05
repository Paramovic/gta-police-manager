const mongoose = require('mongoose');
const Rank = require('../models/Rank');
require('dotenv').config();
 
// Los rangos equivalentes entre LSPD y BCSO comparten el mismo `level`
// para que la lógica de permisos sea uniforme (level >= 5 = puede editar rangos, etc.)
const ranks = [
  // ── LSPD ──────────────────────────────────────────────
  {
    name: 'Oficial I',
    level: 1,
    jurisdiction: 'LSPD',
    canEditRanks: false,
    canManageDivisions: false,
    canApproveJurisdictionChange: false,
    description: 'Rango de entrada en la LSPD',
  },
  {
    name: 'Oficial II',
    level: 2,
    jurisdiction: 'LSPD',
    canEditRanks: false,
    canManageDivisions: false,
    canApproveJurisdictionChange: false,
    description: '',
  },
  {
    name: 'Oficial III',
    level: 3,
    jurisdiction: 'LSPD',
    canEditRanks: false,
    canManageDivisions: false,
    canApproveJurisdictionChange: false,
    description: '',
  },
  {
    name: 'Oficial III+',
    level: 4,
    jurisdiction: 'LSPD',
    canEditRanks: false,
    canManageDivisions: false,
    canApproveJurisdictionChange: false,
    description: '',
  },
  {
    name: 'Sargento',
    level: 5,
    jurisdiction: 'LSPD',
    canEditRanks: true,
    canManageDivisions: false,
    canApproveJurisdictionChange: false,
    description: 'Mando intermedio LSPD',
  },
  {
    name: 'Sargento II',
    level: 6,
    jurisdiction: 'LSPD',
    canEditRanks: true,
    canManageDivisions: false,
    canApproveJurisdictionChange: false,
    description: '',
  },
  {
    name: 'Teniente',
    level: 7,
    jurisdiction: 'LSPD',
    canEditRanks: true,
    canManageDivisions: true,
    canApproveJurisdictionChange: false,
    description: 'Oficial senior LSPD',
  },
  {
    name: 'Teniente II',
    level: 8,
    jurisdiction: 'LSPD',
    canEditRanks: true,
    canManageDivisions: true,
    canApproveJurisdictionChange: false,
    description: '',
  },
  {
    name: 'Comandante',
    level: 9,
    jurisdiction: 'LSPD',
    canEditRanks: true,
    canManageDivisions: true,
    canApproveJurisdictionChange: true,
    description: 'Alto mando de la LSPD',
  },
 
  // ── BCSO ──────────────────────────────────────────────
  {
    name: 'Deputy Sheriff',
    level: 1,
    jurisdiction: 'BCSO',
    canEditRanks: false,
    canManageDivisions: false,
    canApproveJurisdictionChange: false,
    description: 'Rango de entrada en el BCSO',
  },
  {
    name: 'Deputy Sheriff Bonus I',
    level: 2,
    jurisdiction: 'BCSO',
    canEditRanks: false,
    canManageDivisions: false,
    canApproveJurisdictionChange: false,
    description: '',
  },
  {
    name: 'Deputy Sheriff Bonus II',
    level: 3,
    jurisdiction: 'BCSO',
    canEditRanks: false,
    canManageDivisions: false,
    canApproveJurisdictionChange: false,
    description: '',
  },
  {
    name: 'Deputy Sheriff Bonus III',
    level: 4,
    jurisdiction: 'BCSO',
    canEditRanks: false,
    canManageDivisions: false,
    canApproveJurisdictionChange: false,
    description: '',
  },
  {
    name: 'Sargento',
    level: 5,
    jurisdiction: 'BCSO',
    canEditRanks: true,
    canManageDivisions: false,
    canApproveJurisdictionChange: false,
    description: 'Mando intermedio BCSO',
  },
  {
    name: 'Sargento II',
    level: 6,
    jurisdiction: 'BCSO',
    canEditRanks: true,
    canManageDivisions: false,
    canApproveJurisdictionChange: false,
    description: '',
  },
  {
    name: 'Teniente',
    level: 7,
    jurisdiction: 'BCSO',
    canEditRanks: true,
    canManageDivisions: true,
    canApproveJurisdictionChange: false,
    description: 'Oficial senior BCSO',
  },
  {
    name: 'Teniente II',
    level: 8,
    jurisdiction: 'BCSO',
    canEditRanks: true,
    canManageDivisions: true,
    canApproveJurisdictionChange: false,
    description: '',
  },
  {
    name: 'Comandante',
    level: 9,
    jurisdiction: 'BCSO',
    canEditRanks: true,
    canManageDivisions: true,
    canApproveJurisdictionChange: true,
    description: 'Alto mando del BCSO',
  },
 
  // ── SAPD (global) ─────────────────────────────────────
  {
    name: 'Jefa SAPD',
    level: 10,
    jurisdiction: 'SAPD',
    canEditRanks: true,
    canManageDivisions: true,
    canApproveJurisdictionChange: true,
    description: 'Máxima autoridad de la SAPD',
  },
];
 
const seedRanks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado\n');
 
    for (const rankData of ranks) {
      await Rank.findOneAndUpdate(
        { name: rankData.name, jurisdiction: rankData.jurisdiction },
        rankData,
        { upsert: true, new: true }
      );
      console.log(`✓ [${rankData.jurisdiction}] ${rankData.name} (level ${rankData.level})`);
    }
 
    console.log('\n── Rangos en BD ──────────────────────────────');
    for (const j of ['LSPD', 'BCSO', 'SAPD']) {
      const jRanks = await Rank.find({ jurisdiction: j }).sort({ level: 1 });
      console.log(`\n${j}:`);
      jRanks.forEach(r =>
        console.log(
          `  [${r.level}] ${r.name.padEnd(24)} canEditRanks: ${r.canEditRanks} | canApproveJurisdictionChange: ${r.canApproveJurisdictionChange}`
        )
      );
    }
  } catch (err) {
    console.error('Error en seed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado.');
  }
};
 
seedRanks();