import { Request, Response } from 'express';
import { prisma } from '../db';

export async function getCustomers(req: Request, res: Response): Promise<void> {
  try {
    const { search, tier, status, page = '1', limit = '10' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { name: { contains: q } },
        { nameAr: { contains: q } },
        { email: { contains: q } },
        { company: { contains: q } },
        { phone: { contains: q } }
      ];
    }

    if (tier && tier !== 'ALL') {
      where.tier = String(tier).toUpperCase();
    }

    if (status && status !== 'ALL') {
      where.status = String(status).toUpperCase();
    }

    const [total, customers] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { tickets: true }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: customers,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('getCustomers error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customers' });
  }
}

export async function getCustomerById(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        tickets: {
          orderBy: { createdAt: 'desc' },
          include: {
            assignedAgent: {
              select: { id: true, name: true, nameAr: true, email: true, avatarUrl: true }
            },
            _count: {
              select: { notes: true }
            }
          }
        }
      }
    });

    if (!customer) {
      res.status(404).json({ success: false, error: 'Customer not found' });
      return;
    }

    const ticketsList = (customer as any).tickets || [];
    const stats = {
      totalTickets: ticketsList.length,
      openTickets: ticketsList.filter((t: any) => t.status === 'OPEN' || t.status === 'NEW').length,
      resolvedTickets: ticketsList.filter((t: any) => t.status === 'RESOLVED' || t.status === 'CLOSED').length
    };

    res.json({
      success: true,
      data: {
        ...customer,
        stats
      }
    });
  } catch (error: any) {
    console.error('getCustomerById error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer profile' });
  }
}

export async function createCustomer(req: Request, res: Response): Promise<void> {
  try {
    const { name, nameAr, email, phone, company, tier = 'STANDARD', preferredLang = 'en', avatarUrl } = req.body;

    if (!name || !email) {
      res.status(400).json({ success: false, error: 'Name and email are required fields' });
      return;
    }

    const existing = await prisma.customer.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existing) {
      res.status(409).json({ success: false, error: 'A customer with this email already exists' });
      return;
    }

    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        nameAr: nameAr?.trim() || null,
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        company: company?.trim() || null,
        tier: tier.toUpperCase(),
        preferredLang: preferredLang.toLowerCase(),
        avatarUrl: avatarUrl || null
      }
    });

    res.status(201).json({ success: true, data: customer });
  } catch (error: any) {
    console.error('createCustomer error:', error);
    res.status(500).json({ success: false, error: 'Failed to create customer' });
  }
}

export async function updateCustomer(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name, nameAr, phone, company, tier, status, preferredLang, avatarUrl } = req.body;

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(nameAr !== undefined && { nameAr: nameAr?.trim() || null }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
        ...(company !== undefined && { company: company?.trim() || null }),
        ...(tier && { tier: tier.toUpperCase() }),
        ...(status && { status: status.toUpperCase() }),
        ...(preferredLang && { preferredLang: preferredLang.toLowerCase() }),
        ...(avatarUrl !== undefined && { avatarUrl })
      }
    });

    res.json({ success: true, data: customer });
  } catch (error: any) {
    console.error('updateCustomer error:', error);
    res.status(500).json({ success: false, error: 'Failed to update customer' });
  }
}
