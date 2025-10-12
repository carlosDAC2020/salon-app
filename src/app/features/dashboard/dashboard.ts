import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService, DashboardStats, RevenueData, TopService } from '../../core/services/dashboard.service';
import { Appointment } from '../../core/models/appointment.model';
import { Client } from '../../core/models/client.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  stats: DashboardStats = {
    todayAppointments: 0,
    todayRevenue: 0,
    monthRevenue: 0,
    activeClients: 0,
    pendingAppointments: 0,
    completedToday: 0
  };

  revenueData: RevenueData[] = [];
  topServices: TopService[] = [];
  upcomingAppointments: Appointment[] = [];
  recentClients: Client[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.stats = this.dashboardService.getStats();
    this.revenueData = this.dashboardService.getRevenueLastDays(7);
    this.topServices = this.dashboardService.getTopServices(5);
    this.upcomingAppointments = this.dashboardService.getUpcomingAppointments(5);
    this.recentClients = this.dashboardService.getRecentClients(5);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-CO', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getClientFullName(client: Client): string {
    return `${client.firstName} ${client.lastName}`;
  }

  getMaxRevenue(): number {
    return Math.max(...this.revenueData.map(d => d.amount), 1);
  }

  getRevenuePercentage(amount: number): number {
    const max = this.getMaxRevenue();
    return (amount / max) * 100;
  }

  getGrowthPercentage(): number {
    if (this.revenueData.length < 2) return 0;
    const today = this.revenueData[this.revenueData.length - 1].amount;
    const yesterday = this.revenueData[this.revenueData.length - 2].amount;
    if (yesterday === 0) return today > 0 ? 100 : 0;
    return ((today - yesterday) / yesterday) * 100;
  }

  isGrowthPositive(): boolean {
    return this.getGrowthPercentage() >= 0;
  }
}

