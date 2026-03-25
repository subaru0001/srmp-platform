const Resident = require('../models/Resident');
const Unit = require('../models/Unit');

const residentController = {
  // LISTAR RESIDENTES DE UNA UNIDAD
  listByUnit: async (req, res) => {
    try {
      const { unitId } = req.params;
      const residents = await Resident.findByUnit(unitId);
      
      res.json({
        message: '✅ Residentes obtenidos',
        success: true,
        data: {                    // ← ✅ CORREGIDO: "data:" como clave
          count: residents.length,
          residents
        }
      });
    } catch (error) {
      console.error('Error al listar residentes:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // OBTENER RESIDENTE POR ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const resident = await Resident.findById(id);
      
      if (!resident) {
        return res.status(404).json({
          message: '❌ Residente no encontrado',
          success: false
        });
      }
      
      res.json({
        message: '✅ Residente obtenido',
        success: true,
        data: { resident }         // ← ✅ CORREGIDO
      });
    } catch (error) {
      console.error('Error al obtener residente:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // CREAR RESIDENTE (Solo admin)
  create: async (req, res) => {
    try {
      const { usuario_id, unidad_id, tipo_vinculo, fecha_ingreso } = req.body;
      
      if (!usuario_id || !unidad_id) {
        return res.status(400).json({
          message: '❌ Usuario y unidad son requeridos',
          success: false
        });
      }
      
      // Verificar que la unidad existe
      const unit = await Unit.findById(unidad_id);
      if (!unit) {
        return res.status(404).json({
          message: '❌ Unidad no encontrada',
          success: false
        });
      }
      
      const newResident = await Resident.create({
        usuario_id,
        unidad_id,
        tipo_vinculo: tipo_vinculo || 'propietario',
        fecha_ingreso: fecha_ingreso || new Date()
      });
      
      res.status(201).json({
        message: '✅ Residente registrado exitosamente',
        success: true,
        data: { resident: newResident }  // ← ✅ CORREGIDO
      });
    } catch (error) {
      console.error('Error al crear residente:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // ACTUALIZAR RESIDENTE (Solo admin)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedResident = await Resident.update(id, updateData);
      
      if (!updatedResident) {
        return res.status(404).json({
          message: '❌ Residente no encontrado',
          success: false
        });
      }
      
      res.json({
        message: '✅ Residente actualizado',
        success: true,
        data: { resident: updatedResident }  // ← ✅ CORREGIDO
      });
    } catch (error) {
      console.error('Error al actualizar residente:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  }
};

module.exports = residentController;