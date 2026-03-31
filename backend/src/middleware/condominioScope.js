/**
 * Middleware para filtrar consultas por condominio
 * 
 * - Super Admin (condominio_id = NULL): Ve TODOS los condominios
 * - Admin Local (condominio_id = X): Solo ve SU condominio
 * - Residentes/Vigilantes: Solo ven datos de SU condominio
 */

// Middleware principal: agrega el scope al request
const scopeByCondominio = (req, res, next) => {
  try {
    // req.user se establece en verifyToken middleware
    if (!req.user) {
      return res.status(401).json({
        message: '❌ No autenticado',
        success: false
      });
    }

    // Si condominioId es null/undefined → Super Admin (sin filtro)
    if (!req.user.condominioId) {
      req.condominioScope = null;
      req.isSuperAdmin = true;
    } else {
      // Admin local o usuario con condominio asignado
      req.condominioScope = req.user.condominioId;
      req.isSuperAdmin = false;
    }

    next();
  } catch (error) {
    console.error('Error en scopeByCondominio:', error);
    res.status(500).json({
      message: '❌ Error interno del servidor',
      error: error.message,
      success: false
    });
  }
};

/**
 * Helper para aplicar el filtro de condominio a consultas SQL
 * 
 * @param {string} baseQuery - La consulta SQL base
 * @param {Array} params - Los parámetros actuales de la consulta
 * @param {number|null} scope - El ID del condominio para filtrar (null = sin filtro)
 * @param {string} columnName - Nombre de la columna a filtrar (default: 'condominio_id')
 * @param {string} tableAlias - Alias de tabla para la columna (ej: 't.', 'c.', '')
 * @returns {Object} - { query: string, params: Array }
 */
const applyCondominioScope = (baseQuery, params, scope, columnName = 'condominio_id', tableAlias = '') => {
  // Si no hay scope (Super Admin), retornar la query original
  if (!scope) {
    return { query: baseQuery, params };
  }

  // Calcular el índice del siguiente parámetro ($1, $2, $3, ...)
  const nextParamIndex = params.length + 1;

  // Construir la referencia a la columna con alias si se proporciona
  const columnRef = tableAlias ? `${tableAlias}${columnName}` : columnName;
  
  // Agregar el filtro AND [alias.]condominio_id = $X
  const filteredQuery = `${baseQuery} AND ${columnRef} = $${nextParamIndex}`;
  const filteredParams = [...params, scope];

  return {
    query: filteredQuery,
    params: filteredParams
  };
};

/**
 * Middleware para verificar que el usuario pertenece al condominio solicitado
 * (Útil para rutas como GET /api/condos/:id donde se pasa un ID específico)
 */
const checkCondominioAccess = (req, res, next) => {
  try {
    // Si es Super Admin, permite acceso a cualquier condominio
    if (req.isSuperAdmin) {
      return next();
    }

    // Obtener el condominio_id de la URL o del body
    const requestedCondoId = req.params.condoId || req.params.id || req.body.condominio_id;

    // Si no se especifica un condominio, usar el del usuario
    if (!requestedCondoId) {
      req.condominioScope = req.user.condominioId;
      return next();
    }

    // Verificar que el usuario tenga acceso al condominio solicitado
    if (parseInt(requestedCondoId) !== req.user.condominioId) {
      return res.status(403).json({
        message: '❌ Acceso denegado: No tienes permiso para este condominio',
        success: false
      });
    }

    next();
  } catch (error) {
    console.error('Error en checkCondominioAccess:', error);
    res.status(500).json({
      message: '❌ Error interno del servidor',
      error: error.message,
      success: false
    });
  }
};

module.exports = { 
  scopeByCondominio, 
  applyCondominioScope,
  checkCondominioAccess 
};