// backend/src/controllers/reviewController.ts
import { Request, Response } from "express";
import Review from "../models/Review";
import Agreement from "../models/Agreement";
import User from "../models/User";
import Property from "../models/Property";
import { Types } from "mongoose";

// HU-019 y HU-020
export const createReview = async (req: Request, res: Response) => {
  const reviewerId = (req as any).userId;
  const { agreementId, rating, comment } = req.body;

  const agr = await Agreement.findById(agreementId);
  if (!agr || agr.status !== 'completed') {
    return res.status(400).json({ msg: 'Solo se puede calificar tras finalizar acuerdo' });
  }

  // ¿Es el reviewer el tenant o el owner?
  let targetType: 'user' | 'property';
  let userId: Types.ObjectId | undefined;
  let propertyId: Types.ObjectId | undefined;

  if (agr.tenantId.equals(reviewerId)) {
    // Inquilino califica propiedad
    targetType = 'property';
    propertyId = agr.propertyId;
  } else if (agr.ownerId.equals(reviewerId)) {
    // Propietario califica inquilino
    targetType = 'user';
    userId = agr.tenantId;
  } else {
    return res.status(403).json({ msg: 'No autorizado a calificar este acuerdo' });
  }

  const exists = await Review.findOne({ agreementId, reviewerId });
  if (exists) return res.status(400).json({ msg: 'Ya calificaste este acuerdo' });

  const review = await Review.create({
    agreementId, reviewerId, rating, comment, targetType, userId, propertyId
  });

  // Actualizar promedio:
  if (targetType === 'user') {
    const stats = await Review.aggregate([
      { $match: { userId, targetType: 'user' } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (stats[0]) {
      await User.findByIdAndUpdate(userId, {
        averageScore: stats[0].avg,
        reviewCount: stats[0].count
      });
    }
  } else {
    const stats = await Review.aggregate([
      { $match: { propertyId, targetType: 'property' } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (stats[0]) {
      await Property.findByIdAndUpdate(propertyId, {
        averageRating: stats[0].avg,
        reviewCount: stats[0].count
      });

      // BONUS: actualizar rating promedio del owner con sus propiedades
      const ownerProps = await Property.find({ owner: agr.ownerId });
      const ownerRatings = ownerProps.map(p => (p.get('averageRating') as number) || 0).filter(Boolean);
      const avgOwner = ownerRatings.reduce((a, b) => a + b, 0) / ownerRatings.length;

      await User.findByIdAndUpdate(agr.ownerId, {
        propertyRating: avgOwner || null
      });
    }
  }

  res.status(201).json(review);
};