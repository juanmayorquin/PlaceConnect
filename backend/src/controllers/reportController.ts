import { Request, Response } from "express";
import Report from "../models/Report";
import Property from "../models/Property";

// POST /api/reports
export const createReport = async (req: Request, res: Response) => {
  const reporterId = (req as any).userId;
  const { propertyId, reason, comment } = req.body;
  const report = await Report.create({
    propertyId,
    reporterId,
    reason,
    comment,
  });
  res.status(201).json(report);
  return;
};

// GET /api/reports (admin)
export const listReports = async (req: Request, res: Response) => {
  const reports = await Report.find().populate("propertyId reporterId");
  res.json(reports);
};

// POST /api/reports/:id/action
export const reviewReport = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { decision } = req.body; // 'invalid' or 'removed'
  const report = await Report.findById(id);
  if (!report) {
    res.status(404).json({ msg: "Reporte no encontrado" });
    return;
  }
  report.reviewed = true;
  report.decision = decision;
  await report.save();
  if (decision === "removed") {
    // remove property
    await Property.findByIdAndUpdate(report.propertyId, { status: "inactivo" });
  }
  res.json(report);
};
