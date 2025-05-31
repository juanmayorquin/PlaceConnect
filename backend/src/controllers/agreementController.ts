// backend/src/controllers/agreementController.ts
import { Request, Response } from "express";
import Agreement from "../models/Agreement";
import { Types } from "mongoose";
import Property from "../models/Property";
import Notification from "../models/Notification";

// Registrar HU-016
export const createAgreement = async (req: Request, res: Response) => {
  const ownerId = (req as any).userId;
  const { propertyId, tenantId, startDate, endDate, contractUrl } = req.body;
  if (new Date(endDate) < new Date(startDate)) {
    res.status(400).json({ msg: "endDate debe ser posterior a startDate" });
    return;
  }
  const agr = await Agreement.create({
    propertyId,
    ownerId,
    tenantId,
    startDate,
    endDate,
    contractUrl,
  });
  res.status(201).json(agr);
};

// Modificar HU-017
export const updateAgreement = async (req: Request, res: Response) => {
  const ownerId = (req as any).userId;
  const { id } = req.params;
  const update = req.body;
  const agr = await Agreement.findOneAndUpdate(
    { _id: id, ownerId, status: "active" },
    update,
    { new: true }
  );
  if (!agr) {
    res.status(404).json({ msg: "Acuerdo no encontrado o inmodificable" });
    return;
  }
  res.json(agr);
};

// Cancelar HU-018
export const cancelAgreement = async (req: Request, res: Response) => {
  const ownerId = (req as any).userId;
  const { id } = req.params;
  const { reasonCancel } = req.body;
  if (!reasonCancel || reasonCancel.length < 20) {
    res.status(400).json({ msg: "reasonCancel mínimo 20 caracteres" });
    return;
  }
  const agr = await Agreement.findOneAndUpdate(
    { _id: id, ownerId, status: "active" },
    { status: "cancelled", reasonCancel },
    { new: true }
  );
  if (!agr) {
    res.status(404).json({ msg: "Acuerdo no encontrado o no activo" });
    return;
  }
  res.json(agr);
};

// (1) Solicitar un contrato → crea el acuerdo en estado "pending" y notifica al inquilino
export const requestAgreement = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).userId;
    const { propertyId, tenantId, startDate, endDate, contractUrl } = req.body;

    // Validar fechas
    if (new Date(endDate) < new Date(startDate)) {
      res.status(400).json({ msg: "endDate debe ser posterior a startDate" });
      return;
    }

    // Verificar que la propiedad exista y pertenezca al owner
    const prop = await Property.findOne({ _id: propertyId, owner: ownerId });
    if (!prop) {
      res
        .status(404)
        .json({ msg: "Propiedad no encontrada o no eres su dueño" });
      return;
    }

    // Crear el acuerdo en estado "pending"
    const agr = await Agreement.create({
      propertyId: new Types.ObjectId(propertyId),
      ownerId: new Types.ObjectId(ownerId),
      tenantId: new Types.ObjectId(tenantId),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      contractUrl,
      // status: default "pending"
    });

    // Crear notificación para el inquilino
    await Notification.create({
      userId: new Types.ObjectId(tenantId),
      agreementId: agr._id,
      type: "agreement-request",
      read: false,
    });

    res.status(201).json(agr);
    return;
  } catch (err) {
    console.error("Error en requestAgreement:", err);
    res.status(500).json({ msg: "Error al solicitar contrato" });
    return;
  }
};

// (2) Aceptar contrato → cambia estado a "active" y notifica al propietario
export const acceptAgreement = async (req: Request, res: Response) => {
  try {
    const tenantId = (req as any).userId;
    const { id } = req.params; // agreementId

    const agr = await Agreement.findById(id);
    if (!agr) {
      res.status(404).json({ msg: "Acuerdo no encontrado" });
      return;
    }
    if (!agr.tenantId.equals(tenantId)) {
      res.status(403).json({ msg: "No autorizado para aceptar este acuerdo" });
      return;
    }

    // Cambiar estado a "active"
    agr.status = "active";
    await agr.save();

    // Marcar la notificación de tipo "agreement-request" como leída
    await Notification.findOneAndUpdate(
      { agreementId: agr._id, type: "agreement-request", userId: tenantId },
      { read: true }
    );

    // Crear notificación para el owner (opcional, si deseas informar que fue aceptado)
    await Notification.create({
      userId: agr.ownerId,
      agreementId: agr._id,
      type: "agreement-accepted",
      read: false,
    });

    res.json(agr);
    return;
  } catch (err) {
    console.error("Error en acceptAgreement:", err);
    res.status(500).json({ msg: "Error al aceptar contrato" });
    return;
  }
};

export const rejectAgreement = async (req: Request, res: Response) => {
  try {
    const tenantId = (req as any).userId;
    const { id } = req.params; // agreementId

    const agr = await Agreement.findById(id);
    if (!agr) {
      res.status(404).json({ msg: "Acuerdo no encontrado" });
      return;
    }
    if (!agr.tenantId.equals(tenantId)) {
      res.status(403).json({ msg: "No autorizado para rechazar este acuerdo" });
      return;
    }

    // Eliminar el acuerdo (o podrías marcar status = 'cancelled'; aquí lo borramos)
    await Agreement.findByIdAndDelete(id);

    // Marcar la notificación original como leída (para que desaparezca de la lista)
    await Notification.findOneAndUpdate(
      { agreementId: id, type: "agreement-request", userId: tenantId },
      { read: true }
    );

    res.json({ msg: "Contrato rechazado y eliminado" });
    return;
  } catch (err) {
    console.error("Error en rejectAgreement:", err);
    res.status(500).json({ msg: "Error al rechazar contrato" });
    return;
  }
};
