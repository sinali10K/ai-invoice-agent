-- AddEscalationStage enum
CREATE TYPE "EscalationStage" AS ENUM ('STAGE_1', 'STAGE_2', 'STAGE_3', 'STAGE_4');

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN "escalationStage" "EscalationStage";