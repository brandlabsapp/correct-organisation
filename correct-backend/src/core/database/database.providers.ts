import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants/index';
import { databaseConfig } from './database.config';
import { Logger } from '@nestjs/common';
// models
import { User } from '@/user/entity/user.entity';
import { CompanyDetails } from '@/company/entities/company.entity';
import { Document } from '@/vault/entities/document.entity';
import { Folder } from '@/vault/entities/folder.entity';
import { Subscription } from '@/subscription/entities/subscription.entity';
import { Conversation } from '@/conversation/entities/conversation.entity';
import { Invoice } from '@/subscription/entities/invoice.entity';
import { ConversationMessage } from '@/conversation/entities/conversationMessages.entity';
import { CompanyMember } from '@/company/entities/company-members.entity';
import { CompanyComplianceTask } from '@/company/compliance/entities/companyTask.entity';
import { Compliance } from '@/company/compliance/entities/compliance.entity';
import { CompanyChecklist } from '@/company/compliance/entities/companyChecklist.entity';
import { ComplianceTask } from '@/company/compliance/entities/task.entity';
import { Role } from '@/roles/entities/role.entity';
import { AdminRole } from '@/admin/entities/admin-roles.entity';
import { Admin } from '@/admin/entities/admin.entity';
import { Din } from '@/company/din/entities/din.entity';
import { Notification } from '@/notification/entities/notification';
import { NotificationObject } from '@/notification/entities/notification_object.entity';
import { NotificationChange } from '@/notification/entities/notification_change.entity';
import { ComplianceDocument } from '@/company/compliance/entities/compliance-document.entity';
import { CompanyTaskDocument } from '@/company/compliance/entities/company-task-document.entity';
import { CompanyTaskAssignee } from '@/company/compliance/entities/company-task-assignee.entity';

// Finance entities
import { FinanceClient } from '@/finance/clients/entities/finance-client.entity';
import { FinanceInvoice } from '@/finance/invoices/entities/finance-invoice.entity';
import { FinanceInvoiceLineItem } from '@/finance/invoices/entities/finance-invoice-line-item.entity';
import { FinanceInvoicePayment } from '@/finance/invoices/entities/finance-invoice-payment.entity';
import { FinanceInvoiceActivity } from '@/finance/invoices/entities/finance-invoice-activity.entity';
import { FinanceRecurringProfile } from '@/finance/invoices/entities/finance-recurring-profile.entity';
import { FinanceBill } from '@/finance/bills/entities/finance-bill.entity';
import { FinanceBillLineItem } from '@/finance/bills/entities/finance-bill-line-item.entity';
import { FinanceBillPayment } from '@/finance/bills/entities/finance-bill-payment.entity';
import { FinanceEstimate } from '@/finance/estimates/entities/finance-estimate.entity';
import { FinanceEstimateLineItem } from '@/finance/estimates/entities/finance-estimate-line-item.entity';
import { FinanceSettings } from '@/finance/settings/entities/finance-settings.entity';
import { FinanceSequence } from '@/finance/settings/entities/finance-sequence.entity';
import { FinanceTaxRate } from '@/finance/settings/entities/finance-tax-rate.entity';
import { FinanceSavedItem } from '@/finance/settings/entities/finance-saved-item.entity';

// Projects entity
import { Project } from '@/projects/entities/project.entity';

const logger = new Logger('Database');

const logging = (sql: string, timing: number) => {
  if (timing > 1000) {
    logger.warn(`Slow query (${timing}ms): ${sql}`);
  }
};

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      logger.log(`Initializing database in ${process.env.NODE_ENV} mode`);

      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }

      console.log('config',config)

      const dialectOptions: Record<string, any> = {
        statement_timeout: 5000,
      };
      if (
        process.env.DB_SSL === 'TRUE' ||
        process.env.NODE_ENV === PRODUCTION
      ) {
        dialectOptions.ssl = {
          require: true,
          rejectUnauthorized: false,
        };
      }

      const sequelize = new Sequelize({
        ...config,
        logging: logging,
        benchmark: true,
        pool: {
          max: 20,
          min: 10,
          acquire: 30000,
          idle: 5000,
          evict: 1000,
        },
        retry: {
          max: 3,
        },
        dialectOptions,
      });

      sequelize.addModels([
        User,
        CompanyDetails,
        CompanyMember,
        Compliance,
        CompanyChecklist,
        CompanyComplianceTask,
        Document,
        ComplianceTask,
        Folder,
        Subscription,
        Invoice,
        Conversation,
        ConversationMessage,
        Role,
        Admin,
        AdminRole,
        Din,
        Notification,
        NotificationChange,
        NotificationObject,
        ComplianceDocument,
        CompanyTaskDocument,
        CompanyTaskAssignee,
        // Finance entities
        FinanceClient,
        FinanceInvoice,
        FinanceInvoiceLineItem,
        FinanceInvoicePayment,
        FinanceInvoiceActivity,
        FinanceRecurringProfile,
        FinanceBill,
        FinanceBillLineItem,
        FinanceBillPayment,
        FinanceEstimate,
        FinanceEstimateLineItem,
        FinanceSettings,
        FinanceSequence,
        FinanceTaxRate,
        FinanceSavedItem,
        // Projects
        Project,
      ]);

      if (process.env.SYNC === 'true') {
        logger.log('Syncing database schema...');
        await sequelize.sync({ alter: true });
        logger.log('Database schema sync complete');
      } else {
        logger.log('Database schema sync skipped');
      }
      return sequelize;
    },
  },
];
