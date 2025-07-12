import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

// Recursively extracts validation error messages, including nested children
function extractErrors(errors: ValidationError[], parentPath = ''): Record<string, string[]> {
  const result = {} as Record<string, string[]>;

  errors.forEach((error) => {
    const propertyPath = parentPath ? `${parentPath}.${error.property}` : error.property;

    // Attach current level constraints if they exist
    if (error.constraints) {
      result[propertyPath] = Object.values(error.constraints);
    }

    // Recurse into children to capture nested errors
    if (error.children && error.children.length > 0) {
      Object.assign(result, extractErrors(error.children, propertyPath));
    }
  });

  return result;
}

export const GlobalPipes = [
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,

    transformOptions: {
      enableImplicitConversion: true,
    },
    // This is the key setting - skip missing properties
    skipMissingProperties: true,
    // Allow empty values for optional properties
    skipNullProperties: false,
    skipUndefinedProperties: false,

    exceptionFactory: (errors: ValidationError[]) => {
      const formattedErrors = extractErrors(errors);

      return new BadRequestException({
        statusCode: 400,
        message: formattedErrors,
        error: 'Bad Request',
      });
    },
  }),
];
