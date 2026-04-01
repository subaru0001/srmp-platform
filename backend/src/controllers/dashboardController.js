const pool = require('../config/database');

const dashboardController = {
  // ============================================
  // ESTADÍSTICAS GENERALES PARA ADMIN
  // ============================================
  
  getAdminStats: async (req, res) => {
    try {
      const condominioId = req.condominioScope;

      // Total de tickets por estado
      const ticketsPorEstado = await pool.query(
        `SELECT estado, COUNT(*) as cantidad
         FROM tickets
         WHERE condominio_id = $1 AND estado != 'eliminado'
         GROUP BY estado`,
        [condominioId]
      );

      // Total de tickets por categoría
      const ticketsPorCategoria = await pool.query(
        `SELECT categoria, COUNT(*) as cantidad
         FROM tickets
         WHERE condominio_id = $1 AND estado != 'eliminado'
         GROUP BY categoria`,
        [condominioId]
      );

      // Total de tickets por prioridad
      const ticketsPorPrioridad = await pool.query(
        `SELECT prioridad, COUNT(*) as cantidad
         FROM tickets
         WHERE condominio_id = $1 AND estado != 'eliminado'
         GROUP BY prioridad`,
        [condominioId]
      );

      // Tickets creados en los últimos 7 días (para gráfico)
      const ticketsUltimos7Dias = await pool.query(
        `SELECT 
           DATE(fecha_creacion) as fecha,
           COUNT(*) as cantidad
         FROM tickets
         WHERE condominio_id = $1 
           AND fecha_creacion >= CURRENT_DATE - INTERVAL '7 days'
         GROUP BY DATE(fecha_creacion)
         ORDER BY fecha ASC`,
        [condominioId]
      );

      // Total de residentes
      const totalResidentes = await pool.query(
        `SELECT COUNT(*) as total
         FROM residentes r
         JOIN unidades u ON r.unidad_id = u.id
         WHERE u.condominio_id = $1`,
        [condominioId]
      );

      // Total de unidades
      const totalUnidades = await pool.query(
        `SELECT COUNT(*) as total
         FROM unidades
         WHERE condominio_id = $1`,
        [condominioId]
      );

      // Tickets sin asignar
      const ticketsSinAsignar = await pool.query(
        `SELECT COUNT(*) as total
         FROM tickets
         WHERE condominio_id = $1 
           AND asignado_a IS NULL 
           AND estado != 'eliminado'`,
        [condominioId]
      );

      // Tickets resueltos este mes
      const ticketsResueltosMes = await pool.query(
        `SELECT COUNT(*) as total
         FROM tickets
         WHERE condominio_id = $1 
           AND estado = 'resuelto'
           AND fecha_resolucion >= DATE_TRUNC('month', CURRENT_DATE)`,
        [condominioId]
      );

      // Tiempo promedio de resolución (en días)
      const tiempoPromedioResolucion = await pool.query(
        `SELECT 
           ROUND(AVG(EXTRACT(EPOCH FROM (fecha_resolucion - fecha_creacion)) / 86400), 2) as promedio_dias
         FROM tickets
         WHERE condominio_id = $1 
           AND estado = 'resuelto'
           AND fecha_resolucion IS NOT NULL`,
        [condominioId]
      );

      res.json({
        message: '✅ Estadísticas de admin obtenidas',
        success: true,
        data: {
          kpis: {
            totalTickets: ticketsPorEstado.rows.reduce((sum, row) => sum + parseInt(row.cantidad), 0),
            totalResidentes: parseInt(totalResidentes.rows[0].total),
            totalUnidades: parseInt(totalUnidades.rows[0].total),
            ticketsSinAsignar: parseInt(ticketsSinAsignar.rows[0].total),
            ticketsResueltosMes: parseInt(ticketsResueltosMes.rows[0].total),
            tiempoPromedioResolucion: parseFloat(tiempoPromedioResolucion.rows[0].promedio_dias) || 0
          },
          ticketsPorEstado: ticketsPorEstado.rows.map(row => ({
            estado: row.estado,
            cantidad: parseInt(row.cantidad)
          })),
          ticketsPorCategoria: ticketsPorCategoria.rows.map(row => ({
            categoria: row.categoria,
            cantidad: parseInt(row.cantidad)
          })),
          ticketsPorPrioridad: ticketsPorPrioridad.rows.map(row => ({
            prioridad: row.prioridad,
            cantidad: parseInt(row.cantidad)
          })),
          ticketsUltimos7Dias: ticketsUltimos7Dias.rows.map(row => ({
            fecha: row.fecha,
            cantidad: parseInt(row.cantidad)
          }))
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas de admin:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // ============================================
  // ESTADÍSTICAS PARA RESIDENTE
  // ============================================
  
  getResidentStats: async (req, res) => {
    try {
      const usuarioId = req.user.userId;

      // Obtener residente_id del usuario
      const residenteData = await pool.query(
        `SELECT r.id, r.unidad_id, u.condominio_id
         FROM residentes r
         JOIN unidades u ON r.unidad_id = u.id
         WHERE r.usuario_id = $1`,
        [usuarioId]
      );

      if (residenteData.rows.length === 0) {
        return res.status(400).json({
          message: '❌ No tienes una unidad asociada',
          success: false
        });
      }

      const residenteId = residenteData.rows[0].id;

      // Total de tickets del residente
      const totalTickets = await pool.query(
        `SELECT COUNT(*) as total
         FROM tickets
         WHERE residente_id = $1 AND estado != 'eliminado'`,
        [residenteId]
      );

      // Tickets por estado
      const ticketsPorEstado = await pool.query(
        `SELECT estado, COUNT(*) as cantidad
         FROM tickets
         WHERE residente_id = $1 AND estado != 'eliminado'
         GROUP BY estado`,
        [residenteId]
      );

      // Tickets abiertos
      const ticketsAbiertos = await pool.query(
        `SELECT COUNT(*) as total
         FROM tickets
         WHERE residente_id = $1 AND estado = 'abierto'`,
        [residenteId]
      );

      // Tickets en progreso
      const ticketsEnProgreso = await pool.query(
        `SELECT COUNT(*) as total
         FROM tickets
         WHERE residente_id = $1 AND estado = 'en_progreso'`,
        [residenteId]
      );

      // Tickets resueltos
      const ticketsResueltos = await pool.query(
        `SELECT COUNT(*) as total
         FROM tickets
         WHERE residente_id = $1 AND estado = 'resuelto'`,
        [residenteId]
      );

      // Notificaciones no leídas
      const notificacionesNoLeidas = await pool.query(
        `SELECT COUNT(*) as total
         FROM notificaciones
         WHERE usuario_id = $1 AND leido = FALSE`,
        [usuarioId]
      );

      // Últimos 5 tickets
      const ultimosTickets = await pool.query(
        `SELECT id, titulo, estado, prioridad, fecha_creacion
         FROM tickets
         WHERE residente_id = $1 AND estado != 'eliminado'
         ORDER BY fecha_creacion DESC
         LIMIT 5`,
        [residenteId]
      );

      res.json({
        message: '✅ Estadísticas de residente obtenidas',
        success: true,
        data: {
          kpis: {
            totalTickets: parseInt(totalTickets.rows[0].total),
            ticketsAbiertos: parseInt(ticketsAbiertos.rows[0].total),
            ticketsEnProgreso: parseInt(ticketsEnProgreso.rows[0].total),
            ticketsResueltos: parseInt(ticketsResueltos.rows[0].total),
            notificacionesNoLeidas: parseInt(notificacionesNoLeidas.rows[0].total)
          },
          ticketsPorEstado: ticketsPorEstado.rows.map(row => ({
            estado: row.estado,
            cantidad: parseInt(row.cantidad)
          })),
          ultimosTickets: ultimosTickets.rows
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas de residente:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // ============================================
  // ESTADÍSTICAS POR PERÍODO
  // ============================================
  
  getStatsByPeriod: async (req, res) => {
    try {
      const condominioId = req.condominioScope;
      const { period = 'month' } = req.query; // day, week, month, year

      let interval;
      switch (period) {
        case 'day':
          interval = '1 day';
          break;
        case 'week':
          interval = '7 days';
          break;
        case 'month':
          interval = '30 days';
          break;
        case 'year':
          interval = '1 year';
          break;
        default:
          interval = '30 days';
      }

      const stats = await pool.query(
        `SELECT 
           DATE(fecha_creacion) as fecha,
           COUNT(*) as total_tickets,
           COUNT(*) FILTER (WHERE estado = 'abierto') as abiertos,
           COUNT(*) FILTER (WHERE estado = 'en_progreso') as en_progreso,
           COUNT(*) FILTER (WHERE estado = 'resuelto') as resueltos,
           COUNT(*) FILTER (WHERE prioridad = 'alta') as alta_prioridad,
           COUNT(*) FILTER (WHERE prioridad = 'media') as media_prioridad,
           COUNT(*) FILTER (WHERE prioridad = 'baja') as baja_prioridad
         FROM tickets
         WHERE condominio_id = $1 
           AND fecha_creacion >= CURRENT_DATE - INTERVAL '${interval}'
         GROUP BY DATE(fecha_creacion)
         ORDER BY fecha ASC`,
        [condominioId]
      );

      res.json({
        message: '✅ Estadísticas por período obtenidas',
        success: true,
        data: {
          period,
          interval,
          stats: stats.rows.map(row => ({
            fecha: row.fecha,
            totalTickets: parseInt(row.total_tickets),
            abiertos: parseInt(row.abiertos),
            enProgreso: parseInt(row.en_progreso),
            resueltos: parseInt(row.resueltos),
            altaPrioridad: parseInt(row.alta_prioridad),
            mediaPrioridad: parseInt(row.media_prioridad),
            bajaPrioridad: parseInt(row.baja_prioridad)
          }))
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas por período:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  },

  // ============================================
  // ESTADÍSTICAS DE PERSONAL
  // ============================================
  
  getPersonalStats: async (req, res) => {
    try {
      const condominioId = req.condominioScope;

      const personalStats = await pool.query(
        `SELECT 
           u.id,
           u.nombres || ' ' || u.apellidos as nombre_completo,
           COUNT(t.id) as tickets_asignados,
           COUNT(t.id) FILTER (WHERE t.estado = 'resuelto') as tickets_resueltos,
           ROUND(
             AVG(EXTRACT(EPOCH FROM (t.fecha_resolucion - t.fecha_creacion)) / 86400) 
             FILTER (WHERE t.estado = 'resuelto'), 2
           ) as promedio_dias_resolucion
         FROM usuarios u
         LEFT JOIN tickets t ON u.id = t.asignado_a
         WHERE u.rol IN ('admin', 'personal')
           AND (u.condominio_id = $1 OR u.condominio_id IS NULL)
         GROUP BY u.id, u.nombres, u.apellidos
         ORDER BY tickets_resueltos DESC`,
        [condominioId]
      );

      res.json({
        message: '✅ Estadísticas de personal obtenidas',
        success: true,
        data: {
          personal: personalStats.rows.map(row => ({
            id: row.id,
            nombre: row.nombre_completo,
            ticketsAsignados: parseInt(row.tickets_asignados),
            ticketsResueltos: parseInt(row.tickets_resueltos),
            promedioDiasResolucion: parseFloat(row.promedio_dias_resolucion) || 0
          }))
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas de personal:', error);
      res.status(500).json({
        message: '❌ Error interno del servidor',
        error: error.message,
        success: false
      });
    }
  }
};

module.exports = dashboardController;