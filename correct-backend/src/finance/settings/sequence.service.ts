import { Injectable, Inject } from '@nestjs/common';
import { FinanceSequence } from './entities/finance-sequence.entity';
import {
	getCurrentFinancialYear,
	getSequenceKey,
	formatDocumentNumber,
} from '../shared/finance.utils';

export type DocumentType = 'inv' | 'exp' | 'bil' | 'est';

const DOCUMENT_PREFIXES: Record<DocumentType, string> = {
	inv: 'INV',
	exp: 'EXP',
	bil: 'BIL',
	est: 'EST',
};

@Injectable()
export class SequenceService {
	constructor(
		@Inject('FINANCE_SEQUENCE_REPOSITORY')
		private readonly sequenceRepository: typeof FinanceSequence
	) {}

	/**
	 * Generate the next document number for a given company and document type
	 *
	 * @param companyId - The company ID
	 * @param documentType - Type of document ('inv', 'exp', 'bil', 'est')
	 * @param financialYear - Optional specific financial year (defaults to current)
	 * @returns Formatted document number (e.g., 'INV-FY2526-0001')
	 */
	async generateNextNumber(
		companyId: number,
		documentType: DocumentType,
		financialYear?: string
	): Promise<{ number: string; financialYear: string }> {
		const fy = financialYear || getCurrentFinancialYear();
		const sequenceKey = getSequenceKey(documentType, fy);

		// Find or create the sequence for this company/type/FY combination
		const [sequence, created] = await this.sequenceRepository.findOrCreate({
			where: { companyId, sequenceKey },
			defaults: {
				companyId,
				sequenceKey,
				nextNumber: 1,
			},
		});

		const currentNumber = sequence.nextNumber;

		// Increment the sequence atomically
		await this.sequenceRepository.update(
			{ nextNumber: currentNumber + 1 },
			{ where: { id: sequence.id } }
		);

		const prefix = DOCUMENT_PREFIXES[documentType];
		const formattedNumber = formatDocumentNumber(prefix, fy, currentNumber);

		return {
			number: formattedNumber,
			financialYear: fy,
		};
	}

	/**
	 * Get the current sequence number without incrementing
	 */
	async getCurrentSequence(
		companyId: number,
		documentType: DocumentType,
		financialYear?: string
	): Promise<number> {
		const fy = financialYear || getCurrentFinancialYear();
		const sequenceKey = getSequenceKey(documentType, fy);

		const sequence = await this.sequenceRepository.findOne({
			where: { companyId, sequenceKey },
		});

		return sequence?.nextNumber || 1;
	}

	/**
	 * Preview what the next document number will look like
	 */
	async previewNextNumber(
		companyId: number,
		documentType: DocumentType,
		financialYear?: string
	): Promise<string> {
		const fy = financialYear || getCurrentFinancialYear();
		const nextNum = await this.getCurrentSequence(companyId, documentType, fy);
		const prefix = DOCUMENT_PREFIXES[documentType];
		return formatDocumentNumber(prefix, fy, nextNum);
	}

	/**
	 * Reset sequence for a specific document type and financial year
	 * Use with caution - primarily for testing or corrections
	 */
	async resetSequence(
		companyId: number,
		documentType: DocumentType,
		financialYear: string,
		startNumber: number = 1
	): Promise<void> {
		const sequenceKey = getSequenceKey(documentType, financialYear);

		await this.sequenceRepository.upsert({
			companyId,
			sequenceKey,
			nextNumber: startNumber,
		});
	}
}
