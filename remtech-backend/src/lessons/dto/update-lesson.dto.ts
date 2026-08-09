import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateLessonDto } from './create-lesson.dto';

// On ne permet pas de changer le type/fichier via update — seulement titre/ordre/durée
export class UpdateLessonDto extends PartialType(
  OmitType(CreateLessonDto, ['type'] as const),
) {}