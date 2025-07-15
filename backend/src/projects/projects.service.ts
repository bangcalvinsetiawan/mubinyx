import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getProjects(filters: {
    category?: string;
    status?: string;
    riskLevel?: string;
    page: number;
    limit: number;
  }) {
    const { category, status, riskLevel, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (category) {
      where.category = { slug: category };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (riskLevel) {
      where.riskLevel = riskLevel;
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        include: {
          category: true,
          investments: {
            select: {
              amount: true,
              status: true
            }
          },
          _count: {
            select: {
              investments: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      this.prisma.project.count({ where })
    ]);

    // Calculate additional stats for each project
    const projectsWithStats = projects.map(project => {
      const progressPercentage = Number(((Number(project.collectedAmount) / Number(project.targetAmount)) * 100).toFixed(1));
      const remainingAmount = Number(project.targetAmount) - Number(project.collectedAmount);
      const daysRemaining = project.endDate ? Math.ceil((project.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
      
      return {
        ...project,
        progressPercentage,
        remainingAmount,
        daysRemaining,
        totalInvestors: project._count.investments,
        // Format currency for display
        minInvestmentFormatted: this.formatCurrency(Number(project.minInvestment)),
        maxInvestmentFormatted: this.formatCurrency(Number(project.maxInvestment)),
        targetAmountFormatted: this.formatCurrency(Number(project.targetAmount)),
        collectedAmountFormatted: this.formatCurrency(Number(project.collectedAmount)),
        remainingAmountFormatted: this.formatCurrency(remainingAmount)
      };
    });

    return {
      data: projectsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getProjectBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        category: true,
        investments: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        updates: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        reports: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 3
        }
      }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Calculate stats
    const progressPercentage = Number(((Number(project.collectedAmount) / Number(project.targetAmount)) * 100).toFixed(1));
    const remainingAmount = Number(project.targetAmount) - Number(project.collectedAmount);
    const daysRemaining = project.endDate ? Math.ceil((project.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
    const totalInvestors = project.investments.length;
    const averageInvestment = totalInvestors > 0 ? Number(project.collectedAmount) / totalInvestors : 0;

    return {
      ...project,
      progressPercentage,
      remainingAmount,
      daysRemaining,
      totalInvestors,
      averageInvestment,
      // Format currency
      minInvestmentFormatted: this.formatCurrency(Number(project.minInvestment)),
      maxInvestmentFormatted: this.formatCurrency(Number(project.maxInvestment)),
      targetAmountFormatted: this.formatCurrency(Number(project.targetAmount)),
      collectedAmountFormatted: this.formatCurrency(Number(project.collectedAmount)),
      remainingAmountFormatted: this.formatCurrency(remainingAmount),
      averageInvestmentFormatted: this.formatCurrency(averageInvestment)
    };
  }

  async getProjectDetails(id: string) {
    return this.getProjectBySlug(id); // For now, same as slug method
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}
