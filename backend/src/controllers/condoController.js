const Condo = require('../models/Condo');

const condoController = {
  // LISTAR CONDOMINIOS
  list: async (req, res) => {
    try {
      const condos = await Condo.findAll();
      
      res.json({
        message: '✅ Condominios obtenidos',
        success: true,
        data: {                    // ← AGREGA ESTO
          count: condos.length,
          condos
        }
      });
    } catch (error) {
      console.error('Error al listar condominios:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // OBTENER CONDOMINIO POR ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const condo = await Condo.findById(id);
      
      if (!condo) {
        return res.status(404).json({
          message: '❌ Condominio no encontrado',
          success: false
        });
      }
      
      res.json({
        message: '✅ Condominio obtenido',
        success: true,
        data: { condo }            // ← AGREGA ESTO
      });
    } catch (error) {
      console.error('Error al obtener condominio:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // CREAR CONDOMINIO (Solo admin)
  create: async (req, res) => {
    try {
      const { nombre, direccion, ciudad, pais, telefono, email } = req.body;
      
      if (!nombre || !direccion) {
        return res.status(400).json({
          message: '❌ Nombre y dirección son requeridos',
          success: false
        });
      }
      
      const newCondo = await Condo.create({
        nombre,
        direccion,
        ciudad: ciudad || null,
        pais: pais || 'Perú',
        telefono: telefono || null,
        email: email || null
      });
      
      res.status(201).json({
        message: '✅ Condominio creado exitosamente',
        success: true,
        data: { condo: newCondo }  // ← AGREGA ESTO
      });
    } catch (error) {
      console.error('Error al crear condominio:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // ACTUALIZAR CONDOMINIO (Solo admin)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedCondo = await Condo.update(id, updateData);
      
      if (!updatedCondo) {
        return res.status(404).json({
          message: '❌ Condominio no encontrado',
          success: false
        });
      }
      
      res.json({
        message: '✅ Condominio actualizado',
        success: true,
        data: { condo: updatedCondo }  // ← AGREGA ESTO
      });
    } catch (error) {
      console.error('Error al actualizar condominio:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // ELIMINAR CONDOMINIO (Solo admin - soft delete)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      
      const deletedCondo = await Condo.delete(id);
      
      if (!deletedCondo) {
        return res.status(404).json({
          message: '❌ Condominio no encontrado',
          success: false
        });
      }
      
      res.json({
        message: '✅ Condominio eliminado (inactivado)',
        success: true,
        data: { condo: deletedCondo }  // ← AGREGA ESTO
      });
    } catch (error) {
      console.error('Error al eliminar condominio:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  }
};

module.exports = condoController;