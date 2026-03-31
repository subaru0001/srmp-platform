const nodemailer = require('nodemailer');
const pool = require('../config/database');

// Configurar transporter de email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const notificationService = {
  // ============================================
  // NOTIFICACIONES EN APP (guardar en BD)
  // ============================================
  
  async createInAppNotification(notificationData) {
    const { 
      usuario_id, 
      titulo, 
      mensaje, 
      tipo = 'info', 
      canal = 'app',
      ticket_id = null,
      condominio_id = null,
      metadata = null 
    } = notificationData;

    const result = await pool.query(
      `INSERT INTO notificaciones 
       (usuario_id, titulo, mensaje, tipo, canal, ticket_id, condominio_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [usuario_id, titulo, mensaje, tipo, canal, ticket_id, condominio_id, metadata ? JSON.stringify(metadata) : null]
    );

    return result.rows[0];
  },

  async createBulkNotification(notificationData) {
    const { 
      usuario_ids, 
      titulo, 
      mensaje, 
      tipo = 'info', 
      canal = 'app',
      condominio_id = null,
      metadata = null 
    } = notificationData;

    const notifications = [];

    for (const usuario_id of usuario_ids) {
      const result = await pool.query(
        `INSERT INTO notificaciones 
         (usuario_id, titulo, mensaje, tipo, canal, condominio_id, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [usuario_id, titulo, mensaje, tipo, canal, condominio_id, metadata ? JSON.stringify(metadata) : null]
      );
      notifications.push(result.rows[0]);
    }

    return notifications;
  },

  // ============================================
  // NOTIFICACIONES POR EMAIL
  // ============================================
  
  async sendEmail(emailData) {
    const { to, subject, html, text } = emailData;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('📧 [EMAIL SIMULADO]');
      console.log(`   Para: ${to}`);
      console.log(`   Asunto: ${subject}`);
      return { success: true, simulated: true };
    }

    try {
      const transporter = createTransporter();

      await transporter.sendMail({
        from: `"SRMP Platform" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
      });

      console.log(`✅ Email enviado a: ${to}`);
      return { success: true, simulated: false };
    } catch (error) {
      console.error('❌ Error al enviar email:', error.message);
      return { success: false, error: error.message };
    }
  },

  async notifyByEmail(userData, notificationData) {
    const { email, nombres } = userData;
    const { titulo, mensaje, tipo } = notificationData;

    await this.createInAppNotification({
      usuario_id: userData.id,
      titulo,
      mensaje,
      tipo,
      canal: 'email'
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">${titulo}</h2>
        <p>Hola ${nombres},</p>
        <p>${mensaje}</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">SRMP Platform</p>
      </div>
    `;

    return await this.sendEmail({
      to: email,
      subject: `[SRMP] ${titulo}`,
      html,
      text: `${titulo}\n\nHola ${nombres},\n\n${mensaje}`
    });
  },

  // ============================================
  // NOTIFICACIONES PREDEFINIDAS
  // ============================================
  
  async notifyTicketCreated(ticket, residente) {
    await this.notifyByEmail(residente, {
      titulo: '🎫 Ticket Creado',
      mensaje: `Tu ticket #${ticket.id} "${ticket.titulo}" ha sido registrado. Estado: ${ticket.estado}`,
      tipo: 'ticket'
    });

    const admins = await pool.query(
      `SELECT u.* FROM usuarios u
       WHERE u.rol = 'admin' 
       AND (u.condominio_id = $1 OR u.condominio_id IS NULL)`,
      [ticket.condominio_id]
    );

    for (const admin of admins.rows) {
      await this.createInAppNotification({
        usuario_id: admin.id,
        titulo: '🎫 Nuevo Ticket',
        mensaje: `El residente ${residente.nombres} ha creado el ticket #${ticket.id}: ${ticket.titulo}`,
        tipo: 'ticket',
        ticket_id: ticket.id,
        condominio_id: ticket.condominio_id
      });
    }
  },

  async notifyTicketStatusChanged(ticket, oldStatus, newStatus, residente) {
    await this.notifyByEmail(residente, {
      titulo: '📋 Estado de Ticket Actualizado',
      mensaje: `Tu ticket #${ticket.id} cambió de estado: ${oldStatus} → ${newStatus}`,
      tipo: 'ticket'
    });
  },

  async notifyTicketAssigned(ticket, personal) {
    await this.createInAppNotification({
      usuario_id: personal.id,
      titulo: '🔧 Ticket Asignado',
      mensaje: `Se te ha asignado el ticket #${ticket.id}: ${ticket.titulo}`,
      tipo: 'ticket',
      ticket_id: ticket.id,
      condominio_id: ticket.condominio_id
    });
  },

  async notifyEmergency(condominioId, titulo, mensaje) {
    const residentes = await pool.query(
      `SELECT u.* FROM usuarios u
       JOIN residentes r ON r.usuario_id = u.id
       JOIN unidades un ON r.unidad_id = un.id
       WHERE un.condominio_id = $1`,
      [condominioId]
    );

    const usuario_ids = residentes.rows.map(r => r.id);

    await this.createBulkNotification({
      usuario_ids,
      titulo: `🚨 ${titulo}`,
      mensaje,
      tipo: 'emergencia',
      condominio_id: condominioId,
      metadata: { urgente: true }
    });

    for (const residente of residentes.rows) {
      await this.sendEmail({
        to: residente.email,
        subject: `🚨 EMERGENCIA: ${titulo}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #dc2626; padding: 20px;">
            <h2 style="color: #dc2626;">🚨 ${titulo}</h2>
            <p>${mensaje}</p>
            <p style="color: #dc2626; font-weight: bold;">Por favor, toma las medidas necesarias.</p>
          </div>
        `,
        text: `🚨 ${titulo}\n\n${mensaje}`
      });
    }

    return { success: true, count: usuario_ids.length };
  },

  // ============================================
  // MARCAR COMO LEÍDO
  // ============================================
  
  async markAsRead(notificationId, usuarioId) {
    const result = await pool.query(
      `UPDATE notificaciones 
       SET leido = TRUE, fecha_leido = CURRENT_TIMESTAMP
       WHERE id = $1 AND usuario_id = $2
       RETURNING *`,
      [notificationId, usuarioId]
    );

    return result.rows[0];
  },

  async markAllAsRead(usuarioId) {
    const result = await pool.query(
      `UPDATE notificaciones 
       SET leido = TRUE, fecha_leido = CURRENT_TIMESTAMP
       WHERE usuario_id = $1 AND leido = FALSE
       RETURNING *`,
      [usuarioId]
    );

    return result.rows;
  },

  async getUnreadCount(usuarioId) {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM notificaciones 
       WHERE usuario_id = $1 AND leido = FALSE`,
      [usuarioId]
    );

    return parseInt(result.rows[0].count);
  }
};

module.exports = notificationService;